import { MRSystem } from 'mrjs/core/MRSystem';
import { MRDivEntity } from 'mrjs/core/MRDivEntity';
import { MREntity } from 'mrjs/core/MREntity';
import { MRPanel } from 'mrjs/core/entities/MRPanel';
import { MRButton } from 'mrjs/core/entities/MRButton';
import { MRImage } from 'mrjs/core/entities/MRImage';
import { MRModel } from '../entities/MRModel';

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
    }

    /**
     * @function
     * @description The generic system update call. Handles updating all 3D items to match whatever style is expected whether that be a 2D setup or a 3D change.
     * @param {number} deltaTime - given timestep to be used for any feature changes
     * @param {object} frame - given frame information to be used for any feature changes
     */
    update(deltaTime, frame) {
        //
    }

    /**
     * @function
     * @description Called when a new entity is added to the scene. Adds said new entity to the style's system registry.
     * @param {MREntity} entity - the entity being added.
     */
    onNewEntity(entity) {
        if (entity instanceof MRSkyBox) {
            if (entity.compStyle.scale == 'none') {
                // has no css scale attribute then use as default
                const SCALING_OFFSET = 0.01;
                entity.skybox.style.scale = (this.registry.size == 0) ? 1 : this.registry[this.registry.size-1].skybox.style.scale + SCALING_OFFSET;
            }
            this.registry.add(entity);
        }
    }
}
