#!/usr/bin/env python
import json
import math
import re
import sys
import csv
import os
from google.cloud import storage, firestore
from export_tracks import Track

AREAS_FILE = "./areas.cup"
RADIUS = 0.1


class Area:
    name = ""
    latitude = 0.0
    longitude = 0.0
    
    def __init__(self, name, lat, lon):
        self.name = name
        self.latitude = lat
        self.longitude = lon

    def __str__(self):
        return "name: " + self.name + " location: " + str(self.latitude) + " " + str(self.longitude)

def parse_igc_line(date, line):
    if line.startswith('B'):
        time = line[1:7]
        latitude = line[7:14]
        latitude = float(latitude[0:2]) + float(latitude[2:]) / 100000
        longitude = line[15:23]
        longitude = float(longitude[0:3]) + float(longitude[3:]) / 100000
        altitude = line[31:36]
        return {
            'time': convert_to_timestring(date, time),
            'latitude': convert_to_degrees(latitude),
            'longitude': convert_to_degrees(longitude),
            'altitude': int(altitude)
        }
    return None

def convert_to_timestring(date, time):
    hour = time[0:2]
    minute = time[2:4]
    second = time[4:6]
    return date + 'T' + hour + ':' + minute + ':' + second + ".000Z"

def convert_to_degrees(coord):
    degrees = int(coord)
    minutes = coord - degrees
    return degrees + (minutes * 1.6666)

def igc_to_json(date, track):
    with open(track.igcpath, 'r') as file:
        lines = file.readlines()

    track_points = [parse_igc_line(date, line) for line in lines if line.startswith('B')]
    track_points = [point for point in track_points if point is not None]

    dict = {'track_points': track_points}
    dict['pilotname'] = track.pilotname
    dict['distance'] = track.distance
    dict['duration'] = track.duration
    dict['activity'] = track.activity
    return dict

def load_areas():
    areas = []
    with open(AREAS_FILE, 'r') as f:
        reader = csv.reader(f)
        for row in reader:
            if not row[0].startswith('SP'):
                continue
            name = re.sub("SP \(.*\)", '', row[1])
            lat = convert_to_degrees(float(re.sub('S|N', '', row[3])) / 100)
            lon = convert_to_degrees(float(re.sub('E|W', '', row[4])) / 100)
            areas.append(Area(name, lat, lon))
    return areas

def find_nearest_area(areas, dict):
    nearest_dist = 100000
    nearest_area = None
    for area in areas:
        dist = math.sqrt(math.pow(dict['track_points'][0]['latitude'] - area.latitude, 2) + math.pow(dict['track_points'][0]['longitude'] - area.longitude, 2))
        if dist < RADIUS and dist < nearest_dist:
            nearest_dist = dist
            nearest_area = area
    return nearest_area

def upload_file_to_gcs(bucket, db, track: Track):
    jsonpath = track.igcpath.replace(".igc", ".json")
    blob = bucket.blob(os.path.basename(jsonpath))
    blob.upload_from_filename(jsonpath)
    file_url = blob.public_url
    doc_ref = db.collection('tracks').document(os.path.basename(track.igcpath).replace(".igc", ""))
    metadata = track.get_metadata()
    metadata['file_url'] = file_url
    doc_ref.set(metadata)

def convert_tracks(date, tracks: [Track]):
    areas = load_areas()

    for track in tracks:
        try:
            dict = igc_to_json(date, track)
            area = find_nearest_area(areas, dict)
            if area != None:
                dict['area'] = area.name
            json.dump(dict, open(track.igcpath.replace(".igc", ".json"), 'w'), indent=4)
        except Exception as e:
            print(f"convert failed. file: {track.igcpath} error: {e}", sys.stderr)

    # Google Cloud Storage クライアントの初期化
    storage_client = storage.Client()
    bucket = storage_client.bucket('wefly')
    # Firestore クライアントの初期化
    db = firestore.Client()

    for track in tracks:
        try:
            upload_file_to_gcs(bucket, db, track)
        except Exception as e:
            print(f"upload failed. file: {track.igcpath} error: {e}", sys.stderr)

