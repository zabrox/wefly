const fs = require('fs');
const xml2js = require('xml2js');
const yaml = require('js-yaml'); // New: require js-yaml
const { Takeoff } = require('./takeoff.js');
const { Landing } = require('./landing.js');

async function parseKML(filePath) {
    const data = fs.readFileSync(filePath, 'utf8');
    const parser = new xml2js.Parser();
    return parser.parseStringPromise(data);
}

// New helper: extract StyleMap mapping
function getStyleMapMapping(doc) {
    const styleMapMapping = {};
    if (doc.StyleMap) {
        doc.StyleMap.forEach(sm => {
            const smId = sm.$.id;
            if (sm.Pair) {
                sm.Pair.forEach(pair => {
                    if (pair.key && pair.key[0] === 'normal' && pair.styleUrl) {
                        const normalId = pair.styleUrl[0].startsWith('#')
                            ? pair.styleUrl[0].substring(1)
                            : pair.styleUrl[0];
                        styleMapMapping[smId] = normalId;
                    }
                });
            }
        });
    }
    return styleMapMapping;
}

// New helper: extract style text mapping from Style and gx:CascadingStyle elements
function getStyleTextMapping(doc) {
    const styleTextMapping = {};
    let allStyles = [];
    if (doc.Style) {
        allStyles = allStyles.concat(doc.Style);
    }
    if (doc['gx:CascadingStyle']) {
        allStyles = allStyles.concat(doc['gx:CascadingStyle']);
    }
    allStyles.forEach(styleEl => {
        const id = (styleEl.$['kml:id'] || styleEl.$.id);
        if (id &&
            styleEl.Style &&
            styleEl.Style[0].BalloonStyle &&
            styleEl.Style[0].BalloonStyle[0].text) {
            let text = styleEl.Style[0].BalloonStyle[0].text[0];
            // Parse YAML text
            try {
                styleTextMapping[id] = yaml.load(text);
            } catch(e) {
                styleTextMapping[id] = text;
            }
        }
    });
    return styleTextMapping;
}

// New helper: extract area information from Placemark elements
function extractPlacemarkAreas(doc, styleMapMapping, styleTextMapping) {
    const takeoffs = [];
    const landings = [];
    if (doc.Placemark) {
        doc.Placemark.forEach(pm => {
            let styleId = pm.styleUrl && pm.styleUrl[0];
            if (styleId && styleId.startsWith('#')) {
                styleId = styleId.substring(1);
            }
            if (styleMapMapping[styleId]) {
                styleId = styleMapMapping[styleId];
            }
            let coordinates = null;
            // Parse coordinate string "longitude,latitude,altitude" into numbers.
            if (pm.Point && pm.Point[0].coordinates) {
                const coordStr = pm.Point[0].coordinates[0].trim();
                const [longitude, latitude, altitude] = coordStr.split(',').map(Number);
                coordinates = { longitude, latitude, altitude };
            }
            if (coordinates === null) {
                throw new Error(`Invalid coordinates for Placemark: ${pm.name}`);
            }
            const balloonText = styleTextMapping[styleId] || null;
            const type = balloonText && balloonText.Type;
            const direction = balloonText && balloonText.Direction;
            const organization = balloonText && balloonText.Organization && balloonText.Organization.name;
            if (type === 'Takeoff') {
                takeoffs.push(new Takeoff(
                    pm.name ? pm.name[0] : "",
                    organization,
                    coordinates.longitude,
                    coordinates.latitude,
                    coordinates.altitude,
                    direction,
                ));
            } else if (type === 'Landing') {
                landings.push(new Landing(
                    pm.name ? pm.name[0] : "",
                    organization,
                    coordinates.longitude,
                    coordinates.latitude,
                    coordinates.altitude,
                ));
            }
        });
    }
    return [takeoffs, landings];
}

// Modified extractAreas using the new helper functions
async function extractTakeoffLanding(filePath) {
    const kmlData = await parseKML(filePath);
    const doc = kmlData.kml.Document[0];
    const styleMapMapping = getStyleMapMapping(doc);
    const styleTextMapping = getStyleTextMapping(doc);
    return extractPlacemarkAreas(doc, styleMapMapping, styleTextMapping);
}

module.exports = { extractTakeoffLanding };
