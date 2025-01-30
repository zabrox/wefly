const dayjs = require('dayjs');

const mockQuery = jest.fn();

const mockGetQueryResults = jest.fn().mockResolvedValue([{
    empty: false,
    map: jest.fn().mockReturnValue([{ pilotname: 'John Doe' }])
}]);
const mockCreateQueryJob = jest.fn();
jest.mock('@google-cloud/bigquery', () => ({
    BigQuery: jest.fn(() => ({
        query: mockQuery,
        createQueryJob: mockCreateQueryJob.mockResolvedValue([{
            getQueryResults: mockGetQueryResults
        }]),
    }))
}));
const { MetadataPerpetuator } = require('./metadataperpetuator.js');

const datasetId = 'wefly';
const tableId = 'metadatas';

describe('MetadataPerpetuator', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('perpetuate should insert track metadata into the database', async () => {

        const track = {
            getId: jest.fn().mockReturnValue('Takase_20240101120000'),
            metadata: {
                pilotname: 'Takase',
                distance: 100,
                duration: 60,
                maxAltitude: 1000,
                maxGain: 1000,
                startTime: dayjs('2024-01-01 12:00:00'),
                lastTime: dayjs('2024-01-01 13:34:56'),
                startPosition: [37.7749, -122.4194, 0],
                lastPosition: [37.7750, -122.4193, 100],
                activity: 'Paraglider',
                model: 'Kangri',
                area: 'Asagiri',
                dataSource: 'https://example.com'
            }
        };

        await (new MetadataPerpetuator).perpetuate(track);

        expect(mockQuery.mock.calls[0][0].replaceAll(/\s+/g, ' ')).toStrictEqual(
            `MERGE INTO wefly.metadatas AS t
                USING (SELECT 100 AS distance, 60 AS duration,
                1000 AS maxAltitude, 1000 AS maxGain,
                DATETIME('2024-01-01 13:34:56') AS lastTime, 37.775 AS lastLongitude,
                -122.4193 AS lastLatitude, 100 AS lastAltitude) AS s
                ON t.id = 'Takase_20240101120000'
                WHEN MATCHED THEN
                UPDATE SET distance = s.distance, duration = s.duration, maxAltitude = s.maxAltitude, maxGain = s.maxGain,
                    lastTime = s.lastTime, lastLongitude = s.lastLongitude, lastLatitude = s.lastLatitude, lastAltitude = s.lastAltitude
                WHEN NOT MATCHED THEN
                INSERT ( id, pilotname, distance, duration, maxAltitude, maxGain, startTime, lastTime,
                    startLongitude, startLatitude, startAltitude,
                    lastLongitude, lastLatitude, lastAltitude, activity, model, area, dataSource)
                    VALUES ('Takase_20240101120000', 'Takase', 100, 60, 1000, 1000, DATETIME('2024-01-01 12:00:00'),
                    DATETIME('2024-01-01 13:34:56'), 37.7749, -122.4194, 0, 37.775, -122.4193, 100,
                    'Paraglider', 'Kangri', 'Asagiri', 'https://example.com')`.replaceAll(/\s+/g, ' ')
        );
    });

    test('fetch should return metadata based on search condition', async () => {
        const searchCondition = {
            fromDate: dayjs('2024-01-01 12:00:00'),
            toDate: dayjs('2024-01-31 12:00:00'),
            pilotname: 'John Doe',
            maxAltitude: 1000,
            distance: 100,
            duration: 60,
            bounds: [[139.95498077133317, 36.04253346930107], [140.45498077133317, 36.54253346930107]],
            activities: ['Paraglider', 'Hangglider'],
        };

        const result = await (new MetadataPerpetuator).fetch(searchCondition);

        expect(mockCreateQueryJob.mock.calls[0][0].query.replaceAll(/\s+/g, ' ')).toStrictEqual(
            `SELECT * FROM \`${datasetId}.${tableId}\` WHERE
            startTime >= '2024-01-01 12:00:00' AND startTime <= '2024-01-31 12:00:00' AND pilotname = 'John Doe' AND maxAltitude >= 1000 AND distance >= 100 AND duration >= 60 
            AND startLongitude >= 139.95498077133317 AND startLongitude <= 140.45498077133317 AND startLatitude >= 36.04253346930107 AND startLatitude <= 36.54253346930107
            AND (activity IN ('Paraglider', 'Flex wing FAI1', 'Rigid wing FAI5')) LIMIT 1000`.replaceAll(/\s+/g, ' ')
        );
        expect(result).toEqual([{ pilotname: 'John Doe' }]);
    });

    test('fetch can query only by from and to date', async () => {
        const searchCondition = {
            fromDate: dayjs('2024-01-01 12:00:00'),
            toDate: dayjs('2024-01-31 12:00:00'),
            bounds: [],
            activities: [],
        };

        const result = await (new MetadataPerpetuator).fetch(searchCondition);

        expect(mockCreateQueryJob.mock.calls[0][0].query.replaceAll(/\s+/g, ' ')).toStrictEqual(
            `SELECT * FROM \`${datasetId}.${tableId}\` WHERE
            startTime >= '2024-01-01 12:00:00' AND startTime <= '2024-01-31 12:00:00' LIMIT 1000`.replaceAll(/\s+/g, ' ')
        );
        expect(result).toEqual([{ pilotname: 'John Doe' }]);
    });

    test('fetch returns empty array when no mathing rows found', async () => {
        mockGetQueryResults.mockResolvedValueOnce([{
            empty: true,
        }]);
        const searchCondition = {
            fromDate: dayjs('2024-01-01 12:00:00'),
            toDate: dayjs('2024-01-31 12:00:00'),
            bounds: [],
            activities: [],
        };

        const result = await (new MetadataPerpetuator).fetch(searchCondition);

        expect(mockCreateQueryJob.mock.calls[0][0].query.replaceAll(/\s+/g, ' ')).toStrictEqual(
            `SELECT * FROM \`${datasetId}.${tableId}\` WHERE
            startTime >= '2024-01-01 12:00:00' AND startTime <= '2024-01-31 12:00:00' LIMIT 1000`.replaceAll(/\s+/g, ' ')
        );
        expect(result).toEqual([]);
    });
});