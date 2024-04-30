import * as THREE from 'three';

/**
 * @namespace math
 * @description Useful namespace for helping with Math utility functions including numerical, 3d, etc.
 */
let math = {};

/**************************/
/***** NUMERICAL MATH *****/
/**************************/

/**
 * @function
 * @memberof math
 * @description Rounds the inputted val to the nearest decimal place as denoted by the decimal parameter.
 * @example For example: roundTo(832.456, 10) = 832.4; roundTo(832.456, 1000) = 832.456; roundTo(832.456, 0.01) = 800;
 * @param {number} val - The number to be rounded.
 * @param {number} decimal - The decimal place targeted in the rounding.
 * @returns {number} - The rounded number to the requested decimal amount.
 */
math.roundTo = function (val, decimal) {
    return Math.round(val * decimal) / decimal;
};

/**
 * @function
 * @memberof math
 * @description Rounds the inputted vector to the nearest decimal place as denoted by the decimal parameter.
 * @example For example: roundTo(<832.456, 92.10003, 23452.1>, 10) = <832.4, 92.1, 2342.1>;
 * @param {vector} vector - The vector of numbers to be rounded.
 * @param {number} decimal - The decimal place targeted in the rounding.
 */
math.roundVectorTo = function (vector, decimal) {
    vector.multiplyScalar(decimal);
    vector.roundToZero();
    vector.divideScalar(decimal);
};

/**
 * @function
 * @memberof math
 * @description Performs the radian To Degree calculation commonly used in math.
 * https://en.wikipedia.org/wiki/Degree_(angle) https://en.wikipedia.org/wiki/Radian
 * @param {number} val - The number to be converted from radians to degrees
 * @returns {number} - the calculated degree representation of val.
 */
math.radToDeg = function (val) {
    return (val * Math.PI) / 180;
};

math.isNormalNumber = function (val) {
    // Check if val is a number, is not NaN, is not Infinity, and is non-negative
    return typeof val === 'number' && isFinite(val) && val >= 0;
};

math.isNumber = function (val) {
    return typeof value === 'number' && isFinite(value);
};

/*******************/
/***** 3D MATH *****/
/*******************/

/**
 * @function
 * @memberof math
 * @description Computes the bounding sphere of an inputted three group object.
 * @param {THREE.group} group - the group to be enclosed in the bounding sphere.
 * @param {THREE.group} relativeTo - object that the group is relative to. For example if the group is an apple held in a
 * character's hand, relativeTo would be the characters hand. When left as null, the bounding sphere defaults to the inputted groups original world matrix.
 * @returns {THREE.Sphere} - the resolved bounding sphere
 */
math.computeBoundingSphere = function (group, relativeTo = null) {
    let sphere = new THREE.Sphere();
    let box = new THREE.Box3();

    box.setFromObject(group);
    box.getBoundingSphere(sphere);

    sphere.applyMatrix4(relativeTo ? relativeTo.matrixWorld : group.matrixWorld);

    return sphere;
};

export { math };
