import React from 'react';
import dayjs from 'dayjs';
import { Typography, Table, TableContainer, Box } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { Track } from '../../entities/track';
import { ProgressBar } from '../playbackmode/progressbar';
import { ScatterActionDial } from './scatteractiondial';
import * as CesiumMap from '../../cesiummap';
import { ScatterMap } from './scattermap';
import { TrackListHeader } from './tracklistheader';
import { TrackListBody } from './tracklistbody';
import { loadMetadatas, loadPaths, loadTrackGroups } from './trackloader';
import { TrackGroupSelector } from './trackGroupSelector';
import * as Mode from '../mode';
import './scattercontrolpanel.css';

const loadTracks = async (state, setState, scatterState, setScatterState) => {
    setState({ ...state, tracks: [], trackGroups: [] });
    setScatterState({ ...scatterState, loading: true })
    let tracks = [];
    let trackGroups = [];
    try {
        let metadatas = await loadMetadatas(scatterState.date);
        metadatas = metadatas.filter(metadata => metadata !== undefined && metadata.duration > 5);
        tracks = metadatas.map(metadata => {
            const t = new Track();
            t.metadata = metadata;
            return t;
        });
        trackGroups = await loadTrackGroups(scatterState.date);
    } catch (error) {
        console.error(error);
        setState({ ...state, tracks: [], trackGroups: [] });
        setScatterState({ ...scatterState, loading: false });
        return;
    }
    CesiumMap.zoomToTrackGroups(trackGroups);
    setState({ ...state, tracks: tracks, trackGroups: trackGroups, });
    setScatterState({ ...scatterState, loading: false });
};

const scrollToTrack = (trackid) => {
    const row = document.getElementById(`trackrow-${trackid}`);
    if (row !== null) {
        row.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

const listup = (tracks, accessor) => {
    const namesSet = new Set();

    tracks.forEach(track => {
        if (accessor(track) && !namesSet.has(accessor(track))) {
            namesSet.add(accessor(track));
        }
    });

    return namesSet;
}

export const ScatterControlPanel = ({ state, setState, scatterState, setScatterState }) => {
    React.useEffect(() => {
        if (state.tracks.length === 0) {
            loadTracks(state, setState, scatterState, setScatterState);
        }
    }, []);

    const handleTrackGroupClick = React.useCallback(async (groupid, trackGroups) => {
        const group = trackGroups.find(group => group.groupid === groupid);
        CesiumMap.zoomToTrackGroup(group);
        const copyTracks = [...state.tracks];
        const tracksInGroup = copyTracks.filter(track => group.trackIds.includes(track.getId()))
        if (scatterState.selectedTrackGroups.has(group)) {
            CesiumMap.zoomToTracks(tracksInGroup);
            return;
        }
        await loadPaths(tracksInGroup);
        setState(state => { return { ...state, tracks: copyTracks } });
        const copySelectedTrackGroups = new TrackGroupSelector(scatterState.selectedTrackGroups);
        copySelectedTrackGroups.add(group);
        setScatterState(state => { return { ...state, selectedTrackGroups: copySelectedTrackGroups } });
        CesiumMap.zoomToTracks(tracksInGroup);
    }, [state]);

    const toggleSelectionOfTrack = React.useCallback((trackid) => {
        const copySelectedTracks = new Set(scatterState.selectedTracks);
        const select = !copySelectedTracks.has(trackid);
        if (select) {
            copySelectedTracks.add(trackid);
        } else {
            copySelectedTracks.delete(trackid);
        }
        setScatterState(state => { return { ...state, selectedTracks: copySelectedTracks } });
        return select;
    }, [scatterState]);

    const handleTrackPointClick = React.useCallback((trackid) => {
        if (!scatterState.selectedTracks.has(trackid)) {
            toggleSelectionOfTrack(trackid);
        }
    }, [state, scatterState]);

    const handleTrackClick = React.useCallback(async (trackid) => {
        console.debug('handleTrackClick');
        const select = toggleSelectionOfTrack(trackid);
        if (select) {
            const targetTrack = state.tracks.find(track => track.getId() === trackid)
            if (targetTrack.path.points.length === 0) {
                const groupid = state.trackGroups.find(group => group.trackIds.includes(trackid)).groupid;
                await handleTrackGroupClick(groupid, state.trackGroups);
            }
            CesiumMap.zoomToTracks([targetTrack]);
        }
    }, [state, scatterState]);

    const handleDateChange = React.useCallback((newDate) => {
        console.debug('handleDateChange');
        CesiumMap.removeAllEntities();
        const date = dayjs(newDate);
        loadTracks(state, setState, { ...scatterState, selectedTrackGroups: new TrackGroupSelector(), date: date }, setScatterState);
    }, [state, scatterState]);

    const trackNumber = React.useCallback(() => {
        if (scatterState.selectedTrackGroups.groups.size === 0) {
            return state.tracks.length;
        }
        let count = 0;
        for (const group of scatterState.selectedTrackGroups.groups) {
            count += group.trackIds.length;
        }
        return count;
    }, [state, scatterState]);

    if (state.mode !== Mode.SCATTER_MODE) {
        return null;
    }

    return (
        <div id='scatter-control-panel'>
            <div id='date-picker-container'><center>
                <DesktopDatePicker
                    defaultValue={scatterState.date}
                    format="YYYY-MM-DD (ddd)"
                    onChange={handleDateChange} />
            </center>
            </div>
            <Typography id='tracknumber-label'>
                {trackNumber()} tracks
            </Typography>
            <Box id='tracklist-container'>
                <TableContainer id='tracklist'>
                    <Table size="medium">
                        <TrackListHeader
                            tracks={state.tracks}
                            scatterState={scatterState}
                            setScatterState={setScatterState} />
                        <TrackListBody
                            state={state}
                            scatterState={scatterState}
                            onTrackClicked={handleTrackClick} />
                    </Table>
                </TableContainer >
                <ProgressBar show={scatterState.loading} controlPanelSize={state.controlPanelSize} />
            </Box>
            <ScatterActionDial
                state={state}
                setState={setState}
                scatterState={scatterState} />
            <ScatterMap
                onTrackPointClick={handleTrackPointClick}
                onTrackGroupClick={handleTrackGroupClick}
                state={state}
                scatterState={scatterState} />
        </div >
    );
};