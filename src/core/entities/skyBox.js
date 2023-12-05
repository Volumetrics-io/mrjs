import * as THREE from 'three';

import { MREntity } from 'MRJS/core/mrEntity';

/**
 *
 */
class SkyBox extends MREntity {
    /**
     *
     */
    constructor() {
        super();
    }

    /**
     *
     */
    connected() {
        // you can have texturesList be all individual textures
        // or you can store them in a specified path and just
        // load them up solely by filename in that path.

        this.texturesList = this.getAttribute('src');
        if (!this.texturesList) {
            return;
        }

        const textureLoader = THREE.CubeTextureLoader();
        const textureNames = texturesList.split(',');

        let path = this.getAttribute('pathToTextures');
        const texture = !path ? textureLoader.load(textureNames) : textureLoader.load(textureNames.map((name) => path + name));

        // scene.background
        this.object3D.background = texture;
    }

    onLoad = () => {};
}
customElements.define('mr-skybox', SkyBox);
