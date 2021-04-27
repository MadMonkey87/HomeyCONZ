'use strict'

const Driver = require('../Driver')

class HeimanMotionDriver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('HeimanMotionDriver has been initiated')
	}
	
	onPairListDevices(_, callback) {
		this.getSensorsByCondition(device => {
			return device.modelid === 'TY0202' || device.modelid === 'PIRSensor-EM'
		}, callback)
	}
	
}

module.exports = HeimanMotionDriver