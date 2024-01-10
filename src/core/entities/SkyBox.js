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

        this.background = null;
        this.textureLoadedCallbacks = [];
    }

    /**
     * @function
     * @description Callback function triggered when the texture is successfully loaded.
     *              It sets the loaded texture as the background and notifies all registered callbacks.
     * @param {THREE.Texture} texture - The loaded texture.
     */
    onTextureLoaded(texture) {
        this.background = texture;
        this.textureLoadedCallbacks.forEach((callback) => callback(texture));
    }

    /**
     * @function
     * @description Registers a callback to be called when the texture is loaded.
     *              If the texture is already loaded, the callback is called immediately.
     * @param {function(THREE.Texture): void} callback - The callback function to be called with the loaded texture.
     */
    addTextureLoadedCallback(callback) {
        if (this.background) {
            // If the texture is already loaded, call the callback immediately
            callback(this.background);
        } else {
            // Otherwise, store the callback to be called when the texture loads
            this.textureLoadedCallbacks.push(callback);
        }
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

        const textureNames = this.texturesList.split(',');
        const path = this.getAttribute('pathToTextures');

        const textureLoader = textureNames.length > 1 ? new THREE.CubeTextureLoader() : new THREE.TextureLoader();
        textureLoader.load(
            textureNames.map((name) => (path ? path + name : name)),
            this.onTextureLoaded.bind(this) // Ensuring the correct context
        );
    }

    /**
     * @function
     * @description On load event function - right now defaults to do nothing.
     */
    onLoad = () => {};
}
customElements.define('mr-skybox', SkyBox);
