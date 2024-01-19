#!/bin/bash

echo '{ "tracks": ' > db.json
cat '2023-10-07_japan.json' >> db.json
echo ', "tracks_2024_01_10": ' >> db.json
cat '2024-01-10_japan.json' >> db.json
echo ', "tracks_2024_01_11": ' >> db.json
cat '2024-01-11_japan.json' >> db.json
echo '}' >> db.json
