import React from 'react';
import * as Cesium from 'cesium';
import { Table, TableRow, TableCell, TableContainer, TableBody } from '@mui/material';
import { focusOnTrack } from './playbackmap';
import * as CesiumMap from './cesiummap';
import './playlist.css';

const FlightArrow = ({ track }) => {
    const flightDuration = track.times[track.times.length - 1].diff(track.times[0], 'seconds');
    const totalFlightDuration = Cesium.JulianDate.secondsDifference(CesiumMap.viewer.clock.stopTime, CesiumMap.viewer.clock.startTime);
    const startPosition = Cesium.JulianDate.secondsDifference(
        Cesium.JulianDate.fromIso8601(track.times[0].format('YYYY-MM-DDTHH:mm:ssZ')),
        CesiumMap.viewer.clock.startTime) / totalFlightDuration * 100;
    const width = flightDuration / totalFlightDuration * 100;

    const color = track.color.withAlpha(0.8);
    // Styles for the flight duration bar
    const flightBarStyle = {
        position: 'absolute',
        top: '-5px',
        left: `${startPosition}%`,
        width: `${width}%`,
        height: '10px',
        background: `linear-gradient(90deg, ${color.toCssHexString()}, ${color.darken(0.2, new Cesium.Color()).toCssHexString()})`,
        borderRadius: '10px',
    };
    // 追加: 親コンテナとして機能する div のスタイル
    const flightArrowContainerStyle = {
        position: 'relative',
        height: '100%', // バーの親コンテナの高さをTableCellと同じにする
        width: '100%', // TableCellの幅いっぱいにする
    };

    return (
        <TableCell className="flight-arrow" sx={{width: '90%'}}>
            <div style={flightArrowContainerStyle}>
                <div style={flightBarStyle}></div>
                {/* Render the arrow or bar here */}
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
            <TableCell className={`trackid-${track.id}`}>{track.pilotname}</TableCell>
            <FlightArrow track={track} />
        </TableRow>
    ));
};

export const PlayList = ({ state, playbackState }) => {
    // headers[0].display = React.useCallback((track) => {
    //     if (track.times[0] <= playbackState.currentTime && playbackState.currentTime <= track.times[track.times.length - 1]) {
    //         return <ParaglidingIcon style={{
    //             width: '25',
    //             height: '25',
    //             borderRadius: '50%',
    //             color: track.color.brighten(0.8, new Cesium.Color()).toCssHexString(),
    //             backgroundColor: track.color.darken(0.2, new Cesium.Color()).toCssHexString(),}}/>;
    //     } else {
    //         return null;
    //     }
    // }, [playbackState.currentTime]);

    const sortedTracks = React.useMemo(() => {
        return state.actionTargetTracks.slice().sort((a, b) => a.startTime().localeCompare(b.startTime()));
    }, [state.actionTargetTracks]);

    return (
        <TableContainer id='playlist-container'>
            <Table>
                <TableBody>{
                    mapTracksToTableRows(sortedTracks)
                }</TableBody>
            </Table>
        </TableContainer>
    );
};