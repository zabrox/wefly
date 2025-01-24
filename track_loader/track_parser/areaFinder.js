const fs = require('fs');
const { Cartesian3 } = require('cesium');
const { Area } = require('./entity/area.js');

const AREA_FILE = 'track_parser/areas.jp.cup';
const AREA_RADIUS = 10000

class AreaFinder {
    async findArea(position) {
        const areas = await this.#loadAreasFromCupFile();

        let closestArea = null;
        let minDistance = Infinity;

        areas.forEach(area => {
            const d = this.#distance(position, area.position);
            if (d < minDistance) {
                closestArea = area;
                minDistance = d;
            }
        });

        if (minDistance <= AREA_RADIUS) {
            return closestArea;
        }
        return new Area();
    }

    async #loadAreasFromCupFile() {
        const content = await fs.promises.readFile(AREA_FILE, 'utf-8');
        const lines = content.split('\n');
        const areas = lines.filter(line => line.startsWith('"SP'))
            .map(line => {
                const parts = line.split(',');
                const name = parts[1];
                const latitude = this.#convertToDecimal(parts[3]);
                const longitude = this.#convertToDecimal(parts[4]);
                const altitude = parseInt(parts[5]);
                return new Area(name, longitude, latitude, altitude);
            });
        return areas;
    }

    #convertToDecimal(coordStr) {
        const coord = parseFloat(coordStr) / 100;
        const degrees = parseInt(coord);
        const minutes = coord - degrees;
        const decimal = degrees + minutes / 0.6;
        return coordStr.endsWith('S') || coordStr.endsWith('W') ? -decimal : decimal;
    }

    #distance(point1, point2) {
        const c1 = Cartesian3.fromDegrees(point1[0], point1[1], point1[2]);
        const c2 = Cartesian3.fromDegrees(point2[0], point2[1], point2[2]);
        return Cartesian3.distance(c1, c2);
    }

}


module.exports = { AreaFinder };