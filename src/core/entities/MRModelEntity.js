import { MREntity } from 'mrjs/core/MREntity';

import { mrjsUtils } from 'mrjs';
import { MRDivEntity } from 'mrjs/core/entities/MRDivEntity';

/**
 * @class MRModelEntity
 * @classdesc Loads in any supported 3D model type to the requested location. `mr-model`
 * @augments MRDivEntity
 */
export class MRModelEntity extends MRDivEntity {
    /**
     * @class
     * @description Constructor for the Model entity, does the default.
     */
    constructor() {
        super();

        this.ignoreStencil = true;

        this.object3D.name = 'model';

        // TODO: replace with single status enum.
        this.loading = false;
        this.loaded = false;

        this.modelObj = null;

        // Store animations for the AnimationSystem to use
        // Need to store this separately from the model, because with
        // the threejs load from glb, we cant directly add it back to
        // the model group itself as overarching animation as we're not
        // guaranteed that theyre not animations for sub-group objects.
        this.animations = [];
    }

    #src = null;

    /**
     * @function
     * @description Pair getter for the src property of <mr-model>. Important so that when a user tries
     * to run modelObject.src = `...` or perform something on modelObject.src it properly gets the html
     * attribute as expected instead of the pure js one.
     *
     * note: we can do this because only htmlimageelement has a `src` property by default, not htmlimagelement,
     * and none of the above class extensions for Model have it as a defined property.
     * @returns {string} the value of the src html attribute
     */
    get src() {
        return this.#src;
    }

    /**
     * @function
     * @description Setter for the src property of <mr-model>. Important so that when a user tries
     * to run modelObject.src = `...` it properly sets the html attribute as expected instead of the
     * pure js one.
     *
     * note: we can do this because only htmlimageelement has a `src` property by default, not htmlimagelement,
     * and none of the above class extensions for Model have it as a defined property.
     */
    set src(value) {
        if (this.#src != value) {
            this.#src = value;
            if (this.#src != this.getAttribute('src')) {
                this.setAttribute('src', value);
            }
        }
    }

    /**
     * @function
     * @description Callback function of MREntity - Updates the media's cover,fill,etc based on the mutation request.
     * @param {object} mutation - the update/change/mutation to be handled.
     */
    mutated(mutation) {
        super.mutated();

        if (mutation.type == 'attributes' && mutation.attributeName == 'src') {
            this.src = this.getAttribute('src');
            if (!this.loading) {
                this.loadModel();
            }
        }
    }

    /**
     * @function
     * @description Async function that fills in this Model object based on src file information
     */
    async loadModel() {
        this.loading = true;

        const extension = this.src.slice(((this.src.lastIndexOf('.') - 1) >>> 0) + 2);

        let modelChanged = false;
        if (this.modelObj) {
            this.modelObj.visible = false;
            while (this.modelObj.parent) {
                this.modelObj.removeFromParent();
            }

            this.modelObj = null;
            modelChanged = true;
        }

        try {
            let url = mrjsUtils.html.resolvePath(this.src);
            const result = await mrjsUtils.model.loadModel(url, extension);

            // Handle the different formats of the loaded result
            this.modelObj =
                result?.scene ?? false
                    ? // For loaders that return an object with multiple properties (scene, animation, joints, etc)
                      // For ex: GLB
                      result.scene
                    : // For loaders that return the object directly
                      // For ex: STL, OBJ, FBX
                      result;
            let animations = result.animations;
            if (animations && animations.length > 0) {
                this.animations = animations;
            }

            this.object3D.add(this.modelObj);

            this.modelObj.receiveShadow = true;
            this.modelObj.renderOrder = 3;

            this.traverseObjects((object) => {
                if (object.isMesh) {
                    object.renderOrder = 3;
                    object.receiveShadow = true;
                    object.castShadow = true;
                }
            });

            this.onLoad();

            this.loading = false;

            this.loaded = true;

            if (this.isConnected && modelChanged) {
                this.dispatchEvent(new CustomEvent('modelchange', { bubbles: true }));
            }
        } catch (error) {
            console.error(`ERR: in loading model ${this.src}. Error was:`, error);
        }
    }

    /**
     * @function
     * @description (async) Callback function of MREntity - handles setting up this Model once it is connected to run as an entity component.
     * Includes loading up the model and associated data.
     */
    async connected() {
        this.src = this.getAttribute('src');
        if (!this.src || this.loaded) {
            return new Promise((resolve) => {
                const interval = setInterval(() => {
                    if (this.loaded) {
                        clearInterval(interval);
                        resolve();
                    }
                }, 100);
            });
        }

        if (!this.loading) {
            await this.loadModel();
        } else {
            return new Promise((resolve) => {
                const interval = setInterval(() => {
                    if (this.loaded) {
                        clearInterval(interval);
                        resolve();
                    }
                }, 100);
            });
        }
    }

    /**
     * @function
     * @description On load event function - right now defaults to do nothing.
     */
    onLoad = () => {};
}

customElements.get('mr-model') || customElements.define('mr-model', MRModelEntity);
