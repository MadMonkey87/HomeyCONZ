'use strict'

const Driver = require('../Driver')

class HeimanHs1rcDriver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('HeimanHs1rcDriver has been initiated')
	}
	
	onPairListDevices(data, callback) {
		this.getSensorsByCondition(device => device.modelid === 'RC-EF-3.0', callback)
	}
	
}

module.exports = HeimanHs1rcDriver