'use strict'

const Driver = require('../Driver')

class HueSmartButtonDriver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('HueSmartButtonDriver has been initiated')
	}
	
	onPairListDevices(data, callback) {
		this.getSensorsByCondition(device => device.modelid === 'ROM001', callback)
	}
	
}

module.exports = HueSmartButtonDriver