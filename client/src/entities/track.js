import { Path } from './path.js';
import { Metadata } from './metadata.js';

export class Track {
    path = new Path();
    metadata = new Metadata();

    getId() {
        return this.metadata.getId();
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
