import { MRSystem } from 'mrjs/core/MRSystem';
import { MRSkyBoxEntity } from 'mrjs/core/entities/MRSkyBoxEntity';

/**
 * @class SkyBoxSystem
 * @classdesc Handles skybox interactions and updates for all items.
 * @augments MRSystem
 */
export class SkyBoxSystem extends MRSystem {
    /**
     * @class
     * @description SkyBox's default constructor
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
     * @param {object} entity - the entity being added.
     */
    onNewEntity(entity) {
        if (entity instanceof MRSkyBoxEntity) {
            if (entity.compStyle.scale == 'none') {
                // has no css scale attribute then use as default otherwise use as the user-defined version.
                const SCALING_OFFSET = 0.001;
                entity.object3D.scale.setScalar(this.registry.size == 0 ? 1 : this._lastItem.object3D.scale.z + SCALING_OFFSET);
                this._lastItem = entity;
            }
            this.registry.add(entity);
        }
    }
}
