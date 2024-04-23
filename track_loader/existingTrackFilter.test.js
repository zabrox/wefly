const dayjs = require('dayjs');
const { filterExistingTracks } = require('./existingTrackFilter');

describe('filterExistingTracks', () => {
    it('should filter out tracks with existing metadata', () => {
        const tracks = [
            { getId: () => 'track1', metadata: { lastTime: dayjs('2022-01-01T12:34:56.000Z') } },
            { getId: () => 'track2', metadata: { lastTime: dayjs('2022-01-01T12:34:57.000Z') } },
            { getId: () => 'track3', metadata: { lastTime: dayjs('2022-01-01T12:34:58.000Z') } },
        ];

        const existingMetadatas = [
            { getId: () => 'track1', trackId: 'track1', lastTime: dayjs('2022-01-01T12:34:55.000Z') },
            { getId: () => 'track3', trackId: 'track3', lastTime: dayjs('2022-01-01T12:34:58.000Z') },
        ];

        const filteredTracks = filterExistingTracks(tracks, existingMetadatas);

        const filteredTrackIds = filteredTracks.map(track => track.getId());
        expect(filteredTrackIds).toEqual(['track1', 'track2']);
    });

    it('should not filter out tracks without existing metadata', () => {
        const tracks = [
            { getId: () => 'track1', metadata: { lastTime: dayjs('2022-01-01T12:34:56.000Z') } },
            { getId: () => 'track2', metadata: { lastTime: dayjs('2022-01-01T12:34:57.000Z') } },
            { getId: () => 'track3', metadata: { lastTime: dayjs('2022-01-01T12:34:58.000Z') } },
        ];

        const existingMetadatas = [
            { getId: () => 'track4', trackId: 'track4', lastTime: dayjs('2022-01-01T12:34:55.000Z') },
            { getId: () => 'track5', trackId: 'track5', lastTime: dayjs('2022-01-01T12:34:59.000Z') },
        ];

        const filteredTracks = filterExistingTracks(tracks, existingMetadatas);

        expect(filteredTracks).toEqual(tracks);
    });
});