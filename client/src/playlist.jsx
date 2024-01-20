import React from 'react';
import * as Cesium from 'cesium';
import { Table, TableRow, TableCell, TableContainer, TableBody } from '@mui/material';
import { focusOnTrack } from './playbackmap';
import * as CesiumMap from './cesiummap';
import './playlist.css';

const PlaybackRange = ({ track }) => {
    const flightDuration = track.times[track.times.length - 1].diff(track.times[0], 'seconds');
    const totalFlightDuration = Cesium.JulianDate.secondsDifference(CesiumMap.viewer.clock.stopTime, CesiumMap.viewer.clock.startTime);
    const startPosition = Cesium.JulianDate.secondsDifference(
        Cesium.JulianDate.fromIso8601(track.times[0].format('YYYY-MM-DDTHH:mm:ssZ')),
        CesiumMap.viewer.clock.startTime) / totalFlightDuration * 100;
    const width = flightDuration / totalFlightDuration * 100;

    const color = track.color.withAlpha(0.8);
    // Styles for the flight duration bar
    const playbackRangeStyle = {
        position: 'relative',
        left: `${startPosition}%`,
        width: `${width}%`,
        height: '10px',
        background: `linear-gradient(90deg, ${color.toCssHexString()}, ${color.darken(0.2, new Cesium.Color()).toCssHexString()})`,
        borderRadius: '10px',
        verticalAlign: 'middle',
    };

    return (
        <TableCell className='playback-range-cell'>
            <div className='playback-range-container'>
                <div style={playbackRangeStyle}></div>
            </div>
        </TableCell>
    );
};

const mapTracksToTableRows = (tracks) => {
    return tracks.map((track, i) => (
        <TableRow
            key={"tr" + i}
            id={`trackrow-${track.id}`}
            onClick={() => { focusOnTrack(track) }} >
            <TableCell id='pilotname'>
                {track.pilotname}
            </TableCell>
            <PlaybackRange track={track} />
        </TableRow>
    ));
};

const calculateTimeLinePosition = (currentTime) => {
    const totalFlightDuration = Cesium.JulianDate.secondsDifference(
        CesiumMap.viewer.clock.stopTime,
        CesiumMap.viewer.clock.startTime);
    const currentPosition = Cesium.JulianDate.secondsDifference(
        Cesium.JulianDate.fromIso8601(currentTime.format('YYYY-MM-DDTHH:mm:ssZ')),
        CesiumMap.viewer.clock.startTime) / totalFlightDuration * 100;
    return currentPosition;
}

const CurrentTimelineBar = ({ tracks, playbackState }) => {
    const timelineBarStyle = React.useMemo(() => {
        return {
            position: 'relative',
            left: `${calculateTimeLinePosition(playbackState.currentTime)}%`,
            height: `${52.41 * (tracks.length)}px`,
            width: '3px',
            background: '#e95800',
        };
    }, [tracks, playbackState]);

    return (
        <div id='timeline-bar' style={timelineBarStyle} />
    )
}

export const PlayList = ({ state, playbackState }) => {
    const sortedTracks = React.useMemo(() => {
        return state.actionTargetTracks.slice().sort((a, b) => a.startTime().localeCompare(b.startTime()));
    }, [state.actionTargetTracks]);

    return (
        <TableContainer id='playlist-container'>
            <Table id='playlist-table'>
                <TableBody>{
                    mapTracksToTableRows(sortedTracks)
                }</TableBody>
            </Table>
            <div id='timelinebar-container'>
                <CurrentTimelineBar tracks={sortedTracks} playbackState={playbackState} />
            </div>
        </TableContainer >
    );
};