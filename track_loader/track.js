
class Track {
    #pilotname
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
    get liveTrackId() {
        return this.#liveTrackId;
    }
    get isLive() {
        return this.#isLive;
    }
}

module.exports = { Track };