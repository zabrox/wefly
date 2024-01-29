import { Timeline } from './timeline';
import './timelineoverlay.css';

export const TimelineOverlay = ({ state, playbackState, setPlaybackState }) => {
    return (
        <div id='timeline-overlay'>
            <Timeline track={state.actionTargetTracks[0]} playbackState={playbackState} setPlaybackState={setPlaybackState} />
        </div>
    )
}