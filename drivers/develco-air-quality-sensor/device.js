'use strict'

const Sensor = require('../Sensor')
const Homey = require('homey');

class DevelcoAirQualitySensor extends Sensor {

	onInit() {
		super.onInit()

		this.initializeTriggers()

		this.log(this.getName(), 'has been initiated')
	}

	setCapabilityValue(name, value) {
		if (name === 'measure_voc' && value != this.getCapabilityValue(name)) {
			this.vocChanged.trigger(this, { measure_voc: value });
		}

		super.setCapabilityValue(name, value)
	}

	initializeTriggers() {
		this.vocChanged = new Homey.FlowCardTrigger('measure_voc_changed').register();
	}
}

module.exports = DevelcoAirQualitySensor