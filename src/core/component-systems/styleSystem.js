import { MRSystem } from 'MRJS/core/mrSystem';
import { MRUIEntity } from 'MRJS/core/mrUIEntity';

/**
 * Handles style updates for all items.
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
     * 
     * @param deltaTime - given timestep to be used for any feature changes
     * @param frame - given frame information to be used for any feature changes
     */
    update(deltaTime, frame) {
        for (const entity of this.registry) {
            if (entity.compStyle.scale != 'none') {
                entity.object3D.scale.setScalar(entity.compStyle.scale);
            } else {
                entity.object3D.scale.setScalar(1);
            }

            if (entity.compStyle.zIndex != 'auto') {
                entity.object3D.position.setZ(entity.compStyle.zIndex / 1000);
            }

            if (entity instanceof MRUIEntity) {
                entity.updateStyle();
            }
        }
    }

    /**
     * Called when a new entity is added to the scene.
     * Adds said new entity to the style's system registry.
     * 
     * @param entity - the entity being added.
     */
    onNewEntity(entity) {
        this.registry.add(entity);
    }
}
