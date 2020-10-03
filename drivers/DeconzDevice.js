'use strict'

const Homey = require('homey')

class DeconzDevice extends Homey.Device {
	
	onInit() {

		if(!hasCapability("button.repair"))
		{
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
		}

		this.registerCapabilityListener('button.repair', async () => {
			// Maintenance action button was pressed, return a promise
			throw new Error('Something went wrong');
		});
	}
}

module.exports = DeconzDevice