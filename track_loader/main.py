#!/bin/python3
import requests
from bs4 import BeautifulSoup
import datetime
import sys
import os
import re

from upload_pilot_icon import upload_pilot_icon
from export_tracks import export_tracks
from convert_tracks import convert_tracks
from aggregate_tracks import aggregate_tracks

if __name__ == "__main__":
    date = datetime.datetime.now().strftime("%Y-%m-%d")
    if len(sys.argv) == 2:
        date = sys.argv[1]
    tracks = export_tracks(date)
    if len(tracks) == 0:
        print("no tracks found")
        exit(0)

    upload_pilot_icon(tracks)
    convert_tracks(date, tracks)
    aggregate_tracks(date)

    print("done")
    exit(0)