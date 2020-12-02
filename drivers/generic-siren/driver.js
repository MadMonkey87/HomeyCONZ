'use strict'

const Driver = require('../Driver')

class GenericSirenDriver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('GenericSirenDriver has been initiated')
	}
	
	onPairListDevices(data, callback) {
		this.getLightsByCondition(device => {
			return device.type == 'Warning device'
		}, callback)
	}
}

module.exports = GenericSirenDriver