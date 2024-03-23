class SearchCondition {
    fromDate;
    toDate;
    pilotname;
    maxAltitude;
    distance;
    duration;
    bounds;

    constructor(fromDate, toDate, pilotname, maxAltitude, distance, duration, bounds) {
        this.fromDate = fromDate;
        this.toDate = toDate;
        this.pilotname = pilotname;
        this.maxAltitude = maxAltitude;
        this.distance = distance;
        this.duration = duration;
        this.bounds = bounds;
    }
}
module.exports = { SearchCondition };