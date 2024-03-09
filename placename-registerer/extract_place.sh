#!/bin/bash

osmium=~/src/osmium/work/osmium-tool/build/osmium
$osmium tags-filter geodata/japan-latest.osm.pbf \
    -o geodata/japan-all.osm.pbf --overwrite \
    n/place=city,borough,town,village \
    n/natural \
    water=lake,pond,reservoir,dam \
    leisure=golf_course,stadium,track \
    highway=services,motorway_junction \
    building=shrine,temple,train_station \
    amenity=training \
    landuse=industrial \
    religion=buddhist,shinto \
    tourism=theme_park,zoo \
    aeroway=aerodrome,control_center,heliport,runway
$osmium export geodata/japan-all.osm.pbf -o geodata/japan-all.json --overwrite
