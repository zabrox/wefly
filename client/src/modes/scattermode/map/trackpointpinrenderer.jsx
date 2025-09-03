import * as Cesium from "cesium";
import * as CesiumMap from "../../../cesiummap";
import { trackColor } from '../../../util/trackcolor';
import { toRenderCartesian } from '../../../util/trackPosition';

const entities = [];

// In-memory cache for pilot images to avoid reloading on every render
const pilotImageCache = new Map(); // key: pilotName, value: HTMLImageElement
const pilotImageLoading = new Map(); // key: pilotName, value: Array<function(HTMLImageElement|null)>

// Relative luminance for contrast decisions (expects Cesium.Color with 0..1 channels)
const luminance = (color) => 0.2126 * color.red + 0.7152 * color.green + 0.0722 * color.blue;

const getPilotIconUrl = (pilotName) => {
    return `${import.meta.env.VITE_API_URL}api/track/piloticon?pilotname=${encodeURIComponent(pilotName ?? '')}`;
};

const fetchPilotImage = (pilotName, onDone) => {
    if (!pilotName) {
        onDone(null);
        return;
    }
    if (pilotImageCache.has(pilotName)) {
        onDone(pilotImageCache.get(pilotName));
        return;
    }
    if (pilotImageLoading.has(pilotName)) {
        pilotImageLoading.get(pilotName).push(onDone);
        return;
    }
    pilotImageLoading.set(pilotName, [onDone]);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
        pilotImageCache.set(pilotName, img);
        const cbs = pilotImageLoading.get(pilotName) || [];
        pilotImageLoading.delete(pilotName);
        cbs.forEach((cb) => cb(img));
    };
    img.onerror = () => {
        const cbs = pilotImageLoading.get(pilotName) || [];
        pilotImageLoading.delete(pilotName);
        cbs.forEach((cb) => cb(null));
    };
    img.src = getPilotIconUrl(pilotName);
};

export const removeTrackPointPinEntities = () => {
    entities.forEach((entity) => CesiumMap.viewer.entities.remove(entity));
}

export const renderTrackPointPin = (selectedTrackPoint) => {
    const entity = CesiumMap.viewer.entities.getById('trackpointpin');
    if (entity !== undefined) {
        CesiumMap.viewer.entities.remove(entity);
    }
    if (!selectedTrackPoint.isValid()) {
        return;
    }
    const track = selectedTrackPoint.track;
    const point = track.path.points[selectedTrackPoint.index];
    const cartesian = toRenderCartesian(point);
    const baseColor = trackColor(track);
    const borderColor = baseColor.darken(0.3, new Cesium.Color());

    // If pilot image is cached, composite immediately for instant draw
    const cachedImg = pilotImageCache.get(track.metadata.pilotname);
    const isLightFill = luminance(baseColor) >= 0.6;
    const haloColor = isLightFill ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.95)';
    const initialCanvas = createPinCanvas({
        fill: baseColor.toCssColorString(),
        stroke: borderColor.toCssColorString(),
        pilotImage: cachedImg || null,
        haloColor,
    });

    const ent = CesiumMap.viewer.entities.add({
        id: 'trackpointpin',
        type: 'trackpointpin',
        trackid: track.getId(),
        position: cartesian,
        billboard: {
            image: initialCanvas,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            scale: 1/3,
            scaleByDistance: new Cesium.NearFarScalar(100, 2.5, 100000, 0.5),
            // Keep selected pin in front of terrain/geometry
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
            // Nudge toward camera so it draws above nearby billboards
            eyeOffset: new Cesium.Cartesian3(0, 0, -50),
        },
    });
    entities.push(ent);

    // Ensure the pilot image is fetched and cached; update entity if it arrives later
    if (!cachedImg) {
        fetchPilotImage(track.metadata.pilotname, (loadedImg) => {
            if (!loadedImg) return; // Fail silently
            const canvasWithPilot = createPinCanvas({
                fill: baseColor.toCssColorString(),
                stroke: borderColor.toCssColorString(),
                pilotImage: loadedImg,
                haloColor,
            });
            ent.billboard.image = canvasWithPilot;
        });
    }
}

