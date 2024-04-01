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

export { color };
