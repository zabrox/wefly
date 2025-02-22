
export class Takeoff {
    name = "";
    area = "";
    organization = "";
    longitude = 0;
    latitude = 0;
    altitude = 0;
    direction = "";

    constructor(name, area, organization, longitude, latitude, altitude, direction) {
        this.name = name;
        this.area = area;
        this.organization = organization;
        this.longitude = longitude;
        this.latitude = latitude;
        this.altitude = altitude;
        this.direction = direction;
    }
}
