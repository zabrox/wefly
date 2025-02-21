
class Landing {
    name = "";
    organization = "";
    longitude = 0;
    latitude = 0;
    altitude = 0;

    constructor(name, organization, longitude, latitude, altitude, direction) {
        this.name = name;
        this.organization = organization;
        this.longitude = longitude;
        this.latitude = latitude;
        this.altitude = altitude;
        this.direction = direction;
    }
}

module.exports = { Landing };