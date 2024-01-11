import React, { useEffect, useState } from 'react';
import { AppBar, Typography, Table, TableContainer, Box, SpeedDial } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { TrackListHeader } from './tracklistheader';
import { TrackListBody } from './tracklistbody';
import { ProgressBar } from './progressbar';
import './controlpanel.css';
import { Filter } from './trackfilter';
import { ActionDial } from './actiondial';

function listTracksBy(key, tracks) {
    const namesSet = new Set();

    tracks.forEach(track => {
        if (track[key] && !namesSet.has(track[key])) {
            namesSet.add(track[key]);
        }
    });

    return Array.from(namesSet).sort();
}

export const ControlPanel = ({ date, onDateChange, tracks, onTrackClicked, controlPanelSize, loadingTracks }) => {
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('starttime');
    const [filter, setFilter] = useState(new Filter());

    useEffect(() => {
        const newFilter = filter;
        const areas = listTracksBy('area', tracks);
        const pilots = listTracksBy('pilotname', tracks);
        const activities = listTracksBy('activity', tracks);
        newFilter.setContents(pilots, activities, areas);
        setFilter(newFilter);
    }, [tracks]);


    return (
        <div id='control-panel' style={{ width: controlPanelSize, height: '100%' }}>
            <AppBar id='app-bar' position="static">
                <Typography id='title' variant="h5" >
                    WeFly
                </Typography>
            </AppBar>
            <div id='date-picker-container'
                style={controlPanelSize === 0 ? { display: 'none' } : {}}><center>
                    <DesktopDatePicker
                        defaultValue={date}
                        format="YYYY-MM-DD (ddd)"
                        onChange={(newDate) => {
                            const newFilter = filter;
                            newFilter.clear();
                            setFilter(newFilter);
                            onDateChange(newDate)
                        }} />
                </center>
            </div>
            <Typography id='tracknumber-label' style={controlPanelSize === 0 ? { display: 'none' } : {}}>
                {filter.filterTracks(tracks).length} tracks
            </Typography>
            <Box id='tracklist-container'>
                <TableContainer id='tracklist'>
                    <Table size="medium">
                        <TrackListHeader
                            tracks={tracks}
                            order={order}
                            setOrder={setOrder}
                            orderBy={orderBy}
                            setOrderBy={setOrderBy}
                            filter={filter}
                            setFilter={setFilter} />
                        <TrackListBody
                            tracks={tracks}
                            onTrackClicked={onTrackClicked}
                            orderBy={orderBy}
                            order={order}
                            filter={filter} />
                    </Table>
                </TableContainer >
                <ProgressBar show={loadingTracks} controlPanelSize={controlPanelSize} />
            </Box>
            <ActionDial tracks={tracks} controlPanelSize={controlPanelSize}></ActionDial>
        </div >
    );
};

export const scrollToTrack = (trackid) => {
    const row = document.getElementById(`trackrow-${trackid}`);
    if (row !== null) {
        row.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}