export class Area {
    areaName = "";
    position = undefined;

    constructor(name, longitude, latitude, altitude) {
        this.areaName = name;
        this.position = [longitude, latitude, altitude];
    }

    serialize() {
        return {
            areaName: this.areaName,
            position: this.position,
        };
    }

    static deserialize(json) {
        const area = new Area(json.areaName, json.position[0], json.position[1], json.position[2]);
        return area;
    }
}