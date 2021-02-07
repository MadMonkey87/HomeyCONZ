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

}

module.exports = GenericThermostatDriver