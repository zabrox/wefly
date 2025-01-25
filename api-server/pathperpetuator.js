const { Storage } = require('@google-cloud/storage');
const zlib = require('zlib');

const lakeBucketName = 'wefly-mart';

class PathPerpetuator {
    constructor() {
        this.path = '';
    }

    perpetuate(track) {
        const fileName = `paths/${track.getId()}.json.gz`;
        const storage = new Storage();
        const bucket = storage.bucket(lakeBucketName);
        const file = bucket.file(fileName);

        const json = JSON.stringify(track.path.points.map((point, index) => {
            return [...point, track.path.times[index].toDate()];
        }));
        const gzip = zlib.gzipSync(json);
        file.save(gzip, {
            metadata: {
                contentType: 'application/gzip',
                contentEncoding: 'gzip'
            }
        });
    }

    async fetch(trackids) {
        const storage = new Storage();
        const bucket = storage.bucket(lakeBucketName);
        const promises = trackids.map(async (trackid) => {
            return new Promise(async (resolve) => {
                const paths = {};
                try {
                    const fileName = `paths/${trackid}.json.gz`;
                    const file = bucket.file(fileName);
                    const [content] = await file.download();
                    paths[trackid] = JSON.parse(content.toString());
                    resolve(paths);
                } catch (error) {
                    console.error(error)
                    resolve(paths);
                }
            });
        });

        const paths = await Promise.all(promises);
        const ret = {};
        paths.forEach((path) => {
            Object.keys(path).forEach((key) => {
                ret[key] = path[key];
            });
        });
        return ret;
    }
}

module.exports = { PathPerpetuator };