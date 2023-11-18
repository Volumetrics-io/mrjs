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