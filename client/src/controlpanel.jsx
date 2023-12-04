import React, { useState } from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, TableContainer, TableSortLabel } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { AreaSelector } from './areaselector';
import './controlpanel.css';

const compareByKey = (key, a, b) => {
    const valueA = typeof a[key] === 'function' ? a[key]() : a[key];
    const valueB = typeof b[key] === 'function' ? b[key]() : b[key];
    if (typeof valueA === 'string') {
        return valueA.localeCompare(valueB);
    }
    return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
}

const headers = [
    {
        id: 'pilotname',
        label: 'Pilot',
        numeric: false,
        defaultOrder: 'asc',
        comparator: compareByKey.bind(null, 'pilotname'),
    },
    {
        id: 'area',
        label: 'Area',
        numeric: false,
        defaultOrder: 'asc',
        comparator: compareByKey.bind(null, 'area'),
    },
    {
        id: 'starttime',
        label: 'Start',
        numeric: false,
        defaultOrder: 'asc',
        comparator: compareByKey.bind(null, 'startTime'),
    },
    {
        id: 'duration',
        label: 'Duration',
        numeric: true,
        defaultOrder: 'desc',
        comparator: compareByKey.bind(null, 'duration'),
    },
    {
        id: 'maxalt',
        label: 'Max Alt.',
        numeric: true,
        defaultOrder: 'desc',
        comparator: compareByKey.bind(null, 'maxAltitude'),
    },
    {
        id: 'distance',
        label: 'Distance',
        numeric: true,
        defaultOrder: 'desc',
        comparator: compareByKey.bind(null, 'distance'),
    },
];
const handleSort = (header, order, setOrder, orderBy, setOrderBy) => {
    // flip the order if the same header is clicked
    // otherwise, set the order to ascending
    const targetHeader = headers.find(h => h.id === header);
    let newOrder = targetHeader.defaultOrder;
    if (header === orderBy) {
        newOrder = order === 'asc' ? 'desc' : 'asc';
    }
    setOrder(newOrder);
    setOrderBy(header);
};

function listAreas(tracks) {
    const areaNamesSet = new Set();

    tracks.forEach(track => {
        if (track.area && !areaNamesSet.has(track.area)) {
            areaNamesSet.add(track.area);
        }
    });

    return Array.from(areaNamesSet).sort();
}

const MAX_AREA_NAME_LENGTH = 17;
const cutDownAreaName = (area) => {
    if (area === undefined) {
        return '';
    }
    if (area.length > MAX_AREA_NAME_LENGTH) {
        return area.slice(0, MAX_AREA_NAME_LENGTH) + '...';
    }
    return area;
}

const Headers = ({ areas, order, setOrder, orderBy, setOrderBy, areasFilter, onAreasFilterChange }) => {
    return (
        <TableHead>
            <TableRow id="track-list-header">
                {headers.map((header) => (
                    <TableCell
                        key={header.id}
                        sortDirection={orderBy === header.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === header.id}
                            direction={orderBy === header ? order : 'asc'}
                            onClick={() => handleSort(header.id, order, setOrder, orderBy, setOrderBy)}
                        >
                            {header.label}
                            {header.id === 'area' && (
                                <AreaSelector
                                    areas={areas}
                                    areasFilter={areasFilter}
                                    onAreasFilterChange={onAreasFilterChange} />)}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
};

const filterTracksByArea = (tracks, areasFilter) => {
    if (areasFilter.length === 0) {
        return tracks;
    }
    return tracks.filter(track => 'area' in track && areasFilter.includes(track.area));
};

const mapTracksToTableRows = (tracks, onTrackClicked) => {
    return tracks.map((track, i) => (
        <TableRow
            key={"tr" + i}
            id={track.id}
            onClick={() => { onTrackClicked(track.id) }}
            style={{
                backgroundColor: track.isShowingTrackLine() ? track.color.toCssHexString() : '',
                scrollMarginTop: document.getElementById('track-list-header').clientHeight,
            }}>
            <TableCell className="pilotname" key={track.pilotname}>{track.pilotname}</TableCell>
            <TableCell className="area" key={track.area}>{cutDownAreaName(track.area)}</TableCell>
            <TableCell className="starttime" key={track.pilotname + "starttime"}>{track.startTime().split(' ')[1]}</TableCell>
            <TableCell className="duration" key={track.pilotname + "duration"}>{track.durationStr()}</TableCell>
            <TableCell className="maxalt" key={track.pilotname + "maxalt"}>{track.maxAltitude()}m</TableCell>
            <TableCell className="distance" key={track.pilotname + "distance"}>{track.distance}km</TableCell>
        </TableRow>
    ));
};

export const ControlPanel = (props) => {
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('starttime');
    const [areasFilter, setAreasFilter] = useState('');

    const sortedrows = React.useMemo(() => {
        const comparator = headers.find(header => header.id === orderBy).comparator;
        const sortedTracks = props.tracks.slice().sort(comparator);
        return order === 'asc' ? sortedTracks : sortedTracks.reverse();
    });
    let notracks = <div></div>;
    if (props.tracks.length === 0) {
        notracks = <div style={{ padding: "10px" }}><center>No tracks.</center></div>;
    }
    const areas = listAreas(props.tracks);

    return (
        <div id='control-panel'>
            <div id='data-picker-container'><center>
                <DatePicker defaultValue={props['date']} format="YYYY-MM-DD (ddd)" onChange={(newDate) => props.onDateChange(newDate)} />
            </center></div>
            <TableContainer id='tracklist'>
                <Table stickyHeader size="medium">
                    <Headers
                        areas={areas}
                        order={order}
                        setOrder={setOrder}
                        orderBy={orderBy}
                        setOrderBy={setOrderBy}
                        areasFilter={areasFilter}
                        onAreasFilterChange={setAreasFilter} />
                    <TableBody>{
                        mapTracksToTableRows(
                            filterTracksByArea(sortedrows, areasFilter),
                            props.onTrackClicked,
                        )
                    }</TableBody>
                </Table>
            </TableContainer >
            {notracks}
        </div>
    );
};

export const scrollToTrack = (trackid) => {
    const row = document.getElementById(trackid);
    if (row !== null) {
        row.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}