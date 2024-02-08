#!/usr/bin/env python

from google.cloud import firestore, storage
import datetime
import os
import json
import gzip

def aggregate_tracks(datestr):
    date = datetime.datetime.strptime(datestr, '%Y-%m-%d')
    db = firestore.Client()
    bucket = storage.Client().bucket('wefly')

    # Query Firestore
    tracks_ref = db.collection('tracks')
    query = tracks_ref  \
        .where(filter=firestore.FieldFilter('lasttime', '>=', date)) \
        .where(filter=firestore.FieldFilter('lasttime', '<', date + datetime.timedelta(days=1)))
    tracks = query.stream()

    aggregated_data = []

    # Download and aggregate data
    for track in tracks:
        try:
            file_url = track.to_dict().get('file_url')
            path = '/'.join(file_url.split('/')[-2:])
            blob = bucket.blob(path)
            data = json.loads(blob.download_as_string())
            aggregated_data.append(data)
        except:
            print(f'failed to download {track.to_dict().get("file_url")}')
            continue

    # Combine all data into one JSON
    combined_data = json.dumps(aggregated_data)
    gzip_data = gzip.compress(combined_data.encode('utf-8'))

    # Upload to GCS
    print(f'upload aggregated json {datestr}/japan.json.gz')
    new_blob = bucket.blob(f'{datestr}/japan.json.gz')
    new_blob.upload_from_string(gzip_data, content_type='application/json')