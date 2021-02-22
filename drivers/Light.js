'use strict'

const Homey = require('homey')
const { http } = require('../nbhttp')
const { util } = require('../util')
const DeconzDevice = require('../drivers/DeconzDevice')

class Light extends DeconzDevice {

	onInit() {
		super.onInit()

		this.host = Homey.ManagerSettings.get('host')
		this.apikey = Homey.ManagerSettings.get('apikey')
		this.port = Homey.ManagerSettings.get('port')

		this.isBlinds = this.getClass() === 'windowcoverings'

		this.registerInApp()

		let capabilities = this.getCapabilities()

		if (capabilities.includes('onoff')) {
			this.registerOnOffListener()
		}

		if (capabilities.includes('dim')) {
			this.registerDimListener()
		}

		if (capabilities.includes('light_temperature')) {
			this.registerCTListener()
		}

		if (capabilities.includes('windowcoverings_set')) {
			this.registerLiftListener()
		}

		if (capabilities.includes('windowcoverings_closed')) {
			this.registerOpenListener()
		}

		if (capabilities.includes('blinds_stop')) {
			this.registerStopListener()
		}

		if (capabilities.includes('light_hue') && capabilities.includes('light_saturation')) {
			this.registerColorListener()
		}

		this.updateSettings()

		this.setInitialState()
	}

	onSettings(oldSettingsObj, newSettingsObj, changedKeysArr, callback) {
		if (newSettingsObj.colormode !== undefined) {
			this.xycolormode = newSettingsObj.colormode
		} else if (newSettingsObj['dim_duration'] !== undefined) {
			this.dimDuration = newSettingsObj['dim_duration']
		}
		callback(null, true)
	}

	updateSettings() {
		this.dimDuration = this.getSetting('dim_duration') || 4
		this.xycolormode = this.getSetting('colormode') || false
		this.log('settings updated', this.dimDuration, this.xycolormode)
	}

	registerInApp() {
		this.id = this.getSetting('id')
		this.address = `/lights/${this.id}/state`
		this.sensors = this.getSetting('sensors')

		Homey.app.devices.lights[this.id] = this
		if (this.sensors) {
			this.sensors.forEach(id => {
				Homey.app.devices.sensors[id] = this
			})
		}
	}

	setInitialState() {
		Homey.app.getLightState(this, (error, state) => {
			if (error) {
				return this.error(error)
			}
			Homey.app.updateState(this, state, true)
		})
	}

	registerLiftListener() {
		this.registerCapabilityListener('windowcoverings_set', (value, opts, callback) => {
			this.setLift(100 - value * 100, callback)
		})
	}

	registerOpenListener() {
		this.registerCapabilityListener('windowcoverings_closed', (value, opts, callback) => {
			this.setOpen(value, callback)
		})
	}

	registerStopListener() {
		this.registerCapabilityListener('blinds_stop', (value, opts, callback) => {
			this.setStop(callback)
		})
	}

	registerOnOffListener() {
		this.registerCapabilityListener('onoff', (value, opts, callback) => {
			let power = this.isBlinds ? !value : value
			this.setPower(power, callback)
		})
	}

	registerDimListener() {
		this.registerCapabilityListener('dim', (value, opts, callback) => {
			let dim = this.isBlinds ? 1 - value : value
			this.dim(dim, this.dimDuration, (err, result) => {
				callback(err, result)
			})
		})
	}

	registerCTListener() {
		this.registerCapabilityListener('light_temperature', (value, opts, callback) => {
			let ct = value * 347 + 153
			this.setCapabilityValue('light_mode', 'temperature')
			this.setColorTemperature(ct, callback)
		})
	}

	registerColorListener() {

		// when setting the color from the homey ui it performs this by emitting a hue and a saturation event separatly. Therefore we try to wait for the second event but if it doesn't
		// come swiftly we take the first one anyways

		// this.timeout = 200

		this.registerCapabilityListener('light_hue', (hue, opts, callback) => {
			/*if (!this.setColorTimeOut) {
				this.setColorBuffer = {
					hue: hue
				}
				this.setColorTimeOut = setTimeout(() => {
					clearTimeout(this.setColorTimeOut)
					this.setColorBuffer.hue = undefined
					this.setColor(hue, undefined)
				}, this.timeout)
			} else {
				clearTimeout(this.setColorTimeOut)
				this.setColor(hue, this.setColorBuffer.sat)
			}*/

			this.setColor(hue, undefined)
			callback(null, true)
		})

		this.registerCapabilityListener('light_saturation', (sat, opts, callback) => {
			/*if (!this.setColorTimeOut) {
				this.setColorBuffer = {
					sat: sat
				}
				this.setColorTimeOut = setTimeout(() => {
					clearTimeout(this.setColorTimeOut)
					this.setColorBuffer.sat = undefined
					this.setColor(undefined, sat)
				}, this.timeout)
			} else {
				clearTimeout(this.setColorTimeOut)
				this.setColor(this.setColorBuffer.hue, sat)
			}*/

			this.setColor(undefined, sat)
			callback(null, true)
		})
	}

	setColor(hue, sat) {
		if (this.xycolormode === true) {
			if (hue === undefined) {
				hue = this.getCapabilityValue('light_hue')
			}
			if (sat === undefined) {
				sat = this.getCapabilityValue('light_saturation')
			}
			this.put(this.address, { xy: util.hsToXy(hue, sat), transitiontime: 0 }, (error, success) => { })
		} else {
			if (hue !== undefined && sat !== undefined) {
				this.put(this.address, { hue: Math.round(hue * 65534), sat: Math.round(sat * 255), transitiontime: 0 }, (error, success) => { })
			} else if (hue !== undefined) {
				this.put(this.address, { hue: Math.round(hue * 65534), transitiontime: 0 }, (error, success) => { })
			} else if (sat !== undefined) {
				this.put(this.address, { sat: Math.round(sat * 255), transitiontime: 0 }, (error, success) => { })
			}
		}
	}

	setPower(value, callback) {
		this.put(this.address, { on: value }, callback)
	}

	dim(level, duration, callback) {
		this.put(this.address, { on: true, bri: level * 255, transitiontime: duration }, callback)
	}

	setColorTemperature(value, callback) {
		this.put(this.address, { ct: value }, callback)
	}

	setLift(value, callback) {
		this.put(this.address, { lift: value }, callback)
	}

	setOpen(value, callback) {
		this.put(this.address, { open: value }, callback)
	}

	setStop(callback) {
		this.put(this.address, { stop: true }, callback)
	}

	put(path, data, callback) {
		http.put(this.host, this.port, `/api/${this.apikey}${path}`, data, (error, data) => {
			callback(error, !!error ? null : JSON.parse(data))
		})
	}

	handleRepairRequest(candidateDevice) {
		super.handleRepairRequest(candidateDevice)
		this.id = this.getSetting('id')
		this.address = `/lights/${this.id}/state`
		this.registerInApp()
	}
}

module.exports = Light
