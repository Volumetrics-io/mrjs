import * as THREE from 'three';

import { MRSystem } from 'mrjs/core/MRSystem';
import { MREntity } from 'mrjs/core/MREntity';
import { MRDivEntity } from 'mrjs/core/entities/MRDivEntity';
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

    /**
     * @function
     * @description (async) Called when the entity component is initialized
     * @param {object} entity - the entity being attached/initialized.
     */
    async attachedComponent(entity) {
        let comp = entity.components.get('animation');
        // the animations list does not load immediately, so we set a promise to wait for the model to load.
        await new Promise((resolve) => {
            const interval = setInterval(() => {
                if (entity.loaded) {
                    clearInterval(interval);
                    resolve();
                }
            }, 100); // Checks every 100ms
        });

        if (entity instanceof MRModelEntity && entity.animations.length > 0) {
            // Create a mixer for each Model instance with animations
            entity.mixer = new THREE.AnimationMixer(entity.object3D);
            this.setAnimation(entity, comp);
        }
    }

    /**
     * @function
     * @description Called when the entity component is updated
     * @param {object} entity - the entity being updated based on the component.
     */
    updatedComponent(entity) {
        let comp = entity.components.get('animation');
        if (entity instanceof MRModelEntity && entity.animations.length > 0) {
            this.setAnimation(entity, comp);
        }
    }

    /**
     * @function
     * @description Called when the entity component is detached
     * @param {object} entity - the entity being updated based on the component being detached.
     */
    detachedComponent(entity) {
        entity.mixer.stopAllActions();
    }

    /**
     * @function
     * @description When the system swaps to a new entity, this handles setting up the animations for the system runs.
     * @param {object} entity - given entity that might be handled by the system.
     */
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

    /**
     * @function
     * @description Sets the Animation of the entity object based on the component value associated with it.
     * @param {object} entity - the entity being updated based on the component being detached.
     * @param {object} comp - component that contains a string value of 'play', 'pause', 'stop'
     */
    setAnimation(entity, comp) {
        let clip = entity.animations[comp.clip];
        let action =  entity.mixer.clipAction(clip);
        switch (comp.action) {
            case 'play':
                action.play();
                break;
            case 'pause':
                action.pause();
                break;
            case 'stop':
                action.stop();
                break;
            default:
                mrjsUtils.err.error('Unknown case hit for action in the AnimationSystem from entity:', entity, '. Comp is:', comp);
                break;
        }
        if (comp.hasOwnProperty('loop')) {
            switch (comp.loop) {
                case 'true':
                    action.setLoop(THREE.LoopRepeat, Infinity);
                    break;
                case 'false':
                    action.setLoop(THREE.LoopOnce, 1);
                    break;
                default:
                     if (!comp.hasOwnProperty('loopMode')) {
                        mrjsUtils.err.error('loopMode must be set when using loop as count instead of true/false. entity:', entity, ' comp:', comp);
                    }
                    let loopCount = +comp.loop;
                    if (! mrjsUtils.math.isNormalNumber(comp.loop)) {
                        mrjsUtils.err.error('Trying to use an invalid number value for loop with loopMode in the AnimationSystem from entity:', entity, '. Comp is:', comp);
                    }
                    switch (comp.loopMode) {
                        case 'repeat':
                            action.setLoop(THREE.LoopRepeat, loopCount);
                            break;
                        case 'once':
                            action.setLoop(THREE.LoopOnce, 1);
                            break;
                        case 'pingpong'
                            action.setLoop(THREE.LoopPingPong, loopCount);
                            break;
                        default:
                            mrjsUtils.err.error('Unknown case hit for loopMode in the AnimationSystem from entity:', entity, '. Comp is:', comp);
                            break;
                    }
                    let val = +comp.loop;
                    if (mrjsUtils.math.isNormalNumber(comp.loop)) {
                        entity.mixer.clipAction(clip).
                    }
        }
    }
}
