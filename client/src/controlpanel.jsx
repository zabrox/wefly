import React, { useState } from 'react';
import { Stack, AppBar, Typography, Table, TableContainer, } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { TrackListHeader } from './tracklistheader';
import { TrackListBody } from './tracklistbody';
import './controlpanel.css';

export const ControlPanel = ({ date, onDateChange, tracks, onTrackClicked, controlPanelSize, media }) => {
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('starttime');
    const [areasFilter, setAreasFilter] = useState('');

    return (
        <div id='control-panel' style={{ width: controlPanelSize }}>
            <AppBar id='app-bar' position="static">
                <Typography id='title' variant="h5" >
                    WeFly
                </Typography>
            </AppBar>
            <div id='date-picker-container'
                style={controlPanelSize === 0 ? { display: 'none' } : {}}><center>
                <DatePicker
                defaultValue={date}
                format="YYYY-MM-DD (ddd)"
                onChange={(newDate) => {
                    setAreasFilter('');
                    onDateChange(newDate)
                }} />
        </center></div>
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
        </div >
    );
};

export const scrollToTrack = (trackid) => {
    const row = document.getElementById(`trackrow-${trackid}`);
    if (row !== null) {
        row.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}