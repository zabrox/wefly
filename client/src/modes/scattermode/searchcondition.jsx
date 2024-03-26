import dayjs from 'dayjs';

const defaultActivities = ['Paraglider', 'Hangglider', 'Glider', 'Other'];

export class SearchCondition {
    from = dayjs().startOf('day');
    to = dayjs().endOf('day');
    pilotname = '';
    maxAltitude = undefined;
    distance = undefined;
    duration = undefined;
    bounds = undefined;
    activities = defaultActivities;

    constructor(arg) {
        if (arg instanceof SearchCondition) {
            this.from = arg.from;
            this.to = arg.to;
            this.pilotname = arg.pilotname;
            this.maxAltitude = arg.maxAltitude;
            this.distance = arg.distance;
            this.duration = arg.duration;
            this.bounds = arg.bounds;
            this.activities = arg.activities;
        }
    }

    isAdvancedSearchEnabled() {
        return this.from.format('YYYY-MM-DD') !== this.to.format('YYYY-MM-DD') ||
            this.pilotname !== '' ||
            this.maxAltitude !== undefined ||
            this.distance !== undefined ||
            this.duration !== undefined ||
            this.activities != defaultActivities ||
            this.bounds !== undefined;
    }
}