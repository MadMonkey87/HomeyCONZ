const Homey = require('homey')

module.exports = [
	{
		method: 'GET',
		path: '/state',
		public: false,
		fn: function (args, callback) {
			Homey.app.getFullState((err, result) => {
				if (err) {
					callback(err, null)
				} else {
					callback(null, result)
				}
			})
		}
	},
	{
		method: 'POST',
		path: '/test',
		public: false,
		fn: function (args, callback) {
			Homey.app.test(args.body.host, args.body.port, args.body.apikey, (err, result) => {
				if (err) {
					callback(err, null)
				} else {
					callback(null, result)
				}
			})
		}
	},
	{
		method: 'GET',
		path: '/discover',
		public: false,
		fn: function (args, callback) {
			Homey.app.discover((err, result) => {
				if (err) {
					callback(err, null)
				} else {
					callback(null, result)
				}
			})
		}
	},
	{
		method: 'PUT',
		path: '/authenticate',
		public: false,
		fn: function (args, callback) {
			Homey.app.authenticate(args.body.host, args.body.port, (err, result) => {
				if (err) {
					callback(err, null)
				} else {
					callback(null, result)
				}
			})
		}
	},
	{
		method: 'GET',
		path: '/checkDeconzUpdate',
		public: false,
		fn: function (args, callback) {
			Homey.app.getDeconzUpdates((err, result) => {
				if (err) {
					callback(err, null)
				} else {
					callback(null, result)
				}
			})
		}
	},
	{
		method: 'GET',
		path: '/checkDeconzDockerUpdate',
		public: false,
		fn: function (args, callback) {
			Homey.app.getDeconzDockerUpdates((err, result) => {
				if (err) {
					callback(err, null)
				} else {
					callback(null, result)
				}
			})
		}
	},
	{
		method: 'GET',
		path: '/pollManually',
		public: false,
		fn: function (args, callback) {
			Homey.app.setInitialStates()
			callback(null, 'success')
		}
	},
	{
		method: 'GET',
		path: '/backups',
		public: false,
		fn: function (args, callback) {
			Homey.app.getBackups((err, result) => {
				if (err) {
					callback(err, null)
				} else {
					callback(null, result)
				}
			})
		}
	},
	{
		method: 'GET',
		path: '/backup',
		public: true,
		fn: function (args, callback) {
			Homey.app.getBackup((err, result) => {
				if (err) {
					callback(err, null)
				} else {
					callback(null, result)
				}
			})
		}
	},
]