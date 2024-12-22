import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, vitest, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { TrackPointStatsTable } from './trackpointstatstable';
import dayjs, { extend } from 'dayjs';
import duration from "dayjs/plugin/duration";
extend(duration);

const baseTime = dayjs('2024-12-22 23:08:00');
const mockTrackPoint = {
    track: {
        metadata: { maxAltitude: 1000 },
        path: {
            times: [
                baseTime.subtract(10, 'minute'),
                baseTime.subtract(9, 'minute'),
                baseTime.subtract(8, 'minute'),
                baseTime.subtract(7, 'minute'),
                baseTime.subtract(6, 'minute'),
                baseTime.subtract(5, 'minute'),
                baseTime.subtract(4, 'minute'),
                baseTime.subtract(3, 'minute'),
                baseTime.subtract(2, 'minute'),
                baseTime.subtract(1, 'minute'),
                baseTime],
            altitudes: vitest.fn().mockReturnValue([
                0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]),
        }
    },
    index: 0,
};

vi.mock('../../../entities/trackstatscalculator', () => {
    return {
        TrackStatsCalculator: vi.fn().mockImplementation(() => {
            return {
                duration: vi.fn(() => dayjs.duration(1, 'hour')),
                getAverageAltitude: vi.fn(() => 1000),
                getAverageSpeed: vi.fn(() => 50),
                getAverageGain: vi.fn(() => 2),
                getAverageGlideRatio: vi.fn(() => 10),
                getDistance: vi.fn(() => 5),
                getTotalDistance: vi.fn(() => 100),
            };
        }),
    };
});

describe('TrackPointStatsTable', () => {
    afterEach(() => {
        cleanup();
    })
    it('renders correctly with initial stats', () => {
        render(<TrackPointStatsTable trackPoint={mockTrackPoint} />);

        expect(screen.getByText('時刻')).toBeInTheDocument();
        expect(screen.getByText('高度')).toBeInTheDocument();
        expect(screen.getByText('上昇率')).toBeInTheDocument();
        expect(screen.getByText('距離')).toBeInTheDocument();
        expect(screen.getByText('飛行時間')).toBeInTheDocument();
        expect(screen.getByText('速度')).toBeInTheDocument();
        expect(screen.getByText('滑空比')).toBeInTheDocument();
        expect(screen.getByText('累計距離')).toBeInTheDocument();
    });

    it('displays correct stats after useEffect', () => {
        render(<TrackPointStatsTable trackPoint={mockTrackPoint} />);

        expect(screen.getByText("22:58:00")).toBeInTheDocument(); // 現在時刻
        expect(screen.getByText('1000 m')).toBeInTheDocument();   // 高度
        expect(screen.getByText('2.0 m/s')).toBeInTheDocument();  // 上昇率
        expect(screen.getByText('5.0 km')).toBeInTheDocument();   // 距離
        expect(screen.getByText('01:00:00')).toBeInTheDocument(); // 飛行時間
        expect(screen.getByText('50 km/h')).toBeInTheDocument();  // 速度
        expect(screen.getByText('10.0')).toBeInTheDocument();     // 滑空比
        expect(screen.getByText('100.0 km')).toBeInTheDocument(); // 累計距離
    });
});