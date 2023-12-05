import React, { useState } from 'react';
import { Table, TableContainer, } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { TrackListHeader } from './tracklistheader';
import { TrackListBody } from './tracklistbody';
import './controlpanel.css';

export const ControlPanel = ({ date, onDateChange, tracks, onTrackClicked, controlPanelSize, media }) => {
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('starttime');
    const [areasFilter, setAreasFilter] = useState('');

    let notracks = <div></div>;
    if (tracks.length === 0) {
        notracks = <div style={{ padding: "10px" }}><center>No tracks.</center></div>;
    }

    return (
        <div id='control-panel' style={{ width: controlPanelSize }}>
            <div id='date-picker-container'><center>
                <DatePicker defaultValue={date} format="YYYY-MM-DD (ddd)" onChange={(newDate) => onDateChange(newDate)} />
            </center></div>
            <div id='tracklist'>
                <TableContainer>
                    <Table stickyHeader size="medium">
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
            </div>
            {notracks}
        </div>
    );
};

export const scrollToTrack = (trackid) => {
    const row = document.getElementById(`trackrow-${trackid}`);
    if (row !== null) {
        row.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}