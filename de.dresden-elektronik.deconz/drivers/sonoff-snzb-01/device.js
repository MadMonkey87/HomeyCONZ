'use strict'

const Sensor = require('../Sensor')
const Homey = require('homey')

class SonoffSnzb01 extends Sensor {

	onInit() {
		super.onInit()

		this.setTriggers()

		this.log(this.getName(), 'has been initiated')
	}

	fireEvent(number) {

		const tokens = this.getSwitchEventTokens(number);
		const state = { buttonIndex: tokens.buttonIndex.toString(), actionIndex: tokens.actionIndex.toString() };

		this.log('SonoffSnzb01 switch event (' + number + ') button: ' + tokens.buttonIndex + ', action: ' + tokens.action);

		this.triggerRaw.trigger(this, tokens, state);
	}

	setTriggers() {
		this.triggerRaw = new Homey.FlowCardTriggerDevice('raw_switch_event')
			.register()
			.registerRunListener((args, state) => {
				return Promise.resolve(
					(args.action === '-1' || args.action === state.actionIndex));
			});
	}

}

module.exports = SonoffSnzb01