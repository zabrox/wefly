import React, { useState } from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, TableContainer, TableSortLabel } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import { IconButton, Button, Dialog, DialogTitle, List, ListItem, Checkbox, ListItemText } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import './controlpanel.css';

const trackrows = {};

const handleSort = (header, order, setOrder, orderBy, setOrderBy) => {
    // flip the order if the same header is clicked
    // otherwise, set the order to ascending
    let newOrder = 'asc';
    if (orderBy === header) {
        newOrder = order === 'asc' ? 'desc' : 'asc';
    }
    else if (header === 'Duration' || header === 'Max Alt.' || header === 'Distance') {
        newOrder = 'desc';
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

const AreaSelector = ({ areas, areasFilter, onAreasFilterChange }) => {
    const [showAreaSelector, setShowAreaSelector] = useState(false);

    const handleToggle = (value) => () => {
        const currentIndex = areasFilter.indexOf(value);
        const newAreasFilter = [...areasFilter];

        if (currentIndex === -1) {
            newAreasFilter.push(value);
        } else {
            newAreasFilter.splice(currentIndex, 1);
        }

        onAreasFilterChange(newAreasFilter);
    };

    return (
        <div onClick={(event) => event.stopPropagation()}>
            <IconButton id='areafilter' onClick={(event) => {
                setShowAreaSelector(!showAreaSelector)
                event.stopPropagation();
            }}>
                <FilterListIcon />
            </IconButton>
            <Dialog open={showAreaSelector} onClose={() => setShowAreaSelector(false)}>
                <DialogTitle>Select area...</DialogTitle>
                <List id='arealist'>
                    {areas.map((area) => (
                        <ListItem key={area} onClick={handleToggle(area)}>
                            <Checkbox checked={areasFilter.includes(area)} />
                            <ListItemText primary={area} />
                        </ListItem>
                    ))}
                </List>
                <Button onClick={() => setShowAreaSelector(false)}>Close</Button>
            </Dialog>
        </div>
    );
};

const Headers = ({ areas, order, setOrder, orderBy, setOrderBy, areasFilter, onAreasFilterChange }) => {
    return (
        <TableHead>
            <TableRow>
                {headers.map((header) => (
                    <TableCell
                        key={header}
                        sortDirection={orderBy === header ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === header}
                            direction={orderBy === header ? order : 'asc'}
                            onClick={() => handleSort(header, order, setOrder, orderBy, setOrderBy)}
                        >
                            {header}
                            {header === 'Area' && (
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

const mapTracksToTableRows = (tracks, onTrackClicked, trackrows) => {
    return tracks.map((track, i) => (
        <TableRow
            key={"tr" + i}
            ref={(elem) => { trackrows[track.id] = elem }}
            onClick={() => { onTrackClicked(track.id) }}
            style={{
                backgroundColor: track.isShowingTrackLine() ? track.color.toCssHexString() : '',
                height: '30px'
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
    const [orderBy, setOrderBy] = useState('Start');
    const [areasFilter, setAreasFilter] = useState('');

    const sortedrows = React.useMemo(() => {
        const comparator = comparators[headers.indexOf(orderBy)];
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
                            trackrows
                        )
                    }</TableBody>
                </Table>
            </TableContainer >
            {notracks}
        </div>
    );
};

export const scrollToTrack = (trackid) => {
    const trackrow = trackrows[trackid];
    if (trackrow === undefined) {
        return;
    }
    trackrow.scrollIntoView({ behavior: 'smooth' });
}