'use strict'

const Driver = require('../Driver')

class SonoffSnzb02Driver extends Driver {

	onInit() {
		super.onInit()
		this.log('SonoffSnzb02Driver has been initiated')
	}

	onPairListDevices(data, callback) {
		this.getSensorsByCondition(device => device.modelid === 'H01', callback)
	}

}

module.exports = SonoffSnzb02Driver