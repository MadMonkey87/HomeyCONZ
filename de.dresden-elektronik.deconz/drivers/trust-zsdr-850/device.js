'use strict'

const Sensor = require('../Sensor')

class TrustZsdr850 extends Sensor {
	
	onInit() {
		super.onInit()
		
		this.log(this.getName(), 'has been initiated')
	}
	
}

module.exports = TrustZsdr850