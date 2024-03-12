// /**
//  * @module mrjsUtils
//  * @description mrjsUtils module acts as a one stop shop for all global util functions of mrjs.
//  * Items can be grabbed by importing as `import { mrjsUtils } from 'mrjs';` and calling them through `mrjsUtils.ParentFile.functionName(...);`
//  */

// // TODO - this should auto grab instead of manually be updated as manual updates will create problems.

import { app } from './App.js';
import { css } from './CSS.js';
import { display } from './Display.js';
import { geometry } from './Geometry.js';
import { html } from './HTML.js';
import { js } from './JS.js';
import { material } from './Material.js';
import { math } from './Math.js';
import { model } from './Model.js';
import { error, warn } from './Notify.js';
import { physics } from './Physics.js';
import { string } from './String.js';
import { xr } from './XR.js';

const mrjsUtils = {
    app,
    css,
    display,
    error,
    geometry,
    html,
    js,
    material,
    math,
    model,
    physics,
    string,
    warn,
    xr,
};

export { mrjsUtils }; // Export as named export
