const axios = require('axios');
const { TrackPage } = require('./trackPage');
jest.mock('axios');

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
});
