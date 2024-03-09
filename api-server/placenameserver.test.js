const dayjs = require('dayjs');
const request = require('supertest');
const { Track } = require('./common/track');
const { Metadata } = require('./common/metadata');
const { Path } = require('./common/path');

const mockMetadataPerpetuate = jest.fn();
const mockMetadataFetch = jest.fn();
jest.mock('./metadataperpetuator.js', () => {
    return {
        MetadataPerpetuator: jest.fn(() => ({
            perpetuate: mockMetadataPerpetuate,
            fetch: mockMetadataFetch,
        })),
    };
});
const mockPathPerpetuate = jest.fn();
const mockPathFetch = jest.fn();
jest.mock('./pathperpetuator.js', () => {
    return {
        PathPerpetuator: jest.fn(() => ({
            perpetuate: mockPathPerpetuate,
            fetch: mockPathFetch,
        })),
    };
});
const { app } = require('./server');

describe('POST /api/tracks', () => {
    it('should respond with status code 200', async () => {
        const track = new Track();
        track.metadata = new Metadata();
        track.path = new Path();

        track.metadata.pilotname = 'John Doe';
        track.metadata.startTime = dayjs('2022-01-01T11:34:56.000Z');
        track.metadata.lastTime = dayjs('2022-01-01T12:34:56.000Z');
        track.metadata.startPosition = [37.7749, -122.4194, 0];
        track.metadata.lastPosition = [37.7750, -122.4193, 100];
        track.path.addPoint(37.7749, -122.4194, 0, dayjs('2022-01-01T12:34:56.000Z'));
        track.path.addPoint(37.7750, -122.4193, 100, dayjs('2022-01-01T12:34:57.000Z'));

        const response = await request(app)
            .post('/api/tracks')
            .send(track.serialize())
            .expect(200);

        expect(response.text).toBe(`Path data for JohnDoe_20220101123456 saved successfully.`);
        expect(mockMetadataPerpetuate).toHaveBeenCalledWith(track);
        expect(mockPathPerpetuate).toHaveBeenCalledWith(track);
    });
});

describe('GET /api/tracks/metadata', () => {
    it('should respond with 404 for empty metadata', async () => {
        const metadata1 = new Metadata();
        metadata1.pilotname = 'John Doe';
        metadata1.startTime = dayjs('2022-01-01T11:34:56.000Z');
        metadata1.lastTime = dayjs('2022-01-01T12:34:56.000Z');
        metadata1.startPosition = [37.7749, -122.4194, 0];
        metadata1.lastPosition = [37.7750, -122.4193, 100];
        const metadata2 = new Metadata();
        metadata2.pilotname = 'Takase';
        metadata2.startTime = dayjs('2022-01-01T11:34:56.000Z');
        metadata2.lastTime = dayjs('2022-01-01T12:34:56.000Z');
        metadata2.startPosition = [37.7749, -122.4194, 0];
        metadata2.lastPosition = [37.7750, -122.4193, 100];
        const metadatas = [metadata1, metadata2];

        mockMetadataFetch.mockResolvedValue(metadatas);

        const response = await request(app)
            .get('/api/tracks/metadata')
            .query({ date: '2024-03-08' })
            .expect(200);

        expect(mockMetadataFetch).toHaveBeenCalledWith('2024-03-08');
        expect(Metadata.deserialize(response.body[0])).toEqual(metadata1);
        expect(Metadata.deserialize(response.body[1])).toEqual(metadata2);
    });

    it('should respond with 404 for empty metadata', async () => {
        mockMetadataFetch.mockResolvedValue([]);

        const response = await request(app)
            .get('/api/tracks/metadata')
            .query({ date: '2024-03-08' })
            .expect(404);

        expect(mockMetadataFetch).toHaveBeenCalledWith('2024-03-08');
        expect(response.text).toBe('No tracks found.');
    });
});