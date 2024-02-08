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

            // VISIBILITY
            this.setVisibility(entity);

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

    setVisibility(entity) {
        function makeVisible(entity, bool) {
            entity.object3D.visible = bool;
            if (entity.background) {
                // The background for MRDivEntities, but we want this css property allowed
                // for all, so using this checker to confirm the existence first.
                // entity.background.visible = bool;
                //
                // XXX - right now all backgrounds are set as visible=false by default in their
                // MRDivEntity constructors, so toggling them here isnt useful, but in future
                // if this is requested for use or we want to add a feature for more use of the
                // background - adding in toggling for this with the object will be useful.
            }
        }
        if (entity.compStyle.visibility && entity.compStyle.visibility !== 'none' && entity.compStyle.visibility !== 'collapse') {
            // visbility: hidden or visible are the options we care about
            const isVisible = entity.compStyle.visibility !== 'hidden';
            makeVisible(entity, isVisible);
        }
    }
}
