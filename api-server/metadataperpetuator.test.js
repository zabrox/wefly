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
                startTime: dayjs('2024-01-01 12:00:00'),
                lastTime: dayjs('2024-01-01 13:34:56'),
                startPosition: [37.7749, -122.4194, 0],
                lastPosition: [37.7750, -122.4193, 100],
                activity: 'Paraglider',
                model: 'Kangri',
                area: 'Asagiri'
            }
        };

        await (new MetadataPerpetuator).perpetuate(track);

        expect(mockQuery.mock.calls[0][0].replaceAll(/\s+/g, ' ')).toStrictEqual(
            `IF NOT EXISTS ( SELECT id FROM \`${datasetId}.${tableId}\` WHERE id = 'Takase_20240101120000' ) THEN 
                INSERT INTO \`${datasetId}.${tableId}\` (
                id, pilotname, distance, duration, maxAltitude, startTime, lastTime,
                startLongitude, startLatitude, startAltitude,
                lastLongitude, lastLatitude, lastAltitude, activity, model, area) VALUES 
                ('Takase_20240101120000', 'Takase', 100, 60, 1000, DATETIME('2024-01-01 12:00:00'), DATETIME('2024-01-01 13:34:56'),
                37.7749, -122.4194, 0,
                37.775, -122.4193, 100,
                'Paraglider', 'Kangri', 'Asagiri'); END IF;`.replaceAll(/\s+/g, ' ')
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
            bounds: [],
            activities: ['Paraglider', 'Hangglider'],
        };

        const result = await (new MetadataPerpetuator).fetch(searchCondition);

        expect(mockCreateQueryJob.mock.calls[0][0].query.replaceAll(/\s+/g, ' ')).toStrictEqual(
            `SELECT * FROM \`${datasetId}.${tableId}\` WHERE
            startTime >= '2024-01-01 12:00:00' AND startTime <= '2024-01-31 12:00:00' AND pilotname = 'John Doe' AND maxAltitude >= 1000 AND distance >= 100 AND duration >= 60 
            AND (activity = 'Paraglider' OR activity = 'Flex wing FAI1' OR activity = 'Rigid wing FAI5') LIMIT 1000`.replaceAll(/\s+/g, ' ')
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