const { Storage } = require('@google-cloud/storage');
const e = require('express');

const lakeBucketName = 'wefly-lake';

class PathPerpetuator {
    constructor() {
        this.path = '';
    }

    perpetuate(track) {
        const fileName = `paths/${track.getId()}.json`;
        const storage = new Storage();
        const bucket = storage.bucket(lakeBucketName);
        const file = bucket.file(fileName);

        const json = JSON.stringify(track.path.points.map((point, index) => {
            return [...point, track.path.times[index].toDate()];
        }));
        file.save(json);
    }

    async fetch(trackids) {
        const storage = new Storage();
        const bucket = storage.bucket(lakeBucketName);
        const ret = {};
        try {
            const promises = trackids.map(async (trackid) => {
                const fileName = `paths/${trackid}.json`;
                const file = bucket.file(fileName);
                const [content] = await file.download();
                ret[trackid] = JSON.parse(content.toString());
            });

            await Promise.all(promises);
        } catch (error) {
            throw error;
        }
        return ret;
    }
}

module.exports = { PathPerpetuator };