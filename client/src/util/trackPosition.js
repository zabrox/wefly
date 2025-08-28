import * as Cesium from 'cesium';

export const TRACK_ALTITUDE_OFFSET_M = 35;

// Accepts [lon, lat, alt]
export const withTrackOffset = (point) => {
  const lon = point[0];
  const lat = point[1];
  const alt = (point[2] ?? 0) + TRACK_ALTITUDE_OFFSET_M;
  return [lon, lat, alt];
};

export const toRenderCartesian = (point) => {
  const [lon, lat, alt] = withTrackOffset(point);
  return Cesium.Cartesian3.fromDegrees(lon, lat, alt);
};

export const toRenderCartesians = (points) => {
  return points.map((p) => toRenderCartesian(p));
};
