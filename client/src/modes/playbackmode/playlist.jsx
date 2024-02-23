import React from 'react';
import * as Cesium from 'cesium';
import dayjs from 'dayjs';
import { Table, TableRow, TableCell, TableContainer, TableBody } from '@mui/material';
import { Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import * as CesiumMap from '../../cesiummap';
import { Timeline } from './timeline';
import { TimelineBarContainer } from './timelinebar';
import { PilotIcon } from '../../util/piloticon';
import './playlist.css';

const mapTracksToTableRows = (tracks, playbackState, setPlaybackState) => {
    const handleClick = React.useCallback((e, track) => {
        if (track.path.times[0].isBefore(playbackState.currentTime) &&
            track.path.times[track.path.times.length - 1].isAfter(playbackState.currentTime)) {
            setPlaybackState({ ...playbackState, selectedTrack: track });
        }
    }, [tracks, playbackState]);

    return tracks.map((track, i) => (
        <TableRow
            key={"tr" + i}
            id={`trackrow-${track.getId()}`}
            onClick={(e) => handleClick(e, track)}>
            <TableCell className='pilotcell' sx={{padding: '5px'}}>
                <div>
                    <PilotIcon track={track} />
                    <div className='pilotname-container'>
                        <Typography variant='body2'>{track.metadata.pilotname}</Typography>
                    </div>
                </div>
            </TableCell>
            <TableCell className='timeline-cell'>
                <Timeline
                    track={track}
                    playbackState={playbackState}
                    setPlaybackState={setPlaybackState}
                    start={playbackState.startTime}
                    end={playbackState.stopTime} />
            </TableCell>
        </TableRow>
    ));
};

export const PlayList = ({ state, playbackState, setPlaybackState }) => {
    const sortedTracks = React.useMemo(() => {
        return state.actionTargetTracks.slice().sort((a, b) => a.metadata.startTime.isBefore(b.metadata.startTime));
    }, [state.actionTargetTracks]);

    return (
        <TableContainer id='playlist-container'>
            <Table id='playlist-table'>
                <TableBody>{
                    mapTracksToTableRows(sortedTracks, playbackState, setPlaybackState)
                }</TableBody>
            </Table>
            <TimelineBarContainer playbackState={playbackState} />
        </TableContainer >
    );
};