#!/usr/bin/env python

from google.cloud import firestore, storage
import datetime
import sys

def delete_logs(datestr):
    date = datetime.datetime.strptime(datestr, '%Y-%m-%d')
    db = firestore.Client()

    # Query Firestore
    tracks_ref = db.collection('tracks')
    query = tracks_ref  \
        .where(filter=firestore.FieldFilter('lasttime', '>=', date)) \
        .where(filter=firestore.FieldFilter('lasttime', '<', date + datetime.timedelta(days=1)))
    tracks = query.stream()

    for track in tracks:
        # delete from firestore
        track.reference.delete()
    
    # Delete from GCS
    bucket = storage.Client().bucket('wefly')
    blobs = bucket.list_blobs(prefix=datestr)
    for blob in blobs:
        blob.delete()

delete_logs(sys.argv[1])