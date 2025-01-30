const { loadTracks } = require('./trackLoader');
const { TrackListPage } = require('./trackListPage');
const { uploadTrackListPage } = require('./trackListPageUploader');
const { TrackPage } = require('./trackPage');
const { uploadTrackPage } = require('./trackPageUploader');
const { IgcLoader } = require('./igcLoader');
const { uploadIgc } = require('./igcUploader');
const { MetadataLoader } = require('./metadataLoader');

jest.mock('./trackListPage');
jest.mock('./trackListPageUploader');
jest.mock('./trackPage');
jest.mock('./trackPageUploader');
jest.mock('./igcLoader');
jest.mock('./igcUploader');
jest.mock('./metadataLoader');

describe('loadTracks', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should process and upload track list and track pages', async () => {
        const date = '2023-10-10';
        const track = { pilotname: 'testPilot', liveTrackId: '12345', isLive: false, getTrackId: () => 'testPilot_12345' };
        const trackListPage = new TrackListPage(date, 1);
        trackListPage.load = jest.fn().mockResolvedValue();
        trackListPage.getTracks = jest.fn().mockReturnValue([track]);
        const metadataLoader = new MetadataLoader();
        metadataLoader.loadMetadatas = jest.fn().mockResolvedValue([]);
        
        TrackListPage.mockImplementation(() => trackListPage);
        MetadataLoader.mockImplementation(() => metadataLoader);
        
        const trackPage = new TrackPage(track.liveTrackId);
        trackPage.load = jest.fn().mockResolvedValue();
        trackPage.getHtml = jest.fn().mockReturnValue('<html>mockHtmlData</html>');
        
        TrackPage.mockImplementation(() => trackPage);
        
        const igcLoader = new IgcLoader(track.liveTrackId);
        igcLoader.load = jest.fn().mockResolvedValue();
        igcLoader.getIgcData = jest.fn().mockReturnValue('mockIgcData');
        
        IgcLoader.mockImplementation(() => igcLoader);
        
        await loadTracks(date, { force: false });
        
        expect(uploadTrackListPage).toHaveBeenCalledWith(date, trackListPage);
        expect(uploadTrackPage).toHaveBeenCalledWith(date, track, trackPage);
        expect(uploadIgc).toHaveBeenCalledWith(date, track, igcLoader);
    });

    it('should handle no tracks found', async () => {
        const date = '2023-10-10';
        const trackListPage = new TrackListPage(date, 1);
        trackListPage.load = jest.fn().mockResolvedValue();
        trackListPage.getTracks = jest.fn().mockReturnValue([]);
        
        TrackListPage.mockImplementation(() => trackListPage);
        
        console.log = jest.fn();
        
        await loadTracks(date);
        
        expect(console.log).toHaveBeenCalledWith('No tracks found');
    });

    it('should not load tracks already present in metadata', async () => {
        const date = '2023-10-10';
        const track = { pilotname: 'testPilot', liveTrackId: '12345', isLive: false, getTrackId: () => 'testPilot_12345' };
        const trackListPage = new TrackListPage(date, 1);
        trackListPage.load = jest.fn().mockResolvedValue();
        trackListPage.getTracks = jest.fn().mockReturnValue([track]);
        const metadataLoader = new MetadataLoader();
        metadataLoader.loadMetadatas = jest.fn().mockResolvedValue([
            {
                getId: () => 'testPilot_12345',
                lastTime: { isBefore: () => false }
            }
        ]);
        
        TrackListPage.mockImplementation(() => trackListPage);
        MetadataLoader.mockImplementation(() => metadataLoader);
        
        const trackPage = new TrackPage(track.liveTrackId);
        trackPage.load = jest.fn();
        
        TrackPage.mockImplementation(() => trackPage);
        
        const igcLoader = new IgcLoader(track.liveTrackId);
        igcLoader.load = jest.fn();
        
        IgcLoader.mockImplementation(() => igcLoader);
        
        const ret = await loadTracks(date, { force: false });
        
        expect(trackPage.load).toHaveBeenCalled();
        expect(igcLoader.load).not.toHaveBeenCalled();
        expect(ret).toEqual([]);
    });

    it('should load tracks even if already present in metadata on force mode', async () => {
        const date = '2023-10-10';
        const track = { pilotname: 'testPilot', liveTrackId: '12345', isLive: false, getTrackId: () => 'testPilot_12345' };
        const trackListPage = new TrackListPage(date, 1);
        trackListPage.load = jest.fn().mockResolvedValue();
        trackListPage.getTracks = jest.fn().mockReturnValue([track]);
        const metadataLoader = new MetadataLoader();
        metadataLoader.loadMetadatas = jest.fn().mockResolvedValue([
            {
                getId: () => 'testPilot_12345',
                lastTime: { isBefore: () => false }
            }
        ]);
        
        TrackListPage.mockImplementation(() => trackListPage);
        MetadataLoader.mockImplementation(() => metadataLoader);
        
        const trackPage = new TrackPage(track.liveTrackId);
        trackPage.load = jest.fn();
        
        TrackPage.mockImplementation(() => trackPage);
        
        const igcLoader = new IgcLoader(track.liveTrackId);
        igcLoader.load = jest.fn();
        
        IgcLoader.mockImplementation(() => igcLoader);
        
        const ret = await loadTracks(date, { force: true });
        
        expect(trackPage.load).toHaveBeenCalled();
        expect(igcLoader.load).toHaveBeenCalled();
        expect(ret.length).toEqual(1);
    });
});
