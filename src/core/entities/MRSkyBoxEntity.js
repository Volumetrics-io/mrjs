import * as THREE from 'three';

import { MREntity } from 'mrjs/core/MREntity';
import { MRSystem } from 'mrjs/core/MRSystem';

/**
 * @class MRSkyBoxEntity
 * @classdesc The skybox entity that allows users to give multiple images to pattern into the 3D background space. `mr-skybox`
 * @augments MREntity
 */
export class MRSkyBoxEntity extends MREntity {
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
            if (Array.isArray(texture.images) && texture.images.length === 6) {
                // Handle cube texture case
                if (this.skybox.material !== undefined) {
                    this.skybox.material.dispose();
                }
                const material = mrjsUtils.material.MeshStandardMaterial.clone();
                material.envMap = texture;
                material.side = THREE.BackSide;
                material.programName = 'skyboxMaterial-1';
                this.skybox.material = material;
            } else {
                // Handle single texture case
                if (this.skybox.material !== undefined) {
                    this.skybox.material.dispose();
                }
                const material = mrjsUtils.material.MeshBasicMaterial.clone();
                material.envMap = texture;
                material.side = THREE.BackSide;
                material.opacity = 1;
                material.programName = 'skyboxMaterial-2';
                this.skybox.material = material;
            }
        }
        this.textureLoadedCallbacks.forEach((callback) => callback(texture));
    }

    /**
     * @function
     * @description (async) Lifecycle method that is called when the entity is connected.
     *              This method initializes and starts the texture loading process.
     */
    async connected() {
        // you can have texturesList be all individual textures
        // or you can store them in a specified path and just
        // load them up solely by filename in that path.

        this.texturesList = mrjsUtils.html.resolvePath(this.getAttribute('src'));
        if (!this.texturesList) {
            return;
        }

        const textureNames = this.texturesList.split(',');
        const path = this.getAttribute('pathToTextures');
        const textureUrls = textureNames.map((name) => mrjsUtils.html.resolvePath(path ? path + name : name));

        let geometry;
        let textureLoader;
        if (textureNames.length > 1) {
            geometry = new THREE.BoxGeometry(900, 900, 900);
            textureLoader = new THREE.CubeTextureLoader();
            textureLoader.load(textureUrls, this.onTextureLoaded.bind(this));
        } else if (textureUrls.length == 1) {
            geometry = new THREE.SphereGeometry(900, 32, 16);
            textureLoader = new THREE.TextureLoader();
            textureLoader.load(textureUrls[0], this.onTextureLoaded.bind(this));
        }

        if (this.skybox) {
            // Remove existing skybox if present
            this.object3D.remove(this.skybox);
            this.skybox.dispose();
        }
        this.skybox = new THREE.Mesh(geometry); // going to passively load texture on async
        this.object3D.add(this.skybox);
    }

    /**
     * @function
     * @description Set the opacity of the skybox itself. Useful for blending between the outside and MR. Also
     * useful for cases where you want to blend between different skybox versions.
     */
    set setOpacity(val) {
        this.object3D.traverse((child) => {
            if (child.isMesh) {
                child.material.transparent = true;
                child.material.opacity = val;
                child.material.needsUpdate = true;
            }
        });
    }

    /**
     * @function
     * @description On load event function - right now defaults to do nothing.
     */
    onLoad = () => {};
}
customElements.define('mr-skybox', MRSkyBoxEntity);
