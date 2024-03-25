const { Storage } = require('@google-cloud/storage');
const dayjs = require('dayjs');

const bucketName = 'wefly-lake';

class IGCParser {
    async parseIGC(date, track) {
        const storage = new Storage();
        const igcFileName = `${date}/igcs/${track.getId()}.igc`;
        const bucket = storage.bucket(bucketName);
        const file = bucket.file(igcFileName);

        try {
            const [content] = await file.download();
            const igcText = content.toString('utf-8');
            this.processIGCContent(date, igcText, track);
            track.metadata.startTime = track.path.times[0];
            track.metadata.lastTime = track.path.times[track.path.times.length - 1];
            track.metadata.startPosition = track.path.points[0];
            track.metadata.lastPosition = track.path.points[track.path.points.length - 1];
            track.metadata.maxAltitude = track.path.maxAltitude();
            console.log(`Processed IGC file for ${track.getId()} done`);
        } catch (error) {
            console.error(`Error downloading or processing IGC file: ${error}`);
        }
    }

    processIGCContent(date, igcText, track) {
        const bRecordRegex = /^B(\d{6})(\d{2})(\d{5})([NS])(\d{3})(\d{5})([EW])A(\d{5})(\d{5})/;

        const lines = igcText.split('\n');
        lines.forEach(line => {
            const match = line.match(bRecordRegex);
            if (match) {
                const timeStr = match[1];
                const latitude = this.convertToDecimal(match[2], match[3], match[4]);
                const longitude = this.convertToDecimal(match[5], match[6], match[7]);
                const altitude = parseInt(match[9], 10); // GPS altitude

                let time = dayjs(`${date}T${timeStr.slice(0, 2)}:${timeStr.slice(2, 4)}:${timeStr.slice(4, 6)}Z`);
                if (time.isAfter(track.metadata.lastTime)) {
                    time = time.add(-1, 'day');
                }
                track.path.addPoint(longitude, latitude, altitude, time);
            }
        });
    }

    convertToDecimal(degrees, minutes, direction) {
        const decimal = parseInt(degrees, 10) + parseInt(minutes, 10) / 60000;
        return (direction === 'S' || direction === 'W') ? -decimal : decimal;
    }
}

async function parseIgc(date, track) {
    const parser = new IGCParser();
    await parser.parseIGC(date, track);
}

module.exports = { parseIgc };