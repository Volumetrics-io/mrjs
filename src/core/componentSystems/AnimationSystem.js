

import * as THREE from 'three';

import { MRSystem } from 'mrjs/core/MRSystem';
import { MRDivEntity } from 'mrjs/core/MRDivEntity';
import { MREntity } from 'mrjs/core/MREntity';
import { Panel } from 'mrjs/core/entities/Panel';

/**
 * @class MaskingSystem
 * @classdesc Handles specific needs for setting up the masking for all necessary items.
 * @augments MRSystem
 */
export class AnimationSystem extends MRSystem {
    /**
     * @class
     * @description AnimationSystem's default constructor.
     */
    constructor() {
        super(false);
    }

    /**
     * @function
     * @description ...
     * @param {number} deltaTime - given timestep to be used for any feature changes
     * @param {object} frame - given frame information to be used for any feature changes
     */
    update(deltaTime, frame) {
        // update the animations
        for (const mixer of this.registry) {
            if (mixer == undefined) { continue; }
            mixer.update(deltaTime);
        }
    }

    /**
     * @function
     * @description Called when a new entity is added to the scene. Handles masking elements to their panel.
     * @param {MREntity} entity - the entity being added.
     */
    onNewEntity(entity) {
        if (entity instanceof Model) {
            entity.traverse((child) => {
                // Since we're stepping through every child, we only need to touch each mesh's material instead of
                // updating group objects as a whole.
                if (!child.object3D.isGroup) {
                    if (this.app.debug) {
                        child.object3D.material.color.set(0x00ff00); // green
                    }
                    if (child.object3D.animations.length > 0) {
                        console.log('animation check');
                        console.log(loadedMeshModel);
                        
                        mixer = new THREE.AnimationMixer(child.object3D);
                        animations.forEach((clip) => {
                          mixer.clipAction(clip).play();
                        });
                        this.registry.add(mixer);
                    }
                }
            }
        }
            
    }
}
