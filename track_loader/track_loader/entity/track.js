const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');

dayjs.extend(utc);

class Track {
    #pilotname
    #startTime
    #endTime
    #liveTrackId
    #isLive

    constructor(pilotname, liveTrackId, isLive) {
        this.#pilotname = pilotname;
        this.#liveTrackId = liveTrackId;
        this.#isLive = isLive;
    }

    get pilotname() {
        return this.#pilotname;
    }
    set startTime(startTime) {
        this.#startTime = startTime;
    }
    get startTime() {
        return this.#startTime;
    }
    set endTime(endTime) {
        this.#endTime = endTime;
    }
    get endTime() {
        return this.#endTime;
    }
    getTrackId() {
        return this.#pilotname + '_' + this.#startTime.utc().format('YYYYMMDDHHmmss');
    }
    get liveTrackId() {
        return this.#liveTrackId;
    }
    get isLive() {
        return this.#isLive;
    }
}

module.exports = { Track };