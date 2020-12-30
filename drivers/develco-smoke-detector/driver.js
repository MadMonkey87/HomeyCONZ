'use strict'

const Driver = require('../Driver')

class DevelcoSmokeDetectorDriver extends Driver {

	onInit() {
		super.onInit()
		this.log('DevelcoSmokeDetectorDriver has been initiated')
	}

	onPairListDevices(data, callback) {
		this.getSensorsByCondition(device => device.modelid === 'SMSZB-120', callback)
	}

}

module.exports = DevelcoSmokeDetectorDriver