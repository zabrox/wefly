import React, { useEffect, useState } from 'react';
import axios from "axios";
import dayjs from 'dayjs';
import { AppBar, Typography, Table, TableContainer, Box, SpeedDial } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { TrackListHeader } from './tracklistheader';
import { TrackListBody } from './tracklistbody';
import { ProgressBar } from './progressbar';
import { parseTrackJson, dbscanTracks } from './track';
import { Filter } from './trackfilter';
import { ScatterActionDial } from './scatteractiondial';
import './scattercontrolpanel.css';

const loadTracks = async (state, setState, scatterState, setScatterState) => {
    setState({ ...state, tracks: [] });
    setScatterState({ ...scatterState, loading: true })
    const date = state.date;
    const tracksurl = `${import.meta.env.VITE_API_URL}/tracks?date=`;
    let response = undefined;
    try {
        console.time('loadTracks');
        response = await axios({ method: "get", url: `${tracksurl}${scatterState.date.format('YYYY-MM-DD')}`, responseType: "json" });
        console.timeEnd('loadTracks');
    } catch (error) {
        console.error(error);
        setState({ ...state, tracks: [] });
        setScatterState({ ...scatterState, loadingTracks: false });
        return;
    }
    let tracks = parseAllTracks(response.data);
    // filter tracks less than 5 minutes
    tracks = tracks.filter(track => track !== undefined && track.duration() > 5);
    console.time('dbscanTracks');
    const trackGroups = dbscanTracks(tracks);
    console.timeEnd('dbscanTracks');
    // CesiumMap.onTrackLoad(tracks, trackGroups);
    setState({ ...state, tracks: tracks, trackGroups: trackGroups, });
    setScatterState({ ...scatterState, loading: false });
};

const parseAllTracks = tracks => {
    console.time('parseAllTracks');
    const parsedTracks = tracks.map((trackjson) => {
        return parseTrackJson(trackjson);
    });
    console.timeEnd('parseAllTracks');
    return parsedTracks;
};

const handleTrackClick = (state, setState, trackid) => {
    console.debug('handleTrackClick');
    const copy_tracks = [...state.tracks];
    const index = copy_tracks.findIndex(track => track.id === trackid)
    const target_track = copy_tracks[index];
    const select = !target_track.isSelected();
    target_track.select(select);
    setState({ ...state, tracks: copy_tracks });
    // if (select) {
    //     CesiumMap.zoomToTracks([target_track]);
    // }
};

const handleDateChange = (state, setState, scatterState, setScatterState, newDate) => {
    console.debug('handleDateChange');
    // stopPlayback((mode) => setState({ ...state, mode: mode }));
    // CesiumMap.removeAllEntities();
    const date = dayjs(newDate);
    loadTracks(state, setState, {...scatterState, date: date}, setScatterState);
}

const scrollToTrack = (trackid) => {
    const row = document.getElementById(`trackrow-${trackid}`);
    if (row !== null) {
        row.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

const handleTrackPointClick = (trackid) => {
    const track = state.tracks.find(track => track.id === trackid);
    if (!track.isSelected()) {
        handleTrackClick(state, trackid);
    }
    setTimeout(() => scrollToTrack(trackid), 100);
}

const handleTrackGroupClick = (groupid) => {
    const group = state.trackGroups.find(group => group.groupid === groupid);
    CesiumMap.zoomToTrackGroup(group);
}

function listup(key, tracks) {
    const namesSet = new Set();

    tracks.forEach(track => {
        if (track[key] && !namesSet.has(track[key])) {
            namesSet.add(track[key]);
        }
    });

    return Array.from(namesSet).sort();
}

export const ScatterControlPanel = ({ state, setState }) => {
    const [scatterState, setScatterState] = useState({
        loadingTracks: false,
        date: dayjs(),
        order: 'asc',
        orderBy: 'starttime',
        filter: new Filter(),
        loading: false,
    });

    useEffect(() => {
        loadTracks(state, setState, scatterState, setScatterState);
    }, []);

    useEffect(() => {
        const newFilter = scatterState.filter;
        const areas = listup('area', state.tracks);
        const pilots = listup('pilotname', state.tracks);
        const activities = listup('activity', state.tracks);
        newFilter.setContents(pilots, activities, areas);
        setScatterState({ ...scatterState, filter: newFilter });
    }, [state.tracks]);

    return (
        <div id='scatter-control-panel' style={{ width: state.controlPanelSize, height: '100%' }}>
            <div id='date-picker-container'
                style={state.controlPanelSize === 0 ? { display: 'none' } : {}}><center>
                    <DesktopDatePicker
                        defaultValue={scatterState.date}
                        format="YYYY-MM-DD (ddd)"
                        onChange={(newDate) => {
                            const newFilter = scatterState.filter;
                            newFilter.clear();
                            setScatterState({ ...scatterState, filter: newFilter });
                            handleDateChange(state, setState, scatterState, setScatterState, newDate)
                        }} />
                </center>
            </div>
            <Typography id='tracknumber-label' style={state.controlPanelSize === 0 ? { display: 'none' } : {}}>
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
                            tracks={state.tracks}
                            onTrackClicked={(trackid) => handleTrackClick(state, setState, trackid)}
                            orderBy={scatterState.orderBy}
                            order={scatterState.order}
                            filter={scatterState.filter} />
                    </Table>
                </TableContainer >
                <ProgressBar show={scatterState.loading} controlPanelSize={state.controlPanelSize} />
            </Box>
            <ScatterActionDial
                tracks={state.tracks}
                filter={scatterState.filter}
                controlPanelSize={state.controlPanelSize}
                setMode={(mode) => setState({...state, mode: mode})} />
        </div >
    );
};