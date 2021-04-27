'use strict'

const Driver = require('../Driver')

class SonoffSnzb01Driver extends Driver {

	onInit() {
		super.onInit()
		this.log('SonoffSnzb01Driver has been initiated')
	}

	onPairListDevices(data, callback) {
		this.getSensorsByCondition(device => device.modelid === 'WB01' || device.modelid === 'WB-01', callback)
	}

}

module.exports = SonoffSnzb01Driver