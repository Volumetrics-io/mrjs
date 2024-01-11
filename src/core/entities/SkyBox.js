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

        this.skybox = null;
        this.textureLoadedCallbacks = [];
    }

    /**
     * @function
     * @description Callback function triggered when the texture is successfully loaded.
     *              It sets the loaded texture as the background and notifies all registered callbacks.
     * @param {THREE.Texture} texture - The loaded texture.
     */
    onTextureLoaded(texture) {
        if (this.skybox) {
            this.skybox.material = new THREE.MeshBasicMaterial({
                map: texture,
                side: THREE.BackSide, // Render only on the inside
                opacity: 1,
            });
        }
        this.textureLoadedCallbacks.forEach((callback) => callback(texture));
    }

    /**
     * @function
     * @description Lifecycle method that is called when the entity is connected.
     *              This method initializes and starts the texture loading process.
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

        const textureNames = this.texturesList.split(',');
        const path = this.getAttribute('pathToTextures');

        const textureLoader = textureNames.length > 1 ? new THREE.CubeTextureLoader() : new THREE.TextureLoader();
        textureLoader.load(
            textureNames.map((name) => (path ? path + name : name)),
            this.onTextureLoaded.bind(this) // Ensuring the correct context
        );
        const geometry = new THREE.SphereGeometry(1000, 32, 16);

        this.skybox = new THREE.Mesh(geometry); // going to passively load texture on async
        this.object3D.add(this.skybox);
        this.skybox.rotateX(90);
    }

    /**
     * @function
     * @description On load event function - right now defaults to do nothing.
     */
    onLoad = () => {};
}
customElements.define('mr-skybox', SkyBox);
