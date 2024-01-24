import ParagliderIcon from '/images/paraglider.svg';
import GliderIcon from '/images/glider.svg';
import HanggliderIcon from '/images/hangglider.svg';

export const ActivityIcon = ({ track }) => {
    const divstyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '32px',
        height: '32px',
        backgroundColor: track.color.toCssHexString(),
        borderRadius: '50%',
    };
    const svgstyle = {
        width: '20px',
        height: '20px',
    };

    return (
        <div style={divstyle}>
            {track.activity === 'Paraglider' && <img src={ParagliderIcon} style={svgstyle} alt={track.activity} />}
            {track.activity === 'Glider' && <img src={GliderIcon} style={svgstyle} alt={track.activity} />}
            {track.activity === 'Hangglider' && <img src={HanggliderIcon} style={svgstyle} alt={track.activity} />}
        </div>
    )
}