'use strict'

const Driver = require('../Driver')

class SonoffSnzb03Driver extends Driver {

	onInit() {
		super.onInit()
		this.log('SonoffSnzb03Driver has been initiated')
	}

	onPairListDevices(_, callback) {
		this.getSensorsByCondition(device => {
			return device.modelid === 'ms01' || device.modelid === 'MS01' || device.modelid === 'MSO1'
		}, callback)
	}

}

module.exports = SonoffSnzb03Driver