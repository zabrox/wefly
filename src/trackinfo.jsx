import React from "react";
import "./trackinfo.css";

export class TrackInfo extends React.Component {
    render() {
        const track = this.props.track;
        const position = this.props.position;
        const trackpoint_index = this.props.trackpointindex;
        if (track === undefined) {
            return (<div></div>);
        }
        return (
            <div id="trackinfo" style={{
                position: "absolute",
                top: position.y,
                left: position.x,
                borderColor: track.color.toCssColorString()
            }}>
                <div className="trackinfo-header">
                    <input type="checkbox" checked={track.show} onChange={() => this.props.onChange(track.id)} />
                    <h3>{track.name}</h3>
                    <button id="close" type="button" onClick={this.props.onCloseClick}>X</button>
                </div>
                <div><b>Point Summary</b></div>
                <table>
                    <tbody>
                        <tr><td>Date</td><td>{track.times[trackpoint_index].format('YYYY-MM-DD HH:mm:ss')}</td></tr>
                        <tr><td>Altitude</td><td>{track.altitudes[trackpoint_index]} m</td></tr>
                    </tbody>
                </table>
                <div><b>Flight Summary</b></div>
                <table>
                    <tbody>
                        <tr><td>Start</td><td>{track.startTime().format('YYYY-MM-DD HH:mm:ss')}</td></tr>
                        <tr><td>Duration</td><td>{Math.floor(track.duration() / 60)} hour {track.duration() % 60} min</td></tr>
                        <tr><td>Max Altitude</td><td>{track.maxAltitude()} m</td></tr>
                    </tbody>
                </table>
            </div >
        );
    }
}
