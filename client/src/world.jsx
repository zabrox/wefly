import React from "react";
import * as Cesium from "cesium";
import axios from "axios";
import { ControlPanel, scrollToTrack } from "./controlpanel";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs';
import { parseTrackJson, dbscanTracks } from "./track";
import "./world.css";

const BASE_URL = "http://localhost:3001/";
let viewer = undefined;
let state = undefined;
let setState = undefined;
let trackGroups = Array();

const initializeCesium = (cesiumContainerRef) => {
    viewer = new Cesium.Viewer(cesiumContainerRef.current, {
        terrain: Cesium.Terrain.fromWorldTerrain(),
        timeline: false,
        animation: false,
        geocoder: false,
        homeButton: false,
        sceneModePicker: false,
        navigationHelpButton: false,
        fullscreenButton: false,
        terrainShadows: Cesium.ShadowMode.DISABLED,
    });
    viewer.scene.globe.depthTestAgainstTerrain = true;
    viewer.fog = new Cesium.Fog({
        enabled: true,
        density: 0.0005,
        minimumBrightness: 1.0,
    });
}

const zoomToTracks = (tracks) => {
    let cartesians = new Array();
    if (tracks.length > 0) {
        tracks.forEach(track => cartesians.push(...track.cartesians));
        viewer.camera.flyToBoundingSphere(Cesium.BoundingSphere.fromPoints(cartesians), { duration: 1 });
    }
}

const loadTracks = (state, setState) => {
    const date = state['date'];
    const tracksurl = `${BASE_URL}tracks/${date.format('YYYY-MM-DD')}/`;
    axios({ method: "get", url: tracksurl, responseType: "json" }).then(response => {
        const tracknames = response.data;
        Promise.all(tracknames.map(trackname => {
            return axios.get(`${tracksurl}${trackname}`).then(response => {
                return parseTrackJson(response.data);
            })
        })).then((tracks) => {
            // filter tracks less than 5 minutes
            tracks = tracks.filter(track => track !== undefined && track.duration() > 5);
            trackGroups = dbscanTracks(tracks);
            trackGroups.forEach(group => group.initializeTrackGroupEntity(viewer));
            setState({ tracks: tracks });
            initializeTracks(tracks);
            zoomToTracks(tracks);
        }).catch(error => {
            console.error(error);
        });
    }).catch(error => {
        console.error(error);
    });
}

const initializeTracks = (tracks) => {
    tracks.forEach(track => {
        track.initializeTrackEntity(viewer);
    });
};

const registerEventHandlerOnPointClick = () => {
    // Event handler for clicking on track points
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction(function (click) {
        const pickedObject = viewer.scene.pick(click.position);
        if (Cesium.defined(pickedObject) && Cesium.defined(pickedObject.id)) {
            const entityId = pickedObject.id;
            if (entityId instanceof Cesium.Entity) {
                if ('trackid' in entityId) {
                    const track = state.tracks.find(track => track.id === entityId.trackid);
                    scrollToTrack(track.id);
                } else if ('groupid' in entityId) {
                    const group = trackGroups.find(group => group.groupid === entityId.groupid);
                    group.zoomToTrackGroup(viewer);
                    viewer.selectedEntity = undefined;
                } else {
                    viewer.selectedEntity = undefined;
                }
            }
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
};

const registerEventListenerOnCameraMove = () => {
    viewer.camera.changed.addEventListener(() => {
        const cameraAltitude = viewer.scene.camera.positionCartographic.height;
        if (cameraAltitude > 70000) {
            trackGroups.forEach(group => group.showTrackGroup(true));
            state['tracks'].forEach(track => {
                track.fadeOut();
            });
        } else {
            trackGroups.forEach(group => group.showTrackGroup(false));
            state['tracks'].forEach(track => {
                track.fadeIn();
            });
        }
    });
}

const handleTrackChecked = (state, setState, trackid) => {
    const copy_tracks = [...state['tracks']];
    const index = copy_tracks.findIndex(track => track.id === trackid)
    const target_track = copy_tracks[index];
    const show = !target_track.isShowingTrackLine();
    target_track.showTrackLine(show);
    setState({ tracks: copy_tracks });
    if (show) {
        zoomToTracks([target_track]);
    }
};

const handleTrackClick = (state, trackid) => {
    const copy_tracks = [...state['tracks']];
    const index = copy_tracks.findIndex(track => track.id === trackid)
    const target_track = copy_tracks[index];
    scrollToTrack(target_track.id);
    zoomToTracks([target_track]);
};

const handleDateChange = (newDate) => {
    const date = dayjs(newDate);
    loadTracks({ date: date }, setState);
}

const World = () => {
    const cesiumContainerRef = React.useRef(null);
    [state, setState] = React.useState({
        tracks: [],
        date: dayjs(),
    });

    React.useEffect(() => {
        initializeCesium(cesiumContainerRef);
        loadTracks(state, setState);
        registerEventHandlerOnPointClick();
        registerEventListenerOnCameraMove();

        return () => {
            viewer.destroy();
        };
    }, []);

    return (
        <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <ControlPanel
                    date={state['date']}
                    onDateChange={(newDate) => handleDateChange(newDate)}
                    tracks={state['tracks']}
                    onTrackChecked={(trackid) => { handleTrackChecked(state, setState, trackid) }}
                    onTrackClicked={(trackid) => { handleTrackClick(state, trackid) }} />
            </LocalizationProvider>
        </div>
    );
};

export default World;