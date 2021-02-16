'use strict'

const Driver = require('../Driver')

class BitronThermostatDriver extends Driver {

	onInit() {
		super.onInit()

		this.log('BitronThermostatDriver has been initiated')
	}

	onPairListDevices(data, callback) {
		this.getSensorsByCondition(device => device.modelid == '902010/32', callback)
	}

	onAddCustomSensorCapabilities(sensor, capabilities) {

		if (sensor.config && sensor.config.hasOwnProperty('heatsetpoint')) {
			capabilities.push('target_temperature')
		}

		if (sensor.config && sensor.config.hasOwnProperty('on')) {
			capabilities.push('onoff')
		}

	}

}

module.exports = BitronThermostatDriver