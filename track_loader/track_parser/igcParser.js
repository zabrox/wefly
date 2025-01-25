const { Storage } = require('@google-cloud/storage');
const dayjs = require('dayjs');
const { Path } = require('./entity/path');

const bucketName = 'wefly-lake';

class IGCParser {
    #gcsPath
    #date

    constructor(date, trackId) {
        this.#gcsPath = `${date}/igcs/${trackId}.igc`;
        this.#date = date;
    }

    async parseIGC() {
        const igcText = await this.#fetchIGC()
        const path = this.#parseIGCText(igcText);
        return path;
    }

    async #fetchIGC() {
        const storage = new Storage();
        const igcFileName = `${this.#gcsPath}`;
        const bucket = storage.bucket(bucketName);
        const file = bucket.file(igcFileName);
        try {
            const [content] = await file.download();
            const igcText = content.toString('utf-8');
            return igcText;
        } catch (error) {
            console.error(`Error downloading or processing IGC file: ${error}`);
            throw error;
        }
    }

    #parseIGCText(igcText) {
        const bRecordRegex = /^B(\d{6})(\d{2})(\d{5})([NS])(\d{3})(\d{5})([EW])A(\d{5})(\d{5})/;

        const lines = igcText.split('\n');
        const bRecords = [];
        lines.forEach(line => {
            const bRecordMatch = line.match(bRecordRegex);
            if (bRecordMatch) {
                bRecords.push(this.#parseBRecordLine(bRecordMatch));
            }
        });
        const path = this.#createPath(bRecords);
        return path;
    }

    #parseBRecordLine(match) {
        const timeStr = match[1];
        const latitude = this.#convertToDecimal(match[2], match[3], match[4]);
        const longitude = this.#convertToDecimal(match[5], match[6], match[7]);
        const altitude = parseInt(match[9], 10); // GPS altitude
        let time = dayjs(`${this.#date}T${timeStr.slice(0, 2)}:${timeStr.slice(2, 4)}:${timeStr.slice(4, 6)}Z`);
        return [longitude, latitude, altitude, time];
    }

    #createPath(bRecords) {
        const lastTime = bRecords[bRecords.length - 1][3];
        const path = new Path();
        bRecords.forEach(record => {
            if (record[3].isAfter(lastTime)) {
                record[3] = record[3].add(-1, 'day');
            }
            path.addPoint(...record);
        });
        return path;
    }

    #convertToDecimal(degrees, minutes, direction) {
        const decimal = parseInt(degrees, 10) + parseInt(minutes, 10) / 60000;
        return (direction === 'S' || direction === 'W') ? -decimal : decimal;
    }
}

module.exports = { IGCParser };