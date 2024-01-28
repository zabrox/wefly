import React from 'react';
import * as Cesium from 'cesium';
import dayjs from 'dayjs';
import { Table, TableRow, TableCell, TableContainer, TableBody } from '@mui/material';
import { focusOnTrack } from './playbackmap';
import * as CesiumMap from './cesiummap';
import { TimelineBarContainer } from './timelinebar';
import './playlist.css';

const PlaybackRange = ({ track, playbackState, setPlaybackState }) => {
    const [playbackRangeState, setPlaybackRangeState] = React.useState({
        spanCells: [],
        canvas: null,
        cellNumber: 0,
    });

    const playbackRangeCell = React.useRef(null);
    const playbackRangeCanvas = React.useRef(null);

    React.useEffect(() => {
        if (!playbackRangeCanvas.current || !playbackRangeCell.current) {
            return;
        }
        const canvas = playbackRangeCanvas.current;
        canvas.width = playbackRangeCell.current.getBoundingClientRect().width;
        canvas.height = canvas.getBoundingClientRect().height;
        const context = canvas.getContext('2d');
        context.strokeStyle = "#aaa";
        context.lineWidth = 1;
        const lineargradient = context.createLinearGradient(0, 0, 0, canvas.height);
        lineargradient.addColorStop(0, track.color.brighten(0.3, new Cesium.Color()).withAlpha(0.5).toCssHexString());
        lineargradient.addColorStop(1, track.color.darken(0.2, new Cesium.Color()).withAlpha(0.5).toCssHexString());
        context.fillStyle = lineargradient;
        setPlaybackRangeState({ ...playbackRangeState, cellNumber: canvas.width / 4, canvas: canvas });
    }, []);

    React.useEffect(() => {
        if (!playbackRangeState.canvas) {
            return;
        }
        let time = track.times[0];

        const totalFlightDuration = Cesium.JulianDate.secondsDifference(CesiumMap.viewer.clock.stopTime, CesiumMap.viewer.clock.startTime);
        const span = totalFlightDuration / playbackRangeState.cellNumber;
        const spanCells = [];
        while (time.isBefore(track.times[track.times.length - 1])) {
            const height = playbackRangeState.canvas.height * track.getAverageAltitude(time, time.add(span, 'seconds')) / track.maxAltitude();
            const position = playbackRangeState.canvas.width * Cesium.JulianDate.secondsDifference(
                Cesium.JulianDate.fromIso8601(time.format('YYYY-MM-DDTHH:mm:ssZ')),
                CesiumMap.viewer.clock.startTime) / totalFlightDuration;
            spanCells.push({ position: position, height: height });
            // console.log(playbackRangeState.canvas.width, time.format('YYYY-MM-DDTHH:mm:ssZ'));
            time = time.add(span, 'seconds');
        }
        setPlaybackRangeState({ ...playbackRangeState, spanCells: spanCells });
    }, [playbackRangeState.canvas, playbackRangeState.cellNumber]);

    React.useEffect(() => {
        if (!playbackRangeState.canvas) {
            return;
        }
        const context = playbackRangeState.canvas.getContext('2d');
        playbackRangeState.spanCells.forEach(spanCell => {
            context.rect(spanCell.position, playbackRangeState.canvas.height - spanCell.height, playbackRangeState.canvas.width / playbackRangeState.cellNumber * 0.7, spanCell.height);
            context.fill();
            context.stroke();
        });
    }, [playbackRangeState]);

    const handleClick = (e) => {
        const rect = playbackRangeCanvas.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        console.log(e.clientX, rect.left)
        const totalFlightDuration = Cesium.JulianDate.secondsDifference(CesiumMap.viewer.clock.stopTime, CesiumMap.viewer.clock.startTime);
        const currentTime = dayjs(Cesium.JulianDate.toDate(Cesium.JulianDate.addSeconds(
            CesiumMap.viewer.clock.startTime,
            totalFlightDuration * x / rect.width,
            new Cesium.JulianDate())));
        console.log(currentTime.format('YYYY-MM-DDTHH:mm:ssZ'));
        CesiumMap.viewer.clock.currentTime = Cesium.JulianDate.fromIso8601(currentTime.format('YYYY-MM-DDTHH:mm:ssZ'));
        setPlaybackState({ ...playbackState, currentTime: currentTime });
    }

    return (
        <TableCell className='playback-range-cell' ref={playbackRangeCell}>
            <canvas className='playback-range-canvas'
                ref={playbackRangeCanvas}
                onClick={handleClick} />
        </TableCell>
    );
};

const mapTracksToTableRows = (tracks, playbackState, setPlaybackState) => {
    return tracks.map((track, i) => (
        <TableRow
            key={"tr" + i}
            id={`trackrow-${track.id}`}
            onClick={() => { focusOnTrack(track) }} >
            <TableCell id='pilotname'>
                {track.pilotname}
            </TableCell>
            <PlaybackRange track={track} playbackState={playbackState} setPlaybackState={setPlaybackState}/>
        </TableRow>
    ));
};

export const PlayList = ({ state, playbackState, setPlaybackState }) => {
    const sortedTracks = React.useMemo(() => {
        return state.actionTargetTracks.slice().sort((a, b) => a.startTime().localeCompare(b.startTime()));
    }, [state.actionTargetTracks]);

    return (
        <TableContainer id='playlist-container'>
            <Table id='playlist-table'>
                <TableBody>{
                    mapTracksToTableRows(sortedTracks, playbackState, setPlaybackState)
                }</TableBody>
            </Table>
            <TimelineBarContainer
                playbackState={playbackState}
                setPlaybackState={setPlaybackState} />
        </TableContainer >
    );
};