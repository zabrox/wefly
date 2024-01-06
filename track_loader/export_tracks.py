#!/bin/python3
import requests
from bs4 import BeautifulSoup
import datetime
import os
import re
from google.cloud import firestore
from track import Track

TRACK_DIR = "./tracks/"
MAX_PAGES = 100

def download_html(url: str):
    response = requests.get(url)
    return response.text

def parse_track_row(trackrow: BeautifulSoup):
    track = Track()
    track.pilotname = re.search(r'[a-zA-Z0-9\-]+', trackrow.find('span', class_='liveusername').find('a').text).group()
    last_locations = trackrow.find_all('div', class_='list_last_location')
    last_time = trackrow.find_all('div', class_='list_last_time')
    track.location = last_locations[0].text.replace("was at  ", "")
    track.altitude = re.search(r'\d+ m', last_locations[1].text).group()
    track.duration = re.search(r'\d{2}:\d{2}:\d{2}', last_locations[1].text).group()
    track.distance = re.search(r'\[Max\] [\d\.]+ km', last_locations[2].text).group().replace("[Max] ", "")
    lasttime_str = re.search(r'\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2} UTC', last_time[0].text).group()
    track.lasttime = datetime.datetime.strptime(lasttime_str, '%d-%m-%Y %H:%M:%S %Z')
    trackid  = trackrow.find_all(attrs={'data-action': 'track_info'})
    track.trackid = trackid[0].get('data-trackid')
    track.activity = trackrow.find('img', class_='activityImg')['alt']
    status = trackrow.find('span', class_='track_status')
    if status is not None and status.text == 'Live!':
        track.isLive = True
    return track

def get_list_table_elements(html: str):
    soup = BeautifulSoup(html, 'html.parser')
    tracktables = soup.find_all('table', class_='tracktable')
    tracks = []
    for trackrow in tracktables:
        try:
            track = parse_track_row(trackrow)
            # skip if track is live
            if track.isLive:
                print(f'skipping track since it is live {track}')
                continue
            # skip parsing if it already exists on firestore
            db = firestore.Client()
            doc_ref = db.collection('tracks').document(track.filename())
            doc = doc_ref.get()
            if doc.exists:
                print(f'skipping track since it already exists {track}')
                continue
        except Exception as e:
            print(f'failed to parse track {track} {e}')
            continue
        tracks.append(track)

    return tracks, len(tracktables) > 0

def download_igc(track: Track, date: str):
    url = "https://www.livetrack24.com/leo_live.php?op=igc&trackID=" + track.trackid
    response = requests.get(url)
    with open(TRACK_DIR + date + "/" + track.filename() + ".igc", 'wb') as f:
        f.write(response.content)

def export_tracks(date: str):
    tracks = []
    baseurl = "https://www.livetrack24.com/tracks/country/jp/from/" + date + "/to/" + date + "/page_num/"
    for i in range(MAX_PAGES):
        url = baseurl + str(i+1)
        html = download_html(url)
        ts, cont = get_list_table_elements(html)
        if not cont:
            break
        tracks.extend(ts)
    if not os.path.exists(TRACK_DIR + date):
        os.makedirs(TRACK_DIR + date)
    for t in tracks:
        print(f'download track for {t}')
        download_igc(t, date)
    print(f'downloaded {str(len(tracks))} tracks')
    return tracks
