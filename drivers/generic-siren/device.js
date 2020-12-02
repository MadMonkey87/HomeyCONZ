'use strict'

const Light = require('../Light')
const Homey = require('homey')
const { http } = require('../../nbhttp')

class GenericSiren extends Light {

	onInit() {
		super.onInit()

		this.log(this.getName(), 'has been initiated')
	}

	registerOnOffListener() {
		this.registerCapabilityListener('onoff', (value, opts, callback) => {
			this.put(this.address, { alert: value ? 'select':'none' }, callback)
		})
	}
}

module.exports = GenericSiren