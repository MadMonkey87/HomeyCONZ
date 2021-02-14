'use strict'

const Sensor = require('../Sensor')
const Homey = require('homey')

class TradfriShortcutButton extends Sensor {

	onInit() {
		super.onInit()

		this.setTriggers()

		this.log(this.getName(), 'has been initiated')
	}

	fireEvent(number) {

		const tokens = this.getSwitchEventTokens(number);
		const state = { buttonIndex: tokens.buttonIndex.toString(), actionIndex: tokens.actionIndex.toString() };

		this.log('tradfri shortcut button event (' + number + ') button: ' + tokens.buttonIndex + ', action: ' + tokens.action);

		this.triggerRaw.trigger(this);
	}

	setTriggers() {
		this.triggerRaw = new Homey.FlowCardTriggerDevice('raw_switch_event')
			.register();
	}

}

module.exports = TradfriShortcutButton