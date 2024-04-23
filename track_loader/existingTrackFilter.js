
function filterExistingTracks(tracks, existingMetadatas) {
    return tracks.filter(track => {
        const metadata = existingMetadatas.find(metadata => metadata.getId() === track.getId());
        if (!metadata) {
            return true;
        }
        if (metadata.lastTime.isBefore(track.metadata.lastTime)) {
            return true;
        }
        return false;
    });
}

module.exports = { filterExistingTracks };