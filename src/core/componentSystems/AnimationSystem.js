import * as THREE from 'three';

import { MRSystem } from 'mrjs/core/MRSystem';
import { MRDivEntity } from 'mrjs/core/entities/MRDivEntity';
import { MREntity } from 'mrjs/core/MREntity';
import { MRModelEntity } from 'mrjs/core/entities/MRModelEntity';

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
        super();
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
        for (const entity of this.registry) {
            if (entity.mixer) {
                entity.mixer.update(deltaTime);
            }
        }
    }

    attachedComponent(entity) {
        let comp = entity.components.get('animation');
        if (entity instanceof MRModelEntity && entity.animations.length > 0) {
            // Create a mixer for each Model instance with animations
            entity.mixer = new THREE.AnimationMixer(entity.object3D);
            this.setAnimation(entity, comp);
        }
    }

    updatedComponent(entity) {
        let comp = entity.components.get('animation');
        if (entity instanceof MRModelEntity && entity.animations.length > 0) {
            this.setAnimation(entity, comp);
        }
    }

    detachedComponent(entity) {
        entity.mixer.stopAllActions();
    }

    onNewEntity(entity) {
        if (entity instanceof MRModelEntity && entity.animations.length > 0) {
            let comp = entity.components.get('animation');
            if (!comp) {
                return;
            }
            this.registry.add(entity);
            entity.mixer = new THREE.AnimationMixer(entity.object3D);
            this.setAnimation(entity, comp);
        }
    }

    setAnimation(entity, comp) {
        let clip = entity.animations[comp.clip];
        switch (comp.action) {
            case 'play':
                entity.mixer.clipAction(clip).play();
                break;
            case 'pause':
                entity.mixer.clipAction(clip).pause();
                break;
            case 'stop':
                entity.mixer.clipAction(clip).stop();
                break;
            default:
                break;
        }
    }
}
