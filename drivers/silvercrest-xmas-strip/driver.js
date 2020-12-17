'use strict'

const Driver = require('../Driver')

class SilvercrestXmasStripDriver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('SilvercrestXmasStripDriver has been initiated')
	}
	
	onPairListDevices(data, callback) {
		this.getLightsByCondition(device => {
			return device.modelid === 'TS0601'
		}, callback)
	}
}

module.exports = SilvercrestXmasStripDriver