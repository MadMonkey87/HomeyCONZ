'use strict'

const Sensor = require('../Sensor')
const Homey = require('homey')

class GenericDoorLock extends Sensor {
	
	onInit() {
		super.onInit()
		
		this.setTriggers()
		
		this.log(this.getName(), 'has been initiated')
	}
	
}

module.exports = GenericDoorLock