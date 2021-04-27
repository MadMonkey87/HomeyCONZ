'use strict'

const Driver = require('../Driver')

class SonoffZbMiniDriver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('SonoffZbMiniDriver has been initiated')
	}
	
	onPairListDevices(data, callback) {
		this.getLightsByCondition(device => device.modelid === '01MINIZB', callback)
	}
}

module.exports = SonoffZbMiniDriver