#!/bin/bash

osmium=~/src/osmium/work/osmium-tool/build/osmium
$osmium tags-filter geodata/japan-latest.osm.pbf n/aeroway=aerodrome -o geodata/japan-aeroway.osm.pbf --overwrite
$osmium export geodata/japan-aeroway.osm.pbf -o geodata/japan-aeroway.json --overwrite
$osmium tags-filter geodata/japan-latest.osm.pbf n/amenity=school,university -o geodata/japan-school.osm.pbf --overwrite
$osmium export geodata/japan-school.osm.pbf -o geodata/japan-school.json --overwrite
$osmium tags-filter geodata/japan-latest.osm.pbf n/natural -o geodata/japan-nature.osm.pbf --overwrite
$osmium export geodata/japan-nature.osm.pbf -o geodata/japan-nature.json --overwrite
$osmium tags-filter geodata/japan-latest.osm.pbf n/place -o geodata/japan-place.osm.pbf --overwrite
$osmium export geodata/japan-place.osm.pbf -o geodata/japan-place.json --overwrite
