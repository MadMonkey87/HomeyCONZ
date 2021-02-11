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
		if (!this.throttle) {
			device.setSettings({ 'throttling': 1000 });
			this.throttle = 1000;
		}

		this.scale = this.getSetting('scale');
		if (!this.scale) {
			device.setSettings({ 'scale': 0.5 });
			this.scale = 0.5;
		}

		this.triggerClockwiseThrottled = util.throttle(() => {
			this.log('rotatingClockwise', this.clockwiseCount, this.clockwiseCount * this.scale)
			this.triggerRotating.trigger(this, { count: this.clockwiseCount, amount: this.clockwiseCount * this.scale }, { direction: 'clockwise' });
			this.clockwiseCount = 0;
		}, this.throttle);
		this.triggerCounterClockwiseThrottled = util.throttle(() => {
			this.log('rotatingCounterClockwise', this.counterClockwiseCount, this.counterClockwiseCount * -this.scale);
			this.triggerRotating.trigger(this, { count: this.counterClockwiseCount, amount: this.counterClockwiseCount * -this.scale }, { direction: 'counterClockwise' });
			this.counterClockwiseCount = 0;
		}, this.throttle);

		this.setTriggers();

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
					this.triggerClockwiseThrottled();
					this.triggerEndRotating.trigger(this, null, { direction: 'clockwise' });
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
					this.triggerCounterClockwiseThrottled();
					this.triggerEndRotating.trigger(this, null, { direction: 'counterClockwise' });
					return;
				} else if (number == 2001) {
					// ignore: the device always sents both events, relevant is only the one of the current direction indicated by the first event
					return;
				}
				break;
			case 'none':
				if (number == 2001) {
					this.mode = 'rotatingClockwise';
					this.triggerStartRotating.trigger(this, null, { direction: 'clockwise' });
					return;
				} else if (number == 3001) {
					this.mode = 'rotatingCounterClockwise';
					this.triggerStartRotating.trigger(this, null, { direction: 'counterClockwise' });
					return;
				}
				break;
		}

		const tokens = this.getSwitchEventTokens(number);
		const state = { buttonIndex: tokens.buttonIndex.toString(), actionIndex: tokens.actionIndex.toString() };

		if (state.buttonIndex == 1) {
			this.log('symphonisk switch event (' + number + ') button: ' + tokens.buttonIndex + ', action: ' + tokens.action);
			this.triggerRaw.trigger(this, tokens, state);
		}
	}

	setTriggers() {

		this.triggerRaw = new Homey.FlowCardTriggerDevice('raw_switch_event')
			.register()
			.registerRunListener((args, state) => {
				return Promise.resolve(args.action === '-1' || args.action === state.actionIndex);
			});

		this.triggerRotating = new Homey.FlowCardTriggerDevice('rotating')
			.register()
			.registerRunListener((args, state) => {
				return Promise.resolve(args.direction === '-1' || args.direction === state.direction);
			});

		this.triggerStartRotating = new Homey.FlowCardTriggerDevice('rotation_start')
			.register()
			.registerRunListener((args, state) => {
				return Promise.resolve(args.direction === '-1' || args.direction === state.direction);
			});

		this.triggerEndRotating = new Homey.FlowCardTriggerDevice('rotating_end')
			.register()
			.registerRunListener((args, state) => {
				return Promise.resolve(args.direction === '-1' || args.direction === state.direction);
			});

	}

}

module.exports = SymfoniskRemote