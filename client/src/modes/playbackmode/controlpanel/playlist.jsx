import React from 'react';
import { Table, TableRow, TableCell, TableContainer, TableBody } from '@mui/material';
import { Typography } from '@mui/material';
import { Timeline } from '../../../timeline';
import { TimelineBarContainer } from './timelinebar';
import { PilotIcon } from '../../../util/piloticon';
import './playlist.css';

const mapTracksToTableRows = (tracks, playbackState, setPlaybackState) => {
    const [sortedTracks, setSortedTracks] = React.useState(tracks.toSorted((a, b) => a.metadata.startTime.isAfter(b.metadata.startTime) ? 1 : -1));

    const handleClick = React.useCallback((e, track) => {
        if (track.path.times[0].isBefore(playbackState.currentTime) &&
            track.path.times[track.path.times.length - 1].isAfter(playbackState.currentTime)) {
            setPlaybackState({ ...playbackState, selectedTrack: track });
        }
    }, [tracks, playbackState]);

    const handleTimelineClick = (e, newCurrentTime, track) => {
        if (track.path.times[0].isBefore(newCurrentTime) && track.path.times[track.path.times.length - 1].isAfter(newCurrentTime)) {
            setPlaybackState({ ...playbackState, selectedTrack: track });
        }
    }

    return sortedTracks.map((track, i) => (
        <TableRow
            key={"tr" + i}
            id={`trackrow-${track.getId()}`}
            onClick={(e) => handleClick(e, track)}>
            <TableCell className='pilotcell' sx={{ padding: '5px' }}>
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
                    currentTime={playbackState.currentTime}
                    setCurrentTime={(newCurrentTime) => {
                        setPlaybackState({ ...playbackState, currentTime: newCurrentTime });
                    }}
                    start={playbackState.startTime}
                    end={playbackState.stopTime}
                    handleTimelineClick={(e, newCurrentTime) => { handleTimelineClick(e, newCurrentTime, track) }} />
            </TableCell>
        </TableRow>));
};

export const PlayList = ({ state, playbackState, setPlaybackState }) => {
    return (
        <TableContainer id='playlist-container'>
            <Table id='playlist-table'>
                <TableBody>{
                    mapTracksToTableRows(state.actionTargetTracks, playbackState, setPlaybackState)
                }</TableBody>
            </Table>
            <TimelineBarContainer playbackState={playbackState} />
        </TableContainer >
    );
};