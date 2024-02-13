// /**
//  * @module mrjsExtras
//  * @description mrjsExtras module acts as a one stop shop for all extras of mrjs. Ie things that are part of it for now but arent part of the main library.
//  * Items can be grabbed by importing as `import { class } from 'mrjs';` like any other class in mrjs.
//  */

// // TODO - this should auto grab instead of manually be updated as manual updates will create problems.

import { Refractor } from './Refractor.js';
import { Water, WaterSystem } from './Water.js';

export { Refractor, Water, WaterSystem };
export { WaterRefractionShader } from 'three/examples/jsm/shaders/WaterRefractionShader.js';
