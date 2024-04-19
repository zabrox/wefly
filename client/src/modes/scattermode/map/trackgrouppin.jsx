import {primaryColor} from '../../../colortheme';

export const createTrackGroupPin = (trackGroup) => {
    const canvas = document.createElement('canvas');
    canvas.width = 60;
    canvas.height = 80;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.arc(30, 30, 29, 0, Math.PI * 2);
    ctx.fillStyle = primaryColor;
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(30, 80);
    ctx.lineTo(10, 40);
    ctx.lineTo(50, 40);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.arc(30, 30, 20, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = primaryColor;
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${trackGroup.trackIds.length}`, 30, 30);
    return canvas.toDataURL();
}
