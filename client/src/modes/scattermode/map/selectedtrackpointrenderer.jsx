import * as Cesium from "cesium";
import * as CesiumMap from "../../../cesiummap";
import { trackColor } from '../../../util/trackcolor';
import { toRenderCartesian } from '../../../util/trackPosition';

const entities = [];

export const removeSelectedTrackPointEntities = () => {
    entities.forEach((entity) => CesiumMap.viewer.entities.remove(entity));
}

export const renderSelectedTrackPoint = (selectedTrackPoint) => {
    const entity = CesiumMap.viewer.entities.getById('selectedtrackpoint');
    if (entity !== undefined) {
        CesiumMap.viewer.entities.remove(entity);
    }
    if (!selectedTrackPoint.isValid()) {
        return;
    }
    const track = selectedTrackPoint.track;
    const point = track.path.points[selectedTrackPoint.index];
    const cartesian = toRenderCartesian(point);
    entities.push(CesiumMap.viewer.entities.add({
        id: 'selectedtrackpoint',
        type: 'selectedtrackpoint',
        trackid: track.getId(),
        position: cartesian,
        point: {
            pixelSize: 8,
            color: Cesium.Color.WHITE,
            outlineColor: trackColor(track).darken(0.3, new Cesium.Color()),
            outlineWidth: 4,
            scaleByDistance: new Cesium.NearFarScalar(100, 2.5, 100000, 0.5),
        },
    }));
}
