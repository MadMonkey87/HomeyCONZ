'use strict'

const Driver = require('../Driver')

class AqaraMagnetDriver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('AqaraMagnetDriver has been initiated')
	}
	
	onPairListDevices(data, callback) {
		this.getSensorsByCondition(device => device.modelid === 'lumi.sensor_magnet.aq2' || device.modelid === 'lumi.sensor_magnet.agl02', callback)
	}
	
}

module.exports = AqaraMagnetDriver