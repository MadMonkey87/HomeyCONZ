'use strict'

const Driver = require('../Driver')

class SonoffS31LiteZbDriver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('SonoffS31LiteZbDriver has been initiated')
	}
	
	onPairListDevices(data, callback) {
		this.getLightsByCondition(device => device.modelid === 'S31ZB', callback)
	}
}

module.exports = SonoffS31LiteZbDriver