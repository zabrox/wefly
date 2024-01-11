import React from "react";
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
import { Filter } from './trackfilter';
import { stopPlayback } from './playbacker';
import { PLAYBACK_MODE, SCATTER_MODE } from './mode';
import "./world.css";

let state = undefined;
let setState = undefined;
let media = undefined;

const loadTracks = async (state, setState) => {
    setState({ ...state, tracks: [], loadingTracks: true });
    const date = state.date;
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
    console.timeEnd('dbscanTracks');
    cesiumMap.onTrackLoad(tracks, trackGroups, state.filter);
    setState({ ...state, tracks: tracks, trackGroups: trackGroups, loadingTracks: false, mode: SCATTER_MODE });
};

const parseAllTracks = tracks => {
    console.time('parseAllTracks');
    const parsedTracks = tracks.map((trackjson) => {
        return parseTrackJson(trackjson);
    });
    console.timeEnd('parseAllTracks');
    return parsedTracks;
};

const handleTrackClick = (state, trackid) => {
    console.debug('handleTrackClick');
    const copy_tracks = [...state.tracks];
    const index = copy_tracks.findIndex(track => track.id === trackid)
    const target_track = copy_tracks[index];
    const select = !target_track.isSelected();
    target_track.select(select);
    setState({ ...state, tracks: copy_tracks });
    if (select) {
        cesiumMap.zoomToTracks([target_track]);
    }
};

const handleDateChange = (state, setState, newDate) => {
    console.debug('handleDateChange');
    stopPlayback((mode) => setState({ ...state, mode: mode }));
    cesiumMap.removeAllEntities();
    const date = dayjs(newDate);
    loadTracks({ ...state, date: date }, setState);
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
        date: dayjs(),
        controlPanelSize: defaultControlPanelSize,
        loadingTracks: false,
        filter: new Filter(),
        mode: SCATTER_MODE,
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
                    tracks={state.tracks}
                    trackGroups={state.trackGroups}
                    setState={setState}
                    filter={state.filter}
                    mode={state.mode} />
                <ControlPanel
                    date={state.date}
                    onDateChange={(newDate) => handleDateChange(state, setState, newDate)}
                    tracks={state.tracks}
                    onTrackClicked={(trackid) => { handleTrackClick(state, trackid) }}
                    controlPanelSize={state.controlPanelSize}
                    loadingTracks={state.loadingTracks}
                    filter={state.filter}
                    setFilter={(filter) => setState({ ...state, filter: filter })}
                    mode={state.mode}
                    setMode={(mode) => setState({ ...state, mode: mode })} />
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