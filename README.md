# node-twitch-api

A simple customizable module for making Twitch API calls. This is an extremely simple module for right now, and will likely only have changes when I need them. Feel free to post any feature requests or bugs that you find.

## Usage

Install the module:
```
npm install cletusc/node-twitch-api#master --save
```

Simple usage:
```
var twitch = require('node-twitch-api');
twitch.api(
    '/streams/featured',
    {
        params: {
            limit: 5
        }
    },
    function (error, statusCode, response) {
        if (error) {
            console.log(error);
            return;
        }
        console.log('Status code: ' + statusCode);
        console.log('API:');
        console.log(response);
    }
);
```

## Methods

### `.api(path, [options], callback)`

#### Parameters

| Parameter            | Type     | Default  | Description |
|----------------------|----------|----------|-------------|
| path                 | String   | required | The API resource as shown on the Twitch API page, e.g. `/streams/:channel` |
| options              | Object   |          | Possible options below. Will inherit defaults of properties if not passed. |
| options.replacements | Object   | `{}`     | A hash of string replacements on path. For a path of `/streams/:channel`, `{channel: 'test_user'}` would convert the path to `/streams/test_user`. Any text in the path with the format of `:token` can be replaced. |
| options.accessKey    | String   | `''`     | The access key for the API if it requires it. This API will not get an access key for you. This should typically come from an authentication like https://github.com/johnkernke/passport-twitchtv. |
| options.params       | Object   | `{}`     | A hash of query parameters to add to the path, consult Twitch API for possible paramters for a certain path. A path of `/stream/featured` with params `{limit:5, offset: 10}` would change path to `/stream/featured?limit=5&offset=10`. |
| options.apiBase      | String   | `'https://api.twitch.tv/kraken'` | The base URL of the API. Useful if Twitch ever changes the URL. |
| options.apiVersion   | String   | `2`      | The version of the API to use. |
| options.json         | Boolean  | `true`   | Whether to pass body through `JSON.parse()`. `false` is useful when `options.params.callback` is set. |
| options.clientID     | String   | `''`     | Your Twitch application client ID. To set for all calls, set `this.defaults.clientID`. |
| callback             | Function | required | Called when the API call is finished. Passed 3 arguments: error, statusCode, and the API response object. |

#### Return

Returns `this` so that you can chain methods.
