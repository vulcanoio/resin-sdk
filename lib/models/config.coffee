###*
# @module resin.models.config
###

request = require('resin-request')

###*
# @summary Get all configuration
# @public
# @function
#
# @returns {Promise<Object>} configuration
#
# @example
# resin.models.config.getAll().then (config) ->
# 	console.log(config)
###
exports.getAll = (callback) ->
	request.send
		method: 'GET'
		url: '/config'
	.get('body')
	.nodeify(callback)

###*
# @summary Get PubNub keys
# @public
# @function
#
# @returns {Promise<Object>} pubnub keys
#
# @example
# resin.models.config.getPubNubKeys().then (pubnubKeys) ->
# 	console.log(pubnubKeys.subscribe_key)
# 	console.log(pubnubKeys.publish_key)
###
exports.getPubNubKeys = (callback) ->
	exports.getAll().get('pubnub').nodeify(callback)

###*
# @summary Get device types
# @public
# @function
#
# @returns {Promise<Object[]>} device types
#
# @example
# resin.models.config.getDeviceTypes().then (deviceTypes) ->
# 	console.log(deviceTypes)
###
exports.getDeviceTypes = (callback) ->
	exports.getAll().get('deviceTypes').nodeify(callback)
