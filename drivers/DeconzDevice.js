'use strict'

const Homey = require('homey')

class DeconzDevice extends Homey.Device {
	
	onInit() {
		if(!this.hasCapability("button.repair"))
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

		if(!this.hasCapability("button.updateState"))
		{
			// randomize the setup a little as we will get cpu warnings otherwise
			this.initializeTimeout = setTimeout(() => {
				this.log("add repair capability")

				this.addCapability("button.updateState")
				this.setCapabilityOptions(
					"button.updateState", 
					{     
						"maintenanceAction": true,
						"title": { 
						"en": "Update manually"
						},
						"desc": { 
							"en": "The state of the device gets updated in real time, and also periodically, but you can use this action to force the update immediately"
						}
					})
					this.registerUpdateStateTrigger();
			}, Math.random() * 30 * 1000)
		} else {
			this.registerUpdateStateTrigger();
		}
	}

	registerRepairTrigger() {
		this.registerCapabilityListener('button.repair', async () => {
            
            // Maintenance action button was pressed, return a promise
			//throw new Error('Something went wrong');
			return Promise.resolve();
        });
	}
}

module.exports = DeconzDevice