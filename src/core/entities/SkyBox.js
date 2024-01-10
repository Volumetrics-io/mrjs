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
        this.geometry = new THREE.SphereGeometry(1000, 32, 16);

        const textureLoader = new THREE.TextureLoader();
        this.texture = textureLoader.load(this.texturesList);
        this.material = new THREE.MeshStandardMaterial({
            opacity: 1,
            side:1,
            map: this.texture
        });

        this.skybox = new THREE.Mesh(this.geometry, this.material);
        this.object3D.add(this.skybox)
        this.skybox.rotateX(90)

    }

    /**
     * @function
     * @description On load event function - right now defaults to do nothing.
     */
    onLoad = () => {};
}
customElements.define('mr-skybox', SkyBox);
