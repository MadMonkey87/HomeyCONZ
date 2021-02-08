'use strict'

const Sensor = require('../Sensor')
const Homey = require('homey')
const { util } = require('../util')

class SymfoniskRemote extends Sensor {

	onInit() {
		super.onInit()

		this.clockwiseCount = 0;
		this.counterClockwiseCount = 0;

		this.setTriggers()

		this.log(this.getName(), 'has been initiated')
	}

	fireEvent(number) {

		const tokens = this.getSwitchEventTokens(number);
		const state = { buttonIndex: tokens.buttonIndex.toString(), actionIndex: tokens.actionIndex.toString() };

		this.log('symphonisk switch event (' + number + ') button: ' + tokens.buttonIndex + ', action: ' + tokens.action);


		// todo: trigger at least once every second

		if (tokens.buttonIndex === 2) {
			this.clockwiseCount++;
			util.debounce(() => {
				this.triggerRaw.trigger(this, tokens, state);
				this.clockwiseCount = 0;
			}, 1000)
		} else if (tokens.buttonIndex === 3) {
			this.counterClockwiseCount++;
			util.debounce(() => {
				this.triggerRaw.trigger(this, tokens, state);
				this.counterClockwiseCount = 0;
			}, 1000)
		} else {
			this.triggerRaw.trigger(this, tokens, state);
		}

	}

	setTriggers() {
		this.triggerRaw = new Homey.FlowCardTriggerDevice('raw_switch_event')
			.register()
			.registerRunListener((args, state) => {
				return Promise.resolve(
					(args.button === '-1' || args.button === state.buttonIndex) &&
					(args.action === '-1' || args.action === state.actionIndex));
			});
	}

}

module.exports = SymfoniskRemote