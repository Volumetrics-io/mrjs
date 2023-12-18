import { MRSystem } from 'mrjs/core/MRSystem';
import { MRDivEntity } from 'mrjs/core/MRDivEntity';
import { MREntity } from 'mrjs/core/MREntity';

/**
 * @class MaskingSystem
 * @classdesc Handles specific needs for setting up the masking for all necessary items.
 * @augments MRSystem
 */
export class MaskingSystem extends MRSystem {
    /**
     * @class
     * @description MaskingSystem's default constructor.
     */
    constructor() {
        super(false);
    }

    /**
     * @function
     * @description ...
     * @param {number} deltaTime - given timestep to be used for any feature changes
     * @param {object} frame - given frame information to be used for any feature changes
     */
    update(deltaTime, frame) {
        // for (const entity of this.registry) {
        //     entity.object3D.scale.setScalar(entity.compStyle.scale != 'none' ? entity.compStyle.scale : 1);

        //     if (entity.compStyle.zIndex != 'auto') {
        //         // default zIndex values in css are in the 1000s - using this arbitrary divide to convert to an actual usable threejs value.
        //         entity.object3D.position.setZ(entity.compStyle.zIndex / 1000);
        //     }

        //     if (entity instanceof MRDivEntity) {
        //         entity.updateStyle();
        //     }
        // }
    }

    /**
     * @function
     * @description Called when a new entity is added to the scene. Adds said new entity to the style's system registry.
     * @param {MREntity} entity - the entity being added.
     */
    onNewEntity(entity) {
        this.registry.add(entity);
    }
}
