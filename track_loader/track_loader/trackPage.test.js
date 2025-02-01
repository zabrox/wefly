const axios = require('axios');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const { TrackPage } = require('./trackPage');
jest.mock('axios');

dayjs.extend(utc)

describe('TrackPage', () => {
    it('should load track page HTML successfully', async () => {
        const liveTrackId = '12345';
        const htmlData = '<html>mockHtmlData</html>';
        const response = { status: 200, data: htmlData };
        
        axios.get.mockResolvedValue(response);
        
        const trackPage = new TrackPage(liveTrackId);
        await trackPage.load();
        
        expect(axios.get).toHaveBeenCalledWith(`https://www.livetrack24.com/track/${liveTrackId}`, {
            httpAgent: expect.any(Object),
            httpsAgent: expect.any(Object),
            timeout: 10000,
        });
        expect(trackPage.getHtml()).toBe(htmlData);
    });

    it('should throw an error if the request fails', async () => {
        const liveTrackId = '12345';
        axios.get.mockResolvedValue({ status: 404 });
        
        const trackPage = new TrackPage(liveTrackId);
        
        await expect(trackPage.load()).rejects.toThrow(`Failed to get https://www.livetrack24.com/track/${liveTrackId}`);
    });

    it('should parse start time correctly', async () => {
        const liveTrackId = '12345';
        const htmlData = '<html><div id="row2_2"><div> 2025-01-16 08:43:02 UTC+9</div></div></html>';
        const response = { status: 200, data: htmlData };
        
        axios.get.mockResolvedValue(response);
        
        const trackPage = new TrackPage(liveTrackId);
        await trackPage.load();
        
        const startTime = trackPage.parseStartTime();
        expect(startTime.isValid()).toBe(true);
        expect(startTime.format()).toBe(dayjs('2025-01-16 08:43:02').utc().format());
    });

    it('should parse end time correctly', async () => {
        const liveTrackId = '12345';
        const htmlData = '<html><div id="row2_3"><div> 2025-01-16 08:43:02 UTC+9</div></div></html>';
        const response = { status: 200, data: htmlData };
        
        axios.get.mockResolvedValue(response);
        
        const trackPage = new TrackPage(liveTrackId);
        await trackPage.load();
        
        const startTime = trackPage.parseEndTime();
        expect(startTime.isValid()).toBe(true);
        expect(startTime.format()).toBe(dayjs('2025-01-16 08:43:02').utc().format());
    });
});
