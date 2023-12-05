// TODO - switch to use threejs as base loader in loadTexture (like how we did with loadModel) since we shouldnt need to implement this ourselves.
// this should just be `import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";`

// https://github.com/mrdoob/three.js/issues/5552
// http://en.wikipedia.org/wiki/RGBE_image_format

import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
