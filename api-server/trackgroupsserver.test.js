const dayjs = require('dayjs');
const request = require('supertest');
const { Track } = require('./common/track');
const { Metadata } = require('./common/metadata');
const { Path } = require('./common/path');

const mockMetadataFetch = jest.fn();
jest.mock('./metadataperpetuator.js', () => {
    return {
        MetadataPerpetuator: jest.fn(() => ({
            fetch: mockMetadataFetch,
        })),
    };
});
const { app } = require('./server');

describe('GET /api/trackgroups', () => {
    it.only('should respond with status code 200', async () => {
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
                startPosition: [139.13396666666668, 35.360933333333335, 509],
                startTime: dayjs("2024-01-01T00:00:00.000Z"),
                getId: () => "pilot6_20240101000000",
            },
        ];
        mockMetadataFetch.mockResolvedValue(metadatas);
        const response = await request(app)
            .get('/api/trackgroups')
            .query({ date: '2024-01-01' })
            .expect(200);

        expect(mockMetadataFetch.mock.calls.length).toBe(1);
        expect(response.body).toEqual([
            {
                groupid: 0,
                position: [138.5467, 35.373066666666666, 1016],
                trackIds: [
                    'pilot1_20240101000000',
                    'pilot3_20240101000000',
                    'pilot4_20240101000000'
                ]
            },
            {
                groupid: 1,
                position: [139.03493333333333, 35.104616666666665, 648],
                trackIds: ['pilot2_20240101000000', 'pilot5_20240101000000']
            },
            {
                groupid: 2,
                position: [139.13396666666668, 35.360933333333335, 509],
                trackIds: ['pilot6_20240101000000']
            }
        ]);
    });
});
