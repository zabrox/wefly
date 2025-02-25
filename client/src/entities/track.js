import { Path } from './path.js';
import { Metadata } from './metadata.js';

export class Track {
    path = new Path();
    metadata = new Metadata();

    getId() {
        return this.metadata.getId();
    }
}
