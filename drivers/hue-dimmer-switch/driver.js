'use strict'

const Driver = require('../Driver')

class HueDimmerSwitchDriver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('HueDimmerSwitchDriver has been inited')
	}
	
	onPairListDevices(data, callback) {
		this.getSensorsByCondition(device => device.modelid === 'RWL021' || device.modelid === 'RWL020', callback)
	}
	
}

module.exports = HueDimmerSwitchDriver