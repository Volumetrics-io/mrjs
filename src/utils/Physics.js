/**
 * @namespace Physics
 * @description Useful namespace for helping with Physics utility functions
 */
var Physics = {};

/**
 * @property
 * @memberof Physics
 * @description the RAPIER physics controller object
 */
Physics.RAPIER = null;
import('@dimforge/rapier3d').then((rap) => {
    Physics.RAPIER = rap;
    document.dispatchEvent(new CustomEvent('engine-started', { bubbles: true }));
});

// const _INPUT_COLLIDER_HANDLE_NAMES = {};
/**
 * @property
 * @memberof Physics
 * @description the Rapier INPUT_COLLIDER_HANDLE_NAMES
 */
Physics.INPUT_COLLIDER_HANDLE_NAMES = {};//alert(_INPUT_COLLIDER_HANDLE_NAMES);

// const _COLLIDER_ENTITY_MAP = {};
/**
 * @property
 * @memberof Physics
 * @description the Rapier COLLIDER_ENTITY_MAP
 */
Physics.COLLIDER_ENTITY_MAP = {};

export { Physics };
