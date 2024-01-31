import React from 'react';
import * as Cesium from 'cesium';
import dayjs from 'dayjs';
import { Table, TableRow, TableCell, TableContainer, TableBody } from '@mui/material';
import { focusOnTrack } from './playbackmap';
import * as CesiumMap from './cesiummap';
import { Timeline } from './timeline';
import { TimelineBarContainer } from './timelinebar';
import './playlist.css';

const mapTracksToTableRows = (tracks, playbackState, setPlaybackState) => {
    const handleClick = (e, track) => {
        console.log(`${track.pilotname} clicked`);
        setPlaybackState({ ...playbackState, selectedTrack: track });
    };

    return tracks.map((track, i) => (
        <TableRow
            key={"tr" + i}
            id={`trackrow-${track.id}`}
            onClick={(e) => handleClick(e, track)}>
            <TableCell id='pilotname'>
                {track.pilotname}
            </TableCell>
            <TableCell className='timeline-cell'>
                <Timeline
                    track={track}
                    playbackState={playbackState}
                    setPlaybackState={setPlaybackState}
                    start={dayjs(Cesium.JulianDate.toDate(CesiumMap.viewer.clock.startTime))}
                    end={dayjs(Cesium.JulianDate.toDate(CesiumMap.viewer.clock.stopTime))} />
            </TableCell>
        </TableRow>
    ));
};

export const PlayList = ({ state, playbackState, setPlaybackState }) => {
    const sortedTracks = React.useMemo(() => {
        return state.actionTargetTracks.slice().sort((a, b) => a.startTime().localeCompare(b.startTime()));
    }, [state.actionTargetTracks]);

    const [isDragging, setIsDragging] = React.useState(false);

    const handleMouseDown = ((e) => {
        setIsDragging(true);
    });
    const handleMouseUp = ((e) => {
        setIsDragging(false);
    });
    const handleMove = React.useCallback((x, rect) => {
        if (isDragging) {
            const totalFlightDuration = Cesium.JulianDate.secondsDifference(
                CesiumMap.viewer.clock.stopTime,
                CesiumMap.viewer.clock.startTime);
            const currentTime = dayjs(Cesium.JulianDate.toDate(Cesium.JulianDate.addSeconds(
                CesiumMap.viewer.clock.startTime,
                totalFlightDuration * x / rect.width,
                new Cesium.JulianDate())));
            CesiumMap.viewer.clock.currentTime = Cesium.JulianDate.fromIso8601(currentTime.format('YYYY-MM-DDTHH:mm:ssZ'));
            setPlaybackState({ ...playbackState, currentTime: currentTime });
        }
    }, [playbackState]);
    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        handleMove(x, rect);
    };
    const handleTouchMove = (e) => {
        const rect = document.getElementById('timelinebar-container').getBoundingClientRect();
        const x = e.touches[0].clientX - rect.left;
        handleMove(x, rect);
    }

    return (
        <TableContainer id='playlist-container'
            onMouseUp={handleMouseUp}
            onTouchEnd={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}>
            <Table id='playlist-table'>
                <TableBody>{
                    mapTracksToTableRows(sortedTracks, playbackState, setPlaybackState)
                }</TableBody>
            </Table>
            <TimelineBarContainer
                playbackState={playbackState}
                setPlaybackState={setPlaybackState}
                onMouseDown={handleMouseDown} />
        </TableContainer >
    );
};