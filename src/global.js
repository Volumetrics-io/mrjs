/**
 * @global
 * @type {number}
 * @description the noted viewport height
 */
global.viewPortHeight = 0;

/**
 * @global
 * @type {number}
 * @description the noted viewport width
 */
global.viewPortWidth = 0;

/**
 * @global
 * @type {boolean}
 * @description true if in XR, false otherwise - useful for toggling between and setting up for the varied publishing cases.
 */
global.inXR = false;

/**
 * @global
 * @type {number}
 * @description UI needs to be scaled down in XR, 1:1 scale is huuuuge
 */
global.XRScale = 1 / 2;

global.renderTarget = null;
