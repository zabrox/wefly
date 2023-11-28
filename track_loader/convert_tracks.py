#!/usr/bin/env python
import json
import math
import re
import csv
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

def parse_igc_line(line):
    if line.startswith('B'):
        time = line[1:7]
        latitude = line[7:14]
        longitude = line[15:23]
        altitude = line[31:36]
        return {
            'time': convert_to_timestring(time),
            'latitude': convert_to_degrees(latitude),
            'longitude': convert_to_degrees(longitude),
            'altitude': int(altitude)
        }
    return None

def convert_to_timestring(time):
    hour = time[0:2]
    minute = time[2:4]
    second = time[4:6]
    return hour + ':' + minute + ':' + second

def convert_to_degrees(coord):
    degrees = float(coord) / 100000
    return degrees

def igc_to_json(track):
    with open(track.igcpath, 'r') as file:
        lines = file.readlines()

    track_points = [parse_igc_line(line) for line in lines if line.startswith('B')]
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
            lat = float(re.sub('S|N', '', row[3])) / 100
            lon = float(re.sub('E|W', '', row[4])) / 100
            areas.append(Area(name, lat, lon))
    return areas

def nearest_area(areas, dict):
    nearest_dist = 100000
    nearest_area = None
    for area in areas:
        dist = math.sqrt(math.pow(dict['track_points'][0]['latitude'] - area.latitude, 2) + math.pow(dict['track_points'][0]['longitude'] - area.longitude, 2))
        if dist < RADIUS and dist < nearest_dist:
            nearest_dist = dist
            nearest_area = area
    return nearest_area

def find_nearest_area(areas, dict):
    area = nearest_area(areas, dict)
    return area

def convert_tracks(tracks: [Track]):
    areas = load_areas()
    for track in tracks:
        dict = igc_to_json(track)
        area = find_nearest_area(areas, dict)
        if area != None:
            dict['area'] = area.name
        json.dump(dict, open(track.igcpath.replace(".igc", ".json"), 'w'), indent=4)
