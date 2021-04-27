'use strict'

const Homey = require('homey')
const Driver = require('../Driver')
const { http } = require('../../nbhttp')

class GroupDriver extends Driver {

	onInit() {
		super.onInit()

		this.initializeActions()

		this.log('GroupDriver has been initiated')
	}

	onPairListDevices(_, callback) {
		let capabilitiesArray = [
			['onoff'],
			['onoff', 'dim'],
			['onoff', 'dim', 'light_temperature'],
			['onoff', 'dim', 'light_temperature', 'light_mode', 'light_saturation', 'light_hue']
		]

		let matchTable = {
			'On/Off light': 0,
			'Dimmable light': 1,
			'Color temperature light': 2,
			'Extended color light': 3,
			'Color light': 3,
			'Smart plug': 0,
			'On/Off plug-in unit': 0,
			'Window covering device': 1
		}

		this.getGroupsList((groupError, groupDevices) => {
			if (groupError) {
				callback(groupError)
				return
			}
			this.getLightsList((lightError, lights) => {
				if (lightError) {
					callback(lightError)
					return
				}
				let devicesObjects = Object.entries(groupDevices).filter(entry => {
					const group = entry[1]
					return group.lights.length > 0
				}).map(entry => {
					const key = entry[0]
					const group = entry[1]
					let groupLights = Object.entries(lights).filter(entry => {
						const lightKey = entry[0]
						// const light = entry[1]
						return group.lights.includes(lightKey)
					}).map(light => {
						light = light[1]
						return matchTable[light.type]
					})

					return {
						name: group.name,
						data: {
							id: group.etag
						},
						settings: {
							id: key
						},
						capabilities: capabilitiesArray[Math.max.apply(Math, groupLights)]
					}
				})
				callback(null, devicesObjects)
			})
		})
	}

	getScenesList(groupId, callback) {
		http.get(`http://${Homey.app.host}:${Homey.app.port}/api/${Homey.app.apikey}/groups/${groupId}/scenes`, (error, response) => {
			callback(error, !!error ? null : JSON.parse(response))
		})
	}

	recallScene(groupId, sceneId, callback) {
		http.put(Homey.app.host, Homey.app.port, `/api/${Homey.app.apikey}/groups/${groupId}/scenes/${sceneId}/recall`, {}, (error, data) => {
			callback(error, !!error ? null : JSON.parse(data))
		})
	}

	setGroupState(groupId, state, callback) {
		http.put(Homey.app.host, Homey.app.port, `/api/${Homey.app.apikey}/groups/${groupId}/action`, state, (error, response) => {
			callback(error)
		})
	}

	initializeActions() {
		let recalSceneAction = new Homey.FlowCardAction('recall_scene');
		recalSceneAction
			.register()
			.registerRunListener(async (args, state) => {
				return new Promise((resolve) => {
					this.recallScene(args.device.id, args.scene.id, (error, result) => {
						if (error) {
							this.log(error)
							resolve(false);
						}
						resolve(true);
					})
				});
			})
			.getArgument('scene')
			.registerAutocompleteListener((query, args) => {
				return new Promise((resolve) => {
					this.getScenesList(args.device.id, (error, scenes) => {
						if (error) {
							return this.error(error);
						}
						let result = [];
						Object.entries(scenes).forEach(entry => {
							const key = entry[0];
							const scene = entry[1];
							if (query && scene.name.toLowerCase().includes(query.toLowerCase())) {
								result.push({ name: scene.name, id: key });
							}
						});
						resolve(result);
					})
				});
			});

		let flashGroupShortAction = new Homey.FlowCardAction('flash_short');
		flashGroupShortAction
			.register()
			.registerRunListener(async (args, state) => {
				const groupState = { alert: 'select' };
				return new Promise((resolve) => {
					this.setGroupState(args.device.id, groupState, (error) => {
						if (error) {
							this.log(error)
							resolve(false);
						}
						resolve(true);
					})
				});
			});

		let flashGroupLongAction = new Homey.FlowCardAction('flash_long');
		flashGroupLongAction
			.register()
			.registerRunListener(async (args, state) => {
				const groupState = { alert: 'lselect' };
				return new Promise((resolve) => {
					this.setGroupState(args.device.id, groupState, (error) => {
						if (error) {
							this.log(error)
							resolve(false);
						}
						resolve(true);
					})
				});
			});

		let setRelativeBrightnessAction = new Homey.FlowCardAction('relative_brightness');
		setRelativeBrightnessAction
			.register()
			.registerRunListener(async (args, state) => {
				const groupState = { bri_inc: args.relative_brightness * 254, transitiontime: args.transitiontime };
				return new Promise((resolve) => {
					this.setGroupState(args.device.id, groupState, (error) => {
						if (error) {
							this.log(error)
							resolve(false);
						}
						resolve(true);
					})
				});
			});

		let setRelativeColorTemperatureAction = new Homey.FlowCardAction('relative_ct');
		setRelativeColorTemperatureAction
			.register()
			.registerRunListener(async (args, state) => {
				const groupState = { ct_inc: args.relative_ct * 254, transitiontime: args.transitiontime };
				return new Promise((resolve) => {
					this.setGroupState(args.device.id, groupState, (error) => {
						if (error) {
							this.log(error)
							resolve(false);
						}
						resolve(true);
					})
				});
			});

		let setLightState = new Homey.FlowCardAction('set_group_state');
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
				} else if (args.saturation_mode === 'relative') {
					lightState.sat_inc = Math.round(args.relative_increasement_saturation * 254)
				}

				if (args.hue_mode === 'absolute') {
					lightState.hue = Math.round(args.hue * 65534)
				} else if (args.hue_mode === 'relative') {
					lightState.hue_inc = Math.round(args.relative_increasement_hue * 65534)
				}

				if (args.hue_mode === 'absolute') {
					lightState.hue = Math.round(args.hue * 65534)
				} else if (args.hue_mode === 'relative') {
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
					this.setGroupState(args.device.id, lightState, (error, result) => {
						if (error) {
							this.log(error)
							resolve(false);
						}
						resolve(true);
					})
				});
			});

	}
}

module.exports = GroupDriver
