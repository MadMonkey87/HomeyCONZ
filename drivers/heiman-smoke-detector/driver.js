'use strict'

const Driver = require('../Driver')

class HeimanSmokeDetectorDriver extends Driver {

	onInit() {
		super.onInit()
		this.log('HeimanSmokeDetectorDriver has been initiated')
	}

	onPairListDevices(data, callback) {
		this.getSensorsByCondition(device => device.modelid === 'SmokeSensor-N-3.0' || device.modelid === 'GAS_V15' || device.modelid === 'SMOK_YDLV10' || device.modelid === 'SMOK_V16' || device.modelid === 'SmokeSensor-EM' || device.modelid === 'SmokeSensor-N-3.0' || device.modelid === 'SmokeSensor-EF-3.0', callback)
	}

}

module.exports = HeimanSmokeDetectorDriver