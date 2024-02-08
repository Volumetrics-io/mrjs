import { MRSystem } from 'mrjs/core/MRSystem';
import { MRDivEntity } from 'mrjs/core/MRDivEntity';
import { MREntity } from 'mrjs/core/MREntity';
import { MRPanel } from 'mrjs/core/entities/MRPanel';
import { MRButton } from 'mrjs/core/entities/MRButton';
import { MRImage } from 'mrjs/core/entities/MRImage';
import { MRModel } from 'mrjs/core/entities/MRModel';

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
    }

    /**
     * @function
     * @description The generic system update call. Handles updating all 3D items to match whatever geometry/style is expected whether that be a 2D setup or a 3D change.
     * @param {number} deltaTime - given timestep to be used for any feature changes
     * @param {object} frame - given frame information to be used for any feature changes
     */
    update(deltaTime, frame) {
        for (const entity of this.registry) {
            if (!entity.needsGeometryUpdate) {
                return;
            }

            // Anything needed for mrjs defined entities - the order of the below matters
            if (entity instanceof MRDivEntity) {
                this.setBorder(entity);
            }
            this.setScale(entity);
            if (entity instanceof MRImage) {
                this.setUpdatedImagePlane(entity);
            }

            // User additional - Main Entity Style Change
            if (entity instanceof MREntity) {
                entity.updateGeometryStyle();
            }

            // Cleanup
            entity.dispatchEvent(new CustomEvent('child-updated', { bubbles: true }));
            if (!entity.alwaysNeedsGeometryUpdate) {
                entity.needsGeometryUpdate = false;
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

    setScale(entity) {
        entity.object3D.scale.setScalar(
            entity.compStyle.scale != 'none'
            ? parseFloat(entity.compStyle.scale) * mrjsUtils.app.scale
            : 1
        );
    }

    /**
     * @function
     * @description Sets the border of the UI based on compStyle and inputted css elements.
     */
    setBorder(entity) {
        entity.background.geometry = mrjsUtils.geometry.UIPlane(entity.width, entity.height, entity.borderRadii, 18);
    }

    setUpdatedImagePlane(entity) {
        entity.computeObjectFitDimensions();

        // geometry will only update if width, height, or borderRadii have changed
        if (entity.object3D.geometry !== undefined) {
            entity.object3D.geometry.dispose();
        }
        entity.object3D.geometry = mrjsUtils.geometry.UIPlane(entity.width, entity.height, entity.borderRadii, 18);
    }  
}
