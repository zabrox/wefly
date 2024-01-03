import React, { useState } from 'react';
import { AppBar, Typography, Table, TableContainer, Box } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { TrackListHeader } from './tracklistheader';
import { TrackListBody } from './tracklistbody';
import { ProgressBar } from './progressbar';
import './controlpanel.css';

export const ControlPanel = ({ date, onDateChange, tracks, onTrackClicked, controlPanelSize, loadingTracks}) => {
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('starttime');
    const [areasFilter, setAreasFilter] = useState('');

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
                            setAreasFilter('');
                            onDateChange(newDate)
                        }} />
                </center>
            </div>
            <Box id='tracklist-container'>
                <TableContainer id='tracklist'>
                    <Table size="medium">
                        <TrackListHeader
                            tracks={tracks}
                            order={order}
                            setOrder={setOrder}
                            orderBy={orderBy}
                            setOrderBy={setOrderBy}
                            areasFilter={areasFilter}
                            onAreasFilterChange={setAreasFilter} />
                        <TrackListBody
                            tracks={tracks}
                            onTrackClicked={onTrackClicked}
                            orderBy={orderBy}
                            order={order}
                            areasFilter={areasFilter}
                        />
                    </Table>
                </TableContainer >
                <ProgressBar show={loadingTracks} controlPanelSize={controlPanelSize} />
            </Box>
        </div >
    );
};

export const scrollToTrack = (trackid) => {
    const row = document.getElementById(`trackrow-${trackid}`);
    if (row !== null) {
        row.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}