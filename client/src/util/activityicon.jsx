import { trackColor } from './trackcolor';
import ParagliderIcon from '/images/paraglider.svg';
import GliderIcon from '/images/glider.svg';
import HanggliderIcon from '/images/hangglider.svg';

export const ActivityIcon = ({ track, size }) => {
    const divstyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: trackColor(track).toCssHexString(),
        borderRadius: '50%',
    };
    const svgstyle = {
        width: `${size * 0.6}px`,
        height: `${size * 0.6}px`,
    };

    return (
        <div style={divstyle}>
            {track.metadata.activity === 'Paraglider' && <img src={ParagliderIcon} style={svgstyle} alt={track.metadata.activity} />}
            {track.metadata.activity === 'Glider' && <img src={GliderIcon} style={svgstyle} alt={track.metadata.activity} />}
            {track.metadata.activity === 'Hangglider' && <img src={HanggliderIcon} style={svgstyle} alt={track.metadata.activity} />}
        </div>
    )
}