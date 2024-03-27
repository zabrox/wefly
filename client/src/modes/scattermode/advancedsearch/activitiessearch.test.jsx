import dayjs from 'dayjs';
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { ActivitiesSearch } from './activitiessearch';
import { SearchCondition } from '../searchcondition';
import "@testing-library/jest-dom/vitest";

describe('ActivitiesSearch', () => {
    afterEach(() => {
        cleanup();
    });

    it('updates search condition on selection change', () => {
        const searchCondition = new SearchCondition();
        searchCondition.activities = [];
        searchCondition.from = dayjs("2024-03-25T15:00:00.000Z");
        searchCondition.to = dayjs("2024-03-26T14:59:59.999Z");
        const setSearchCondition = vi.fn();

        render(
            <ActivitiesSearch
                searchCondition={searchCondition}
                setSearchCondition={setSearchCondition}
            />
        );

        const toggleButtons = screen.getAllByRole('button');
        const paragliderButton = toggleButtons[0];
        fireEvent.click(paragliderButton);

        const expected = new SearchCondition();
        expected.activities = ['Paraglider'];
        expected.from = dayjs("2024-03-25T15:00:00.000Z");
        expected.to = dayjs("2024-03-26T14:59:59.999Z");
        expected.pilotname = "";
        expected.distance = undefined;
        expected.duration = undefined;
        expected.maxAltitude = undefined;
        expected.bounds = undefined;
        expect(setSearchCondition).toHaveBeenCalledWith(expected);
    });

    it('toggles search condition on selection change', () => {
        const searchCondition = new SearchCondition();
        searchCondition.activities = ['Paraglider', 'Hangglider', 'Glider', 'Other'],
        searchCondition.from = dayjs("2024-03-25T15:00:00.000Z");
        searchCondition.to = dayjs("2024-03-26T14:59:59.999Z");
        const setSearchCondition = vi.fn();

        render(
            <ActivitiesSearch
                searchCondition={searchCondition}
                setSearchCondition={setSearchCondition}
            />
        );

        const toggleButtons = screen.getAllByRole('button');
        const paragliderButton = toggleButtons[2];
        fireEvent.click(paragliderButton);

        const expected = new SearchCondition();
        expected.activities = ['Paraglider', 'Hangglider', 'Other'];
        expected.from = dayjs("2024-03-25T15:00:00.000Z");
        expected.to = dayjs("2024-03-26T14:59:59.999Z");
        expected.pilotname = "";
        expected.distance = undefined;
        expected.duration = undefined;
        expected.maxAltitude = undefined;
        expected.bounds = undefined;
        expect(setSearchCondition).toHaveBeenCalledWith(expected);
    });
});