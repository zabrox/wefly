import * as Cesium from "cesium";
import * as CesiumMap from '../../../cesiummap.jsx';
import { TrackPoint } from "../trackpoint.jsx";

const SHOW_DISTANCE = 200000;
let clickHandler = undefined;

const takeoffId = (takeoff) => {
    return `takeoff-${takeoff.name}-${takeoff.longitude}-${takeoff.latitude}`
}
const landingId = (landing) => {
    return `landing-${landing.name}-${landing.longitude}-${landing.latitude}`
}

const displayTakeoff = (takeoff) => {
    const id = takeoffId(takeoff);

    if (CesiumMap.viewer.entities.getById(id)) {
        return;
    }

    CesiumMap.viewer.entities.add({
        id: id,
        type: 'takeoff',
        name: takeoff.name,
        permanent: true,
        position: Cesium.Cartesian3.fromDegrees(takeoff.longitude, takeoff.latitude, takeoff.altitude),
        billboard: {
            image: new Cesium.PinBuilder().fromMakiIconId("airport", Cesium.Color.CYAN, 48),
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            pixcelOffset: new Cesium.Cartesian2(0, -20),
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            scaleByDistance: new Cesium.NearFarScalar(100, 1.5, 10000, 0.3),
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, SHOW_DISTANCE),
            fillColor: Cesium.Color.WHITE,
        },
    });
};

const displayLanding = (landing) => {
    const id = landingId(landing);

    if (CesiumMap.viewer.entities.getById(id)) {
        return;
    }

    CesiumMap.viewer.entities.add({
        id: id,
        type: 'landing',
        name: landing.name,
        permanent: true,
        position: Cesium.Cartesian3.fromDegrees(landing.longitude, landing.latitude, landing.altitude),
        billboard: {
            image: new Cesium.PinBuilder().fromMakiIconId("airport", Cesium.Color.RED, 48),
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            pixcelOffset: new Cesium.Cartesian2(0, -20),
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            scaleByDistance: new Cesium.NearFarScalar(100, 1.5, 10000, 0.3),
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, SHOW_DISTANCE),
            fillColor: Cesium.Color.WHITE,
        },
    });
};

const registerEventHandlerOnTakeoffLandingClick = (scatterState, setScatterState) => {
    if (clickHandler !== undefined) {
        clickHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }
    clickHandler = new Cesium.ScreenSpaceEventHandler(CesiumMap.viewer.scene.canvas);
    clickHandler.setInputAction((clickEvent) => {
        const pickedObject = CesiumMap.viewer.scene.pick(clickEvent.position);
        if (Cesium.defined(pickedObject) && pickedObject.id) {
            const entity = pickedObject.id;
            let takeoffLanding;
            if (entity.type === 'takeoff') {
                takeoffLanding = scatterState.takeoffs.find(takeoff => takeoff.name === entity.name);
            } else if (entity.type === 'landing') {
                takeoffLanding = scatterState.landings.find(landing => landing.name === entity.name);
            } else {
                return;
            }
            setScatterState(state => ({
                ...state,
                selectedTakeoffLanding: takeoffLanding,
                selectedTrackPoint: new TrackPoint(),
            }));
        }
        CesiumMap.viewer.selectedEntity = undefined;
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
};

const displayTakeoffLandingPins = async (takeoffs, landings) => {
    console.log(`displayTakeoffLandingPins`);
    takeoffs.forEach(takeoff => {
        displayTakeoff(takeoff)
    });
    landings.forEach(landing => {
        displayLanding(landing);
    });
};

export { displayTakeoffLandingPins, registerEventHandlerOnTakeoffLandingClick };
