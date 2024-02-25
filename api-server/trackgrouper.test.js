const dayjs = require('dayjs');
const { Metadata } = require('./common/metadata.js');
const { groupTracks } = require('./trackgrouper.js');
const { TrackGroup } = require('./common/trackgroup.js');

describe('groupTracks', () => {
    it('should group tracks based on start positions', () => {
        const metadatas = [
            {
                pilotname: "pilot1",
                startPosition: [138.5467, 35.373066666666666, 1016],
                startTime: dayjs("2024-01-01T00:00:00.000Z"),
                getId: () => "pilot1_20240101000000",
            },
            {
                pilotname: "pilot2",
                startPosition: [139.03493333333333, 35.104616666666665, 648],
                startTime: dayjs("2024-01-01T00:00:00.000Z"),
                getId: () => "pilot2_20240101000000",
            },
            {
                pilotname: "pilot3",
                startPosition: [138.5469, 35.3736, 1050],
                startTime: dayjs("2024-01-01T00:00:00.000Z"),
                getId: () => "pilot3_20240101000000",
            },
            {
                pilotname: "pilot4",
                startPosition: [138.5468, 35.37361666666666, 1054],
                startTime: dayjs("2024-01-01T00:00:00.000Z"),
                getId: () => "pilot4_20240101000000",
            },
            {
                pilotname: "pilot5",
                startPosition: [139.0351, 35.10471666666667, 644],
                startTime: dayjs("2024-01-01T00:00:00.000Z"),
                getId: () => "pilot5_20240101000000",
            },
            {
                pilotname: "pilot6",
                startPosition: [139.13396666666668,35.360933333333335,509],
                startTime: dayjs("2024-01-01T00:00:00.000Z"),
                getId: () => "pilot6_20240101000000",
            },
        ];

        const expectedGroups = [
        ];

        const groups = groupTracks(metadatas);

        expect(groups[0].trackIds).toEqual(["pilot1_20240101000000", "pilot3_20240101000000", "pilot4_20240101000000"]);
        expect(groups[1].trackIds).toEqual(["pilot2_20240101000000", "pilot5_20240101000000"]);
        expect(groups[2].trackIds).toEqual(["pilot6_20240101000000"]);
    });

    it('should handle empty input', () => {
        const metadatas = [];

        const groups = groupTracks(metadatas);

        expect(groups).toEqual([]);
    });

    // Add more test cases as needed
});