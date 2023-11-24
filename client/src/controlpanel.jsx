import React, { useState } from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, TableContainer, TableSortLabel } from '@mui/material';
import { Checkbox } from '@mui/material';
import './controlpanel.css';

const handleSort = (header, props) => {
    // flip the order if the same header is clicked
    // otherwise, set the order to ascending
    let newOrder = 'asc';
    if (props.orderBy === header) {
        newOrder = props.order === 'asc' ? 'desc' : 'asc';
    }
    if (header === 'Duration' || header === 'Max Alt.') {
        newOrder = 'desc';
    }
    props.setOrder(newOrder);
    props.setOrderBy(header);
};

const compareByPilotname = (a, b) => {
    // compare pilotname in lowercase
    const pilotnameA = a.pilotname.toLowerCase();
    const pilotnameB = b.pilotname.toLowerCase();
    return (pilotnameA < pilotnameB) ? -1 : (pilotnameA > pilotnameB) ? 1 : 0;
}
const compareByStart = (a, b) => {
    return (a.times[0].isBefore(b.times[0])) ? -1 : (a.times[0].isAfter(b.times[0])) ? 1 : 0;
}
const compareByDuration = (a, b) => {
    return (a.duration() < b.duration()) ? -1 : (a.duration() > b.duration()) ? 1 : 0;
}
const compareByMaxAltitude = (a, b) => {
    return (a.maxAltitude() < b.maxAltitude()) ? -1 : (a.maxAltitude() > b.maxAltitude()) ? 1 : 0;
}

const headers = ['Pilot', 'Start', 'Duration', 'Max Alt.'];
const comparators = [compareByPilotname, compareByStart, compareByDuration, compareByMaxAltitude];

const Headers = (props) => {
    return (
        <TableHead>
            <TableRow>
                <TableCell padding='none' />
                <TableCell padding='none' />
                {
                    headers.map((header, i) => {
                        return (
                            <TableCell key={"th" + i} sortDirection={props.orderBy === header ? props.order : false}>
                                <TableSortLabel
                                    active={props.orderBy === header}
                                    direction={props.orderBy === header ? props.order : 'asc'}
                                    onClick={() => handleSort(header, props)}
                                >
                                    {header}
                                </TableSortLabel>
                            </TableCell>
                        )
                    })}
            </TableRow>
        </TableHead>
    );
};

export const ControlPanel = (props) => {
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('Start');

    const sortedrows = React.useMemo(() => {
        const comparator = comparators[headers.indexOf(orderBy)];
        const sortedTracks = props.tracks.slice().sort(comparator);
        return order === 'asc' ? sortedTracks : sortedTracks.reverse();
    });

    return (
        <div className="control-panel">
            <TableContainer>
                <Table stickyHeader size="small">
                    <Headers order={order} setOrder={setOrder} orderBy={orderBy} setOrderBy={setOrderBy}></Headers>
                    <TableBody>{
                        sortedrows.map((track, i) => {
                            return (
                                <TableRow key={"tr" + i}>
                                    <TableCell padding='none'>
                                        <Checkbox color="primary" checked={track.show} onChange={() => props.onChange(track.id)} />
                                    </TableCell>
                                    <TableCell padding='none' key={"track-color-td" + i}>
                                        <div className="track-color" key={"track-color" + i} style={{ backgroundColor: track.color.toCssHexString() }}>　</div>
                                    </TableCell>
                                    <TableCell className="pilotname" key={track.pilotname}>{track.pilotname}</TableCell>
                                    <TableCell className="starttime" key={track.pilotname + "starttime"}>{track.startTime()}</TableCell>
                                    <TableCell className="duration" key={track.pilotname + "duration"}>{track.duration()}</TableCell>
                                    <TableCell className="maxalt" key={track.pilotname + "maxalt"}>{track.maxAltitude()}m</TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer >
        </div >
    );
};