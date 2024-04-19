import dayjs from 'dayjs';
import { describe, it, expect } from 'vitest';
import { SearchCondition } from './searchcondition';

describe('SearchCondition', () => {
    it('returns true when any search condition is enabled', () => {
        const searchCondition = new SearchCondition();
        searchCondition.from = dayjs('2022-01-01');
        searchCondition.to = dayjs('2022-01-31');
        searchCondition.pilotname = 'John Doe';
        searchCondition.maxAltitude = 1000;
        searchCondition.distance = 50;
        searchCondition.duration = 30;
        searchCondition.activities = ['Paraglider', 'Hangglider', 'Glider', 'Other'];
        searchCondition.bounds = { lat: 0, lng: 0 };

        const result = searchCondition.isAdvancedSearchEnabled();

        expect(result).toBe(true);
    });

    it('returns false when all search conditions are disabled', () => {
        const searchCondition = new SearchCondition();
        searchCondition.from = dayjs('2022-01-01');
        searchCondition.to = dayjs('2022-01-01');
        searchCondition.pilotname = '';
        searchCondition.maxAltitude = undefined;
        searchCondition.distance = undefined;
        searchCondition.duration = undefined;
        searchCondition.activities = ['Paraglider', 'Hangglider', 'Glider', 'Other'];
        searchCondition.bounds = undefined;

        const result = searchCondition.isAdvancedSearchEnabled();

        expect(result).toBe(false);
    });
});