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
            // DETERMINE IF STYLE CHANGE IS NEEDED
            if (!entity.needsStyleUpdate) {
                continue;
            }

            // SCALE
            entity.object3D.scale.setScalar(entity.compStyle.scale != 'none' ? parseFloat(entity.compStyle.scale) * mrjsUtils.app.scale : 1);
            if (entity.compStyle.zIndex != 'auto' && !(entity instanceof MRPanel)) {
                // default zIndex values in css are in the 1000s - using this arbitrary divide to convert to an actual usable threejs value.
                entity.object3D.position.setZ(parseFloat(entity.compStyle.zIndex / 1000));

                if(entity.compStyle.zIndex == entity.parentElement.compStyle.zIndex){
                    entity.object3D.position.z += 0.0001
                }
            }

            // VISIBILITY
            function makeVisible() {
                this.setVisibility(true, true);
            } 
            function makeHidden() {
                this.setVisibility(false, true);
            }
            const hasValidParam = (entity.compStyle.visibility && entity.compStyle.visibility !== 'none' && entity.compStyle.visibility !== 'collapse');
            // hidden or visible are the options we care about
            const isVisible = hasValidParam ? (this.compStyle.visibility !== 'hidden') : bool;
            entity.object3D.visible = isVisible;
            if (entity.background) {
                // The background for MRDivEntities, but we want this css property allowed
                // for all, so using this checker to confirm the existence first.
                entity.background.visible = isVisible;
            }
            entity.traverse(isVisible ? entity.makeVisibile() : entity.makeHidden());

            // MAIN ENTITY STYLE CHANGE
            if (entity instanceof MRDivEntity) {
                entity.updateStyle();
            }

            // CLEANUP AFTER STYLE CHANGES
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
