import React, { useState } from 'react';
import { Table, TableContainer, } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { TrackListHeader } from './tracklistheader';
import { TrackListBody } from './tracklistbody';
import './controlpanel.css';

export const ControlPanel = (props) => {
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('starttime');
    const [areasFilter, setAreasFilter] = useState('');

    let notracks = <div></div>;
    if (props.tracks.length === 0) {
        notracks = <div style={{ padding: "10px" }}><center>No tracks.</center></div>;
    }

    return (
        <div id='control-panel'>
            <div id='data-picker-container'><center>
                <DatePicker defaultValue={props['date']} format="YYYY-MM-DD (ddd)" onChange={(newDate) => props.onDateChange(newDate)} />
            </center></div>
            <TableContainer id='tracklist'>
                <Table stickyHeader size="medium">
                    <TrackListHeader
                        tracks={props.tracks}
                        order={order}
                        setOrder={setOrder}
                        orderBy={orderBy}
                        setOrderBy={setOrderBy}
                        areasFilter={areasFilter}
                        onAreasFilterChange={setAreasFilter} />
                    <TrackListBody
                        tracks={props.tracks}
                        onTrackClicked={props.onTrackClicked}
                        orderBy={orderBy}
                        order={order}
                        areasFilter={areasFilter}
                    />
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