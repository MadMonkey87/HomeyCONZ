'use strict'

const Driver = require('../Driver')

class GenericThermostatDriver extends Driver {

	onInit() {
		super.onInit()

		this.log('GenericThermostatDriver has been initiated')
	}

	onPairListDevices(data, callback) {
		this.getSensorsByCondition(device => device.type == 'ZHAThermostat', callback)
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

module.exports = GenericThermostatDriver