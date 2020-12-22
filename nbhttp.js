const http = require('http')
const https = require('https')

module.exports.http = {}
module.exports.https = {}

module.exports.http.get = function (url, callback) {
	let options = {
		headers: {
			'User-Agent': 'Homey'
		}
	}
	http.get(url, options, response => {
		let data = ''
		response.on('data', chunk => {
			data += chunk
		})
		response.on('end', () => {
			callback(null, data, response.statusCode)
		})
	}).on('error', err => {
		callback(err)
	})
}

module.exports.http.downloadToFile = function (url, filename, callback) {
	let file = fs.createWriteStream(filename);
	http.get(url, function (response) {
		response.pipe(file)
		file.on('finish', function () {
			file.close(callback)
		});
	}).on('error', function (err) {
		fs.unlink(filename)
		callback(err)
	})
}

module.exports.https.get = function (url, callback) {
	let options = {
		headers: {
			'User-Agent': 'Homey'
		}
	}
	https.get(url, options, response => {
		let data = ''
		response.on('data', chunk => {
			data += chunk
		})
		response.on('end', () => {
			callback(null, data, response.statusCode)
		})
	}).on('error', err => {
		callback(err)
	})
}

module.exports.https.downloadToFile = function (url, filename, callback) {
	let file = fs.createWriteStream(filename);
	https.get(url, function (response) {
		response.pipe(file)
		file.on('finish', function () {
			file.close(callback)
		});
	}).on('error', function (err) {
		fs.unlink(filename)
		callback(err)
	})
}

module.exports.http.post = function (host, port, path, data, callback) {
	let dataString = JSON.stringify(data)
	let options = {
		host: host,
		port: port,
		path: path,
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Content-Length': dataString.length,
			'User-Agent': 'Homey'
		}
	}
	http.request(options, response => {
		let data = ''
		response.on('data', chunk => {
			data += chunk
		})
		response.on('end', () => {
			callback(null, data, response.statusCode)
		})
	}).on('error', err => {
		callback(err)
	}).write(dataString)
}

module.exports.https.post = function (host, port, path, data, callback) {
	let dataString = JSON.stringify(data)
	let options = {
		host: host,
		port: port,
		path: path,
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Content-Length': dataString.length,
			'User-Agent': 'Homey'
		}
	}
	https.request(options, response => {
		let data = ''
		response.on('data', chunk => {
			data += chunk
		})
		response.on('end', () => {
			callback(null, data, response.statusCode)
		})
	}).on('error', err => {
		callback(err)
	}).write(dataString)
}

module.exports.http.put = function (host, port, path, data, callback) {
	let dataString = JSON.stringify(data)
	let options = {
		host: host,
		port: port,
		path: path,
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			'Content-Length': dataString.length,
			'User-Agent': 'Homey'
		}
	}
	http.request(options, response => {
		let data = ''
		response.on('data', chunk => {
			data += chunk
		})
		response.on('end', () => {
			callback(null, data, response.statusCode)
		})
	}).on('error', err => {
		callback(err)
	}).write(dataString)
}

module.exports.https.put = function (host, port, path, data, callback) {
	let dataString = JSON.stringify(data)
	let options = {
		host: host,
		port: port,
		path: path,
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			'Content-Length': dataString.length,
			'User-Agent': 'Homey'
		}
	}
	https.request(options, response => {
		let data = ''
		response.on('data', chunk => {
			data += chunk
		})
		response.on('end', () => {
			callback(null, data, response.statusCode)
		})
	}).on('error', err => {
		callback(err)
	}).write(dataString)
}