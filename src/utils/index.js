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
import { model } from './Model.js';
import { mathUtils } from './MathUtils.js';
import { math3D } from './Math3D.js';
import { physics } from './Physics.js';
import { stringUtils } from './StringUtils.js';
import { xr } from './XR.js';

const mrjsUtils = {
    app,
    css,
    display,
    geometry,
    html,
    js,
    material,
    model,
    mathUtils,
    math3D,
    physics,
    stringUtils,
    xr,
};

export { mrjsUtils }; // Export as named export
