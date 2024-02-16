import * as Cesium from "cesium";

const colorpallete = [
    Cesium.Color.AQUA,
    Cesium.Color.AQUAMARINE,
    Cesium.Color.BLUEVIOLET,
    Cesium.Color.CHARTREUSE,
    Cesium.Color.CORAL,
    Cesium.Color.CRIMSON,
    Cesium.Color.CYAN,
    Cesium.Color.DARKORANGE,
    Cesium.Color.DARKORCHID,
    Cesium.Color.DEEPPINK,
    Cesium.Color.DEEPSKYBLUE,
    Cesium.Color.FUCHSIA,
    Cesium.Color.GOLD,
    Cesium.Color.GREENYELLOW,
    Cesium.Color.HOTPINK,
    Cesium.Color.LIGHTBLUE,
    Cesium.Color.LIGHTGREEN,
    Cesium.Color.LIGHTPINK,
    Cesium.Color.LIME,
    Cesium.Color.MAGENTA,
    Cesium.Color.ORANGE,
    Cesium.Color.RED,
    Cesium.Color.TOMATO,
    Cesium.Color.YELLOW,
    Cesium.Color.YELLOWGREEN,
];

const hashCode = function (s) {
    var h = 0, l = s.length, i = 0;
    if (l > 0)
        while (i < l)
            h = (h << 5) - h + s.charCodeAt(i++) | 0;
    return h;
};

export const trackColor = (track) => {
    return colorpallete[Math.abs(hashCode(track.getId())) % colorpallete.length];
}
