'use strict'

const Homey = require('homey')

class DeconzDevice extends Homey.Device {
	
	onInit() {
		if(!this.hasCapability("button.repair"))
		{
			this.setAvailable() // needed as homey won't add the capability if the device is unavailable

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
			}, Math.random() * 15 * 1000)
		} else {
			this.registerRepairTrigger();
		}

		if(!this.hasCapability("button.updateState"))
		{
			this.setAvailable() // needed as homey won't add the capability if the device is unavailable

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
			}, Math.random() * 15 * 1000)
		} else {
			this.registerUpdateStateTrigger();
		}
	}

	registerRepairTrigger() {
		this.registerCapabilityListener('button.repair', async () => {

			const mac = this.getSetting('mac')
			this.log('attempting to repair ' + this.getName() + ' ' + mac)

			this.getDriver().onPairListDevices(null,(error,success)=>{
				if (error) {
					throw new Error(error);
				} else {
					this.log('retrieved candidates', success)
					for (let candidateDevice of success) {
						if(candidateDevice.data.id.split('-')[0] !== mac)
						{
							continue;
						}
						else {
							this.log('found a matching candidate ' + candidateDevice.name);
							this.handleRepairRequest(candidateDevice)
							this.setInitialState()
							return Promise.resolve();
						}
					}

					throw new Error('no candidate matched the device to repair');
				}
			})
        });
	}

	handleRepairRequest(candidateDevice){
		this.setSettings(candidateDevice.settings);
	}
}

module.exports = DeconzDevice