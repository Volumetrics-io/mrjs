/**
 * Converts 3D world positions to display positions based on global viewPort information.
 * Useful as part of the layout system and css value handling (px<-->threejs).
 * @param {number} val - the 3D value to be converted to 2D pixel space
 * @returns {number} - the 2D pixel space representation of value.
 */
export function threeToPx(val) {
    return (val / global.viewPortHeight) * window.innerHeight;
}

/**
 * Converts display positions to 3D world positions to based on global viewPort information.
 * Useful as part of the layout system and css value handling (px<-->threejs).
 * @param {number} val - the 2D pixel space value to be converted to 3D space.
 * @returns {number} - the 3D representation of value.
 */
export function pxToThree(val) {
    let px = val instanceof String ? val.split('px')[0] : val;

    if (global.inXR) {
        return (px / window.innerWidth) * this.windowHorizontalScale;
    }
    return (px / window.innerWidth) * global.viewPortWidth;
}
