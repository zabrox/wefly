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
const { SearchCondition } = require('./searchcondition');

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

        expect(response.text).toBe(`Path data for JohnDoe_20220101113456 saved successfully.`);
        expect(mockMetadataPerpetuate).toHaveBeenCalledWith(track);
        expect(mockPathPerpetuate).toHaveBeenCalledWith(track);
    });
});

describe('GET /api/tracks/metadata', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('should respond with 200 for get metadata', async () => {
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
            .query({
                from: '2024-03-08T00:00:00Z',
                to: '2024-03-08T23:59:59Z',
                pilotname: 'Takase',
                maxAltitude: 1000,
                distance: 100,
                duration: 100,
                bounds: '-122.42000,37.77000,-122.40000,37.78000',
                activities: 'Paraglider,Hangglider',
            })
            .expect(200);

        expect(mockMetadataFetch).toHaveBeenCalledWith(new SearchCondition(
            dayjs("2024-03-08T00:00:00.000Z"),
            dayjs("2024-03-08T23:59:59.000Z"),
            'Takase',
            1000,
            100,
            100,
            [[-122.42, 37.77], [-122.4, 37.78]],
            ["Paraglider", "Hangglider"],
        ));
        expect(Metadata.deserialize(response.body[0])).toEqual(metadata1);
        expect(Metadata.deserialize(response.body[1])).toEqual(metadata2);
    });

    it('should respond with 404 for empty metadata', async () => {
        mockMetadataFetch.mockResolvedValue([]);

        const response = await request(app)
            .get('/api/tracks/metadata')
            .query({
                from: '2024-03-08T00:00:00Z', to: '2024-03-08T23:59:59Z' })
            .expect(404);

        expect(mockMetadataFetch).toHaveBeenCalledWith(new SearchCondition(
            dayjs("2024-03-08T00:00:00.000Z"),
            dayjs("2024-03-08T23:59:59.000Z"),
            undefined,
            NaN,
            NaN,
            NaN,
            [],
            [],
        ));
        expect(response.text).toBe('No tracks found.');
    });
});


describe('GET /api/tracks/paths', () => {
    it('should respond with 200 for valid trackids', async () => {
        const path1 = new Path();
        path1.addPoint(37.7749, -122.4194, 0, dayjs('2022-01-01T12:34:56.000Z'));
        path1.addPoint(37.7750, -122.4193, 100, dayjs('2022-01-01T12:34:57.000Z'));
        const path2 = new Path();
        path2.addPoint(37.7749, -122.4194, 0, dayjs('2022-01-01T12:34:56.000Z'));
        path2.addPoint(37.7750, -122.4193, 100, dayjs('2022-01-01T12:34:57.000Z'));
        const paths = [path1, path2];

        mockPathFetch.mockResolvedValue(paths);

        const response = await request(app)
            .get('/api/tracks/paths')
            .query({ trackids: 'JohnDoe_20220101123456,Takase_20220101123456' })
            .expect(200);

        expect(mockPathFetch).toHaveBeenCalledWith(['JohnDoe_20220101123456', 'Takase_20220101123456']);
        expect(Path.deserialize(response.body[0])).toEqual(path1);
        expect(Path.deserialize(response.body[1])).toEqual(path2);
    });
});
