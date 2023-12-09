export const VIRTUAL_DISPLAY_RESOLUTION = 1080;

global.viewPortHeight = 0;
global.viewPortWidth = 0;

global.inXR = false;

// lol chatGPT made this.
/**
 *
 * @param compString
 */
export function parseComponentString(compString) {
    const regexPattern = /(\w+):\s*([^;]+)/g;
    const jsonObject = {};

    let match;
    while ((match = regexPattern.exec(compString)) !== null) {
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
 * @param componentData
 */
export function stringifyComponent(componentData) {
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

/**
 *
 * @param group
 * @param relativeTo
 */
export function computeBoundingSphere(group, relativeTo = null) {
    let sphere = new THREE.Sphere();
    let box = new THREE.Box3();

    box.setFromObject(group);
    box.getBoundingSphere(sphere);

    if (relativeTo) {
        sphere.applyMatrix4(relativeTo.matrixWorld);
    } else {
        sphere.applyMatrix4(group.matrixWorld);
    }

    return sphere;
}

/**
 *
 * @param val
 */
export function threeToPx(val) {
    return (val / global.viewPortHeight) * window.innerHeight;
}

/**
 *
 * @param val
 */
export function pxToThree(val) {
    if (global.inXR) {
        return (val.split('px')[0] / window.innerWidth) * this.windowHorizontalScale;
    }
    return (val.split('px')[0] / window.innerWidth) * global.viewPortWidth;
}
