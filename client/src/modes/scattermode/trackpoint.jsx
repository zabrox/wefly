
export class TrackPoint {
    track = undefined;
    index = 0;

    isValid() {
        return this.track !== undefined;
    }

    constructor(arg1, arg2) {
        if (arg1 instanceof TrackPoint) {
            this.track = arg1.track;
            this.index = arg1.index;
            return;
        }
        this.track = arg1;
        this.index = arg2;
    }
}