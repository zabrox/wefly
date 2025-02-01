const { parseTracks } = require('./trackParser');
const { TrackPageParser } = require('./trackPageParser');
const { IGCParser } = require('./igcParser');
const { uploadTrack } = require('./trackUploader');
const { AreaFinder } = require('./areaFinder');
const { Track } = require('./entity/track');

jest.mock('./trackPageParser');
jest.mock('./igcParser');
jest.mock('./trackUploader');
jest.mock('./areaFinder');

describe('parseTracks', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should parse and upload tracks successfully', async () => {
        const date = '2023-10-10';
        const livetrackTrack = { pilotname: 'testPilot', liveTrackId: '12345', getTrackId: () => 'testPilot_12345' };
        const livetrackTracks = [livetrackTrack];

        const trackPageData = {
            pilotname: 'testPilot',
            distance: 123.45,
            activity: 'Paraglider',
            model: 'ModelName'
        };
        const path = {
            points: [[37.7749, -122.4194, 0], [37.7750, -122.4193, 100]],
            duration: jest.fn().mockReturnValue(60),
            maxAltitude: jest.fn().mockReturnValue(1000),
            maxGain: jest.fn().mockReturnValue(1000),
            startTime: jest.fn().mockReturnValue('2023-10-10T00:00:00Z'),
            endTime: jest.fn().mockReturnValue('2023-10-10T01:00:00Z')
        };
        const area = { areaName: 'Asagiri' };

        TrackPageParser.mockImplementation(() => ({
            parseTrackPage: jest.fn().mockResolvedValue(trackPageData)
        }));
        IGCParser.mockImplementation(() => ({
            parseIGC: jest.fn().mockResolvedValue(path)
        }));
        AreaFinder.mockImplementation(() => ({
            findArea: jest.fn().mockResolvedValue(area)
        }));

        await parseTracks(date, livetrackTracks);

        expect(TrackPageParser).toHaveBeenCalledWith(date, livetrackTrack);
        expect(IGCParser).toHaveBeenCalledWith(date, livetrackTrack);
        expect(AreaFinder).toHaveBeenCalled();
        expect(uploadTrack).toHaveBeenCalledWith(expect.any(Track));
    });

    it('should handle track page data not found', async () => {
        const date = '2023-10-10';
        const livetrackTrack = { pilotname: 'testPilot', liveTrackId: '12345', getTrackId: () => 'testPilot_12345' };
        const livetrackTracks = [livetrackTrack];

        TrackPageParser.mockImplementation(() => ({
            parseTrackPage: jest.fn().mockResolvedValue(undefined)
        }));

        await parseTracks(date, livetrackTracks);

        expect(TrackPageParser).toHaveBeenCalledWith(date, livetrackTrack);
        expect(IGCParser).not.toHaveBeenCalled();
        expect(AreaFinder).not.toHaveBeenCalled();
        expect(uploadTrack).not.toHaveBeenCalled();
    });

    it('should handle error during track parsing', async () => {
        const date = '2023-10-10';
        const livetrackTrack = { pilotname: 'testPilot', liveTrackId: '12345', getTrackId: () => 'testPilot_12345' };
        const livetrackTracks = [livetrackTrack];

        TrackPageParser.mockImplementation(() => ({
            parseTrackPage: jest.fn().mockRejectedValue(new Error('Parsing error'))
        }));

        console.error = jest.fn();

        await parseTracks(date, livetrackTracks);

        expect(TrackPageParser).toHaveBeenCalledWith(date, livetrackTrack);
        expect(console.error).toHaveBeenCalledWith('Failed to parse track page: Parsing error');
        expect(IGCParser).not.toHaveBeenCalled();
        expect(AreaFinder).not.toHaveBeenCalled();
        expect(uploadTrack).not.toHaveBeenCalled();
    });
});
