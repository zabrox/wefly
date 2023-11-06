import React from 'react';
import './controlpanel.css';

export class ControlPanel extends React.Component {
    render() {
        return (
            <div className="control-panel">
                <table>
                    <tbody>
                        {
                            this.props.tracks.map((track, i) => {
                                const checked = track.show ? "checked" : "";
                                return (
                                    <tr key={"tr" + i}>
                                        <td key={"show-track-td" + i}>
                                            <input type="checkbox" className="show-track" onChange={() => { this.props.onChange(track.id) }} key={"show-track" + i} checked={checked} />
                                        </td>
                                        <td key={"track-color-td" + i}>
                                            <div className="track-color" key={"track-color" + i} style={{ backgroundColor: track.color.toCssHexString() }}>　</div>
                                        </td>
                                        <td className="trackname" key={track.name}>{track.name}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div >
        );
    }
}