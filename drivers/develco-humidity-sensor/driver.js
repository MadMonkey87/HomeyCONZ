'use strict'

const Driver = require('../Driver')

class DevelcoHumiditySensorDriver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('DevelcoHumiditySensorDriver has been initiated')
	}
	
	onPairListDevices(data, callback) {
		this.getSensorsByCondition(device => device.modelid === 'HMSZB-110', callback)
	}
	
}

module.exports = DevelcoHumiditySensorDriver