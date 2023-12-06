import * as THREE from 'three';

/*********** Extensions *************/

String.prototype.spliceSplit = function (index, count, add) {
    const ar = this.split('');
    ar.splice(index, count, add);
    return ar.join('');
};

/*********** JSON // String interactions *************/

/**
 *
 * @param {string} attrString - TODO
 * @returns {object} - TODO
 */
export function stringToJson(attrString) {
    if (attrString == null) {
        return null;
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

// TODO - is this fine here?
/**
 *
 * @param {object} componentData - TODO
 * @returns {string} - TODO
 */
export function jsonToString(componentData) {
    let compString = '';

    for (const [key, value] of Object.entries(componentData)) {
        let stringValue;

        if (Array.isArray(value)) {
            // Convert array of numbers to space-separated string
            stringValue = value.join(' ');
        } else {
            // Use the value directly for numbers and booleans
            stringValue = value.toString();
        }

        // Append the key-value pair to the component string
        compString += `${key}: ${stringValue}; `;
    }

    return compString.trim();
}

/*********** String to Math *************/

/**
 *
 * @param {string} str - TODO
 * @returns {object} - TODO
 */
export function stringToVector(str) {
    return str.split(' ').map(Number);
}

/**
 *
 * @param {string} str - TODO
 * @returns {object} - TODO
 */
export function stringToDegVector(str) {
    return str.split(' ').map((val) => (parseFloat(val) * Math.PI) / 180);
}

/**
 *
 * @param {string} val - TODO
 * @returns {number} - TODO
 */
export function stringToDimensionValue(val) {
    if (val.includes('%')) {
        return parseFloat(val) / 100;
    }
    if (val.includes('/')) {
        return parseInt(val.split('/')[0]) / parseInt(val.split('/')[1]);
    }
    return val;
}
