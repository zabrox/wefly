import dayjs from 'dayjs';

export class SearchCondition {
    from = dayjs().startOf('day');
    to = dayjs().endOf('day');
    pilotname = '';
    maxAltitude = undefined;
    distance = undefined;
    duration = undefined;
    activity = new Set();

    constructor(arg) {
        if (arg instanceof SearchCondition) {
            this.from = arg.from;
            this.to = arg.to;
            this.pilotname = arg.pilotname;
            this.maxAltitude = arg.maxAltitude;
            this.distance = arg.distance;
            this.duration = arg.duration;
            this.activity = new Set(arg.activity);
        }
    }
}