import React from 'react';
import './controlpanel.css';

export const ControlPanel = (props) => {
    return (
        <div className="control-panel">
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th></th>
                        <th>Name</th>
                        <th>Max Altitude</th>
                        <th>Duration</th>
                    </tr>
                </thead>
                <tbody>{
                    props.tracks.map((track, i) => {
                        const checked = track.show ? "checked" : "";
                        return (
                            <tr key={"tr" + i}>
                                <td key={"show-track-td" + i}>
                                    <input type="checkbox" className="show-track" onChange={() => { props.onChange(track.id) }} key={"show-track" + i} checked={checked} />
                                </td>
                                <td key={"track-color-td" + i}>
                                    <div className="track-color" key={"track-color" + i} style={{ backgroundColor: track.color.toCssHexString() }}>　</div>
                                </td>
                                <td className="trackname" key={track.name}>{track.name}</td>
                                <td className="maxalt" key={track.name + "maxalt"}>{track.maxAltitude()}m</td>
                                <td className="duration" key={track.name + "duration"}>{track.duration()}</td>
                            </tr>
                        )
                    })
                }
                </tbody>
            </table>
        </div>
    );
};