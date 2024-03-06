#!/bin/bash

osmium=~/src/osmium/work/osmium-tool/build/osmium

function filterTags() {
    title=$1
    tags=$2
    $osmium tags-filter geodata/japan-latest.osm.pbf \
        -o geodata/japan-${title}.osm.pbf --overwrite \
        $tags
    $osmium export geodata/japan-${title}.osm.pbf -o geodata/japan-${title}.json --overwrite
}

filterTags aeroway 'n/aeroway=aerodrome,control_center,heliport,runway'
filterTags education 'n/amenity=college,driving_school,kindergarten,library,research_institute,training,school,traffic_park,university'
filterTags religious 'n/building=cathedral,chapel,church,kingdom_hall,monastery,mosque,shrine,synagogue,temple'
filterTags natural 'n/natural'
filterTags place 'n/place=city,borough,town,village'
