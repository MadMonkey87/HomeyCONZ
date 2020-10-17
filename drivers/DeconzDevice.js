'use strict'

const Homey = require('homey')

class DeconzDevice extends Homey.Device {

	onInit() {

		// randomize the setup a little as we will get cpu warnings otherwise
		this.initializeTimeout = setTimeout(() => {
			this.log("add repair capability")
			this.addCapability("button.repair")
			this.initializeTimeout = setTimeout(() => {
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
			}, 3000)
		}, Math.random() * 15 * 1000)

		this.registerRepairTrigger();

		// randomize the setup a little as we will get cpu warnings otherwise
		this.initializeTimeout = setTimeout(() => {
			this.log("add repair capability")
			this.addCapability("button.updateState")
			this.initializeTimeout = setTimeout(() => {
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
			}, 3000)
		}, Math.random() * 15 * 1000)

		this.registerUpdateStateTrigger();
	}

	registerRepairTrigger() {
		this.registerCapabilityListener('button.repair', async () => {

			const mac = this.getSetting('mac')
			this.log('attempting to repair ' + this.getName() + ' ' + mac)

			this.getDriver().onPairListDevices(null, (error, success) => {
				if (error) {
					throw new Error(error);
				} else {
					this.log('retrieved candidates', success)
					for (let candidateDevice of success) {
						if (candidateDevice.data.id.split('-')[0] !== mac) {
							continue;
						}
						else {
							this.log('found a matching candidate ' + candidateDevice.name, candidateDevice.settings);
							this.handleRepairRequest(candidateDevice)
							this.setInitialState()
							return Promise.resolve();
						}
					}
					this.log('no candidate matched the device to repair', success)
					Promise.reject();
				}
			})
		});
	}

	handleRepairRequest(candidateDevice) {
		this.setSettings(candidateDevice.settings);

		if (this.getSetting('ids') != null && this.getSetting('id') != null) {
			this.setSettings({ ids: JSON.stringify(this.getSetting('id')) });
		}

		if (this.getSetting('sensorids') != null && this.getSetting('sensors') != null) {
			this.setSettings({ sensorids: JSON.stringify(this.getSetting('sensors')) });
		}
	}

	fireEvent(event, state){
		throw new Error('unhandled fireEvent for the device ' + JSON.stringify(this.getDriver().getManifest()))
	}
}

module.exports = DeconzDevice