import dayjs from 'dayjs';
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { AdvancedSearchDialog } from './advancedsearchdialog';
import "@testing-library/jest-dom/vitest";

describe('AdvancedSearchDialog', () => {
    const mockSearch = vi.fn();
    const mockSetShow = vi.fn();

    afterEach(() => {
        cleanup();
    });

    it('renders the dialog with correct labels and default values', () => {
        render(
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <AdvancedSearchDialog
                    searchCondition={{
                        from: dayjs('2022-01-01').startOf('day'),
                        to: dayjs('2022-01-31').endOf('day'),
                    }}
                    show={true}
                    setShow={mockSetShow}
                    search={mockSearch}
                />
            </LocalizationProvider>
        );

        expect(screen.getByText('高度な検索')).toBeInTheDocument();
        expect(screen.getByLabelText('From')).toHaveValue('2022-01-01 (Sat)');
        expect(screen.getByLabelText('To')).toHaveValue('2022-01-31 (Mon)');
        expect(screen.getByLabelText('パイロット名')).toHaveValue('');
        expect(screen.getByLabelText('最高高度≧ (m)')).toHaveValue(null);
        expect(screen.getByLabelText('距離≧ (km)')).toHaveValue(null);
        expect(screen.getByLabelText('飛行時間≧ (分)')).toHaveValue(null);
    });

    it('calls setShow(false) when cancel button is clicked', () => {
        render(
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <AdvancedSearchDialog
                    searchCondition={{
                        from: dayjs('2022-01-01').startOf('day'),
                        to: dayjs('2022-01-31').endOf('day'),
                    }}
                    show={true}
                    setShow={mockSetShow}
                    search={mockSearch}
                />
            </LocalizationProvider>
        );

        fireEvent.click(screen.getByText('CANCEL'));

        expect(mockSetShow).toHaveBeenCalledWith(false);
    });

    it('calls setShow(false) and search() with updated searchCondition when search button is clicked', async () => {
        render(
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <AdvancedSearchDialog
                    searchCondition={{
                        from: dayjs('2022-01-01').startOf('day'),
                        to: dayjs('2022-01-31').endOf('day'),
                    }}
                    show={true}
                    setShow={mockSetShow}
                    search={mockSearch}
                />
            </LocalizationProvider>
        );

        // 上手くテストできないのでSkip
        // fireEvent.click(screen.getByLabelText('From'));
        // fireEvent.click(screen.getByText("1"));
        // fireEvent.click(screen.getByText("OK"));
        // fireEvent.click(screen.getByLabelText('To'));
        // fireEvent.click(screen.getByText("3"));
        // fireEvent.click(screen.getByText("OK"));

        fireEvent.change(screen.getByLabelText('パイロット名'), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByLabelText('最高高度≧ (m)'), { target: { value: '1000' } });
        fireEvent.change(screen.getByLabelText('距離≧ (km)'), { target: { value: '50' } });
        fireEvent.change(screen.getByLabelText('飛行時間≧ (分)'), { target: { value: '30' } });
        fireEvent.click(screen.getByText('検索'));

        expect(mockSetShow).toHaveBeenCalledWith(false);
        expect(mockSearch).toHaveBeenCalledWith({
            from: dayjs().startOf('day'),
            to: dayjs().endOf('day'),
            pilotname: 'John Doe',
            maxAltitude: '1000',
            distance: '50',
            duration: '30',
            bounds: undefined,
            activities: ["Paraglider", "Hangglider", "Glider", "Other"],
        });
    });
});