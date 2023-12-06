import * as THREE from 'three';

/**
 *
 * @param {number} val - TODO
 * @param {number} decimal - TODO
 * @returns {number} - TODO
 */
export function roundTo(val, decimal) {
    return Math.round(val * decimal) / decimal;
}

/**
 *
 * @param {object} vector - TODO
 * @param {number} decimal - TODO
 */
export function roundVectorTo(vector, decimal) {
    vector.multiplyScalar(decimal);
    vector.roundToZero();
    vector.divideScalar(decimal);
}

/**
 *
 * @param {number} val - TODO
 * @returns {number} - TODO
 */
export function radToDeg(val) {
    return (val * Math.PI) / 180;
}
