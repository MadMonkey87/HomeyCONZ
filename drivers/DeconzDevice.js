'use strict'

const Homey = require('homey')

class DeconzDevice extends Homey.Device {

	onInit() {

		// randomize the setup a little as we will get cpu warnings otherwise
		this.initializeTimeout = setTimeout(() => {
			this.removeCapability("button.repair")
		}, Math.random() * 15 * 1000)

		// randomize the setup a little as we will get cpu warnings otherwise
		this.initializeTimeout = setTimeout(() => {
			this.removeCapability("button.updateState")
		}, Math.random() * 15 * 1000)
	}

	repair(callback) {
		const mac = this.getSetting('mac')
		const originalId = this.getSetting('id')

		this.log('attempting to repair ' + this.getName() + ' ' + mac + ' ' + this.getSetting('id'))

		this.getDriver().onPairListDevices(null, (error, success) => {
			if (error) {
				callback(null, { message: 'Unknown error: ' + error, error: true })
				return Promise.resolve()
			} else {
				this.log('retrieved candidates', success)
				for (let candidateDevice of success) {
					if (candidateDevice.data.id.split('-')[0] !== mac) {
						continue
					}
					else {
						this.log('found a matching candidate ' + candidateDevice.name, candidateDevice.settings)

						let isSameDevice = false
						if (typeof (originalId) === 'object') {
							let sum = 0
							originalId.forEach(id => {
								sum += id
							})
							candidateDevice.settings.id.forEach(id => {
								sum -= id
							})
							isSameDevice = sum === 0
						} else {
							isSameDevice = originalId == candidateDevice.settings.id
						}

						if (isSameDevice) {
							this.log('The matching candidate is the same device', originalId, candidateDevice.settings.id)
							callback(null, { message: 'Could not repair the device as there is no new binding in DeConz (did you really remove the device and re-add it?)', error: true })
							return Promise.resolve()
						} else {

							this.log('set setting to repair the device', JSON.stringify(candidateDevice.settings))
							this.setSettings(candidateDevice.settings)
							// for some weired reasons it seems the call above is not always successfully, therefore we simply try it again later
							setTimeout(() => {
								this.setSettings(candidateDevice.settings)
	
								if (this.getSetting('ids') != null && this.getSetting('id') != null) {
									this.setSettings({ ids: JSON.stringify(this.getSetting('id')) })
								}
	
								if (this.getSetting('sensorids') != null && this.getSetting('sensors') != null) {
									this.setSettings({ sensorids: JSON.stringify(this.getSetting('sensors')) })
								}
	
								this.log('re-register the device in the app')
								this.registerInApp()

								this.setInitialState()
	
								this.log('repaired successfully ' + this.getName() + ' ' + mac + ' ' + this.getSetting('id'))
								callback(null, { message: 'Successfully repaired the device!', error: false })
								return Promise.resolve()
							}, 3000)
						}
					}
				}
				this.log('no candidate matched the device to repair')
				callback(null, { message: 'Could not find any device with the same MAC address!', error: true })
				return Promise.resolve()
			}
		})
	}

	fireEvent(event, state) {
		throw new Error('unhandled fireEvent for the device ' + device.getSetting('modelid') + ' ### ' + JSON.stringify(event) + ' ### ' + JSON.stringify(state) + JSON.stringify(this.getDriver().getManifest()))
	}
}

module.exports = DeconzDevice