import * as THREE from 'three';

/**
 * Rounds the inputted val to the nearest decimal place as denoted by the decimal parameter.
 * For example: roundTo(832.456, 10) = 832.4; roundTo(832.456, 1000) = 832.456; roundTo(832.456, 0.01) = 800;
 * @param {number} val - The number to be rounded.
 * @param {number} decimal - The decimal place targeted in the rounding.
 * @returns {number} - The rounded number to the requested decimal amount.
 */
export function roundTo(val, decimal) {
    return Math.round(val * decimal) / decimal;
}

/**
 * Rounds the inputted vector to the nearest decimal place as denoted by the decimal parameter.
 * For example: roundTo(<832.456, 92.10003, 23452.1>, 10) = <832.4, 92.1, 2342.1>;
 * @param {vector} vector - The vector of numbers to be rounded.
 * @param {number} decimal - The decimal place targeted in the rounding.
 */
export function roundVectorTo(vector, decimal) {
    vector.multiplyScalar(decimal);
    vector.roundToZero();
    vector.divideScalar(decimal);
}

/**
 * Performs the radian To Degree calculation commonly used in math.
 * https://en.wikipedia.org/wiki/Degree_(angle)
 * https://en.wikipedia.org/wiki/Radian
 * @param {number} val - The number to be converted from radians to degrees
 * @returns {number} - the calculated degree representation of val.
 */
export function radToDeg(val) {
    return (val * Math.PI) / 180;
}
