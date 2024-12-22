import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, it, expect, vi, afterEach } from "vitest";
import { Timeline } from "./timeline";
import dayjs from "dayjs";

// モック関数の作成
vi.mock("./cesiummap", () => ({
    viewer: { clock: { currentTime: null } },
}));

vi.mock("./entities/trackstatscalculator", () => ({
    TrackStatsCalculator: vi.fn().mockImplementation(() => ({
        getAverageAltitude: vi.fn().mockReturnValue(500),
    })),
}));

describe("Timeline コンポーネント", () => {
    afterEach(() => {
        cleanup();
    });

    const baseTime = dayjs('2024-12-22 23:08:00');
    const mockTrack = {
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
        },
        metadata: { maxAltitude: 1000 },
    };

    const mockSetCurrentTime = vi.fn();
    const mockHandleTimelineClick = vi.fn();

    it("タイムラインがレンダリングされる", () => {
        render(
            <Timeline
                track={mockTrack}
                currentTime={mockTrack.path.times[0]}
                setCurrentTime={mockSetCurrentTime}
                start={mockTrack.path.times[0]}
                end={mockTrack.path.times[1]}
                handleTimelineClick={mockHandleTimelineClick}
            />
        );
        expect(screen.getByTestId('timelinecanvas')).toBeInTheDocument();
    });

    it("キャンバスがクリックされると、現在の時間が更新される", () => {
        const mockGetBoundingClientRect = vi.fn(() => ({
            width: 300,
            height: 100,
            left: 0,
        }));

        // render前にモック適用
        Object.defineProperty(HTMLCanvasElement.prototype, "getBoundingClientRect", {
            value: mockGetBoundingClientRect,
        });

        render(
            <Timeline
                track={mockTrack}
                currentTime={mockTrack.path.times[0]}
                setCurrentTime={mockSetCurrentTime}
                start={mockTrack.path.times[0]}
                end={mockTrack.path.times.slice(-1)[0]}
                handleTimelineClick={mockHandleTimelineClick}
            />
        );

        const canvas = screen.getByTestId("timelinecanvas", { hidden: true });

        fireEvent.click(canvas, { clientX: 150, clientY: 10 });
        expect(mockSetCurrentTime).toHaveBeenCalledWith(dayjs("2024-12-22 23:03:00"));
        expect(mockHandleTimelineClick).toHaveBeenCalled();
    });
});
