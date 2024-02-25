import { describe, it, expect } from 'vitest';
import { TrackPlaybackStats } from './trackplaybackstats';
import dayjs from 'dayjs';

describe('TrackPlaybackStats', () => {
    it('calculates average altitude correctly', () => {
        const mockTrack = {
            path: {
                times: [dayjs('2020-01-01T00:00:00Z'), dayjs('2020-01-01T00:02:00Z'), dayjs('2020-01-01T00:03:00Z')],
                points: [[138.730, 35.360, 3776], [138.731, 35.361, 3778], [138.731, 35.361, 3780]],
                altitudes: () => [3776, 3778, 3780]
            }
        };

        const stats = new TrackPlaybackStats(mockTrack);
        const starttime = dayjs('2020-01-01T00:00:00Z');
        const endtime = dayjs('2020-01-01T00:02:59Z');

        const averageAltitude = stats.getAverageAltitude(starttime, endtime);

        expect(averageAltitude).toBe(3778);
    });
    it('calculates average altitude before first entry', () => {
        const mockTrack = {
            path: {
                times: [dayjs('2020-01-01T00:00:00Z'), dayjs('2020-01-01T00:02:00Z'), dayjs('2020-01-01T00:03:00Z')],
            }
        };

        const stats = new TrackPlaybackStats(mockTrack);
        const starttime = dayjs('2020-12-31T23:59:00Z');
        const endtime = dayjs('2020-01-01T00:03:00Z');

        const averageAltitude = stats.getAverageAltitude(starttime, endtime);

        expect(averageAltitude).toBe(undefined);
    });
    it('calculates average altitude after last entry', () => {
        const mockTrack = {
            path: {
                times: [dayjs('2020-01-01T00:00:00Z'), dayjs('2020-01-01T00:02:00Z'), dayjs('2020-01-01T00:03:00Z')],
                altitudes: () => [3776, 3778, 3780]
            }
        };

        const stats = new TrackPlaybackStats(mockTrack);
        const starttime = dayjs('2020-01-01T00:00:00Z');
        const endtime = dayjs('2020-01-01T00:04:00Z');

        const averageAltitude = stats.getAverageAltitude(starttime, endtime);

        expect(averageAltitude).toBe(3778);
    });

    it('calculates average speed correctly', () => {
        const mockTrack = {
            path: {
                times: [dayjs('2020-01-01T00:00:00Z'), dayjs('2020-01-01T00:02:00Z'), dayjs('2020-01-01T00:03:00Z')],
                points: [[138.730, 35.360, 3776], [138.731, 35.361, 3778], [138.732, 35.362, 3780]],
                altitudes: () => [3776, 3778, 3780]
            }
        };

        const stats = new TrackPlaybackStats(mockTrack);
        const starttime = dayjs('2020-01-01T00:00:00Z');
        const endtime = dayjs('2020-01-01T00:02:59Z');

        const averageAltitude = stats.getAverageSpeed(starttime, endtime);

        expect(averageAltitude).toBe(5.736820324230934);
    });

    it('calculates average gain correctly', () => {
        const mockTrack = {
            path: {
                times: [dayjs('2020-01-01T00:00:00Z'), dayjs('2020-01-01T00:02:00Z'), dayjs('2020-01-01T00:03:00Z')],
                points: [[138.730, 35.360, 3776], [138.731, 35.361, 3778], [138.732, 35.362, 3780]],
                altitudes: () => [3776, 3778, 3780]
            }
        };

        const stats = new TrackPlaybackStats(mockTrack);
        const starttime = dayjs('2020-01-01T00:00:00Z');
        const endtime = dayjs('2020-01-01T00:02:30Z');

        const average = stats.getAverageGain(starttime, endtime);

        expect(average).toBe(0.022222222222222223);
    });

    it('calculates average glide ratio correctly', () => {
        const mockTrack = {
            path: {
                times: [dayjs('2020-01-01T00:00:00Z'), dayjs('2020-01-01T00:02:00Z'), dayjs('2020-01-01T00:03:00Z')],
                points: [[138.730, 35.360, 3776], [138.731, 35.361, 3778], [138.732, 35.362, 3780]],
                altitudes: () => [3776, 3778, 3780]
            }
        };

        const stats = new TrackPlaybackStats(mockTrack);
        const starttime = dayjs('2020-01-01T00:00:00Z');
        const endtime = dayjs('2020-01-01T00:02:30Z');

        const average = stats.getAverageGlideRatio(starttime, endtime);

        expect(average).toBe(-71.71025405288668);
    });

    it('calculates distance correctly', () => {
        const mockTrack = {
            path: {
                times: [dayjs('2020-01-01T00:00:00Z'), dayjs('2020-01-01T00:02:00Z'), dayjs('2020-01-01T00:03:00Z')],
                points: [[138.730, 35.360, 3776], [138.731, 35.371, 3778], [138.732, 35.362, 3780]],
                altitudes: () => [3776, 3778, 3780]
            }
        };

        const stats = new TrackPlaybackStats(mockTrack);
        const endtime = dayjs('2020-01-01T00:02:30Z');

        const distance = stats.getDistance(endtime);

        expect(distance).toBe(0.28684101621154673);
    });

    it('calculates total distance correctly', () => {
        const mockTrack = {
            path: {
                times: [dayjs('2020-01-01T00:00:00Z'), dayjs('2020-01-01T00:02:00Z'), dayjs('2020-01-01T00:03:00Z')],
                points: [[138.730, 35.360, 3776], [138.731, 35.371, 3778], [138.732, 35.362, 3780]],
                altitudes: () => [3776, 3778, 3780]
            }
        };

        const stats = new TrackPlaybackStats(mockTrack);
        const endtime = dayjs('2020-01-01T00:02:30Z');

        const distance = stats.getTotalDistance(endtime);

        expect(distance).toBe(2.2264520044959695);
    });
});
