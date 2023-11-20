#!/bin/python3
import requests
from bs4 import BeautifulSoup
import datetime
import re

TRACK_DIR = "./tracks/"

class Track:
    username = ""
    location = ""
    altitude = 0
    duration = 0
    distance = 0
    trackid = 0
    lasttime = ""

    def __str__(self):
        return "username: " + self.username + " location: " + self.location


def download_html(url):
    response = requests.get(url)
    return response.text

def get_list_table_elements(html):
    soup = BeautifulSoup(html, 'html.parser')
    tracktables = soup.find_all('table', class_='tracktable')
    tracks = []
    for trackrow in tracktables:
        track = Track()
        track.username = re.search(r'[a-zA-Z0-9\-]+', trackrow.find('span', class_='liveusername').find('a').text).group()
        last_locations = trackrow.find_all('div', class_='list_last_location')
        last_time = trackrow.find_all('div', class_='list_last_time')
        track.location = last_locations[0].text.replace("was at  ", "")
        track.altitude = re.search(r'\d+ m', last_locations[1].text).group()
        track.duration = re.search(r'\d{2}:\d{2}:\d{2}', last_locations[1].text).group()
        track.distance = re.search(r'\[Max\] [\d\.]+ km', last_locations[2].text).group()
        lasttime_str = re.search(r'\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2} UTC', last_time[0].text).group()
        track.lasttime = datetime.datetime.strptime(lasttime_str, '%d-%m-%Y %H:%M:%S %Z')
        trackid  = trackrow.find_all(attrs={'data-action': 'track_info'})
        track.trackid = trackid[0].get('data-trackid')
        tracks.append(track)
    return tracks

def filter_tracks_by_location(tracks, locations):
    ret = []
    for track in tracks:
        for location in locations:
            if re.search(location, track.location):
                ret.append(track)
                break
    return ret

def download_igc(track):
    url = "https://www.livetrack24.com/leo_live.php?op=igc&trackID=" + track.trackid
    response = requests.get(url)
    with open(TRACK_DIR + track.username + "_" + track.lasttime.strftime("%Y%m%d%H%M%S") + ".igc", 'wb') as f:
        f.write(response.content)

if __name__ == "__main__":
    #date = datetime.datetime.today().strftime("%Y-%m-%d")
    date = '2023-11-04'
    areas = ['Asagiri -DK Skygym', 'West Fuji']
    tracks = []
    baseurl = "https://www.livetrack24.com/tracks/country/jp/from/" + date + "/to/" + date + "/page_num/"
    for i in range(100):
        url = baseurl + str(i+1)
        html = download_html(url)
        ts = get_list_table_elements(html)
        if len(ts) == 0:
            break
        tracks.extend(ts)
    tracks = filter_tracks_by_location(tracks, areas)
    for t in tracks:
        print(t)
        download_igc(t)
    print(str(len(tracks)))
