import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { DatePicker } from '@mui/x-date-pickers';
import './controlpanel.css';

const compareFloat = (a, b) => {
    const valueA = parseFloat(a);
    const valueB = parseFloat(b);
    return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
}
const headers = [
    {
        field: 'pilot',
        headerName: 'Pilot',
        width: 130,
        sortingOrder: ['asc', 'desc'],
    },
    {
        field: 'area',
        headerName: 'Area',
        width: 150,
        sortingOrder: ['asc', 'desc'],
    },
    {
        field: 'start',
        headerName: 'Start',
        sortingOrder: ['asc', 'desc'],
    },
    {
        field: 'duration',
        headerName: 'Duration',
        sortingOrder: ['desc', 'asc'],
    },
    {
        field: 'maxalt',
        headerName: 'Max Alt.',
        sortComparator: compareFloat,
        sortingOrder: ['desc', 'asc'],
    },
    {
        field: 'distance',
        headerName: 'Distance',
        sortComparator: compareFloat,
        sortingOrder: ['desc', 'asc'],
    }
];

export const ControlPanel = (props) => {
    const rows = props.tracks.map(track => {
        return {
            'id': track.id,
            'pilot': track.pilotname,
            'area': track.area,
            'start': track.startTime().split(' ')[1],
            'duration': track.durationStr(),
            'maxalt': `${track.maxAltitude()}m`,
            'distance': `${track.distance}km`,
        }
    });

    const selectedRows = props.tracks.filter(track => track.isShowingTrackLine()).map(track => track.id);
    console.log(selectedRows);

    const handleRowSelect = (selected) => {
        let diff = selected.filter(x => !selectedRows.includes(x));
        if (diff.length === 0) {
            diff = selectedRows.filter(x => !selected.includes(x));
        }
        diff.forEach(row => props.onTrackClicked(row));
    }

    return (
        <div id='control-panel'>
            <div id='data-picker-container'><center>
                <DatePicker
                    defaultValue={props['date']}
                    format="YYYY-MM-DD (ddd)"
                    onChange={(newDate) => props.onDateChange(newDate)} />
            </center></div>
            <DataGrid
                rowHeight={40}
                rows={rows}
                columns={headers}
                checkboxSelection
                initialState={{
                    sorting: { sortModel: [{ field: 'start', sort: 'asc' }] },
                }}
                rowSelectionModel={selectedRows}
                onRowSelectionModelChange={(newRowSelectionModel) => handleRowSelect(newRowSelectionModel)}
            />
        </div>
    );
};

export const scrollToTrack = (trackid) => {
    // const trackrow = trackrows[trackid];
    // if (trackrow === undefined) {
    //     return;
    // }
    // trackrow.scrollIntoView({ behavior: 'smooth' });
}