import * as THREE from 'three';

import { MRSystem } from 'mrjs/core/MRSystem';
import { MREntity } from 'mrjs/core/MREntity';
import { MRDivEntity } from 'mrjs/core/entities/MRDivEntity';
import { MRModelEntity } from 'mrjs/core/entities/MRModelEntity';

import { mrjsUtils } from 'mrjs';

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
            if (!entity.mixer) {
                // set it only if not yet set by onNewEntity
                entity.mixer = new THREE.AnimationMixer(entity.object3D);
            }
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
            if (!entity.mixer) {
                // set it only if not yet set by attachedComponent
                entity.mixer = new THREE.AnimationMixer(entity.object3D);
            }
            this.setAnimation(entity, comp);
        }
    }

    /**
     * @function
     * @description Sets the Animation of the entity object based on the component value associated with it. Otherwise lets those
     * be handled by the threejs default setup. (Always looping, always playing based on browser type, etc).
     * @param {object} entity - the entity being updated based on the component being detached.
     * @param {object} comp - component that contains the values of 'action', 'loop', and/or 'loopMode'
     */
    setAnimation(entity, comp) {
        const _perform = (clip, comp, action, entity) => {

            /* ----- Handle all the settings for the animation ----- */

            // Handle ending position. Threejs defaults to the starting position; when
            // `clampWhenFinished` is true, it defaults the stop position as the ending
            // clip of the animation.
            action.clampWhenFinished = comp.clampWhenFinished ?? false;

            let hasLoop = comp.hasOwnProperty('loop');
            let hasLoopMode = comp.hasOwnProperty('loopMode');
            if (hasLoop || hasLoopMode) {
                if (hasLoop && !hasLoopMode) {
                    switch (comp.loop) {
                        case true:
                        case 'true':
                            action.setLoop(THREE.LoopRepeat, Infinity);
                            break;
                        case false:
                        case 'false':
                            action.setLoop(THREE.LoopOnce, 1);
                            break;
                        default:
                            // loopMode doesnt exist so we hit an unexpected value
                            mrjsUtils.error.err(
                                'Bad configuration for loop. It isnt set to true/false (did you mean to pair it with loopMode?) specified in the AnimationSystem from entity:',
                                entity,
                                ' Comp:',
                                comp
                            );
                            return;
                    }
                } else if (hasLoopMode && !hasLoop) {
                    // The only time where loop doesnt need to exist but loopMode does is for 'once'. Additionally, note that we also
                    // handle this version of loopMode even in the case where loop count exists.
                    if (comp.loopMode === 'once') {
                        action.setLoop(THREE.LoopOnce, 1);
                    } else {
                        mrjsUtils.error.err(
                            'Bad configuration, loopMode isnt `once`, but loop isnt set (did you mean to pair it with loop?) specified in the AnimationSystem from entity:',
                            entity,
                            ' Comp:',
                            comp
                        );
                        return;
                    }
                } else if (hasLoop && hasLoopMode) {
                    // Convert comp.loop to a number, and check if it's a valid normal number or Infinity
                    let loopCount = Number(comp.loop);
                    if (!((Number.isInteger(loopCount) && loopCount >= 0) || loopCount === Infinity)) {
                        mrjsUtils.error.err('loop must be a non-negative integer or Infinity when using loop as count. Entity:', entity, ' Comp:', comp);
                        return;
                    }
                    // Use the appropriate looping based on loopMode
                    switch (comp.loopMode) {
                        case 'repeat':
                            action.setLoop(THREE.LoopRepeat, loopCount);
                            break;
                        case 'pingpong':
                            action.setLoop(THREE.LoopPingPong, loopCount);
                            break;
                        case 'once':
                            action.setLoop(THREE.LoopOnce, 1);
                            break;
                        default:
                            mrjsUtils.error.err('Unknown loopMode specified in the AnimationSystem from entity:', entity, ' Comp:', comp);
                            break;
                    }
                } else {
                    // hasLoop and both hasLoopMode are false, should never reach this case so error as failsafe
                    mrjsUtils.error.err('Hit unreachable code - major error in AnimationSystem loop handling');
                }
            }

            /* ----- Now actually handle playing the animation ----- */

            if (comp.hasOwnProperty('action')) {
                switch (comp.action) {
                    case 'play':
                        action.reset().play();
                        break;
                    case 'pause':
                        action.pause();
                        break;
                    case 'stop':
                        action.stop();
                        break;
                    default:
                        mrjsUtils.error.err('Unknown case hit for action in the AnimationSystem from entity:', entity, '. Comp is:', comp);
                        return;
                }
            }
        };

        // XXX in future - add conditions to play specific animations based on names/properties/etc.
        //
        // For now, just hitting the user-specific clip or looping through all existing ones to
        // update as needed.
        if (comp.hasOwnProperty('clip')) {
            let clip = entity.animations[comp.clip];

            entity.traverseObjects((object) => {
                if (object.isMesh) {
                    // Check if there are any animation clips associated with the child object3D
                    if (clip && clip.duration !== undefined && clip.duration > 0) {
                        // If an animation clip is found and it has a valid duration, play it
                        let action = entity.mixer.clipAction(clip);
                        _perform(clip, comp, action, entity);
                    }
                }
            });
        } else {
            entity.animations.forEach((clip, index) => {
                let action = entity.mixer.clipAction(clip);
                _perform(clip, comp, action, entity);
            });
        }
    }
}
