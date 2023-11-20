import * as THREE from 'three';

/**
 *
 * @param str
 */
export function parseVector(str) {
    return str.split(' ').map(Number);
}

/**
 *
 * @param str
 */
export function parseDegVector(str) {
    return str.split(' ').map((val) => (parseFloat(val) * Math.PI) / 180);
}

/**
 *
 * @param val
 */
export function radToDeg(val) {
    return (val * Math.PI) / 180;
}

/**
 *
 * @param val
 */
export function parseDimensionValue(val) {
    if (val.includes('%')) {
        return parseFloat(val) / 100;
    }
    if (val.includes('/')) {
        return parseInt(val.split('/')[0]) / parseInt(val.split('/')[1]);
    }
    return val;
}

/**
 *
 * @param entity
 */
export function setTransformValues(entity) {
    const position = entity.getAttribute('position');
    const scale = entity.getAttribute('scale');
    const rotation = entity.getAttribute('rotation');

    if (position) {
        entity.object3D.position.fromArray(parseVector(position));
    }

    if (scale) {
        entity.object3D.scale.fromArray(parseVector(scale));
    }

    if (rotation) {
        const euler = new THREE.Euler();
        const array = parseVector(rotation).map(radToDeg);
        euler.fromArray(array);
        entity.object3D.setRotationFromEuler(euler);
    }
}

/**
 *
 * @param attrString
 */
export function parseAttributeString(attrString) {
    if (attrString == null) {
        return;
    }
    const regexPattern = /(\w+):\s*([^;]+)/g;
    const jsonObject = {};

    let match;
    while ((match = regexPattern.exec(attrString)) !== null) {
        const key = match[1].trim();
        let value = match[2].trim();

        // Check value type and convert if necessary
        if (value.includes(' ')) {
            value = value.split(' ').map((v) => parseFloat(v));
        } else if (/^\d+(\.\d+)?$/.test(value)) {
            value = parseFloat(value);
        } else if (value === 'true') {
            value = true;
        } else if (value === 'false') {
            value = false;
        }

        jsonObject[key] = value;
    }

    return jsonObject;
}

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
