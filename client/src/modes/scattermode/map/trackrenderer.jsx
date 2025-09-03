import { renderTrackLine, removeTrackLineEntities, registerEventHandlerOnTrackLineClick } from "./tracklinerenderer";
import { renderTrackPoints, removeTrackPointEntities, registerEventHandlerOnTrackPointClick } from "./trackpointrenderer";
import { renderTrackPointPin, removeTrackPointPinEntities } from "./trackpointpinrenderer";

export const renderTracks = (tracks, selectedTracks, selectedTrackGroups, selectedTrackPoint, isTrackPointVisible) => {
    const tracksWithPath = tracks.filter(track => track.path.points.length > 0);
    if (tracksWithPath.length === 0) {
        return;
    }
    tracksWithPath.forEach(track => {
        renderTrackPoints(track, selectedTracks, selectedTrackGroups, isTrackPointVisible);
        renderTrackLine(track, selectedTracks, selectedTrackGroups);
        renderTrackPointPin(selectedTrackPoint);
    });
}

export const registerEventHandlerOnTrackClick = (handleTrackPointClick, tracks) => {
    registerEventHandlerOnTrackLineClick(handleTrackPointClick, tracks);
    registerEventHandlerOnTrackPointClick(handleTrackPointClick, tracks);
}

export const removeTrackEntities = () => {
    removeTrackLineEntities();
    removeTrackPointEntities();
    removeTrackPointPinEntities();
}
