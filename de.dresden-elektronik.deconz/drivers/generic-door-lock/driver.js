'use strict';

const Driver = require('../Driver')

class GenericDoorLockDriver extends Driver {

	onInit() {
		super.onInit()

		this.log(this.constructor.name + ' has been initiated')
	}

	onPairListDevices(data, callback) {
		this.getSensorsByCondition(device => device.type === 'ZHADoorLock', callback)
	}

	onAddCustomSensorCapabilities(sensor, capabilities) {
		if (sensor.config && sensor.config.hasOwnProperty('lock')) {
			capabilities.push('locked')
		}

		if (sensor.state && sensor.state.hasOwnProperty('lockstate')) {
			capabilities.push('lock_state')
		}
	}
}

module.exports = GenericDoorLockDriver