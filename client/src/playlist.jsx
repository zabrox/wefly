import React from 'react';
import * as Cesium from 'cesium';
import { Table, TableHead, TableRow, TableCell, TableContainer, TableBody } from '@mui/material';
import ParaglidingIcon from '@mui/icons-material/Paragliding';
import { focusOnTrack } from './playbackmap';
import './playlist.css';

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

const headers = [
    {
        id: 'status',
        label: '',
        numeric: false,
        defaultOrder: 'asc',
        display: undefined,
    },
    {
        id: 'activity',
        label: '種別',
        numeric: false,
        defaultOrder: 'asc',
        display: (track) => (track.activity),
    },
    {
        id: 'pilotname',
        label: 'パイロット',
        numeric: false,
        defaultOrder: 'asc',
        display: (track) => (track.pilotname),
    },
    {
        id: 'area',
        label: 'エリア',
        numeric: false,
        defaultOrder: 'asc',
        display: (track) => (cutDownAreaName(track.area)),
    },
    {
        id: 'starttime',
        label: '開始時刻',
        numeric: false,
        defaultOrder: 'asc',
        display: (track) => (track.startTime().split(' ')[1]),
    },
];

const TrackCell = ({ track, header }) => {
    return (<TableCell className={header.id}>{header.display(track)}</TableCell>);
}

const mapTracksToTableRows = (tracks) => {
    return tracks.map((track, i) => (
        <TableRow
            key={"tr" + i}
            id={`trackrow-${track.id}`}
            onClick={() => { focusOnTrack(track) }} >
            {
                headers.map((header) => (
                    <TrackCell key={track.pilotname + header.id} track={track} header={header} />
                ))
            }
        </TableRow>
    ));
};

export const PlayList = ({ state, playbackState }) => {
    headers[0].display = React.useCallback((track) => {
        if (track.times[0] <= playbackState.currentTime && playbackState.currentTime <= track.times[track.times.length - 1]) {
            return <ParaglidingIcon style={{
                width: '25',
                height: '25',
                borderRadius: '50%',
                color: track.color.brighten(0.8, new Cesium.Color()).toCssHexString(),
                backgroundColor: track.color.darken(0.2, new Cesium.Color()).toCssHexString(),}}/>;
        } else {
            return null;
        }
    }, [playbackState.currentTime]);

    const sortedTracks = React.useMemo(() => {
        return state.actionTargetTracks.slice().sort((a, b) => a.startTime().localeCompare(b.startTime()));
    }, [state.actionTargetTracks]);

    return (
        <TableContainer id='playlist-container'>
            <Table>
                <TableHead>
                    <TableRow id="playlist-header">
                        {headers.map((header) => (
                            <TableCell
                                key={header.id}
                            >
                                {header.label}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>{
                    mapTracksToTableRows(sortedTracks)
                }</TableBody>
            </Table>
        </TableContainer>
    );
};