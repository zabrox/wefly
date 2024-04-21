import * as Cesium from 'cesium';
import * as CesiumMap from "../../../cesiummap";
import { createTrackGroupPin } from './trackgrouppin';

const entities = [];

const trackGroupEntitiyId = (trackGroup) => {
    return `trackgroup-${trackGroup.groupid}`;
}
const initializeTrackGroupEntity = (trackGroups) => {
    const MIN_ICON_SIZE = 30;
    const MAX_ICON_SIZE = 120;
    const COEFFICIENT = (MAX_ICON_SIZE - MIN_ICON_SIZE) / 200;
    trackGroups.forEach(trackGroup => {
        let size = MIN_ICON_SIZE + trackGroup.trackIds.length * COEFFICIENT;
        size = size > MAX_ICON_SIZE ? MAX_ICON_SIZE : size;
        entities.push(CesiumMap.viewer.entities.add({
            id: trackGroupEntitiyId(trackGroup),
            type: 'trackgroup',
            position: Cesium.Cartesian3.fromDegrees(...trackGroup.position),
            groupid: trackGroup.groupid,
            billboard: {
                image: createTrackGroupPin(trackGroup),
                height: size,
                width: size * 3 / 4,
                pixelOffset: new Cesium.Cartesian2(0, -size / 2),
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            },
            show: true,
        }));
    });
}

const needToShowTrackGroups = (trackGroup, selectedTrackGroups) => {
    const distance = Cesium.Cartesian3.distance(CesiumMap.viewer.camera.position, Cesium.Cartesian3.fromDegrees(...trackGroup.position));
    return !(distance < 50000 && selectedTrackGroups.has(trackGroup));
}

export const renderTrackGroups = (trackGroups, selectedTrackGroups) => {
    if (trackGroups.length === 0) {
        return;
    }
    const entity = CesiumMap.viewer.entities.getById(trackGroupEntitiyId(trackGroups[0]));
    if (entity === undefined) {
        initializeTrackGroupEntity(trackGroups);
    }
    trackGroups.forEach(group => {
        const entity = CesiumMap.viewer.entities.getById(trackGroupEntitiyId(group));
        if (entity !== undefined) {
            entity.show = needToShowTrackGroups(group, selectedTrackGroups);
        }
    });
}

export const removeTrackGroupEntities = () => {
    entities.forEach((entity) => CesiumMap.viewer.entities.remove(entity));
}
