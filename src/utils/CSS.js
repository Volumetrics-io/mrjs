/**
 * @namespace CSS
 * @description Useful namespace for helping with CSS utility functions
 */
let CSS = {};

/**
 * @function
 * @memberof CSS
 * @description Converts 3D world positions to display positions based on global viewPort information.
 *              Useful as part of the layout system and css value handling (px<-->threejs).
 * @param {number} val - the 3D value to be converted to 2D pixel space
 * @returns {number} - the 2D pixel space representation of value.
 */
CSS.threeToPx = function (val) {
    return (val / global.viewPortHeight) * global.appHeight;
};

/**
 * @function
 * @memberof CSS
 * @description Converts display positions to 3D world positions to based on global viewPort information.
 * Useful as part of the layout system and css value handling (px<-->threejs).
 * @param {number} val - the 2D pixel space value to be converted to 3D space.
 * @returns {number} - the 3D representation of value.
 */
CSS.pxToThree = function (val) {
    let px = val instanceof String ? val.split('px')[0] : val;

    if (mrjsUtils.xr.isPresenting) {
        return (px / global.appWidth) * mrjsUtils.appScale;
    }
    return (px / global.appWidth) * global.viewPortWidth;
};

export { CSS };
