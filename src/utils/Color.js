/**
 * @namespace color
 * @description Useful namespace for helping with color utility functions
 */
let color = {};

/**
 * @function
 * @memberof color
 * @param {string} hex - the hex code including "#" at the beginning
 * @description Converts a hex code into a usable rgba object value
 * @returns {object} - the calculated rgba value representation of the hex code
 * {
 *      r: number, // Red component (0-255)
 *      g: number, // Green component (0-255)
 *      b: number, // Blue component (0-255)
 *      a: number  // Alpha component (0-1 for transparency)
 * }
 */
color.hexToRgba = function (hex) {
    let r = 0,
        g = 0,
        b = 0,
        a = 1; // Default is black
    if (hex.startsWith('#')) {
        hex = hex.substring(1);
    }

    if (hex.length === 3) {
        r = parseInt(hex[0] + hex[0], 16);
        g = parseInt(hex[1] + hex[1], 16);
        b = parseInt(hex[2] + hex[2], 16);
    } else if (hex.length === 6) {
        r = parseInt(hex.substring(0, 2), 16);
        g = parseInt(hex.substring(2, 4), 16);
        b = parseInt(hex.substring(4, 6), 16);
    } else if (hex.length === 4) {
        r = parseInt(hex[0] + hex[0], 16);
        g = parseInt(hex[1] + hex[1], 16);
        b = parseInt(hex[2] + hex[2], 16);
        a = parseInt(hex[3] + hex[3], 16) / 255;
    } else if (hex.length === 8) {
        r = parseInt(hex.substring(0, 2), 16);
        g = parseInt(hex.substring(2, 4), 16);
        b = parseInt(hex.substring(4, 6), 16);
        a = parseInt(hex.substring(6, 8), 16) / 255;
    }
    return { r, g, b, a };
};

color.setObject3DColor = function (object3D, color, compStyle_opacity='1', default_color='#000') {
    if (color.startsWith('rgba')) {
        const rgba = color
            .match(/rgba?\(([^)]+)\)/)[1]
            .split(',')
            .map((n) => parseFloat(n.trim()));
        object3D.material.color.setStyle(`rgb(${rgba[0]}, ${rgba[1]}, ${rgba[2]})`);
        object3D.material.transparent = rgba.length === 4 && rgba[3] < 1;
        object3D.material.opacity = rgba.length === 4 ? rgba[3] : 1;
        object3D.visible = !(rgba.length === 4 && rgba[3] === 0);
    } else if (color.startsWith('rgb')) {
        // RGB colors are treated as fully opaque
        object3D.material.color.setStyle(color);
        object3D.material.transparent = false;
        object3D.visible = true;
    } else if (color.startsWith('#')) {
        const { r, g, b, a } = mrjsUtils.color.hexToRgba(color);
        object3D.material.color.setStyle(`rgb(${r}, ${g}, ${b})`);
        object3D.material.transparent = a < 1;
        object3D.material.opacity = a;
        object3D.visible = a !== 0;
    } else {
        // This assumes the color is a CSS color word or another valid CSS color value
        object3D.material.color.setStyle(color ?? default_color);
        object3D.material.transparent = false;
        object3D.visible = true;
    }
    if (compStyle_opacity < 1) {
        object3D.material.opacity = compStyle_opacity;
    }
    object3D.material.needsUpdate = true;
}

color.setTEXTObject3DColor = function (object3D, color, default_color='#000') {
   if (color.includes('rgba')) {
        const rgba = color
            .substring(5, color.length - 1)
            .split(',')
            .map((part) => parseFloat(part.trim()));
        object3D.material.color.setStyle(`rgb(${rgba[0]}, ${rgba[1]}, ${rgba[2]})`);

        object3D.material.opacity = rgba[3];
    } else {
        object3D.material.color.setStyle(color ?? '#000');
    }
    object3D.material.needsUpdate = true;
}

export { color };
