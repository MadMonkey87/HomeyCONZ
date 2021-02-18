'use strict'

const Driver = require('../Driver')

class TradfriShortcutButtonDriver extends Driver {

	onInit() {
		super.onInit()
		this.log('TradfriShortcutButtonDriver has been inited')
	}

	onPairListDevices(data, callback) {
		this.getSensorsByCondition(device => device.modelid === 'TRADFRI SHORTCUT Button', callback)
	}

}

module.exports = TradfriShortcutButtonDriver