import { MRSystem } from 'mrjs/core/MRSystem';
import { MRSkyBox } from 'mrjs/core/entities/MRSkyBox';

/**
 * @class SkyBoxSystem
 * @classdesc Handles skybox interactions and updates for all items.
 * @augments MRSystem
 */
export class SkyBoxSystem extends MRSystem {
    /**
     * @class
     * @description StyleSystem's default constructor with a starting framerate of 1/30.
     */
    constructor() {
        super(false);

        // used as a helper because we cant grab the most recently added
        // item from registry since it's a set.
        this._lastItem = null;
    }

    /**
     * @function
     * @description The generic system update call.
     * @param {number} deltaTime - given timestep to be used for any feature changes
     * @param {object} frame - given frame information to be used for any feature changes
     */
    update(deltaTime, frame) {
        // leave for when needed.
    }

    /**
     * @function
     * @description Called when a new entity is added to the scene. Adds said new entity to the style's system registry.
     * @param {MREntity} entity - the entity being added.
     */
    onNewEntity(entity) {
        if (entity instanceof MRSkyBox) {
            if (entity.compStyle.scale == 'none') {
                // has no css scale attribute then use as default otherwise use as the user-defined version.
                const SCALING_OFFSET = 0.01;
                console.log(this.registry);
                entity.style.scale = (this.registry.size == 0) ? 1 : this._lastItem.style.scale + SCALING_OFFSET;
                this._lastItem = entity;
            }
            this.registry.add(entity);
        }
    }
}
