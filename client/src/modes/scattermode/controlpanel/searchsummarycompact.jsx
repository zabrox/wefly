import { Box, Stack, Chip, Tooltip } from '@mui/material';
import DateRangeIcon from '@mui/icons-material/DateRange';
import PersonIcon from '@mui/icons-material/Person';
import LandscapeOutlinedIcon from '@mui/icons-material/LandscapeOutlined';
import MultipleStopIcon from '@mui/icons-material/MultipleStop';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import PlaceIcon from '@mui/icons-material/Place';
import ParagliderIcon from '/images/paraglider.svg';
import GliderIcon from '/images/glider.svg';
import HanggliderIcon from '/images/hangglider.svg';

export const SearchSummaryCompact = ({
  searchCondition,
}) => {

    const isRange = searchCondition.from.format('YYYY-MM-DD') !== searchCondition.to.format('YYYY-MM-DD');
    const isDefaultActivities = (acs) => {
        if (!acs) return true;
        const def = ['Paraglider', 'Hangglider', 'Glider', 'Other'];
        if (acs.length !== def.length) return false;
        for (let i = 0; i < def.length; i++) if (acs[i] !== def[i]) return false;
        return true;
    };

    const chips = [];

    // Date
    const dateLabel = isRange
        ? `${searchCondition.from.format('YYYY-MM-DD')} – ${searchCondition.to.format('YYYY-MM-DD')}`
        : searchCondition.from.format('YYYY-MM-DD (ddd)');
    chips.push({ key: 'date', icon: <DateRangeIcon fontSize='small' />, label: dateLabel });

    // Pilot
    if (searchCondition.pilotname && searchCondition.pilotname !== '') {
        chips.push({ key: 'pilotname', icon: <PersonIcon fontSize='small' />, label: searchCondition.pilotname });
    }

    // Max Altitude
    if (searchCondition.maxAltitude !== undefined) {
        chips.push({ key: 'maxAltitude', icon: <LandscapeOutlinedIcon fontSize='small' />, label: `≧ ${searchCondition.maxAltitude} m` });
    }

    // Distance
    if (searchCondition.distance !== undefined) {
        chips.push({ key: 'distance', icon: <MultipleStopIcon fontSize='small' />, label: `≧ ${searchCondition.distance} km` });
    }

    // Duration
    if (searchCondition.duration !== undefined) {
        chips.push({ key: 'duration', icon: <TimerOutlinedIcon fontSize='small' />, label: `≧ ${searchCondition.duration} min` });
    }

    // Activities (only when changed from default)
    if (searchCondition.activities && !isDefaultActivities(searchCondition.activities)) {
        const names = searchCondition.activities;
        const iconSize = 16;
        const iconStyle = { width: `${iconSize}px`, height: `${iconSize}px` };
        const labelNode = (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {names.map((n) => {
                    if (n === 'Paraglider') return <img key={n} src={ParagliderIcon} alt={n} style={iconStyle} />;
                    if (n === 'Glider') return <img key={n} src={GliderIcon} alt={n} style={iconStyle} />;
                    if (n === 'Hangglider') return <img key={n} src={HanggliderIcon} alt={n} style={iconStyle} />;
                    return <span key={n} style={{ fontSize: '0.8rem' }}>{n}</span>;
                })}
            </Box>
        );
        chips.push({ key: 'activities', label: labelNode, tooltip: names.join(', ') });
    }

    // Bounds
    if (searchCondition.bounds !== undefined) {
        const [[west, south], [east, north]] = searchCondition.bounds;
        const short = (v) => (typeof v === 'number' ? v.toFixed(2) : v);
        const label = `${short(south)}, ${short(west)} – ${short(north)}, ${short(east)}`;
        chips.push({ key: 'bounds', icon: <PlaceIcon fontSize='small' />, label });
    }

    return (
    <Box sx={{
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: 1,
    }}>
      <Stack
        direction='row'
        spacing={1}
        useFlexGap
        flexWrap='wrap'
        sx={{ flex: 1, minWidth: 0 }}
      >
                {chips.map((c) => (
                    <Tooltip key={c.key} title={c.tooltip ?? (typeof c.label === 'string' ? c.label : '')} arrow>
                        <Chip size='small' icon={'icon' in c ? c.icon : ''} label={c.label} sx={{ maxWidth: 260 }} />
                    </Tooltip>
                ))}
            </Stack>
        </Box>
    );
}

export default SearchSummaryCompact;
