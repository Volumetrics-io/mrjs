import { MRSystem } from 'mrjs/core/MRSystem';
import { MRUIEntity } from 'mrjs/core/MRUIEntity';
import { MREntity } from 'mrjs/core/MREntity';

/**
 * @class StyleSystem
 * @classdesc Handles style updates for all items.
 * @augments MRSystem
 */
export class StyleSystem extends MRSystem {
    /**
     * StyleSystem's default constructor
     */
    constructor() {
        super(false, 1 / 15);
    }

    /**
     * The generic system update call.
     * Handles updating all 3D items to match whatever style is expected whether that be a 2D setup or a 3D change.
     * @param {number} deltaTime - given timestep to be used for any feature changes
     * @param {object} frame - given frame information to be used for any feature changes
     */
    update(deltaTime, frame) {
        for (const entity of this.registry) {
            entity.object3D.scale.setScalar(entity.compStyle.scale != 'none' ? entity.compStyle.scale : 1);

            if (entity.compStyle.zIndex != 'auto') {
                entity.object3D.position.setZ(entity.compStyle.zIndex / 1000); ///TODO - 1000 converting z index to a threejs usable value, a bit arbitrary - its alwasy in the 1000s so making nice
            }

            if (entity instanceof MRUIEntity) {
                entity.updateStyle();
            }
        }
    }

    /**
     * Called when a new entity is added to the scene.
     * Adds said new entity to the style's system registry.
     * @param {MREntity} entity - the entity being added.
     */
    onNewEntity(entity) {
        this.registry.add(entity);
    }
}
