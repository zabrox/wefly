import { Color, } from "cesium";

const colorpallete = [
    Color.RED,
    Color.BLUE,
    Color.YELLOW,
    Color.ORANGE,
    Color.PURPLE,
    Color.CYAN,
    Color.CHARTREUSE,
    Color.CRIMSON,
    Color.CORAL,
    Color.GOLD,
    Color.MAGENTA];

export class Track {
    name = "";
    cartesians = new Array();
    altitudes = new Array();
    times = new Array();
    show = false
    color;
    id;
    #maxAltitude = undefined;

    constructor(name) {
        this.name = name;
        this.color = colorpallete[Math.floor(Math.random() * colorpallete.length)];
        this.id = crypto.randomUUID();
    }

    duration() {
        return this.times[this.times.length - 1].diff(this.times[0], 'minutes');
    }

    startTime() {
        return this.times[0];
    }

    maxAltitude() {
        if (this.#maxAltitude === undefined) {
            this.#maxAltitude = Math.max(...this.altitudes);
        }
        return this.#maxAltitude;
    }
}
