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
     * @description The generic system update call. Handles updating all 3D items to match whatever geometry/style is expected whether that be a 2D setup or a 3D change.
     * @param {number} deltaTime - given timestep to be used for any feature changes
     * @param {object} frame - given frame information to be used for any feature changes
     */
    update(deltaTime, frame) {
        for (const entity of this.registry) {
            if (!entity.needsStyleUpdate) {
                return;
            }

            // Anything needed for all entities
            // - visbility: hidden or visible are the options we care about
            function makeVisible() {
                this.object3D.visible = true;
                if (this.background) {
                    // The background for MRDivEntities, but we want this css property allowed
                    // for all, so using this checker to confirm the existence first.
                    this.background.visible = true;
                }
            }
            function makeHidden() {
                this.object3D.visible = false;
                if (this.background) {
                    // The background for MRDivEntities, but we want this css property allowed
                    // for all, so using this checker to confirm the existence first.
                    this.background.visible = false;
                }
            }
            if (entity.compStyle.visibility && entity.compStyle.visibility !== 'none' && entity.compStyle.visibility !== 'collapse') {
                const isVisible = entity.compStyle.visibility !== 'hidden';
                entity.traverse(isVisible ? makeVisible.bind(entity) : makeHidden.bind(entity));
            }

            // Main Entity Style Change
            if (entity instanceof MRDivEntity) {
                entity.updateStyle();
            }

            // Cleanup
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
