'use strict'

const Sensor = require('../Sensor')
const Homey = require('homey')

class GenericDoorLock extends Sensor {

	onInit() {
		super.onInit()

		let capabilities = this.getCapabilities()

		if (capabilities.includes('locked')) {
			this.registerLockListener()
		}

		//this.setTriggers()

		this.log(this.getName(), 'has been initiated')
	}

	registerLockListener() {
		this.registerCapabilityListener('locked', (value, opts, callback) => {
			this.putSensorConfig({ lock: value }, callback)
		})
	}
}

module.exports = GenericDoorLock