/**
 * @namespace css
 * @description Useful namespace for helping with CSS utility functions
 */
let css = {};

css.extractNumFromPixelStr = function (str) {
  const result = str.match(/(\d+)px/);
  return result ? parseInt(result[1]) : null;
}

/**
 * @function
 * @description Converts the dom string to a 3D numerical value
 * @param {string} val - the dom css information includes items of the form `XXXpx`, `XXX%`, etc
 * @returns {number} - the 3D numerical represenation of the dom css value
 */
css.domToThree = function (val) {
    if (typeof val === 'string') {
        const valuepair = val.split(/(\d+(?:\.\d+)?)/).filter(Boolean);
        if (valuepair.length > 1) {
            switch (valuepair[1]) {
                case 'px':
                    if (mrjsUtils.xr.isPresenting) {
                        return val.split('px')[0] / global.appWidth;
                    }
                    return (val.split('px')[0] / global.appWidth) * global.viewPortWidth;
                case '%':
                    if (mrjsUtils.xr.isPresenting) {
                        return parseFloat(val) / 100;
                    }
                    return (parseFloat(val) / 100) * global.viewPortWidth;
                default:
                    return val;
            }
        }
    }
    return val;
};

/**
 * @function
 * @memberof css
 * @description Converts 3D world positions to display positions based on global viewPort information.
 *              Useful as part of the layout system and css value handling (px<-->threejs).
 * @param {number} val - the 3D value to be converted to 2D pixel space
 * @returns {number} - the 2D pixel space representation of value.
 */
css.threeToPx = function (val) {
    return (val / global.viewPortHeight) * global.appHeight;
};

/**
 * @function
 * @memberof css
 * @description Converts display positions to 3D world positions to based on global viewPort information.
 * Useful as part of the layout system and css value handling (px<-->threejs).
 * @param {number} val - the 2D pixel space value to be converted to 3D space.
 * @returns {number} - the 3D representation of value.
 */
css.pxToThree = function (val) {
    let px = val instanceof String ? val.split('px')[0] : val;

    if (mrjsUtils.xr.isPresenting) {
        return px / global.appWidth;
    }
    return (px / global.appWidth) * global.viewPortWidth;
};

export { css };
