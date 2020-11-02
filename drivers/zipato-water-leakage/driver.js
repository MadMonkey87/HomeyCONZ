'use strict'

const Driver = require('../Driver')

class ZipatoWaterLeakageDriver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('ZipatoWaterLeakageDriver has been initiated')
	}
	
	onPairListDevices(data, callback) {
		this.getSensorsByCondition(device => device.modelid === 'HM-HS1WL-M' || device.modelid === 'FB56-WTS04HM1.1' || device.modelid === 'SWHM-I1' || device.modelid==='WaterSensor-EM' || device.modelid==='WATER_CTPG' || device.modelid==='TS0207', callback)
	}
	
}

module.exports = ZipatoWaterLeakageDriver