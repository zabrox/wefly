import { describe, it, expect } from 'vitest';
import { TrackPoint } from './trackpoint';

describe('TrackPoint', () => {
    it('should create a valid TrackPoint instance with track and index', () => {
        const track = { id: 'Takase_20240203120000' };
        const index = 0;
        const trackPoint = new TrackPoint(track, index);

        expect(trackPoint.track).toBe(track);
        expect(trackPoint.index).toBe(index);
        expect(trackPoint.isValid()).toBe(true);
    });

    it('should create a valid TrackPoint instance from another TrackPoint instance', () => {
        const track = { id: 'Takase_20240203120000' };
        const index = 0;
        const originalTrackPoint = new TrackPoint(track, index);
        const trackPoint = new TrackPoint(originalTrackPoint);

        expect(trackPoint.track).toBe(track);
        expect(trackPoint.index).toBe(index);
        expect(trackPoint.isValid()).toBe(true);
    });

    it('should create an invalid TrackPoint instance if track is undefined', () => {
        const index = 0;
        const trackPoint = new TrackPoint(undefined, index);

        expect(trackPoint.track).toBe(undefined);
        expect(trackPoint.index).toBe(index);
        expect(trackPoint.isValid()).toBe(false);
    });
});