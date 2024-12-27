import * as Cesium from "cesium";
import * as CesiumMap from "../../../cesiummap";
import { trackColor } from '../../../util/trackcolor';

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
    const cartesian = Cesium.Cartesian3.fromDegrees(...point);
    entities.push(CesiumMap.viewer.entities.add({
        id: 'selectedtrackpoint',
        type: 'selectedtrackpoint',
        trackid: track.getId(),
        position: cartesian,
        billboard: {
            image: `${import.meta.env.VITE_API_URL}/track/piloticon?pilotname=${track.metadata.pilotname}`,
            width: 50,
            height: 50,
            pixelOffset: new Cesium.Cartesian2(0, -25),
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        },
    }));
}
