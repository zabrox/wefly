import React from 'react';
import axios from "axios";
import dayjs from 'dayjs';
import { Typography, Table, TableContainer, Box } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { TrackListHeader } from './tracklistheader';
import { TrackListBody } from './tracklistbody';
import { ProgressBar } from './progressbar';
import { parseTrackJson, dbscanTracks } from './track';
import { Filter } from './trackfilter';
import { ScatterActionDial } from './scatteractiondial';
import * as CesiumMap from './cesiummap';
import { ScatterMap } from './scattermap';
import * as Mode from './mode';
import './scattercontrolpanel.css';

const loadTracks = async (state, setState, scatterState, setScatterState) => {
    setState({ ...state, tracks: [] });
    setScatterState({ ...scatterState, loading: true })
    const tracksurl = `${import.meta.env.VITE_API_URL}/tracks?date=`;
    let response = undefined;
    try {
        console.time('loadTracks');
        response = await axios({ method: "get", url: `${tracksurl}${scatterState.date.format('YYYY-MM-DD')}`, responseType: "json" });
        console.timeEnd('loadTracks');
    } catch (error) {
        console.error(error);
        setState({ ...state, tracks: [] });
        return;
    }
    let tracks = parseAllTracks(response.data);
    // filter tracks less than 5 minutes
    tracks = tracks.filter(track => track !== undefined && track.duration() > 5);
    console.time('dbscanTracks');
    const trackGroups = dbscanTracks(tracks);
    console.timeEnd('dbscanTracks');
    CesiumMap.zoomToTracks(tracks);
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

const handleDateChange = (state, setState, scatterState, setScatterState, newDate) => {
    console.debug('handleDateChange');
    CesiumMap.removeAllEntities();
    const date = dayjs(newDate);
    loadTracks(state, setState, { ...scatterState, date: date }, setScatterState);
}

const scrollToTrack = (trackid) => {
    const row = document.getElementById(`trackrow-${trackid}`);
    if (row !== null) {
        row.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}


const listup = (key, tracks) => {
    const namesSet = new Set();

    tracks.forEach(track => {
        if (track[key] && !namesSet.has(track[key])) {
            namesSet.add(track[key]);
        }
    });

    return Array.from(namesSet).sort();
}

export const ScatterControlPanel = ({ state, setState }) => {
    const [scatterState, setScatterState] = React.useState({
        date: dayjs(),
        order: 'asc',
        orderBy: 'starttime',
        filter: new Filter(),
        loading: true,
    });

    React.useEffect(() => {
        loadTracks(state, setState, scatterState, setScatterState);
    }, []);

    React.useEffect(() => {
        const newFilter = scatterState.filter;
        const areas = listup('area', state.tracks);
        const pilots = listup('pilotname', state.tracks);
        const activities = listup('activity', state.tracks);
        newFilter.setContents(pilots, activities, areas);
        setScatterState({ ...scatterState, filter: newFilter });
    }, [state.tracks]);

    const handleTrackGroupClick = React.useCallback((groupid, trackGroups) => {
        const group = trackGroups.find(group => group.groupid === groupid);
        CesiumMap.zoomToTrackGroup(group);
    }, [state]);

    const handleTrackPointClick = React.useCallback((trackid, tracks) => {
        const track = tracks.find(track => track.id === trackid);
        if (!track.isSelected()) {
            handleTrackClick(trackid);
        }
        setTimeout(() => setState(s => { return {...state, isControlPanelOpen: true} }));
        setTimeout(() => scrollToTrack(trackid), 100);
    }, [state]);

    const handleTrackClick = React.useCallback((trackid) => {
        console.debug('handleTrackClick');
        const copy_tracks = [...state.tracks];
        const index = copy_tracks.findIndex(track => track.id === trackid)
        const target_track = copy_tracks[index];
        const select = !target_track.isSelected();
        target_track.select(select);
        setState({ ...state, tracks: copy_tracks });
        if (select) {
            CesiumMap.zoomToTracks([target_track]);
        }
    }, [state]);

    if (state.mode !== Mode.SCATTER_MODE) {
        return null;
    }


    return (
        <div id='scatter-control-panel'>
            <div id='date-picker-container'><center>
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
                            tracks={state.tracks}
                            onTrackClicked={handleTrackClick}
                            orderBy={scatterState.orderBy}
                            order={scatterState.order}
                            filter={scatterState.filter} />
                    </Table>
                </TableContainer >
                <ProgressBar show={scatterState.loading} controlPanelSize={state.controlPanelSize} />
            </Box>
            <ScatterActionDial
                state={state}
                setState={setState}
                filter={scatterState.filter} />
            <ScatterMap
                onTrackPointClick={handleTrackPointClick}
                onTrackGroupClick={handleTrackGroupClick}
                state={state}
                scatterState={scatterState} />
        </div >
    );
};