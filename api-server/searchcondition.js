class SearchCondition {
    fromDate;
    toDate;
    pilotname;
    maxAltitude;
    distance;
    duration;

    constructor(fromDate, toDate, pilotname, maxAltitude, distance, duration) {
        this.fromDate = fromDate;
        this.toDate = toDate;
        this.pilotname = pilotname;
        this.maxAltitude = maxAltitude;
        this.distance = distance;
        this.duration = duration;
    }
}
module.exports = { SearchCondition };