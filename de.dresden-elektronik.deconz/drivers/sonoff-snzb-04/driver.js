'use strict'

const Driver = require('../Driver')

class SonoffSnzb04Driver extends Driver {

	onInit() {
		super.onInit()
		this.log('SonoffSnzb04Driver has been inited')
	}

	onPairListDevices(data, callback) {
		this.getSensorsByCondition(device => device.modelid === 'DS01', callback)
	}

}

module.exports = SonoffSnzb04Driver