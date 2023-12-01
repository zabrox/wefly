import React, { useState } from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, TableContainer, TableSortLabel } from '@mui/material';
import { Checkbox } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import './controlpanel.css';

const trackrows = {};

const handleSort = (header, props) => {
    // flip the order if the same header is clicked
    // otherwise, set the order to ascending
    let newOrder = 'asc';
    if (props.orderBy === header) {
        newOrder = props.order === 'asc' ? 'desc' : 'asc';
    }
    else if (header === 'Duration' || header === 'Max Alt.' || header === 'Distance') {
        newOrder = 'desc';
    }
    props.setOrder(newOrder);
    props.setOrderBy(header);
};

const compareByKey = (key, a, b) => {
    const valueA = typeof a[key] === 'function' ? a[key]() : a[key];
    const valueB = typeof b[key] === 'function' ? b[key]() : b[key];
    if (typeof valueA === 'string') {
        return valueA.localeCompare(valueB);
    }
    return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
}
const compareByPilotname = compareByKey.bind(null, 'pilotname');
const compareByArea = compareByKey.bind(null, 'area');
const compareByStart = compareByKey.bind(null, 'startTime');
const compareByDuration = compareByKey.bind(null, 'duration');
const compareByMaxAltitude = compareByKey.bind(null, 'maxAltitude');
const compareByDistance = compareByKey.bind(null, 'distance');

const headers = ['Pilot', 'Area', 'Start', 'Duration', 'Max Alt.', 'Distance'];
const comparators = [compareByPilotname, compareByArea, compareByStart, compareByDuration, compareByMaxAltitude, compareByDistance];

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

const MAX_AREA_NAME_LENGTH = 20;
const cutDownAreaName = (area) => {
    if (area === undefined) {
        return '';
    }
    if (area.length > MAX_AREA_NAME_LENGTH) {
        return area.slice(0, MAX_AREA_NAME_LENGTH) + '...';
    }
    return area;
}

export const ControlPanel = (props) => {
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('Start');

    const sortedrows = React.useMemo(() => {
        const comparator = comparators[headers.indexOf(orderBy)];
        const sortedTracks = props.tracks.slice().sort(comparator);
        return order === 'asc' ? sortedTracks : sortedTracks.reverse();
    });
    let notracks = <div></div>;
    if (props.tracks.length === 0) {
        notracks = <div style={{ padding: "10px" }}><center>No tracks.</center></div>;
    }

    return (
        <div className="control-panel">
            <div id='data-picker-container'><center>
                <DatePicker defaultValue={props['date']} format="YYYY-MM-DD (ddd)" onChange={(newDate) => props.onDateChange(newDate)} />
            </center></div>
            <TableContainer>
                <Table stickyHeader size="small">
                    <Headers order={order} setOrder={setOrder} orderBy={orderBy} setOrderBy={setOrderBy}></Headers>
                    <TableBody>{
                        sortedrows.map((track, i) => {
                            return (
                                <TableRow
                                    key={"tr" + i}
                                    ref={(elem) => { trackrows[track.id] = elem }}
                                    onClick={() => { props.onTrackClicked(track.id) }}>
                                    <TableCell padding='none'>
                                        <Checkbox
                                            color="primary"
                                            checked={track.isShowingTrackLine()}
                                            onChange={() => props.onTrackChecked(track.id)} />
                                    </TableCell>
                                    <TableCell padding='none' key={"track-color-td" + i}>
                                        <div className="track-color" key={"track-color" + i} style={{ backgroundColor: track.color.toCssHexString() }}>　</div>
                                    </TableCell>
                                    <TableCell className="pilotname" key={track.pilotname}>{track.pilotname}</TableCell>
                                    <TableCell className="area" key={track.area}>{cutDownAreaName(track.area)}</TableCell>
                                    <TableCell className="starttime" key={track.pilotname + "starttime"}>{track.startTime()}</TableCell>
                                    <TableCell className="duration" key={track.pilotname + "duration"}>{track.durationStr()}</TableCell>
                                    <TableCell className="maxalt" key={track.pilotname + "maxalt"}>{track.maxAltitude()}m</TableCell>
                                    <TableCell className="distance" key={track.pilotname + "distance"}>{track.distance}km</TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer >
            {notracks}
        </div >
    );
};

export const scrollToTrack = (trackid) => {
    // clear background color of all trackrows
    for (let [key, value] of Object.entries(trackrows)) {
        if (value === null || !('style' in value)) {
            continue;
        }
        value.style.backgroundColor = '';
    }
    const trackrow = trackrows[trackid];
    if (trackrow === undefined) {
        return;
    }
    trackrow.scrollIntoView({ behavior: 'smooth' });
    trackrow.style.backgroundColor = 'silver';
}