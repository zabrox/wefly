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

    constructor(...args) {
        if (args.length === 1 && args[0] instanceof SearchCondition) {
            this.copyConstructor(args[0]);
            return;
        }
    }

    copyConstructor(arg) {
        this.from = arg.from;
        this.to = arg.to;
        this.pilotname = arg.pilotname;
        this.maxAltitude = arg.maxAltitude;
        this.distance = arg.distance;
        this.duration = arg.duration;
        this.bounds = arg.bounds;
        this.activities = arg.activities;
    }

    isAdvancedSearchEnabled() {
        return this.from.format('YYYY-MM-DD') !== this.to.format('YYYY-MM-DD') ||
            this.pilotname !== '' ||
            this.maxAltitude !== undefined ||
            this.distance !== undefined ||
            this.duration !== undefined ||
            !this.#isSameActivities(defaultActivities) ||
            this.bounds !== undefined;
    }

    #isSameActivities = (other) => {
        if (this.activities.length !== other.length) return false;
        for (let i = 0; i < this.activities.length; i++) {
            if (this.activities[i] !== other[i]) return false;
        }
        return true;
    }
}