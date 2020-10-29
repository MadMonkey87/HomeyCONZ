'use strict'

const Driver = require('../Driver')

class JungSwitch4GangDriver extends Driver {

	onInit() {
		super.onInit()
		this.log('JungSwitch4GangDriver has been initiated')
	}

	onPairListDevices(data, callback) {
		this.getSensorsByCondition(device => device.modelid === 'WS_4f_J_1' || device.modelid === 'HS_4f_GJ_1', callback)
	}

}

module.exports = JungSwitch4GangDriver