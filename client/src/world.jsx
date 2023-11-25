import React from "react";
import * as Cesium from "cesium";
import axios from "axios";
import { TrackInfo } from "./trackinfo";
import { ControlPanel } from "./controlpanel";
import { parseIgc } from "./igc";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs';
import "./world.css";

const BASE_URL = "http://localhost:3001/";
let viewer = undefined;
let state = undefined;
let setState = undefined;

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
                return parseIgc(trackname, response.data);
            })
        })).then((tracks) => {
            // filter tracks less than 5 minutes
            tracks = tracks.filter(track => track.duration() > 5);
            setState({ tracks: tracks });
            showTracks(tracks);
            zoomToTracks(tracks);
        }).catch(error => {
            console.log(error);
        });
    }).catch(error => {
        console.log(error);
    });
}

const showTracks = (tracks) => {
    viewer.entities.removeAll();
    tracks.forEach(track => {
        let lastPoint = track.times[0];
        track.cartesians.forEach((cartesian, index) => {
            if (track.times[index].diff(lastPoint, 'seconds') < 60) {
                return;
            }
            lastPoint = track.times[index];
            viewer.entities.add({
                position: cartesian,
                point: {
                    pixelSize: 6,
                    color: track.color.withAlpha(0.7),
                    outlineColor: Cesium.Color.BLACK,
                    outlineWidth: 2,
                    scaleByDistance: new Cesium.NearFarScalar(100, 3, 10000, 0.8),
                },
            });
        });
        if (track.show) {
            viewer.entities.add({
                polyline: {
                    positions: track.cartesians,
                    width: 2,
                    material: track.color,
                },
            })
        }
    });
};

const handleTrackChecked = (state, setState, trackid) => {
    const copy_tracks = [...state['tracks']];
    const index = copy_tracks.findIndex(track => track.id === trackid)
    copy_tracks[index].show = !copy_tracks[index].show;
    setState({ tracks: copy_tracks });
    showTracks(copy_tracks);
};

const handleDateChange = (newDate) => {
    console.log(newDate);
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

        return () => {
            viewer.destroy();
        };
    }, []);

    return (
        <div ref={cesiumContainerRef} id="world">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <ControlPanel date={state['date']} onDateChange={(newDate) => handleDateChange(newDate)} tracks={state['tracks']} onTrackChecked={(trackid) => { handleTrackChecked(state, setState, trackid) }} />
            </LocalizationProvider>
        </div>
    );
};

export default World;