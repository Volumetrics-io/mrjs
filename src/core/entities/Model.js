import { MREntity } from 'mrjs/core/MREntity';

import { mrjsUtils } from 'mrjs';

/**
 * @class Model
 * @classdesc Loads in any supported 3D model type to the requested location. `mr-model`
 * @augments MREntity
 */
export class Model extends MREntity {

    /**
     * @class
     * @description Constructor for the Model entity, does the default.
     */
    constructor() {
        super();

        this.ignoreStencil = true;
        this.object3D.name = 'model';

        // Store animations for the AnimationSystem to use
        // Need to store this separately from the model, because with
        // the threejs load from glb, we cant directly add it back to
        // the model group itself as overarching animation as we're not
        // guaranteed that theyre not animations for sub-group objects.
        this.animations = [];
    }

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
        return this.getAttribute('src');
    }

    /**
     * @function
     * @description Setter for the src property of <mr-model>. Important so that when a user tries
     * to run modelObject.src = `...` it properly sets the html attribute as expected instead of the
     * pure js one.
     * 
     * note: we can do this because only htmlimageelement has a `src` property by default, not htmlimagelement,
     * and none of the above class extensions for Model have it as a defined property.
     * @returns {string} the value of the src html attribute
     */
    set src(value) {
        this.setAttribute('src', value);
    }

    /**
     * @function
     * @description Async function that fills in this Model object based on src file information
     */
    async loadModel() {
        const extension = this.src.slice(((this.src.lastIndexOf('.') - 1) >>> 0) + 2);

        try {
            const result = await mrjsUtils.Model.loadModel(this.src, extension);

            let loadedMeshModel, animations;

            // Handle the different formats of the loaded result
            if (result.scene) {
                // For loaders that return an object with multiple properties (scene, animation, joints, etc)
                // For ex: GLB
                loadedMeshModel = result.scene;
                animations = result.animations;
            } else {
                // For loaders that return the object directly
                // For ex: STL
                loadedMeshModel = result;
            }

            this.object3D.add(loadedMeshModel);

            loadedMeshModel.receiveShadow = true;
            loadedMeshModel.renderOrder = 3;

            if (animations && animations.length > 0) {
                this.animations = animations;
            }

            this.dispatchEvent(new CustomEvent('new-entity', { bubbles: true }));
        } catch (error) {
            console.error(`ERR: in loading model ${this.src}. Error was:`, error);
        }
    }

    /**
     * @function
     * @description Callback function of MREntity - handles setting up this Model once it is connected to run as an entity component.
     * Includes loading up the model and associated data.
     */
    connected() {
        if (!this.src) {
            return;
        }

        this.loadModel();
    }

    /**
     * @function
     * @description On load event function - right now defaults to do nothing.
     */
    onLoad = () => {};
}

customElements.get('mr-model') || customElements.define('mr-model', Model);
