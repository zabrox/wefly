import React from "react";
import * as Cesium from "cesium";
import { Entity, PointGraphics, PolylineGraphics, } from "resium";

export class Tracks extends React.Component {
    render() {
        return (
            <Entity>
                {this.props.tracks.map((track, i) => {
                    return <Track key={i} track={track} onMouseOver={this.props.onMouseOver} />
                })}
            </Entity>
        );
    }
}

class Track extends React.Component {

    render() {
        let track = this.props.track;
        return (
            <div>
                <Entity>
                    <PolylineGraphics
                        show={track.show}
                        positions={track.cartesians}
                        width={2}
                        material={track.color}
                    />
                </Entity>
                {track.cartesians.map((cartesian, index) => {
                    let pointsize = 7;
                    if (track.show) {
                        pointsize = 3;
                    }
                    if (!track.show && index % 40 !== 0) {
                        return;
                    }
                    return (
                        <Entity key={"trackpointentity-" + index} trackid={track.id} position={cartesian} trackpointindex={index}>
                            <PointGraphics key={"trackpoint-" + index}
                                color={track.color.withAlpha(0.7)}
                                outlineColor={Cesium.Color.WHITE.withAlpha(0.7)}
                                pixelSize={pointsize}
                                scaleByDistance={new Cesium.NearFarScalar(100, 3, 10000, 0.5)} />
                        </Entity>
                    );
                })}
            </div>
        );
    }
}