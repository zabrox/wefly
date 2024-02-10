import { Path } from './path';
import dayjs from 'dayjs';

describe('Path', () => {
    let path;

    beforeEach(() => {
        path = new Path();
    });

    it('should add a point to the path', () => {
        path.addPoint(10, 20, 30, new Date());
        expect(path.points.length).toBe(1);
    });

    it('should return the start time of the path', () => {
        const currentTime = dayjs();
        path.addPoint(10, 20, 30, currentTime);
        expect(path.startTime()).toBe(currentTime);
    });

    it('should return undefined for start time when no points are added', () => {
        expect(path.startTime()).toBeUndefined();
    });

    it('should return the end time of the path', () => {
        const d1 = dayjs(new Date('2024-02-08T12:00:00Z'));
        const d2 = dayjs(new Date('2024-02-08T13:00:00Z'));
        path.addPoint(10, 20, 30, d1);
        path.addPoint(40, 50, 60, d2);
        expect(path.endTime()).toBe(d2);
    });

    it('should return undefined for end time when no points are added', () => {
        expect(path.endTime()).toBeUndefined();
    });

    it('should return the duration of the path', () => {
        const d1 = dayjs(new Date('2024-02-08T12:00:00Z'));
        const d2 = dayjs(new Date('2024-02-08T13:00:00Z'));
        path.addPoint(10, 20, 30, d1);
        path.addPoint(40, 50, 60, d2);
        expect(path.duration()).toBe(60);
    });

    it('should return 0 for duration when no points are added', () => {
        expect(path.duration()).toBe(0);
    });

    it('should return the duration string of the path', () => {
        const d1 = dayjs(new Date('2024-02-08T12:00:00Z'));
        const d2 = dayjs(new Date('2024-02-08T13:00:00Z'));
        path.addPoint(10, 20, 30, d1);
        path.addPoint(40, 50, 60, d2);
        expect(path.durationStr()).toMatch(/^1 h 0 m$/);
    });

    it('should return the maximum altitude of the path', () => {
        path.addPoint(10, 20, 30, new Date());
        path.addPoint(40, 50, 60, new Date());
        path.addPoint(70, 80, 90, new Date());
        expect(path.maxAltitude()).toBe(90);
    });
});