'use strict'

const Homey = require('homey')

class DeconzDevice extends Homey.Device {
	
	onInit() {
		if(!this.hasCapability("button.repair") || true)
		{
			// randomize the setup a little as we will get cpu warnings otherwise
			this.initializeTimeout = setTimeout(() => {
				this.log("add repair capability")

				this.addCapability("button.repair")
				this.setCapabilityOptions(
					"button.repair", 
					{     
						"maintenanceAction": true,
						"title": { 
						"en": "Repair"
						},
						"desc": { 
							"en": "Attempts to repair a device after it has been re-added to deconz (i.e if there were connectivity issues and you needed to remove and pair the device again)."
						}
					})
					this.registerRepairTrigger();
			}, Math.random() * 30 * 1000)
		} else {
			this.registerRepairTrigger();
		}
	}

	registerRepairTrigger() {
		this.registerCapabilityListener('button.repair', async () => {
			// Maintenance action button was pressed, return a promise
			throw new Error('Something went wrong');
		});
	}
}

module.exports = DeconzDevice