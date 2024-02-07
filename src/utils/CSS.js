/**
 * @namespace CSS
 * @description Useful namespace for helping with CSS utility functions
 */
let CSS = {};

/**
 * @function
 * @description Converts the dom string to a 3D numerical value
 * @param {string} val - the dom css information includes items of the form `XXXpx`, `XXX%`, etc
 * @returns {number} - the 3D numerical represenation of the dom css value
 */
CSS.domToThree = function(val) {
    if (typeof val === 'string') {
        const valuepair = val.split(/(\d+(?:\.\d+)?)/).filter(Boolean);
        if (valuepair.length > 1) {
            switch (valuepair[1]) {
                case 'px':
                    if (mrjsUtils.xr.isPresenting) {
                        return (val.split('px')[0] / global.appWidth) * mrjsUtils.app.scale;
                    }
                    return (val.split('px')[0] / global.appWidth) * global.viewPortWidth;
                case '%':
                    if (mrjsUtils.xr.isPresenting) {
                        return (parseFloat(val) / 100) * mrjsUtils.app.scale;
                    }
                    return (parseFloat(val) / 100) * global.viewPortWidth;
                default:
                    return val;
            }
        }
    }
    return val;
}

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
        return (px / global.appWidth) * mrjsUtils.app.scale;
    }
    return (px / global.appWidth) * global.viewPortWidth;
};

export { CSS };
