import * as THREE from 'three';

import { MREntity } from 'mrjs/core/MREntity';

/**
 * @class SkyBox
 * @classdesc The skybox entity that allows users to give multiple images to pattern into the 3D background space. `mr-skybox`
 * @augments MREntity
 */
export class SkyBox extends MREntity {
    /**
     * @class
     * @description Constructor for skybox - defaults to the usual impl of an Entity.
     */
    constructor() {
        super();
        this.object3D.name = 'skybox';
    }

    /**
     * @function
     * @description Callback function of MREntity - handles setting up this Surface once it is connected to run as an entity component.
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
        const textureNames = this.texturesList.split(',');

        let path = this.getAttribute('pathToTextures');
        const texture = !path ? textureLoader.load(textureNames) : textureLoader.load(textureNames.map((name) => path + name));

        // scene.background
        this.object3D.background = texture;
    }

    /**
     * @function
     * @description On load event function - right now defaults to do nothing.
     */
    onLoad = () => {};
}
customElements.define('mr-skybox', SkyBox);
