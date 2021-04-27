'use strict'

const Sensor = require('../Sensor')

class GenericThermostat extends Sensor {

	onInit() {
		super.onInit()


		this.registerTargetTemperatureListener()
		this.registerOnOffListener()

		this.log(this.getName(), 'has been initiated')
	}

	registerTargetTemperatureListener() {
		let capabilities = this.getCapabilities();
		if (capabilities.includes('target_temperature')) {
			this.registerCapabilityListener('target_temperature', (value, opts, callback) => {
				this.putSensorConfig({ config: { heatsetpoint: value * 100 } }, (err, result) => {
					callback(err, result)
				})
			})
		}
	}

	registerOnOffListener() {
		let capabilities = this.getCapabilities();
		if (capabilities.includes('onoff')) {
			this.registerCapabilityListener('onoff', (value, opts, callback) => {
				this.putSensorConfig({ config: { on: value } }, (err, result) => {
					callback(err, result)
				})
			})
		}
	}

}

module.exports = GenericThermostat