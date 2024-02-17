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

    return Array.from(namesSet).sort();
}

export const ScatterControlPanel = ({ state, setState, scatterState, setScatterState }) => {
    React.useEffect(() => {
        if (state.tracks.length === 0) {
            loadTracks(state, setState, scatterState, setScatterState);
        }
    }, []);

    React.useEffect(() => {
        const newFilter = scatterState.filter;
        const areas = listup(state.tracks, (track) => track.metadata.area.areaName);
        const pilots = listup(state.tracks, (track) => track.metadata.pilotname);
        const activities = listup(state.tracks, (track) => track.metadata.activity);
        newFilter.setContents(pilots, activities, areas);
        setScatterState({ ...scatterState, filter: newFilter });
    }, [state, scatterState]);

    const handleTrackGroupClick = React.useCallback(async (groupid, trackGroups) => {
        const group = trackGroups.find(group => group.groupid === groupid);
        CesiumMap.zoomToTrackGroup(group);
        const copyTracks = [...state.tracks];
        const tracksInGroup = copyTracks.filter(track => group.trackIds.includes(track.getId()))
        if (scatterState.selectedTrackGroups.includes(group)) {
            CesiumMap.zoomToTracks(tracksInGroup);
            return;
        }
        await loadPaths(tracksInGroup);
        setState({ ...state, tracks: copyTracks });
        const copySelectedTrackGroups = [...scatterState.selectedTrackGroups];
        copySelectedTrackGroups.push(group);
        setScatterState({ ...scatterState, selectedTrackGroups: copySelectedTrackGroups });
        CesiumMap.zoomToTracks(tracksInGroup);
    }, [state]);

    const toggleSelectionOfTrack = React.useCallback((trackid) => {
        const copySelectedTracks = new Set(scatterState.selectedTracks);
        console.log(scatterState.selectedTracks)
        const select = !copySelectedTracks.has(trackid);
        if (select) {
            copySelectedTracks.add(trackid);
        } else {
            copySelectedTracks.delete(trackid);
        }
        setScatterState({ ...scatterState, selectedTracks: copySelectedTracks });
        return select;
    }, [scatterState]);

    const handleTrackPointClick = React.useCallback((trackid) => {
        if (!scatterState.selectedTracks.has(trackid)) {
            toggleSelectionOfTrack(trackid);
        }
    }, [state, scatterState]);

    const handleTrackClick = React.useCallback((trackid) => {
        console.debug('handleTrackClick');
        const select = toggleSelectionOfTrack(trackid);
        if (select) {
            const targetTrack = state.tracks.find(track => track.getId() === trackid)
            CesiumMap.zoomToTracks([targetTrack]);
        }
    }, [state, scatterState]);

    const handleDateChange = React.useCallback((newDate) => {
        console.debug('handleDateChange');
        const newFilter = scatterState.filter;
        newFilter.clear();
        CesiumMap.removeAllEntities();
        const date = dayjs(newDate);
        loadTracks(state, setState, { ...scatterState, filter: newFilter, date: date }, setScatterState);
    }, [state], [scatterState]);

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
                {scatterState.filter.filterTracks(state.tracks).length} tracks
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
            {/* <ScatterActionDial
                state={state}
                setState={setState}
                filter={scatterState.filter} /> */}
            <ScatterMap
                onTrackPointClick={handleTrackPointClick}
                onTrackGroupClick={handleTrackGroupClick}
                state={state}
                scatterState={scatterState} />
        </div >
    );
};