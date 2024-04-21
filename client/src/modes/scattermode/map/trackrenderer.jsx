import { renderTrackLine, removeTrackLineEntities, registerEventHandlerOnTrackLineClick } from "./tracklinerenderer";
import { renderTrackPoints, removeTrackPointEntities, registerEventHandlerOnTrackPointClick } from "./trackpointrenderer";
import { renderSelectedTrackPoint, removeSelectedTrackPointEntities } from "./selectedtrackpointrenderer";

export const renderTracks = (tracks, selectedTracks, selectedTrackGroups, selectedTrackPoint) => {
    const tracksWithPath = tracks.filter(track => track.path.points.length > 0);
    if (tracksWithPath.length === 0) {
        return;
    }
    tracksWithPath.forEach(track => {
        renderTrackPoints(track, selectedTracks, selectedTrackGroups);
        renderTrackLine(track, selectedTracks, selectedTrackGroups);
        renderSelectedTrackPoint(selectedTrackPoint);
    });
}

export const registerEventHandlerOnTrackClick = (handleTrackPointClick, tracks) => {
    registerEventHandlerOnTrackLineClick(handleTrackPointClick, tracks);
    registerEventHandlerOnTrackPointClick(handleTrackPointClick, tracks);
}

export const removeTrackEntities = () => {
    removeTrackLineEntities();
    removeTrackPointEntities();
    removeSelectedTrackPointEntities();
}