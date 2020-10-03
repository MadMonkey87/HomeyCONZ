'use strict'

const Homey = require('homey')

class DeconzDevice extends Homey.Device {
	
	onInit() {
		this.addCapability("button.repair")
		this.registerCapabilityListener('button.repair', async () => {
			// Maintenance action button was pressed, return a promise
			throw new Error('Something went wrong');
		});
	}
}

module.exports = DeconzDevice