import React, { useEffect, useState } from 'react';
import { AppBar, Typography, Table, TableContainer, Box, SpeedDial } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { TrackListHeader } from './tracklistheader';
import { TrackListBody } from './tracklistbody';
import { ProgressBar } from './progressbar';
import './controlpanel.css';
import { ScatterModeActionDial } from './scattermodeactiondial';
import { PlaybackModeActionDial } from './playbackmodeactiondial';
import { PLAYBACK_MODE, SCATTER_MODE } from './mode';

function listTracksBy(key, tracks) {
    const namesSet = new Set();

    tracks.forEach(track => {
        if (track[key] && !namesSet.has(track[key])) {
            namesSet.add(track[key]);
        }
    });

    return Array.from(namesSet).sort();
}

export const ControlPanel = (
    { date, onDateChange, tracks, onTrackClicked, controlPanelSize, loadingTracks, filter, setFilter, mode, setMode }) => {
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('starttime');

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
            {mode == SCATTER_MODE &&
                <ScatterModeActionDial tracks={tracks} filter={filter} controlPanelSize={controlPanelSize} setMode={setMode}></ScatterModeActionDial>
            }
            {mode == PLAYBACK_MODE &&
                <PlaybackModeActionDial controlPanelSize={controlPanelSize} setMode={setMode}></PlaybackModeActionDial>
            }
        </div >
    );
};

export const scrollToTrack = (trackid) => {
    const row = document.getElementById(`trackrow-${trackid}`);
    if (row !== null) {
        row.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}