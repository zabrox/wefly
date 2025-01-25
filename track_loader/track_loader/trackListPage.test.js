const axios = require('axios');
const cheerio = require('cheerio');
const { TrackListPage } = require('./trackListPage');
jest.mock('axios');

describe('TrackListPage', () => {
    it('should load HTML from liveTrackUrl', async () => {
        const date = '2023-10-10';
        const pageNumber = 1;
        const html = '<html>mockHtml</html>';
        axios.get.mockResolvedValue({ status: 200, data: html });
        
        const trackListPage = new TrackListPage(date, pageNumber);
        await trackListPage.load();
        
        expect(trackListPage.getHtml()).toBe(html);
    });

    it('should throw an error if response status is not 200', async () => {
        const date = '2023-10-10';
        const pageNumber = 1;
        axios.get.mockResolvedValue({ status: 404 });
        
        const trackListPage = new TrackListPage(date, pageNumber);
        await expect(trackListPage.load()).rejects.toThrow(`Failed to get https://www.livetrack24.com/tracks/country/jp/from/${date}/to/${date}/page_num/${pageNumber}/`);
    });

    it('should parse tracks from HTML', async () => {
        const date = '2023-10-10';
        const pageNumber = 1;
        const html = '<div id="trackRow_1" data-trackid="12345"><span class="liveusername"><a>testPilot</a></span><span class="track_status">Live!</span></div>';
        axios.get.mockResolvedValue({ status: 200, data: html });
        
        const trackListPage = new TrackListPage(date, pageNumber);
        await trackListPage.load();
        
        const tracks = trackListPage.getTracks();
        expect(tracks).toHaveLength(1);
        expect(tracks[0].pilotname).toBe('testPilot');
        expect(tracks[0].liveTrackId).toBe('12345');
        expect(tracks[0].isLive).toBe(true);
    });
});
