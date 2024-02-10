import { Path } from './path.mjs';

export class Track {
    id = "";
    pilotname = "";
    path = new Path();
    distance = "";
    lastTime = "";
    activity = "";
    area = undefined;

    getIconUrl() {
        return `https://storage.cloud.google.com/wefly-lake/pilot_icons/${this.pilotname}.png`;
    }
}
