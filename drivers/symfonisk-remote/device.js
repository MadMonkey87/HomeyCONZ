'use strict'

const Sensor = require('../Sensor')
const Homey = require('homey')
const { util } = require('../../util')
var locks = require('locks');

class SymfoniskRemote extends Sensor {

	onInit() {
		super.onInit()

		this.mutex = locks.createMutex();

		this.clockwiseCount = 1;
		this.counterClockwiseCount = 1;
		this.mode = 'none';

		this.throttle = this.getSetting('throttling');
		if (!this.throttle) {
			device.setSettings({ 'throttling': 500 });
			this.throttle = 500;
		}

		this.scale = this.getSetting('scale');
		if (!this.scale) {
			device.setSettings({ 'scale': 0.01 });
			this.scale = 0.01;
		}

		this.triggerClockwiseThrottled =
			util.throttle(() => {
				this.triggerRotating.trigger(this, { count: this.clockwiseCount, amount: this.clockwiseCount * this.scale }, { direction: 'clockwise' });
				this.clockwiseCount = 1;
			}, this.throttle);

		this.triggerCounterClockwiseThrottled =
			util.throttle(() => {
				this.triggerRotating.trigger(this, { count: this.counterClockwiseCount, amount: this.counterClockwiseCount * -this.scale }, { direction: 'counterClockwise' });
				this.counterClockwiseCount = 1;
			}, this.throttle);

		this.setTriggers();

		this.log(this.getName(), 'has been initiated')
	}

	async onSettings(oldSettingsObj, newSettingsObj, changedKeysArr) {
		this.throttle = newSettingsObj['throttling'];
		this.scale = newSettingsObj['scale'];
		this.log('changed throtting to ' + this.throttle);
		this.log('changed scaling to ' + this.scale);
	}

	fireEvent(number) {

		let device = this;
		const tokens = this.getSwitchEventTokens(number);

		if (tokens.buttonIndex === 2 || tokens.buttonIndex === 3) {
			// locking is needed to ensure the order of the incoming events is correct
			device.mutex.lock(function () {
				switch (device.mode) {
					case 'rotatingClockwise':
						if (number == 2001) {
							device.clockwiseCount++;
							device.triggerClockwiseThrottled();
						} else if (number == 2003 || number == 3003) {
							device.mode = 'none';
							device.triggerClockwiseThrottled();
							device.triggerEndRotating.trigger(device, null, { direction: 'clockwise' });
						} else if (number == 3001) {
							// ignore: the device always sents both events, relevant is only the one of the current direction indicated by the first event
						}
						break;
					case 'rotatingCounterClockwise':
						if (number == 3001) {
							device.counterClockwiseCount++;
							device.triggerCounterClockwiseThrottled();
						} else if (number == 2003 || number == 3003) {
							device.mode = 'none';
							device.triggerCounterClockwiseThrottled();
							device.triggerEndRotating.trigger(device, null, { direction: 'counterClockwise' });
						} else if (number == 2001) {
							// ignore: the device always sents both events, relevant is only the one of the current direction indicated by the first event
						}
						break;
					case 'none':
						if (number == 2001) {
							device.mode = 'rotatingClockwise';
							device.triggerClockwiseThrottled();
							device.triggerStartRotating.trigger(device, null, { direction: 'clockwise' });
						} else if (number == 3001) {
							device.mode = 'rotatingCounterClockwise';
							device.triggerCounterClockwiseThrottled();
							device.triggerStartRotating.trigger(device, null, { direction: 'counterClockwise' });
						}
						break;
				}
				device.mutex.unlock();
			});
		} else {
			const state = { buttonIndex: tokens.buttonIndex.toString(), actionIndex: tokens.actionIndex.toString() };

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