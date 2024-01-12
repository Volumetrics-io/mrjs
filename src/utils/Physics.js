/**
 * @namespace Physics
 * @description Useful namespace for helping with Physics utility functions
 */
let Physics = {};

/**
 * @memberof Physics
 * @description the Rapier collision groups used throughout mr.js
 */
Physics.CollisionGroups = {
    USER: 0x000d0001,
    PLANES: 0x000d0002,
    UI: 0x00010001,
};

/**
 * @memberof Physics
 * @description the RAPIER physics controller object
 */
Physics.RAPIER = null;

let rapierLoaded = false;
Physics.initializePhysics = async function () {
    if (!rapierLoaded) {
        Physics.RAPIER = await import('@dimforge/rapier3d');
        rapierLoaded = true;
        document.dispatchEvent(new CustomEvent('engine-started', { bubbles: true }));
    }
    return Physics;
};

// const _INPUT_COLLIDER_HANDLE_NAMES = {};
/**
 * @memberof Physics
 * @description the Rapier INPUT_COLLIDER_HANDLE_NAMES
 */
Physics.INPUT_COLLIDER_HANDLE_NAMES = {}; //alert(_INPUT_COLLIDER_HANDLE_NAMES);

// const _COLLIDER_ENTITY_MAP = {};
/**
 * @memberof Physics
 * @description the Rapier COLLIDER_ENTITY_MAP
 */
Physics.COLLIDER_ENTITY_MAP = {};

export { Physics };
