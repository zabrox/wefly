import React from "react";
import * as Cesium from "cesium";
import axios from "axios";
import { ControlPanel, scrollToTrack } from "./controlpanel";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs';
import { cesiumMap, CesiumMapContainer } from "./cesiummap";
import { parseTrackJson, dbscanTracks } from "./track";
import { Dragger } from "./dragger";
import { ControlPanelToggle } from "./controlpaneltoggle";
import { MessageDialog } from "./messagedialog";
import "./world.css";

let state = undefined;
let setState = undefined;
let media = undefined;

const loadTracks = async (state, setState) => {
    setState({ ...state, tracks: [], loadingTracks: true });
    const date = state['date'];
    const tracksurl = `${import.meta.env.VITE_API_URL}/tracks?date=`;
    let response = undefined;
    try {
        console.time('loadTracks');
        response = await axios({ method: "get", url: `${tracksurl}${date.format('YYYY-MM-DD')}`, responseType: "json" });
        console.timeEnd('loadTracks');
    } catch (error) {
        console.error(error);
        setState({ ...state, tracks: [], loadingTracks: false });
        return;
    }
    let tracks = parseAllTracks(response.data);
    // filter tracks less than 5 minutes
    tracks = tracks.filter(track => track !== undefined && track.duration() > 5);
    console.time('dbscanTracks');
    const trackGroups = dbscanTracks(tracks);
    trackGroups.forEach(group => group.initializeTrackGroupEntity(cesiumMap));
    console.timeEnd('dbscanTracks');
    cesiumMap.zoomToTracks(tracks);
    initializeTracks(tracks);
    setState({ ...state, tracks: tracks, trackGroups: trackGroups, loadingTracks: false });
};

const parseAllTracks = tracks => {
    console.time('parseAllTracks');
    const parsedTracks = tracks.map((trackjson) => {
        return parseTrackJson(trackjson);
    });
    console.timeEnd('parseAllTracks');
    return parsedTracks;
};

const initializeTracks = tracks => {
    console.time('initializeTracks');
    tracks.forEach((track) => {
        track.initializeTrackEntity(cesiumMap, media);
    });
    console.timeEnd('initializeTracks');
};

const handleTrackClick = (state, trackid) => {
    console.debug('handleTrackClick');
    const copy_tracks = [...state['tracks']];
    const index = copy_tracks.findIndex(track => track.id === trackid)
    const target_track = copy_tracks[index];
    const show = !target_track.isShowingTrackLine();
    target_track.showTrackLine(show);
    setState({ ...state, tracks: copy_tracks });
    if (show) {
        cesiumMap.zoomToTracks([target_track]);
    }
};

const handleDateChange = (state, setState, newDate) => {
    console.debug('handleDateChange');
    cesiumMap.removeAllEntities();
    const date = dayjs(newDate);
    loadTracks({ ...state, date: date }, setState);
}

const handleTrackPointClick = (entityId) => {
    const track = state.tracks.find(track => track.id === entityId.trackid);
    if (!track.isShowingTrackLine()) {
        handleTrackClick(state, track.id);
    }
    setTimeout(() => scrollToTrack(track.id), 100);
}

const handleTrackGroupClick = (entityId) => {
    const group = state['trackGroups'].find(group => group.groupid === entityId.groupid);
    cesiumMap.zoomToTrackGroup(group);
}

const judgeMedia = () => {
    const clientWidth = document.documentElement.clientWidth;
    if (clientWidth <= 752) {
        return { isMobile: true, isTablet: false, isPc: false };
    } else if (clientWidth <= 1122) {
        return { isMobile: false, isTablet: true, isPc: false };
    }
    return { isMobile: false, isTablet: false, isPc: true };
}

const World = () => {
    media = judgeMedia();
    const defaultControlPanelSize = media.isPc ?
        document.documentElement.clientWidth * 0.4 : document.documentElement.clientWidth * 0.85;

    [state, setState] = React.useState({
        tracks: [],
        trackGroups: [],
        filteredTracks: [],
        date: dayjs(),
        controlPanelSize: defaultControlPanelSize,
        prevControlPanelSize: defaultControlPanelSize,
        loadingTracks: false,
    });

    React.useEffect(() => {
        loadTracks(state, setState);
    }, []);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div id='main'>
                <CesiumMapContainer
                    onTrackPointClick={handleTrackPointClick}
                    onTrackGroupClick={handleTrackGroupClick}
                    tracks={state['tracks']}
                    trackGroups={state['trackGroups']} />
                <ControlPanel
                    date={state['date']}
                    onDateChange={(newDate) => handleDateChange(state, setState, newDate)}
                    tracks={state['tracks']}
                    onTrackClicked={(trackid) => { handleTrackClick(state, trackid) }}
                    controlPanelSize={state.controlPanelSize}
                    loadingTracks={state.loadingTracks} />
                <Dragger
                    controlPanelSize={state.controlPanelSize}
                    setControlPanelSize={(width) => setState({ ...state, controlPanelSize: width })} />
                <ControlPanelToggle
                    state={state}
                    setState={setState} />
                <MessageDialog />
            </div>
        </LocalizationProvider >
    );
};

export default World;