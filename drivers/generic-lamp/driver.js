'use strict'

const Homey = require('homey')
const Driver = require('../Driver')
const { http } = require('../../nbhttp')

class GenericLampDriver extends Driver {

	onInit() {
		super.onInit()

		this.initializeActions()

		this.log('GenericLampDriver has been initiated')
	}

	onPairListDevices(data, callback) {
		this.getLightsByCondition(device => {
			return device.type !== 'Smart plug' && device.type !== 'On/Off plug-in unit' && device.type !== 'Window covering device' && device.type !== 'Configuration tool' && device.type !== 'Range extender' && device.modelid !== 'lumi.relay.c2acn01' && device.type !== 'Warning device' && device.modelid !== 'TS0601'
		}, callback)
	}

	setLightState(lightId, state, callback) {
		http.put(Homey.app.host, Homey.app.port, `/api/${Homey.app.apikey}/lights/${lightId}/action`, state, (error, response) => {
			callback(error)
		})
	}

	initializeActions() {

		let flashLightShortAction = new Homey.FlowCardAction('flash_short');
		flashLightShortAction
			.register()
			.registerRunListener(async (args, state) => {
				const lightState = { alert: 'select' };
				return new Promise((resolve) => {
					this.setLightState(args.device.id, lightState, (error) => {
						if (error) {
							return this.error(error);
						}
						resolve(true);
					})
				});
			});

		let flashLightLongAction = new Homey.FlowCardAction('flash_long');
		flashLightLongAction
			.register()
			.registerRunListener(async (args, state) => {
				const lightState = { alert: 'lselect' };
				return new Promise((resolve) => {
					this.setLightState(args.device.id, lightState, (error) => {
						if (error) {
							return this.error(error);
						}
						resolve(true);
					})
				});
			});

		let setLightState = new Homey.FlowCardAction('set_light_state');
		setLightState
			.register()
			.registerRunListener(async (args, state) => {

				const lightState = { transitiontime: args.transitiontime };

				if (args.power === 'on') {
					lightState.on = true;
				} else if (args.power === 'off') {
					lightState.on = false;
				}

				if (args.brightness_mode === 'absolute') {
					lightState.bri = Math.round(args.brightness * 254)
				} else if (args.brightness_mode === 'relative') {
					lightState.bri_inc = Math.round(args.relative_increasement_brightness * 254)
				}

				if (args.saturation_mode === 'absolute') {
					lightState.sat = Math.round(args.saturation * 254)
				} else if (args.brightness_mode === 'relative') {
					lightState.sat_inc = Math.round(args.relative_increasement_saturation * 254)
				}

				if (args.hue_mode === 'absolute') {
					lightState.hue = Math.round(args.hue * 65534)
				} else if (args.brightness_mode === 'relative') {
					lightState.hue_inc = Math.round(args.relative_increasement_hue * 65534)
				}

				if (args.hue_mode === 'absolute') {
					lightState.hue = Math.round(args.hue * 65534)
				} else if (args.brightness_mode === 'relative') {
					lightState.hue_inc = Math.round(args.relative_increasement_hue * 65534)
				}

				if (args.ct_mode === 'absolute') {
					lightState.ct = Math.round(args.ct * 347 + 153)
				} else if (args.ct_mode === 'relative') {
					lightState.ct_inc = Math.round(args.relative_increasement_ct * 347)
				}

				if (args.colormode !== 'none') {
					lightState.colormode = args.colormode
				}

				return new Promise((resolve) => {
					this.setLightState(args.device.id, lightState, (error, result) => {
						if (error) {
							this.log(error);
							resolve(false);
						}
						resolve(true);
					})
				})
			})

	}
}

module.exports = GenericLampDriver