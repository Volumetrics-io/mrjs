/**
 * @namespace physics
 * @description Useful namespace for helping with physics utility functions
 */
let physics = {};

/**
 * @memberof physics
 * @description the Rapier collision groups used throughout MRjs
 */
physics.CollisionGroups = {
    USER: 0x00020001,
    PLANES: 0x0004ffff,
    UI: 0x00010002,
};

/**
 * @memberof physics
 * @description the RAPIER physics controller object
 */
physics.RAPIER = null;

let rapierLoaded = false;
physics.initializePhysics = async function () {
    if (!rapierLoaded) {
        physics.RAPIER = await import('@dimforge/rapier3d');
        rapierLoaded = true;
        physics.eventQueue = new physics.RAPIER.EventQueue(true);
        physics.world = new physics.RAPIER.World({ x: 0.0, y: -9.81, z: 0.0 });

        document.dispatchEvent(new CustomEvent('engine-started', { bubbles: true }));
    }
    return physics;
};

// const _INPUT_COLLIDER_HANDLE_NAMES = {};
/**
 * @memberof physics
 * @description the Rapier INPUT_COLLIDER_HANDLE_NAMES
 */
physics.INPUT_COLLIDER_HANDLE_NAMES = {}; //alert(_INPUT_COLLIDER_HANDLE_NAMES);

// const _COLLIDER_ENTITY_MAP = {};
/**
 * @memberof physics
 * @description the Rapier COLLIDER_ENTITY_MAP
 */
physics.COLLIDER_ENTITY_MAP = {};

export { physics };
