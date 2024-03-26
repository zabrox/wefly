class SearchCondition {
    fromDate;
    toDate;
    pilotname;
    maxAltitude;
    distance;
    duration;
    bounds;
    activities;

    constructor(fromDate, toDate, pilotname, maxAltitude, distance, duration, bounds, activities) {
        this.fromDate = fromDate;
        this.toDate = toDate;
        this.pilotname = pilotname;
        this.maxAltitude = maxAltitude;
        this.distance = distance;
        this.duration = duration;
        this.bounds = bounds;
        this.activities = activities;
    }
}
module.exports = { SearchCondition };