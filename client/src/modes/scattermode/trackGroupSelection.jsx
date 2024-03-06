export class TrackGroupSelection {
    groups = new Set();

    constructor(instance) {
        if (instance) {
            this.groups = new Set(instance.groups);
        }
    }

    add(group) {
        this.groups.add(group);
    }

    has(group) {
        return this.groups.has(group);
    }

    containsTrack(track) {
        if (this.groups.size === 0) {
            return true;
        }
        for(const group of this.groups) {
            if (group.trackIds.includes(track.getId())) {
                return true;
            }
        }
        return false;
    }

    filterTracks(tracks) {
        if (this.groups.size === 0) {
            return tracks;
        }
        return tracks.filter((track) => {
            return this.containsTrack(track);
        });
    }
}