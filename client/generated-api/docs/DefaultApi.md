# WeflyTrackApi.DefaultApi

All URIs are relative to *http://www.wefly.tokyo/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**apiTrackTrackIdDelete**](DefaultApi.md#apiTrackTrackIdDelete) | **DELETE** /api/track/{trackId} | Delete track data
[**apiTracksMetadataGet**](DefaultApi.md#apiTracksMetadataGet) | **GET** /api/tracks/metadata | Retrieve track metadata
[**apiTracksPathsGet**](DefaultApi.md#apiTracksPathsGet) | **GET** /api/tracks/paths | Retrieve track paths
[**apiTracksPost**](DefaultApi.md#apiTracksPost) | **POST** /api/tracks | Upload track data



## apiTrackTrackIdDelete

> String apiTrackTrackIdDelete(trackId)

Delete track data

### Example

```javascript
import WeflyTrackApi from 'wefly_track_api';

let apiInstance = new WeflyTrackApi.DefaultApi();
let trackId = "trackId_example"; // String | ID of the track to delete
apiInstance.apiTrackTrackIdDelete(trackId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **trackId** | **String**| ID of the track to delete | 

### Return type

**String**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: text/plain


## apiTracksMetadataGet

> [Metadata] apiTracksMetadataGet(from, to, opts)

Retrieve track metadata

### Example

```javascript
import WeflyTrackApi from 'wefly_track_api';

let apiInstance = new WeflyTrackApi.DefaultApi();
let from = new Date("2013-10-20T19:20:30+01:00"); // Date | Start date-time for the search range
let to = new Date("2013-10-20T19:20:30+01:00"); // Date | End date-time for the search range
let opts = {
  'pilotname': "pilotname_example", // String | Pilot name to filter by
  'maxAltitude': 56, // Number | Minimum altitude to filter by
  'distance': 3.4, // Number | Minimum distance to filter by
  'duration': 56, // Number | Minimum duration to filter by
  'bounds': "bounds_example", // String | Bounding box coordinates to filter by (format \"minLon,minLat,maxLon,maxLat\")
  'activities': "activities_example" // String | Comma-separated list of activities to filter by
};
apiInstance.apiTracksMetadataGet(from, to, opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **from** | **Date**| Start date-time for the search range | 
 **to** | **Date**| End date-time for the search range | 
 **pilotname** | **String**| Pilot name to filter by | [optional] 
 **maxAltitude** | **Number**| Minimum altitude to filter by | [optional] 
 **distance** | **Number**| Minimum distance to filter by | [optional] 
 **duration** | **Number**| Minimum duration to filter by | [optional] 
 **bounds** | **String**| Bounding box coordinates to filter by (format \&quot;minLon,minLat,maxLon,maxLat\&quot;) | [optional] 
 **activities** | **String**| Comma-separated list of activities to filter by | [optional] 

### Return type

[**[Metadata]**](Metadata.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json, text/plain


## apiTracksPathsGet

> {String: Path} apiTracksPathsGet(trackids)

Retrieve track paths

### Example

```javascript
import WeflyTrackApi from 'wefly_track_api';

let apiInstance = new WeflyTrackApi.DefaultApi();
let trackids = "trackids_example"; // String | Comma-separated list of track IDs to retrieve paths for
apiInstance.apiTracksPathsGet(trackids, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **trackids** | **String**| Comma-separated list of track IDs to retrieve paths for | 

### Return type

[**{String: Path}**](Path.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json, text/plain


## apiTracksPost

> String apiTracksPost(track)

Upload track data

### Example

```javascript
import WeflyTrackApi from 'wefly_track_api';

let apiInstance = new WeflyTrackApi.DefaultApi();
let track = new WeflyTrackApi.Track(); // Track | 
apiInstance.apiTracksPost(track, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **track** | [**Track**](Track.md)|  | 

### Return type

**String**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: text/plain

