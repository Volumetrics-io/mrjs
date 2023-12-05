import * as THREE from 'three';

/**
 *
 * @param val
 * @param decimal
 */
export function roundTo(val, decimal) {
    return Math.round(val * decimal) / decimal;
}

/**
 *
 * @param vector
 * @param decimal
 */
export function roundVectorTo(vector, decimal) {
    vector.multiplyScalar(decimal);
    vector.roundToZero();
    vector.divideScalar(decimal);
}

/**
 *
 * @param val
 */
export function radToDeg(val) {
    return (val * Math.PI) / 180;
}
