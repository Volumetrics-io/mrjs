import { MRSystem } from 'mrjs/core/MRSystem';
import { MRDivEntity } from 'mrjs/core/entities/MRDivEntity';
import { MREntity } from 'mrjs/core/MREntity';
import { MRPanelEntity } from 'mrjs/core/entities/MRPanelEntity';
import { MRButtonEntity } from 'mrjs/core/entities/MRButtonEntity';
import { MRMediaEntity } from 'mrjs/core/entities/MRMediaEntity';
import { MRModelEntity } from 'mrjs/core/entities/MRModelEntity';

/**
 * @class GeometryStyleSystem
 * @classdesc Handles geometry updates for all items.
 * @augments MRSystem
 */
export class GeometryStyleSystem extends MRSystem {
    /**
     * @class
     * @description StyleSystem's default constructor with a starting framerate of 1/30.
     */
    constructor() {
        super(false);

        this.app.addEventListener('trigger-geometry-style-update', (e) => {
            // The event has the entity stored as its detail.
            if (e.detail !== undefined) {
                this._updateSpecificEntity(e.detail);
            }
        });
    }

    /**
     * @function
     * @description The per entity triggered update call. Handles updating all 3D items to match whatever geometry/style is expected whether that be a 2D setup or a 3D change.
     */
    _updateSpecificEntity(entity) {
        // Only want to dispatch if anything was actually updated in this iteration.
        let changed = false;

        // Anything needed for mrjs defined entities - the order of the below matters
        if (entity instanceof MRDivEntity) {
            changed = this.setUpdatedBorder(entity);
        }
        changed = this.setScale(entity);
        if (entity instanceof MRMediaEntity) {
            changed = this.setUpdatedMediaPlane(entity);
        }

        // User additional - Main Entity Style Change
        if (entity instanceof MREntity) {
            changed = entity.updateGeometryStyle();
        }

        if (changed) {
            // TODO - TBH i think this is only needed for scale, but just in case others use changed
            // width/height for anything else, and update is required for children as well
            entity.dispatchEvent(new CustomEvent('child-updated', { bubbles: true }));
        }
    }

    /**
     * @function
     * @description The per global scene event update call. Handles updating all 3D items to match whatever geometry/style is expected whether that be a 2D setup or a 3D change.
     */
    eventUpdate = () => {
        for (const entity of this.registry) {
            this._updateSpecificEntity(entity);
        }
    };

    /**
     * @function
     * @description Called when a new entity is added to the scene. Adds said new entity to the style's system registry.
     * @param {MREntity} entity - the entity being added.
     */
    onNewEntity(entity) {
        this.registry.add(entity);
    }

    setScale(entity) {
        let new_scale = entity.compStyle.scale != 'none' ? parseFloat(entity.compStyle.scale) * mrjsUtils.app.scale : 1;
        if (new_scale != entity.object3D.scale) {
            entity.object3D.scale.setScalar(new_scale);
            return true;
        }
        return false;
    }

    /**
     * @function
     * @description Sets the border of the UI based on compStyle and inputted css elements.
     */
    setUpdatedBorder(entity) {
        // geometry will only update if width, height, or borderRadii have changed
        let w = entity.width;
        let h = entity.height;
        let b = entity.borderRadii;
        if (entity._storedWidth != w || entity._storedHeight != h || entity._storedBorderRadii != b) {
            entity._storedWidth = w;
            entity._storedHeight = h;
            entity._storedBorderRadii = b;
        } else {
            // no update needed
            return false;
        }

        if (entity.background.geometry !== undefined) {
            entity.background.geometry.dispose();
        }
        entity.background.geometry = mrjsUtils.geometry.UIPlane(w, h, b, 18);

        return true;
    }

    setUpdatedMediaPlane(entity) {
        entity.computeObjectFitDimensions();

        // geometry will only update if width, height, or borderRadii have changed
        if (entity._storedWidth != entity.width
            || entity._storedHeight != entity.height
            || entity._storedBorderRadii != entity.borderRadii) {
           entity.generateNewMediaPlaneGeometry();
        } else {
            // no update needed
            return false;
        }

        

        return true;
    }
}
