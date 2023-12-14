/**
 * @module mrjsUtils
 * @description mrjsUtils module acts as a one stop shop for all global util functions of mrjs.
 * Items can be grabbed by importing as `import { mrjsUtils } from 'mrjs';` and calling them through `mrjsUtils.ParentFile.functionName(...);`
 */

// TODO - this should auto grab instead of manually be updated as manual updates will create problems.

import * as Css from './Css.js';
import * as Display from './Display.js';
import * as Geometry from './Geometry.js';
import * as Material from './Material.js';
import * as Model from './Model.js';
import * as Math from './Math.js';
import * as Math3D from './Math3D.js';
import * as Physics from './Physics.js';
import * as String from './String.js';

export default {
    Css,
    Display,
    Geometry,
    Material,
    Model,
    Math,
    Math3D,
    Physics,
    String,
};
