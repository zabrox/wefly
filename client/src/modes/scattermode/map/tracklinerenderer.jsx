import * as Cesium from 'cesium';
import * as CesiumMap from "../../../cesiummap";
import { trackColor } from '../../../util/trackcolor';

const entities = [];
let clickHandler = undefined;

const tracklineEntitiyId = (track) => {
    return `trackline-${track.getId()}`;
}
const tracklineMarginEntitiyId = (track) => {
    return `tracklinemargin-${track.getId()}`;
}

const addTrackLineEntity = (track, color, cartesians) => {
    return CesiumMap.viewer.entities.add({
        id: tracklineEntitiyId(track),
        type: 'trackline',
        trackid: track.getId(),
        polyline: {
            positions: cartesians,
            width: 2,
            material: new Cesium.PolylineOutlineMaterialProperty({
                color: color.brighten(0.5, new Cesium.Color()),
                outlineColor: color,
                outlineWidth: 2,
            }),
        },
        show: false,
    })
};

const addTrackLineMarginEntity = (track, color, cartesians) => {
    return CesiumMap.viewer.entities.add({
        id: tracklineMarginEntitiyId(track),
        type: 'trackline',
        trackid: track.getId(),
        polyline: {
            positions: cartesians,
            width: 20,
            material: color.withAlpha(0.01),
        },
        show: false,
    })
};

const initializeTrackLineEntity = (track) => {
    const color = trackColor(track);
    const cartesians = track.path.points.map((point) => Cesium.Cartesian3.fromDegrees(...point));
    entities.push(addTrackLineEntity(track, color, cartesians));
    entities.push(addTrackLineMarginEntity(track, color, cartesians));
};

const needToShowTrackLine = (track, selectedTracks, selectedTrackGroups) => {
    return selectedTrackGroups.containsTrack(track) && selectedTracks.has(track.getId());
}

export const renderTrackLine = (track, selectedTracks, selectedTrackGroups) => {
    let lineEntity = CesiumMap.viewer.entities.getById(tracklineEntitiyId(track));
    if (lineEntity === undefined) {
        initializeTrackLineEntity(track);
        lineEntity = CesiumMap.viewer.entities.getById(tracklineEntitiyId(track));
    }
    const tracklineShow = needToShowTrackLine(track, selectedTracks, selectedTrackGroups);
    if (lineEntity.show != tracklineShow) {
        lineEntity.show = tracklineShow;
        const marginEntity = CesiumMap.viewer.entities.getById(tracklineMarginEntitiyId(track));
        marginEntity.show = tracklineShow;
    }
}

const trackLineClick = (entityId, tracks, clickPosition, handleTrackPointClick) => {
    const clickCartesian = CesiumMap.viewer.scene.pickPosition(clickPosition);
    const track = tracks.find(track => track.getId() === entityId.trackid);
    let minimumDistance = 100000;
    let index = 0;
    track.path.points.forEach((point, i) => {
        const distance = Cesium.Cartesian3.distance(Cesium.Cartesian3.fromDegrees(...point), clickCartesian);
        if (distance < minimumDistance) {
            minimumDistance = distance;
            index = i;
        }
    })
    handleTrackPointClick(entityId.trackid, index);
}

export const registerEventHandlerOnTrackLineClick = (handleTrackPointClick, tracks) => {
    if (tracks.length === 0) {
        return;
    }
    // Event handler for clicking on track points
    if (clickHandler !== undefined) {
        clickHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }
    clickHandler = new Cesium.ScreenSpaceEventHandler(CesiumMap.viewer.scene.canvas);
    clickHandler.setInputAction((click) => {
        const pickedObject = CesiumMap.viewer.scene.pick(click.position);
        if (!Cesium.defined(pickedObject) || !Cesium.defined(pickedObject.id)) {
            return;
        }
        const entityId = pickedObject.id;
        if (!(entityId instanceof Cesium.Entity) || entityId.type !== 'trackline') {
            return;
        }
        trackLineClick(entityId, tracks, click.position, handleTrackPointClick);
        CesiumMap.viewer.selectedEntity = undefined;
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}


export const removeTrackLineEntities = () => {
    entities.forEach((entity) => CesiumMap.viewer.entities.remove(entity));
}
