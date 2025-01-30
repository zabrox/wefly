const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');

dayjs.extend(utc);

class LivetrackTrack {
    #pilotname
    #startTime
    #endTime
    #liveTrackUrl
    #liveTrackUserId
    #liveTrackId
    #isLive

    constructor(pilotname, liveTrackUserId, liveTrackId, isLive) {
        this.#pilotname = pilotname;
        this.#liveTrackUserId = liveTrackUserId;
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
    get liveTrackUserId() {
        return this.#liveTrackUserId;
    }
    get liveTrackId() {
        return this.#liveTrackId;
    }
    get isLive() {
        return this.#isLive;
    }
    set liveTrackUrl(url) {
        this.#liveTrackUrl = url;
    }
    get liveTrackUrl() {
        return this.#liveTrackUrl;
    }
}

module.exports = { LivetrackTrack };