'use strict'

const GenericThermostatDriver = require('../generic-thermostat/driver')

const { http } = require('../../nbhttp')
const Homey = require('homey')

class BitronThermostatDriver extends GenericThermostatDriver {

	onPairListDevices(data, callback) {
		this.getSensorsByCondition(device => device.modelid == '902010/32', callback)
	}

	getSensorsList(callback) {
		http.get(`http://${Homey.app.host}:${Homey.app.port}/api/${Homey.app.apikey}/sensors`, (error, response) => {
			let json = JSON.parse(response)
			json = {
				...json, "65466": {
					"config": {
						"battery": 100,
						"heatsetpoint": 2200,
						"offset": 0,
						"on": true,
						"reachable": true,
						"scheduler": "Monday,Tuesday,Wednesday,Thursday,Friday 04:00 2300 06:00 1700 15:00 2300 16:00 2200 21:00 1800;Saturday 06:00 2200 21:00 1800;",
						"scheduleron": true
					},
					"ep": 1,
					"etag": "06745a49746f448cc3fd23bd6010accd",
					"manufacturername": "Bitron Home",
					"modelid": "902010/32",
					"name": "Thermostat 39",
					"state": {
						"lastupdated": "2019-01-11T16:20:15",
						"on": false,
						"temperature": 2260
					},
					"swversion": "V1b225-20151013",
					"type": "ZHAThermostat",
					"uniqueid": "00:0d:6f:00:0e:f0:df:19-01-0201"
				}
			}
			callback(error, !!error ? null : JSON.parse(json))
		})
	}

}

module.exports = BitronThermostatDriver