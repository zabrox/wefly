#!/usr/bin/env python
import requests
from google.cloud import storage
from export_tracks import Track

def upload_pilot_icon(tracks: [Track]):
    # Google Cloud Storage クライアントの初期化
    storage_client = storage.Client()
    bucket = storage_client.bucket('wefly-lake')

    for track in tracks:
        # download pilot icon
        response = requests.get(track.piloticonurl)
        # save it to GCS
        blob = bucket.blob(f'pilot_icons/{track.pilotname}.png')
        blob.upload_from_string(response.content, content_type='image/png')