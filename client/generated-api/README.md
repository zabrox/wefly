# wefly_track_api

WeflyTrackApi - JavaScript client for wefly_track_api
API for managing and retrieving track data for Wefly.
This SDK is automatically generated by the [OpenAPI Generator](https://openapi-generator.tech) project:

- API version: 1.0.0
- Package version: 1.0.0
- Generator version: 7.11.0
- Build package: org.openapitools.codegen.languages.JavascriptClientCodegen

## Installation

### For [Node.js](https://nodejs.org/)

#### npm

To publish the library as a [npm](https://www.npmjs.com/), please follow the procedure in ["Publishing npm packages"](https://docs.npmjs.com/getting-started/publishing-npm-packages).

Then install it via:

```shell
npm install wefly_track_api --save
```

Finally, you need to build the module:

```shell
npm run build
```

##### Local development

To use the library locally without publishing to a remote npm registry, first install the dependencies by changing into the directory containing `package.json` (and this README). Let's call this `JAVASCRIPT_CLIENT_DIR`. Then run:

```shell
npm install
```

Next, [link](https://docs.npmjs.com/cli/link) it globally in npm with the following, also from `JAVASCRIPT_CLIENT_DIR`:

```shell
npm link
```

To use the link you just defined in your project, switch to the directory you want to use your wefly_track_api from, and run:

```shell
npm link /path/to/<JAVASCRIPT_CLIENT_DIR>
```

Finally, you need to build the module:

```shell
npm run build
```

#### git

If the library is hosted at a git repository, e.g.https://github.com/GIT_USER_ID/GIT_REPO_ID
then install it via:

```shell
    npm install GIT_USER_ID/GIT_REPO_ID --save
```

### For browser

The library also works in the browser environment via npm and [browserify](http://browserify.org/). After following
the above steps with Node.js and installing browserify with `npm install -g browserify`,
perform the following (assuming *main.js* is your entry file):

```shell
browserify main.js > bundle.js
```

Then include *bundle.js* in the HTML pages.

### Webpack Configuration

Using Webpack you may encounter the following error: "Module not found: Error:
Cannot resolve module", most certainly you should disable AMD loader. Add/merge
the following section to your webpack config:

```javascript
module: {
  rules: [
    {
      parser: {
        amd: false
      }
    }
  ]
}
```

## Getting Started

Please follow the [installation](#installation) instruction and execute the following JS code:

```javascript
var WeflyTrackApi = require('wefly_track_api');


var api = new WeflyTrackApi.DefaultApi()
var trackId = "trackId_example"; // {String} ID of the track to delete
var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
api.apiTrackTrackIdDelete(trackId, callback);

```

## Documentation for API Endpoints

All URIs are relative to *http://www.wefly.tokyo/api*

Class | Method | HTTP request | Description
------------ | ------------- | ------------- | -------------
*WeflyTrackApi.DefaultApi* | [**apiTrackTrackIdDelete**](docs/DefaultApi.md#apiTrackTrackIdDelete) | **DELETE** /api/track/{trackId} | Delete track data
*WeflyTrackApi.DefaultApi* | [**apiTracksMetadataGet**](docs/DefaultApi.md#apiTracksMetadataGet) | **GET** /api/tracks/metadata | Retrieve track metadata
*WeflyTrackApi.DefaultApi* | [**apiTracksPathsGet**](docs/DefaultApi.md#apiTracksPathsGet) | **GET** /api/tracks/paths | Retrieve track paths
*WeflyTrackApi.DefaultApi* | [**apiTracksPost**](docs/DefaultApi.md#apiTracksPost) | **POST** /api/tracks | Upload track data


## Documentation for Models

 - [WeflyTrackApi.ApiTracksMetadataGet500Response](docs/ApiTracksMetadataGet500Response.md)
 - [WeflyTrackApi.Metadata](docs/Metadata.md)
 - [WeflyTrackApi.Path](docs/Path.md)
 - [WeflyTrackApi.Track](docs/Track.md)


## Documentation for Authorization

Endpoints do not require authorization.

