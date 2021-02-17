'use strict'

const Light = require('../Light')

class GenericBlinds extends Light {
	
	onInit() {
		super.onInit()
		
		this.log(this.getName() + 'has been initiated')
	}
	
}

module.exports = GenericBlinds