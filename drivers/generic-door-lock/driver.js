'use strict';

const Driver = require('../Driver')

class GenericDoorLockDriver extends Driver {

	onInit() {
		super.onInit()

		this.log(this.constructor.name + ' has been initiated')
	}

	onPairListDevices(data, callback) {
		this.getSensorsByCondition(device => device.type === 'ZHADoorLock', callback)
	}

}

module.exports = GenericDoorLockDriver