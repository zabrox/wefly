import React from "react";
import * as Cesium from "cesium";
import { Entity, PointGraphics, PolylineGraphics, } from "resium";

const colorpallete = [
    Cesium.Color.RED,
    Cesium.Color.BLUE,
    Cesium.Color.YELLOW,
    Cesium.Color.ORANGE,
    Cesium.Color.PURPLE,
    Cesium.Color.CYAN,
    Cesium.Color.CHARTREUSE,
    Cesium.Color.CRIMSON,
    Cesium.Color.CORAL,
    Cesium.Color.GOLD,
    Cesium.Color.MAGENTA];

export class Track {
    pilotname = "";
    filename = "";
    cartesians = new Array();
    altitudes = new Array();
    times = new Array();
    show = false
    color;
    id;
    #maxAltitude = undefined;

    constructor(filename) {
        this.filename = filename;
        this.color = colorpallete[Math.floor(Math.random() * colorpallete.length)];
        this.id = crypto.randomUUID();
    }

    duration() {
        const duration = this.times[this.times.length - 1].diff(this.times[0], 'minutes');
        return duration;
    }

    durationStr() {
        const duration = this.times[this.times.length - 1].diff(this.times[0], 'minutes');
        return `${Math.floor(duration / 60)} h ${duration % 60} m`;
    }

    startTime() {
        return this.times[0].format('YYYY-MM-DD HH:mm:ss');
    }

    pointtime(index) {
        return this.times[index].format('YYYY-MM-DD HH:mm:ss');
    }

    maxAltitude() {
        if (this.#maxAltitude === undefined) {
            this.#maxAltitude = Math.max(...this.altitudes);
        }
        return this.#maxAltitude;
    }
}