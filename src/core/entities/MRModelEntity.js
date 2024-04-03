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
        this.loaded = false;

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
     */
    set src(value) {
        this.setAttribute('src', mrjsUtils.html.resolvePath(value));
        this.loaded = false;
        // if(document.body.contains(this)) {
        //     await this.loadModel();
        // }
    }

    /**
     * @function
     * @description Async function that fills in this Model object based on src file information
     */
    async loadModel() {
        const extension = this.src.slice(((this.src.lastIndexOf('.') - 1) >>> 0) + 2);

        try {
            const result = await mrjsUtils.model.loadModel(this.src, extension);

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

            this.loaded = true;

            this.traverseObjects((object) => {
                if (object.isMesh) {
                    object.renderOrder = 3;
                    object.receiveShadow = true;
                    object.castShadow = true;
                }
            });

            this.onLoad();
        } catch (error) {
            console.error(`ERR: in loading model ${this.src}. Error was:`, error);
        }
    }

    /**
     * @function
     * @description Callback function of MREntity - handles setting up this Model once it is connected to run as an entity component.
     * Includes loading up the model and associated data.
     */
    async connected() {
        if (!this.src || this.loaded) {
            return;
        }

        await this.loadModel();
    }

    /**
     * @function
     * @description On load event function - right now defaults to do nothing.
     */
    onLoad = () => {};
}

customElements.get('mr-model') || customElements.define('mr-model', MRModelEntity);
