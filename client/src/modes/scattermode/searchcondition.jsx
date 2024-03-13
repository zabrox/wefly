import dayjs from 'dayjs';

export class SearchCondition {
    from = dayjs();
    to = dayjs();
    pilotName = '';
    maxAltitude = undefined;
    distance = undefined;
    duration = undefined;
    activity = new Set();

    constructor(arg) {
        if (arg instanceof SearchCondition) {
            this.from = arg.from;
            this.to = arg.to;
            this.pilotName = arg.pilotName;
            this.maxAltitude = arg.maxAltitude;
            this.distance = arg.distance;
            this.duration = arg.duration;
            this.activity = new Set(arg.activity);
        } else if (arg instanceof dayjs) {
            this.from = arg;
            this.to = arg;
        }
    }
}