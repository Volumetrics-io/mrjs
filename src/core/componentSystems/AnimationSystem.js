import * as THREE from 'three';

import { MRSystem } from 'mrjs/core/MRSystem';
import { MRDivEntity } from 'mrjs/core/MRDivEntity';
import { MREntity } from 'mrjs/core/MREntity';
import { MRModel } from 'mrjs/core/entities/MRModel';

/**
 * @class AnimationSystem
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
     * @description Getter to checks if we need to run this system's update call. Overridden implementation returns true if there are any items in this
     * systems registry that need to be run AND the default systemUpdateCheck is true
     * (see [MRSystem.needsSystemUpdate](https://docs.mrjs.io/javascript-api/#mrsystem.needssystemupdate) for default).
     * @returns {boolean} true if the system is in a state where this system is needed to update, false otherwise
     */
    get needsSystemUpdate() {
        return this.registry.size > 0 && super.needsSystemUpdate;
    }

    /**
     * Since this class overrides the default `get` for the `needsSystemUpdate` call, the `set` pair is needed for javascript to be happy.
     * Relies on the parent's implementation. (see [MRSystem.needsSystemUpdate](https://docs.mrjs.io/javascript-api/#mrsystem.needssystemupdate) for default).
     */
    set needsSystemUpdate(bool) {
        super.needsSystemUpdate = bool;
    }

    /**
     * @function
     * @description Updates each animation mixer in the registry. This function should be called
     *      within the main animation loop of the application. It iterates through all the
     *      animation mixers stored in the registry and updates them with the given deltaTime.
     *      The deltaTime parameter is typically the time elapsed since the last frame
     *      which is used to ensure smooth animation playback.
     * @param {number} deltaTime - The time elapsed since the last update call, used to update the animation mixers.
     * @param {object} frame - Additional frame information, not used in the current implementation but can be utilized for future enhancements.
     */
    update(deltaTime, frame) {
        for (const mixer of this.registry) {
            if (mixer) {
                mixer.update(deltaTime);
            }
        }
    }

    /**
     * @function
     * @description Called when a new entity is added to the scene. Handles masking elements to their panel.
     * @param {MREntity} entity - the entity being added.
     */
    onNewEntity(entity) {
        if (entity instanceof MRModel && entity.animations.length > 0) {
            // Create a mixer for each Model instance with animations
            const mixer = new THREE.AnimationMixer(entity.object3D);
            entity.animations.forEach((clip) => {
                mixer.clipAction(clip).play();
            });
            this.registry.add(mixer);

            // Optional: Store the mixer in the Model instance for easy access
            entity.mixer = mixer;
        }
    }
}
