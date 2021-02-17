'use strict';

const Driver = require('../Driver')

class GenericBlindsDriver extends Driver {

	onInit() {
		super.onInit()

		// cleanup old implementation from <= 1.23.x (delayed to prevent cpu usage penalties)

		this.initializeTimeout = setTimeout(() => {
			this.removeCapability("dim")
			this.addCapability("windowcoverings_set");
		}, Math.random() * 15 * 1000)

		this.initializeTimeout = setTimeout(() => {
			this.removeCapability("onoff")
			this.addCapability("windowcoverings_closed");
		}, Math.random() * 15 * 1000)

		this.log(this.constructor.name + ' has been initiated')
	}

	onPairListDevices(data, callback) {
		this.getLightsByCondition(device => device.type === 'Window covering device', callback)
	}

}

module.exports = GenericBlindsDriver