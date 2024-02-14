const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const { Path } = require('./path.js');
const { Metadata } = require('./metadata.js');

dayjs.extend(utc);

class Track {
    path = new Path();
    metadata = new Metadata();

    getId() {
        return (this.metadata.pilotname + '_' + this.metadata.lastTime.utc().format('YYYYMMDDHHmmss')).replace(' ', '');
    }

    serialize() {
        return {
            metadata: this.metadata.serialize(),
            path: this.path.serialize()
        };
    }

    static deserialize(json) {
        const track = new Track();
        track.metadata = Metadata.deserialize(json.metadata);
        track.path = Path.deserialize(json.path);
        return track;
    }
}

module.exports = { Track };