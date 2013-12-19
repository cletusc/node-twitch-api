var request = require('request');
var extend = require('jquery-extend');
var querystring = require('querystring');

function TwitchAPI() {
	this.defaults = {
		accessKey: null,
		apiBase: 'https://api.twitch.tv/kraken',
		apiVersion: '2',
		json: true,
		params: {},
		replacements: {},
		clientID: ''
	};
}

/**
 * Makes an API call to Twitch.
 * @param {string} path The API resource as shown on the Twitch API page, e.g. `/streams/:channel`
 * @param {object} [options] Possible options below. Will inherit defaults of properties if not passed.
 * @param {object} [options.replacements={}] A hash of string replacements on path. For a path of `/streams/:channel`, {channel: 'test_user'} would
 *                                           convert the path to `/streams/test_user`. Any text in the path with the format of `:token` can be replaced.
 * @param {string} [options.accessKey=''] The access key for the API if it requires it. This API will not get an access key for you. This should typically
 *                                        come from an authentication like https://github.com/johnkernke/passport-twitchtv.
 * @param {object} [options.params={}] A hash of query parameters to add to the path, consult Twitch API for possible paramters for a certain path. A
 *                                     path of `/stream/featured` with params {limit:5, offset: 10} would change path to `/stream/featured?limit=5&offset=10`.
 * @param {string} [options.apiBase='https://api.twitch.tv/kraken'] The base URL of the API. Useful if Twitch ever changes the URL.
 * @param {string} [options.apiVersion='2'] The version of the API to use.
 * @param {boolean} [options.json=true] Whether to pass body through `JSON.parse()`. Useful when `options.params.callback` is set.
 * @param {string} [options.clientID=''] Your Twitch application client ID. To set for all calls, set `this.defaults.clientID`.
 * @param {function} callback Called when the API call is finished. Passed 3 arguments: error, statusCode, and the API response object. 
 * @return {instance} Returns `this` so that you can chain methods.
 *
 * Example usage:
 * 
 * var twitch = require('./twitchapi');
 * twitch.api(
 *     '/streams/featured',
 *     {
 *         params: {
 *             limit: 5
 *         }
 *     },
 *     function (error, statusCode, response) {
 *         if (error) {
 *             console.log(error);
 *             return;
 *         }
 *         console.log('Status code: ' + statusCode);
 *         console.log('API:');
 *         console.log(response);
 *     }
 * );
 */
TwitchAPI.prototype.api = function (path, options, callback) {
	var self = this;

	path = typeof path === 'string' ? path : '';
	if (typeof options === 'function') {
		callback = options;
		options = {};
	}
	options = extend({}, this.defaults, options);
	callback = typeof callback === 'function' ? callback : function () {};

	// Replace tokens.
	for (var replacement in options.replacements) {
		if (!options.replacements.hasOwnProperty(replacement)) {
			continue;
		}
		path = path.replace(':' + replacement, options.replacements[replacement]);
	}

	options.params = querystring.stringify(options.params);

	var requestSettings = {};
	requestSettings.url = options.apiBase + path + (options.params ? '?' + options.params : '');
	requestSettings.headers = {
		'Accept': 'application/vnd.twitchtv.v' + options.apiVersion + '+json',
		'Client-ID': options.clientID
	};
	if (options.accessKey) {
		requestSettings.headers['Authorization'] = 'OAuth ' + options.accessKey;
	}

	request(requestSettings, function (error, response, body) {
		if (error) {
			return callback.call(self, error);
		}
		return callback.call(self, null, response.statusCode, (options.json ? JSON.parse(body) : body));
	});

	return this;
};

module.exports = new TwitchAPI();
