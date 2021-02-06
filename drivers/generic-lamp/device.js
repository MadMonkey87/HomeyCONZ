'use strict'

const Light = require('../Light')
const Homey = require('homey')
const { http } = require('../../nbhttp')

class GenericLamp extends Light {

	onInit() {
		super.onInit()

		this.log(this.getName(), 'has been initiated')
	}

	setLightState(state, callback) {
		http.put(Homey.app.host, Homey.app.port, `/api/${Homey.app.apikey}/lights/${this.id}/state`, state, (error, response) => {
			callback(error, !!error ? null : JSON.parse(response))
		})
	}
}

module.exports = GenericLamp