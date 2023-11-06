import React from "react";
import { LineChart, XAxis, YAxis, CartesianGrid, Line, Tooltip, ResponsiveContainer } from "recharts";
//import './timeline.css';

export class Timeline extends React.Component {
    render() {
        if (this.props.tracks.length === 0) {
            return (<div></div>);
        }
        const data = new Array();
        let lines = new Array();
        this.props.tracks.forEach(track => {
            track.times.forEach((time, j) => {
                data.push({time: time.getTime(), [track.name]: track.altitudes[j]});
            });
            lines.push(<Line key={"line" + track.name} type="monotone" dataKey={track.name} dot={false} stroke={track.color.toCssHexString()} />);
        });
        return (
            <ResponsiveContainer width="100%" height="20%">
                <LineChart id="timeline" data={data}>
                    <XAxis dataKey="time" type="number" tickFormatter={(unixTime) => new Date(unixTime).toLocaleTimeString('ja-JP')} domain={['dataMin', 'dataMax']} />
                    <YAxis />
                    <CartesianGrid stroke="#ccc" />
                    {...lines}
                </LineChart>
            </ResponsiveContainer>
        );
    }
}