// Draw a pin-shaped icon on a canvas. If pilotImage is provided,
// it will be clipped inside the circular head of the pin.
const createPinCanvas = ({ fill, stroke, pilotImage, haloColor }) => {
    const width = 64;            // Canvas width in px
    const baseHeadRadius = 35;   // Original head radius (for tail width)
    const headScale = 1.5;       // Requested head scale
    const headRadius = baseHeadRadius * headScale; // Scaled head radius

    const bottomMargin = 2;      // Pixels from bottom to tip
    const tailDrop = 54;         // Distance from base of tail to tip (keeps tail size constant)
    const haloWidth = 7;         // Halo line width (pre-scale)
    const topMargin = 8;         // Extra top padding to avoid halo clipping

    // Compute minimal canvas height so the enlarged head fits with halo
    const minHeight = bottomMargin + tailDrop + headRadius + topMargin;
    const height = Math.ceil(Math.max(96, minHeight));

    const headCX = width / 2;    // Head center X
    const tipX = width / 2;      // Tip X (centered)
    const tipY = height - bottomMargin; // Tip Y near bottom
    const tailBaseY = tipY - tailDrop;  // Keep tail geometry unchanged
    const headCY = tailBaseY;           // Keep circle center aligned with tail base (as before)

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // Pre-draw outer halo for visibility on varied backgrounds (circle)
    if (haloColor) {
        ctx.save();
        // Circle halo
        ctx.beginPath();
        ctx.arc(headCX, headCY, headRadius, 0, Math.PI * 2);
        ctx.strokeStyle = haloColor;
        ctx.lineWidth = haloWidth; // renders ~2.3px at scale 1/3
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.stroke();
        // Tail sides halo
        ctx.beginPath();
        ctx.moveTo(tipX, tipY);
        ctx.lineTo(headCX - baseHeadRadius, tailBaseY);
        ctx.moveTo(tipX, tipY);
        ctx.lineTo(headCX + baseHeadRadius, tailBaseY);
        ctx.strokeStyle = haloColor;
        ctx.lineWidth = haloWidth;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.stroke();
        ctx.restore();
    }

    // Draw head (circle) with subtle shadow
    ctx.save();
    ctx.beginPath();
    ctx.arc(headCX, headCY, headRadius, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    // Shadow for separation under the head
    ctx.shadowColor = 'rgba(0,0,0,0.25)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2;
    ctx.fill();
    // Stroke without shadow
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();

    // Draw triangular tail (keep original base width and shape)
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(tipX, tipY);
    ctx.lineTo(headCX - baseHeadRadius, tailBaseY);
    ctx.lineTo(headCX + baseHeadRadius, tailBaseY);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
    // Stroke only the two sides to avoid drawing across the head base
    ctx.beginPath();
    ctx.moveTo(tipX, tipY);
    ctx.lineTo(headCX - baseHeadRadius, tailBaseY);
    ctx.moveTo(tipX, tipY);
    ctx.lineTo(headCX + baseHeadRadius, tailBaseY);
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 3;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.restore();

    // Draw circular head border with contrast-aware color
    ctx.save();
    ctx.beginPath();
    ctx.arc(headCX, headCY, headRadius, 0, Math.PI * 2);
    ctx.strokeStyle = haloColor === 'rgba(255,255,255,0.95)'
        ? 'rgba(255,255,255,0.9)'
        : 'rgba(0,0,0,0.7)';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();

    // Draw pilot image inside head if available
    if (pilotImage) {
        const inset = 4; // margin inside head circle
        const clipR = headRadius - inset;
        const imgSize = clipR * 2;
        ctx.save();
        ctx.beginPath();
        ctx.arc(headCX, headCY, clipR, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(
            pilotImage,
            headCX - clipR,
            headCY - clipR,
            imgSize,
            imgSize
        );
        ctx.restore();

        // Add subtle ring over the image
        ctx.save();
        ctx.beginPath();
        ctx.arc(headCX, headCY, clipR, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0,0,0,0.2)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();
    } else {
        // If no image yet, fill head with white to hint placeholder
        ctx.save();
        ctx.beginPath();
        ctx.arc(headCX, headCY, headRadius - 4, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.restore();
    }

    return canvas;
};
