'use strict'

const Sensor = require('../Sensor')
const Homey = require('homey')
const { util } = require('../../util')

class SymfoniskRemote extends Sensor {

	onInit() {
		super.onInit()

		this.clockwiseCount = 0;
		this.counterClockwiseCount = 0;
		this.mode = 'none';

		this.throttle = this.getSetting('throttling');
		this.triggerClockwiseThrottled = util.throttle(() => {
			this.log('rotatingClockwise', this.clockwiseCount)
			this.triggerRotateClockwise.trigger(this, { number: this.clockwiseCount }, {});
			this.clockwiseCount = 0;
		}, this.throttle);
		this.triggerCounterClockwiseThrottled = util.throttle(() => {
			this.log('rotatingCounterClockwise', this.counterClockwiseCount)
			this.triggerRotateCounterClockwise.trigger(this, { number: this.counterClockwiseCount }, {});
			this.counterClockwiseCount = 0;
		}, this.throttle);

		this.setTriggers()

		this.log(this.getName(), 'has been initiated')
	}

	async onSettings(oldSettingsObj, newSettingsObj, changedKeysArr) {
		this.throttle = newSettingsObj['throttling'];
		this.log('changed throtting to ' + this.throttle);
	}

	fireEvent(number) {
		switch (this.mode) {
			case 'rotatingClockwise':
				if (number == 2001) {
					this.clockwiseCount++;
					this.triggerClockwiseThrottled();
					return;
				} else if (number == 2003) {
					this.mode = 'none';
					return;
				} else if (number == 3001) {
					// ignore: the device always sents both events, relevant is only the one of the current direction indicated by the first event
					return;
				}
				break;
			case 'rotatingCounterClockwise':
				if (number == 3001) {
					this.counterClockwiseCount++;
					this.triggerCounterClockwiseThrottled();
					return;
				} else if (number == 3003) {
					this.mode = 'none';
					return;
				} else if (number == 2001) {
					// ignore: the device always sents both events, relevant is only the one of the current direction indicated by the first event
					return;
				}
				break;
			case 'none':
				if (number == 2001) {
					this.mode = 'rotatingClockwise';
					return;
				} else if (number == 3001) {
					this.mode = 'rotatingCounterClockwise';
					return;
				}
				break;
		}

		const tokens = this.getSwitchEventTokens(number);
		const state = { buttonIndex: tokens.buttonIndex.toString(), actionIndex: tokens.actionIndex.toString() };

		this.log('symphonisk switch event (' + number + ') button: ' + tokens.buttonIndex + ', action: ' + tokens.action);
		this.triggerRaw.trigger(this, tokens, state);
	}

	setTriggers() {
		this.triggerRaw = new Homey.FlowCardTriggerDevice('raw_switch_event')
			.register()
			.registerRunListener((args, state) => {
				return Promise.resolve(
					(args.action === '-1' || args.action === state.actionIndex));
			});

		this.triggerRotateClockwise = new Homey.FlowCardTriggerDevice('rotate_clockwise')
			.register();

		this.triggerRotateCounterClockwise = new Homey.FlowCardTriggerDevice('rotate_counter_clockwise')
			.register();
	}

}

module.exports = SymfoniskRemote