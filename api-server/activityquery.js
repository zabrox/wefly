
const activityQuery = (activities) => {
    const queryConditions = [];

    for (const activity of activities) {
        switch (activity) {
            case 'Paraglider':
            case 'Glider':
                queryConditions.push(activity);
                break;
            case 'Hangglider':
                queryConditions.push('Flex wing FAI1', 'Rigid wing FAI5');
                break;
        }
    }

    let queryString = '';
    if (queryConditions.length > 0) {
        queryString += `activity IN (${queryConditions.map(cond => `'${cond}'`).join(', ')})`;
    }
    if (activities.includes('Other')) {
        if (queryString.length > 0) {
            queryString += ` OR `;
        }
        queryString += `activity NOT IN ('Paraglider', 'Glider', 'Flex wing FAI1', 'Rigid wing FAI5')`;
    }
    return queryString.length > 0 ? ` AND (${queryString})` : '';
}

module.exports = { activityQuery };