import { MRSystem } from 'mrjs/core/MRSystem';
import { MRDivEntity } from 'mrjs/core/entities/MRDivEntity';
import { MREntity } from 'mrjs/core/MREntity';
import { MRPanelEntity } from 'mrjs/core/entities/MRPanelEntity';
import { MRButtonEntity } from 'mrjs/core/entities/MRButtonEntity';
import { MRModelEntity } from 'mrjs/core/entities/MRModelEntity';
import { MRVideoEntity } from 'mrjs/core/entities/MRVideoEntity';

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

        this.app.addEventListener('trigger-material-style-update', (e) => {
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
        // Anything needed for mrjs defined entities - the order of the below matters
        if (entity instanceof MRDivEntity) {
            this.setBackground(entity);
        }
        this.setVisibility(entity);

        // User additional - Main Entity Style Change
        if (entity instanceof MREntity) {
            entity.updateMaterialStyle();
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
     * @description The per-frame system update call. Handles updating all 3D items to match whatever geometry/style is expected whether that be a 2D setup or a 3D change.
     * @param {number} deltaTime - given timestep to be used for any feature changes
     * @param {object} frame - given frame information to be used for any feature changes
     */
    update(deltaTime, frame) {
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
    }

    /**
     * @function
     * @description Sets the background based on compStyle and inputted css elements.
     */
    setBackground(entity) {
        const color = entity.compStyle.backgroundColor;

        if (color.startsWith('rgba')) {
            const rgba = color.match(/rgba?\(([^)]+)\)/)[1].split(',').map(n => parseFloat(n.trim()));
            entity.background.material.color.setStyle(`rgb(${rgba[0]}, ${rgba[1]}, ${rgba[2]})`);
            entity.background.material.transparent = rgba.length === 4 && rgba[3] < 1;
            entity.background.material.opacity = rgba.length === 4 ? rgba[3] : 1;
            entity.background.visible = !(rgba.length === 4 && rgba[3] === 0);
        } else if (color.startsWith('rgb')) {
            // RGB colors are treated as fully opaque
            entity.background.material.color.setStyle(color);
            entity.background.material.transparent = false;
            entity.background.visible = true;
        } else if (color.startsWith('#')) {
            const {r, g, b, a} = mrjsUtils.color.hexToRgba(color);
            entity.background.material.color.setStyle(`rgb(${r}, ${g}, ${b})`);
            entity.background.material.transparent = a < 1;
            entity.background.material.opacity = a;
            entity.background.visible = a !== 0;
        } else {
            // This assumes the color is a CSS color word or another valid CSS color value
            entity.background.material.color.setStyle(color);
            entity.background.material.transparent = false;
            entity.background.visible = true;
        }

        if (entity.compStyle.opacity < 1) {
            entity.background.material.opacity = entity.compStyle.opacity;
        }
        entity.background.material.needsUpdate = true;
    }

    setVisibility(entity) {
        function makeVisible(entity, bool) {
            entity.object3D.visible = bool;
            if (entity.background) {
                // The background for MRDivEntityEntities, but we want this css property allowed
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
