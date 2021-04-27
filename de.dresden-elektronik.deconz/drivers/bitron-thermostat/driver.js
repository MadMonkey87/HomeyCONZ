'use strict'

const GenericThermostatDriver = require('../generic-thermostat/driver')

class BitronThermostatDriver extends GenericThermostatDriver {

	onPairListDevices(data, callback) {
		this.getSensorsByCondition(device => device.modelid == '902010/32', callback)
	}

}

module.exports = BitronThermostatDriver