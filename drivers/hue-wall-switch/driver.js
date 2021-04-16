'use strict'

const Driver = require('../Driver')

class HueWallSwitchDriver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('HueWallSwitchDriver has been initiated')
	}
	
	onPairListDevices(data, callback) {
		this.getSensorsByCondition(device => device.modelid === 'RDM001', callback)
	}
	
}

module.exports = HueWallSwitchDriver