'use strict'

const Driver = require('../Driver')

class DevelcoAirQualityDriver extends Driver {

	onInit() {
		super.onInit()
		this.log('DevelcoAirQualityDriver has been initiated')
	}

	onPairListDevices(data, callback) {
		this.getSensorsByCondition(device => device.modelid === 'AQSZB-110', callback)
	}

}

module.exports = DevelcoAirQualityDriver