const { activityQuery } = require('./activityquery');

describe('activityQuery', () => {
    it('should return the correct query string for Paraglider activity', () => {
        const activities = ['Paraglider'];
        const expectedQuery = " AND (activity IN ('Paraglider'))";
        const result = activityQuery(activities);
        expect(result).toBe(expectedQuery);
    });

    it('should return the correct query string for Glider activity', () => {
        const activities = ['Glider'];
        const expectedQuery = " AND (activity IN ('Glider'))";
        const result = activityQuery(activities);
        expect(result).toBe(expectedQuery);
    });

    it('should return the correct query string for Hangglider activity', () => {
        const activities = ['Hangglider'];
        const expectedQuery = " AND (activity IN ('Flex wing FAI1', 'Rigid wing FAI5'))";
        const result = activityQuery(activities);
        expect(result).toBe(expectedQuery);
    });

    it('should return the correct query string for multiple activities', () => {
        const activities = ['Paraglider', 'Hangglider'];
        const expectedQuery = " AND (activity IN ('Paraglider', 'Flex wing FAI1', 'Rigid wing FAI5'))";
        const result = activityQuery(activities);
        expect(result).toBe(expectedQuery);
    });

    it('should return the correct query string for activities including "Other"', () => {
        const activities = ['Paraglider', 'Other'];
        const expectedQuery = " AND (activity IN ('Paraglider') OR activity NOT IN ('Paraglider', 'Glider', 'Flex wing FAI1', 'Rigid wing FAI5'))";
        const result = activityQuery(activities);
        expect(result).toBe(expectedQuery);
    });

    it('should return the correct query string for empty activities', () => {
        const activities = [];
        const expectedQuery = "";
        const result = activityQuery(activities);
        expect(result).toBe(expectedQuery);
    });

    it('should return the correct query string for other', () => {
        const activities = ['Other'];
        const expectedQuery = " AND (activity NOT IN ('Paraglider', 'Glider', 'Flex wing FAI1', 'Rigid wing FAI5'))";
        const result = activityQuery(activities);
        expect(result).toBe(expectedQuery);
    });
});