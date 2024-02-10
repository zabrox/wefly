import { Cartesian3 } from 'cesium';

export class Area {
    areaName = "";
    position = new Cartesian3();

    constructor(name, longitude, latitude, altitude) {
        this.areaName = name;
        this.position = Cartesian3.fromDegrees(longitude, latitude, altitude);
    }
}