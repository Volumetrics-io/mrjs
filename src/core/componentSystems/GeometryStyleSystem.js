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
     * @param {object} entity - the MREntity to be updated by this function.
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
            entity.dispatchEvent(new CustomEvent('entityupdated', { bubbles: true }));
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
     * @description The per-frame system update call.
     * @param {number} deltaTime - given timestep to be used for any feature changes
     * @param {object} frame - given frame information to be used for any feature changes
     */
    update(deltaTime, frame) {
        for (const entity of this.registry) {
            let changed = this.setScale(entity);
            if (changed) {
                // TODO - TBH i think this is only needed for scale, but just in case others use changed
                // width/height for anything else, and update is required for children as well
                entity.dispatchEvent(new CustomEvent('entityupdated', { bubbles: true }));
            }
        }
        // For this system, since we have the 'per entity' and 'per scene event' update calls,
        // we dont need a main update call here.
    }

    /**
     * @function
     * @description Called when a new entity is added to the scene. Adds said new entity to the style's system registry.
     * @param {MREntity} entity - the entity being added.
     */
    onNewEntity(entity) {
        this.registry.add(entity);
        this._updateSpecificEntity(entity);
    }

    /**
     * @function
     * @description Sets the scale of the MREntity based on its css scale value, otherwise defaults to 1.
     * @param {object} entity - the MREntity to be updated by this function.
     * @returns {boolean} true if updated, false otherwise.
     */
    setScale(entity) {
        // grab the entity's local scale
        let css_scale = entity.compStyle.scale != 'none' ? parseFloat(entity.compStyle.scale) : 1;
        let new_scale = new THREE.Vector3(css_scale,css_scale,css_scale);

        // We need to compound the scale value from parent to child specifically
        // if theyre within an mr-panel, because although we have the object3D
        // connection, we flatten the hierarchy for objects within a panel s.t.
        // all of their parents are the panel itself for faster loading.
        if (! (entity instanceof MRPanelEntity) && entity.closest('mr-panel') != null) {
            // We're allowed to call the scale directly from the object3D
            // based on the assumption that the parent's entity was already
            // hit in this system's traversal given order of creation.
            //
            // Note: the assumption that parent's scale being set prior to
            // this is /vital/ for this implementation to work.
            new_scale.multiply(entity.parentElement.object3D.scale);
        }

        if (new_scale != entity.object3D.scale) {
            entity.object3D.scale.set(new_scale.x, new_scale.y, new_scale.z);
            return true;
        }
        return false;
    }

    /**
     * @function
     * @description Sets the border of the UI based on compStyle and inputted css elements.
     * @param {object} entity - the MREntity to be updated by this function.
     * @returns {boolean} true if updated, false otherwise
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

    /**
     * @function
     * @description Updates the Media Plane for this geometry. Specific to the MRMedia subclasses.
     * @param {object} entity - the MRMediaEntity to be updated by this function.
     * @returns {boolean} true if updated, false otherwise
     */
    setUpdatedMediaPlane(entity) {
        entity.computeObjectFitDimensions();

        // geometry will only update if width, height, or borderRadii have changed
        if (entity._storedWidth != entity.width || entity._storedHeight != entity.height || entity._storedBorderRadii != entity.borderRadii) {
            entity.generateNewMediaPlaneGeometry();
        } else {
            // no update needed
            return false;
        }

        return true;
    }
}
