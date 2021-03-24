'use strict';

const Driver = require('../Driver')

class GenericBlindsDriver extends Driver {

	onInit() {
		super.onInit()

		this.log(this.constructor.name + ' has been initiated')
	}

	onPairListDevices(data, callback) {
		this.getLightsByCondition(device => device.type === 'Window covering device', callback)
	}

}

module.exports = GenericBlindsDriver