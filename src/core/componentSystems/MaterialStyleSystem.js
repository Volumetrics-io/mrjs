import { MRSystem } from 'mrjs/core/MRSystem';
import { MRDivEntity } from 'mrjs/core/MRDivEntity';
import { MREntity } from 'mrjs/core/MREntity';
import { MRPanel } from 'mrjs/core/entities/MRPanel';
import { MRButton } from 'mrjs/core/entities/MRButton';
import { MRImage } from 'mrjs/core/entities/MRImage';
import { MRModel } from 'mrjs/core/entities/MRModel';

/**
 * @class MaterialStyleSystem
 * @classdesc Handles style updates for all items.
 * @augments MRSystem
 */
export class MaterialStyleSystem extends MRSystem {
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
            // if (!entity.needsStyleUpdate) {
            //     return;
            // }

            // Anything needed for mrjs defined entities - the order of the below matters
            if (entity instanceof MRDivEntity) {
                this.setBackground(entity);
            }
            this.setVisibility(entity);
            

            // User additional - Main Entity Style Change
            if (entity instanceof MREntity) {
                entity.updateMaterialStyle();
            }

            // Cleanup
            // entity.dispatchEvent(new CustomEvent('child-updated', { bubbles: true }));
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

    /**
     * @function
     * @description Sets the background based on compStyle and inputted css elements.
     */
    setBackground(entity) {
        // TODO - we need to determine a quick and easy way to see if the color does
        // not need to update this iteration since we might not have a new background
        // at all.
        const color = entity.compStyle.backgroundColor;
        let opacity = 1; // Default opacity

        if (color.startsWith('rgba')) {
            // Check for RGBA
            const rgba = color
                .substring(5, color.length - 1)
                .split(',')
                .map(part => parseFloat(part.trim()));
            entity.background.material.color.setStyle(`rgb(${rgba[0]}, ${rgba[1]}, ${rgba[2]})`);
            opacity = rgba[3];
        } else if (color.startsWith('rgb')) {
            // Check for RGB
            entity.background.material.color.setStyle(color);
        } else if (/^#([0-9a-f]{8})$/i.test(color)) {
            // Check for Hexadecimal with Alpha
            const hex = color.substring(1);
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            opacity = parseInt(hex.substring(6, 8), 16) / 255;
            entity.background.material.color.setStyle(`rgb(${r}, ${g}, ${b})`);
        } else if (/^#([0-9a-f]{6})$/i.test(color)) {
            // Check for Hexadecimal without Alpha
            entity.background.material.color.setStyle(color);
        } else {
            // General color name or other formats
            entity.background.material.color.setStyle(color);
        }

        // Handle entity-wide opacity
        if (entity.compStyle.opacity < 1) {
            opacity *= entity.compStyle.opacity;
        }

        // Apply opacity
        if (opacity < 1) {
            entity.background.material.transparent = true;
            entity.background.material.opacity = opacity;
            entity.background.visible = true;
        } else if (opacity === 0) {
            entity.background.visible = false;
        } else {
            entity.background.material.transparent = false;
            entity.background.visible = true;
        }

        entity.background.material.needsUpdate = true;
        return true;
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
            return makeVisible(entity, isVisible);
        }
        return false;
    }
}
