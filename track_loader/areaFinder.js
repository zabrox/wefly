const fs = require('fs');
const path = require('path');
const { Cartesian3, Cartographic, Math } = require('cesium');

const AREA_FILE = 'areas.jp.cup';
const AREA_RADIUS = 10000

async function loadAreasFromCupFile() {
    const content = await fs.promises.readFile(AREA_FILE, 'utf-8');
    const lines = content.split('\n');
    const { Area } = await import('../common/area.mjs');
    const areas = lines.filter(line => line.startsWith('"SP'))
        .map(line => {
            const parts = line.split(',');
            const name = parts[1];
            const latitude = convertToDecimal(parts[3]);
            const longitude = convertToDecimal(parts[4]);
            const altitude = parseInt(parts[5]);
            return new Area(name, longitude, latitude, altitude);
        });
    return areas;
}

function convertToDecimal(coordStr) {
    const coord = parseFloat(coordStr) / 100;
    const degrees = parseInt(coord);
    const minutes = coord - degrees;
    const decimal = degrees + minutes / 0.6;
    return coordStr.endsWith('S') || coordStr.endsWith('W') ? -decimal : decimal;
}

function distance(cartesian1, cartesian2) {
    return Cartesian3.distance(cartesian1, cartesian2);
}

async function findArea(tracks) {
    const areas = await loadAreasFromCupFile();

    tracks.forEach(track => {
        let closestArea = null;
        let minDistance = Infinity;

        areas.forEach(area => {
            const d = distance(track.path.points[0], area.position);
            if (d < minDistance) {
                closestArea = area;
                minDistance = d;
            }
        });
        const areaCart = Cartographic.fromCartesian(closestArea.position);
        const trackCart = Cartographic.fromCartesian(track.path.points[0]);

        if (minDistance <= AREA_RADIUS) {
            track.area = closestArea;
        }
    });
}

module.exports = { findArea };