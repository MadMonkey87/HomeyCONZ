# HomeyCONZ

This app for [Athom Homey](https://homey.app/en-us/) adds support for [deCONZ](https://www.dresden-elektronik.de/funk/software/deconz.html)'s [[RaspBee](https://www.phoscon.de/en/raspbee)/[ConBee](https://www.phoscon.de/en/conbee)] child devices.

[![current version](https://img.shields.io/badge/version-1.27.0-<COLOR>.svg)](https://shields.io/)

# Installation information

The easiest way is to get the latest version directly from the [store](https://homey.app/de-ch/app/de.dresden-elektronik.deconz/deCONZ).
Pre-Release versions are available over [here](https://homey.app/de-ch/app/de.dresden-elektronik.deconz/deCONZ/test).

# Supported devices

- [x] Bulbs
- [x] Blinds
- [x] Plugs
- [x] Thermostats
- [x] deCONZ groups
- [x] Door locks
- [x] Sirens/Alarm devices
- [x] Motion sensors: Philips, Xiaomi, Aqara, TRÅDFRI, Trust, Develco, Frient, Heiman, Silvercrest
- [x] Temperature/Humidity sensors: Xiaomi, Aqara, Develco
- [x] Buttons & Switches: Mi, Aqara, Aqara gyro, TRÅDFRI, Philips, Trust, Feller, Jung and a generic driver to support all others
- [x] Contact sensors: Xiaomi, Aqara, Trust
- [x] Remotes: TRÅDFRI, Tint
- [x] Leakage sensor: Aqara, Develco, Zipato, Frient
- [x] Smoke sensor: Honeywell, Trust, Heimann, Develco, Frient
- [x] CO sensor: Heimann
- [x] Relay: Sonoff, Philips, Aqara
- [x] Aqara Cube
- [x] Aqara Vibration sensor
- [x] TRÅDFRI signal repeater
- [x] Mi Light sensor
- [x] Silvercrest Christmas Tree light
- [x] Frient VOC sensor
      ...and many more! If your device isn't supported yet feel free to create a request

# Features
- [x] Receive real-time push notifications
- [x] Optional polling
- [x] Check for DeConz updates (also for marthocs' docker image)
- [x] Store backups on your homey
- [x] Wide support for devices
- [x] More reliable zigbee network in comparisation to add the devices directly to Homey
- [x] Automatically restore the connection if your DeConz gateway get's a different ip
- [x] Hardware settings for devices supporting it (i.e motion sensor sensitivity)
- [x] Easily repair broken devices or replacements
- [x] Easy setup & lots of configuration possabilities

![Supported Devices](https://github.com/MadMonkey87/HomeyCONZ/screenshots/SupportedDevices.jpg "Supported Devices")