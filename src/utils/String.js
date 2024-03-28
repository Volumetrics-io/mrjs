/**
 * @namespace string
 * @description Useful namespace for helping with String utility functions
 */
let string = {};

/*******************************************************/
/************ JSON // String interactions **************/
/*******************************************************/

/**
 * @function
 * @memberof string
 * @description Converts and formats the inputted string to a json object.
 * @param {string} attrString - the string to be formatted
 * @returns {object} - object in json form
 */
string.stringToJson = function (attrString) {
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
};

/**
 * @function
 * @memberof string
 * @description Converts and formats the inputted json object into a string.
 * @param {object} componentData - the json object to be formatted into a string
 * @returns {string} - the string representation of the json object
 */
string.jsonToString = function (componentData) {
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
};

/****************************************/
/*********** String to Math *************/
/****************************************/

/**
 * @function
 * @memberof string
 * @description Converts a string to vector format.
 * @param {string} str - the string to be converted to a vector. Must be of format 'xx xxx xx...'.
 * @returns {object} - the vector version of the inputted string.
 */
string.stringToVector = function (str) {
    return str.split(' ').map(Number);
};

string.vectorToString = function (arr) {
    let str = '';
    for (let i = 0; i < arr.length; ++i) {
        str += arr[i];
        if (i + 1 != arr.length) {
            str += ' ';
        }
    }
    return str;
}

/**
 * @function
 * @memberof string
 * @description Converts a string to vector format where the numbers are pre-converted from radians to degrees.
 * @param {string} str - the string to be converted to a vector. Must be of format 'xx xxx xx...'.
 * @returns {object} - the vector version of the inputted string.
 */
string.stringToDegVector = function (str) {
    return str.split(' ').map((val) => (parseFloat(val) * Math.PI) / 180);
};

/**
 * @function
 * @memberof string
 * @description Converts a string to vector format where the numbers are pre-converted from a number to an appropriate representation
 * @param {string} val - the string to be converted to a vector. Must be of format 'x%' or 'x/y'.
 * @returns {number} - the vector version of the inputted string.
 */
string.stringToDimensionValue = function (val) {
    if (val.includes('%')) {
        return parseFloat(val) / 100;
    }
    if (val.includes('/')) {
        return parseInt(val.split('/')[0]) / parseInt(val.split('/')[1]);
    }
    return val;
};

export { string };
