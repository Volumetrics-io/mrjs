import { MRSystem } from 'mrjs/core/MRSystem';
import { MRDivEntity } from 'mrjs/core/MRDivEntity';
import { MREntity } from 'mrjs/core/MREntity';
import { MRPanel } from 'mrjs/core/entities/MRPanel';
import { MRButton } from 'mrjs/core/entities/MRButton';
import { MRImage } from 'mrjs/core/entities/MRImage';
import { MRModel } from 'mrjs/core/entities/MRModel';

/**
 * @class StyleSystem
 * @classdesc Handles style updates for all items.
 * @augments MRSystem
 */
export class StyleSystem extends MRSystem {
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
        for (const entity of this.registry) {
            if (!entity.needsStyleUpdate) {
                continue;
            }

            let panel = entity.closest('mr-panel')
            if(panel) {
                entity.object3D.scale.setScalar(entity.compStyle.scale != 'none' ? parseFloat(entity.compStyle.scale) * panel.width : 1);
            } else {
                entity.object3D.scale.setScalar(entity.compStyle.scale != 'none' ? entity.compStyle.scale : 1);
            }
            if (entity.compStyle.zIndex != 'auto' && !(entity instanceof MRPanel)) {
                // default zIndex values in css are in the 1000s - using this arbitrary divide to convert to an actual usable threejs value.
                entity.object3D.position.setZ(parseFloat(entity.compStyle.zIndex / 1000));

                if(entity.compStyle.zIndex == entity.parentElement.compStyle.zIndex){
                    entity.object3D.position.z += 0.0001
                }
            }

            if (entity instanceof MRDivEntity) {
                entity.updateStyle();
            }
            entity.dispatchEvent(new CustomEvent('child-updated', { bubbles: true }));
            if (!entity.alwaysNeedsStyleUpdate) {
                entity.needsStyleUpdate = false;
            }
        }
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
