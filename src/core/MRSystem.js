import { MREntity } from 'mrjs/core/MREntity';

/*
 * @description Listing of events that are considered global scene updates.
 * These trigger the `eventUpdate` function call.
 */
const GLOBAL_UPDATE_EVENTS = ['enterxr', 'exitxr', 'load', 'anchored', 'panelupdate', 'engine-started'];

/**
 * @class MRSystem
 * @classdesc The default representation of an MRSystem to be expanded upon by actual details ECS System items.
 */
export class MRSystem {
    frameRate = null;

    delta = 0;

    /**
     * @class
     * @description Constructor for MRSystem. Sets up appropriate document event listeners, component defaults, and system defaults that will be used for system runs ever frame.
     * @param {boolean} useComponents - Default to true. Determines whether comonents need to be maintained (attached/updated/detached) with the system.
     * @param {number} frameRate - Default to null. When set, used and updated as part of the System's update function.
     */
    constructor(useComponents = true, frameRate = null) {
        this.app = document.querySelector('mr-app');

        if (!this.app) {
            return;
        }

        this.frameRate = frameRate;

        // TODO - Need a way to register and deregister systems per environment
        this.registry = new Set();

        // The basic info for the system.
        this.systemName = this.constructor.name.split('System')[0];
        this.componentName = `comp${this.systemName}`;

        // Add the system to our list of systems and reset the render loop systems
        // set to make sure we include all appropriate items that are needed.
        this.app.registerSystem(this);
        this.app.renderLoopSystemsReset();

        // Add component items
        if (useComponents) {
            document.addEventListener(`${this.componentName}-attached`, this.onAttach);
            document.addEventListener(`${this.componentName}-updated`, this.onUpdate);
            document.addEventListener(`${this.componentName}-detached`, this.onDetach);
        }

        // Handle events properly.
        // Handle new-entity events.
        this.app.addEventListener('new-entity', (event) => {
            if (this.registry.has(event.target)) {
                return;
            }
            this.onNewEntity(event.target);
        });
        // Handle any global update events
        for (const eventType of GLOBAL_UPDATE_EVENTS) {
            document.addEventListener(eventType, (event) => {
                this.eventUpdate();
            });
        }

        // Add any MREntity items to this main system by default.
        const entities = document.querySelectorAll(`[${this.componentName}]`);
        for (const entity of entities) {
            if (!(entity instanceof MREntity)) {
                return;
            }
            this.registry.add(entity);
        }
    }

    /**
     * @function
     * @description Called when a new entity is added to the scene
     * @param {MRApp} app - the app the system is registered to.
     */
    onRegister(app) {}

    /**
     * @function
     * @description Called when the system is registered to an app is added.
     * @param {MRApp} app - the app the system is registered to.
     */
    onUnregister(app) {}

    /**
     * @function
     * @description The actual system update call.
     * @param {number} deltaTime - given timestep to be used for any feature changes
     * @param {object} frame - given frame information to be used for any feature changes
     */
    _update(deltaTime, frame) {
        if (this.frameRate) {
            this.delta += deltaTime;
            if (this.delta < this.frameRate) {
                return;
            }
        }
        this.update(deltaTime, frame);
        this.delta = 0;
    }

    _ignoreDuringSceneRenderLoop() {
        // For this system, since we have the 'per entity' and 'per scene event' update calls,
        // we dont need a main update call here.
        //
        // Added as a function call placed in the update function to prevent the overlap
        // case where we think we should be ignoring an item, but it ends up having an update
        // implementation later in the building development of MRjs.
        // 
        // This of this as, unless there's a reason for the system to update as part of the
        // render loop, that is, it's update function is implemented, we're only going to have it
        // update when it actually needs to do so.
        
        // We remove this system from the renderLoop systems but it still remains
        // a valid overarching system in this.app.systems.
        if (this.app.debug) {
            console.log('MRSystem does not have an `update` function. Ignoring in render update loop: ', this);
        }
        this.app._renderLoopSystems.delete(this);
    }

    /**
     * @function
     * @description The generic system update call per render-frame.
     * @param {number} deltaTime - given timestep to be used for any feature changes
     * @param {object} frame - given frame information to be used for any feature changes
     */
    update(deltaTime, frame) {
        this._ignoreDuringSceneRenderLoop();
    }

    /**
     * @function
     * @description An event triggered update, called when any global scene level events occur.
     * See GLOBAL_UPDATE_EVENTS of MRSystem.js 
     */
    eventUpdate() {}

    /**
     * @function
     * @description Called when a new entity is added to the scene
     * @param {MREntity} entity - the entity being added.
     */
    onNewEntity(entity) {}

    /**
     * @function
     * @description Called when the entity component is initialized
     * @param {MREntity} entity - the entity being attached/initialized.
     */
    attachedComponent(entity) {}

    /**
     * @function
     * @description Called when a specific entity component is being updated
     * @param {MREntity} entity - the entity being updated
     * @param {object} oldData - the
     */
    updatedComponent(entity, oldData) {}

    /**
     * @function
     * @description Called when the entity component is removed
     * @param {MREntity} entity - the entity component being removed.
     */
    detachedComponent(entity) {}

    /**
     * @function
     * @description Handles the component and registry aspect of the event when an entity component attaches to this system.
     * @param {object} event - the attach event
     */
    onAttach = (event) => {
        this.registry.add(event.target);
        this.attachedComponent(event.target);
    };

    /**
     * @function
     * @description Handles the component and registry update of the even when an entity component needs to change.
     * @param {object} event - the update event
     */
    onUpdate = (event) => {
        this.updatedComponent(event.target, event.detail.oldData);
    };

    /**
     * @function
     * @description Handles the component and registry aspect of the even when an entity component detaches from this system.
     * @param {object} event - the detach event
     */
    onDetach = (event) => {
        this.registry.delete(event.target);
        this.detachedComponent(event.target);
    };
}
