import * as Cesium from 'cesium';
import * as CesiumMap from "../../../cesiummap";
import { trackColor } from '../../../util/trackcolor';

const entities = [];

const tracklineEntitiyId = (track) => {
    return `trackline-${track.getId()}`;
}
const initializeTrackLineEntity = (track) => {
    const color = trackColor(track);
    const cartesians = track.path.points.map((point) => Cesium.Cartesian3.fromDegrees(...point));
    entities.push(CesiumMap.viewer.entities.add({
        id: tracklineEntitiyId(track),
        type: 'trackline',
        trackid: track.getId(),
        polyline: {
            positions: cartesians,
            width: 4,
            material: new Cesium.PolylineOutlineMaterialProperty({
                color: color.brighten(0.5, new Cesium.Color()),
                outlineColor: color,
                outlineWidth: 2,
            }),
        },
        show: false,
    }));
};

const needToShowTrackLine = (track, selectedTracks, selectedTrackGroups) => {
    return selectedTrackGroups.containsTrack(track) && selectedTracks.has(track.getId());
}

export const renderTrackLine = (track, selectedTracks, selectedTrackGroups) => {
    let entity = CesiumMap.viewer.entities.getById(tracklineEntitiyId(track));
    if (entity === undefined) {
        initializeTrackLineEntity(track);
        entity = CesiumMap.viewer.entities.getById(tracklineEntitiyId(track));
    }
    const tracklineShow = needToShowTrackLine(track, selectedTracks, selectedTrackGroups);
    if (entity.show != tracklineShow) {
        entity.show = tracklineShow;
    }
}

export const trackLineClick = (entityId, tracks, clickPosition, handleTrackPointClick) => {
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

export const removeTrackLineEntities = () => {
    entities.forEach((entity) => CesiumMap.viewer.entities.remove(entity));
}
