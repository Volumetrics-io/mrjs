import * as THREE from 'three';

import { MRSystem } from 'mrjs/core/MRSystem';
import { MRSkyBox } from 'mrjs/core/entities/MRSkyBox';


/**
 * @class SkyBoxSystem
 * @classdesc Handles specific needs for setting up the masking for all necessary items.
 * @augments MRSystem
 */
export class SkyBoxSystem extends MRSystem {
    /**
     * @class
     * @description MaskingSystem's default constructor.
     */
    constructor() {
        super(false);

        // Optimization: set the scene background to the current skybox image if only one found
        // otherwise default to the XR version of skyboxing to allow for blending / opacity
        // since threejs skybox default only allows for one at a time.
        //
        // This is the singular skybox that is stored to be used for a scene background
        // when in website version. For now we do things this way since threejs does not support
        // multiple skyboxes yet - when it does, we wont need to grab a singular skybox this way
        // and we can swap back to solely relying on visibility and opacity.
        this.swappingSkybox = undefined;

        // Using the first run to make sure it's in the proper mode (MR or web)
        this.needsSystemUpdate = true;
        this.inXR = false;
        // Listen to an update based on the enter/exit trigger.
        document.addEventListener('enterXR', (event) => {
            if (!this.alwaysNeedsSystemUpdate) {
                this.needsSystemUpdate = true;
            }
            this.inXR = true;
        });
        document.addEventListener('exitXR', (event) => {
            if (!this.alwaysNeedsSystemUpdate) {
                this.needsSystemUpdate = true;
            }
            this.inXR = false;
        });
    }

    /**
     * @function
     * @description ...
     * @param {number} deltaTime - given timestep to be used for any feature changes
     * @param {object} frame - given frame information to be used for any feature changes
     */
    update(deltaTime, frame) {
        if (this.registry.size() == 0) {
            console.log('did not find skybox image to use');
        }

        if (this.inXR) {
            this.app.scene.background = undefined;
            this.swappingSkybox.object3D.visible = true;
        } else if (!this.inXR && this.app.scene.background === undefined) {
            let currentSkyboxImage = null;
            let grabbed = Set();
            for (let skybox of this.registry) {
                if (skybox.object3D.opacity > 0 && skybox.object3D.visible) {
                    grabbed.add(skybox);
                }
            }

            // Optimization: set the scene background to the current skybox image if only one found
            // otherwise default to the XR version of skyboxing to allow for blending / opacity
            // since threejs skybox default only allows for one at a time.
            if (grabbed.length == 0) {
                console.log('did not find skybox image to use, sticking to MR version');
            } else if (grabbed.length == 1) {
                this.app.scene.background = grabbed[0].material;
                this.swappingSkybox = grabbed[0];
                grabbed.object3D.visible = false;
            }
        }
    }

    /**
     * @function
     * @description Called when a new entity is added to the scene. Handles masking elements to their panel.
     * @param {MREntity} entity - the entity being added.
     */
    onNewEntity(entity) {
        if (entity instanceof MRSkyBox) {
            this.registry.add(entity);
        }
    }
}
