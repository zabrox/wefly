import React from "react";
import * as Cesium from "cesium";
import axios from "axios";
import { TrackInfo } from "./trackinfo";
import { ControlPanel } from "./controlpanel";
import { parseIgc } from "./igc";
import "./world.css";

const BASE_URL = "http://localhost:3001/";
let viewer = undefined;

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

const loadTracks = (setTracks) => {
    axios({ method: "get", url: `${BASE_URL}tracks`, responseType: "json" }).then(response => {
        const tracknames = response.data;
        Promise.all(tracknames.map(trackname => {
            return axios.get(`${BASE_URL}tracks/${trackname}`).then(response => {
                return parseIgc(trackname, response.data);
            })
        })).then((tracks) => {
            setTracks(tracks);
            showTracks(tracks);
            zoomToTracks(tracks);
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

const handleChange = (tracks, setTracks, trackid) => {
    const copy_tracks = [...tracks];
    const index = copy_tracks.findIndex(track => track.id === trackid)
    copy_tracks[index].show = !copy_tracks[index].show;
    setTracks(copy_tracks);
    showTracks(copy_tracks);
};

const World = () => {
    const cesiumContainerRef = React.useRef(null);
    const [tracks, setTracks] = React.useState([]);

    React.useEffect(() => {
        initializeCesium(cesiumContainerRef);
        loadTracks(setTracks);

        return () => {
            viewer.destroy();
        };
    }, []);

    return (
        <div ref={cesiumContainerRef} id="world">
            <ControlPanel tracks={tracks} onChange={(trackid) => { handleChange(tracks, setTracks, trackid) }} />
        </div>
    );
};

export default World;