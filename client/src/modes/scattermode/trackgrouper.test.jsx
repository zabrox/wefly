import { describe, it, expect } from 'vitest';
import dayjs from 'dayjs';
import { groupTracks } from './trackgrouper.jsx';

describe('groupTracks', () => {
    it('should group tracks based on start positions', () => {
        const tracks = [
            {
                getId: () => "pilot1_20240101000000",
                metadata: {
                    pilotname: "pilot1",
                    startPosition: [138.5467, 35.373066666666666, 1016],
                    startTime: dayjs("2024-01-01T00:00:00.000Z"),
                    getId: () => "pilot1_20240101000000",
                }
            },
            {
                getId: () => "pilot2_20240101000000",
                metadata: {
                    pilotname: "pilot2",
                    startPosition: [139.03493333333333, 35.104616666666665, 648],
                    startTime: dayjs("2024-01-01T00:00:00.000Z"),
                    getId: () => "pilot2_20240101000000",
                }
            },
            {
                getId: () => "pilot3_20240101000000",
                metadata: {
                    pilotname: "pilot3",
                    startPosition: [138.5469, 35.3736, 1050],
                    startTime: dayjs("2024-01-01T00:00:00.000Z"),
                    getId: () => "pilot3_20240101000000",
                }
            },
            {
                getId: () => "pilot4_20240101000000",
                metadata: {
                    pilotname: "pilot4",
                    startPosition: [138.5468, 35.37361666666666, 1054],
                    startTime: dayjs("2024-01-01T00:00:00.000Z"),
                    getId: () => "pilot4_20240101000000",
                }
            },
            {
                getId: () => "pilot5_20240101000000",
                metadata: {
                    pilotname: "pilot5",
                    startPosition: [139.0351, 35.10471666666667, 644],
                    startTime: dayjs("2024-01-01T00:00:00.000Z"),
                    getId: () => "pilot5_20240101000000",
                }
            },
            {
                getId: () => "pilot6_20240101000000",
                metadata: {
                    pilotname: "pilot6",
                    startPosition: [139.13396666666668, 35.360933333333335, 509],
                    startTime: dayjs("2024-01-01T00:00:00.000Z"),
                    getId: () => "pilot6_20240101000000",
                }
            },
        ];

        const groups = groupTracks(tracks);

        expect(groups[0].trackIds).toEqual(["pilot1_20240101000000", "pilot3_20240101000000", "pilot4_20240101000000"]);
        expect(groups[0].position).toEqual([138.5467, 35.373066666666666, 1016]);
        expect(groups[1].trackIds).toEqual(["pilot2_20240101000000", "pilot5_20240101000000"]);
        expect(groups[1].position).toEqual([139.03493333333333, 35.104616666666665, 648]);
        expect(groups[2].trackIds).toEqual(["pilot6_20240101000000"]);
        expect(groups[2].position).toEqual([139.13396666666668, 35.360933333333335, 509]);
    });

    it('should handle empty input', () => {
        const metadatas = [];

        const groups = groupTracks(metadatas);

        expect(groups).toEqual([]);
    });
});