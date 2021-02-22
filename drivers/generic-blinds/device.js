'use strict'

const Light = require('../Light')

class GenericBlinds extends Light {

	onInit() {
		super.onInit()

		// cleanup old implementation from <= 1.23.x (delayed to prevent cpu usage penalties)

		this.initializeTimeout = setTimeout(() => {
			this.removeCapability("dim");
			this.addCapability("windowcoverings_set");
		}, Math.random() * 15 * 1000)

		this.initializeTimeout = setTimeout(() => {
			this.removeCapability("onoff");
			this.addCapability("windowcoverings_closed");
		}, Math.random() * 15 * 1000)

		this.log(this.getName() + 'has been initiated')
	}

}

module.exports = GenericBlinds