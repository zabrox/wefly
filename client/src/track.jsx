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
        const duration = this.times[this.times.length - 1].diff(this.times[0], 'minutes');
        return `${Math.floor(duration / 60)} hour ${duration % 60} min`;
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
// export class Tracks extends React.Component {
//     render() {
//         return (
//             <Entity>
//                 {this.props.tracks.map((track, i) => {
//                     return <Track key={i} track={track} onMouseOver={this.props.onMouseOver} />
//                 })}
//             </Entity>
//         );
//     }
// }

// class Track extends React.Component {

//     render() {
//         let track = this.props.track;
//         return (
//             <div>
//                 <Entity>
//                     <PolylineGraphics
//                         show={track.show}
//                         positions={track.cartesians}
//                         width={2}
//                         material={track.color}
//                     />
//                 </Entity>
//                 {track.cartesians.map((cartesian, index) => {
//                     let pointsize = 7;
//                     if (track.show) {
//                         pointsize = 3;
//                     }
//                     if (!track.show && index % 40 !== 0) {
//                         return;
//                     }
//                     return (
//                         <Entity key={"trackpointentity-" + index} trackid={track.id} position={cartesian} trackpointindex={index}>
//                             <PointGraphics key={"trackpoint-" + index}
//                                 color={track.color.withAlpha(0.7)}
//                                 outlineColor={Cesium.Color.WHITE.withAlpha(0.7)}
//                                 pixelSize={pointsize}
//                                 scaleByDistance={new Cesium.NearFarScalar(100, 3, 10000, 0.5)} />
//                         </Entity>
//                     );
//                 })}
//             </div>
//         );
//     }
// }