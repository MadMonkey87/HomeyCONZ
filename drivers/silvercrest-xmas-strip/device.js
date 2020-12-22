'use strict'

const Light = require('../Light')
const Homey = require('homey')
const { http } = require('../../nbhttp')
const { util } = require('../../util')

class SilvercrestXmasStrip extends Light {

	onInit() {
		super.onInit()

		this.initializeActions()

		this.log(this.getName(), 'has been initiated')
	}

	setLightState(state, callback) {
		this.log('send xmas effect', state)
		http.put(Homey.app.host, Homey.app.port, `/api/${Homey.app.apikey}/lights/${this.id}/state`, state, (error, response) => {
			callback(error, !!error ? null : JSON.parse(response))
		})
	}

	initializeActions() {

		let applyEffectAction = new Homey.FlowCardAction('apply_effect');
		applyEffectAction
			.register()
			.registerRunListener(async (args, state) => {
				this.log(args.effect_color_1, args.effect_color_2, args.effect_color_3, args.effect_color_4, args.effect_color_5, args.effect_color_6)
				const effectColors = [util.hexToRgb(args.effect_color_1), util.hexToRgb(args.effect_color_2), util.hexToRgb(args.effect_color_3), util.hexToRgb(args.effect_color_4), util.hexToRgb(args.effect_color_5), util.hexToRgb(args.effect_color_6)];
				const lightState = { effect: args.effect, effectSpeed: args.effect_speed, effectColors: effectColors };
				return new Promise((resolve) => {
					this.setLightState(lightState, (error, result) => {
						if (error) {
							return this.error(error);
						}
						resolve(true);
					})
				});
			});
	}
}

module.exports = SilvercrestXmasStrip