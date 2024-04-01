import { MRSystem } from 'mrjs/core/MRSystem';
import { MRPanelEntity } from 'mrjs/core/entities/MRPanelEntity';

import { mrjsUtils } from 'mrjs';

/**
 * @class PanelManagementSystem
 * @classdesc A system that manages the screen relative position of UI panels
 * @augments MRSystem
 */
export class PanelSystem extends MRSystem {
    /**
     * @class
     * @description Constructor for the PanelManagementSystem system. Uses the default System setup.
     */
    constructor() {
        super(false);
    }

    eventUpdate = () => {
        for (const entity of this.registry) {
            entity.panel.scale.setScalar(mrjsUtils.app.scale);
        }
    };

    /**
     * @function
     * @description The generic system update call. keeps panel positions up to date.
     * @param {number} deltaTime - given timestep to be used for any feature changes
     * @param {object} frame - given frame information to be used for any feature changes
     */
    update(deltaTime, frame) {
        for (const entity of this.registry) {
            this.updatePanel(entity);
        }
    }

    /**
     * @function
     * @description Called when a new entity is added to this system
     * @param {object} entity - the entity being added.
     */
    onNewEntity(entity) {
        if (entity instanceof MRPanelEntity) {
            this.registry.add(entity);
        }
    }

    /**
     * @function
     * @description used to set the position of an individual panel
     * @param {object} entity - the entity being updated.
     */
    updatePanel(entity) {
        const rect = entity.getBoundingClientRect();
        const appRect = this.app.getBoundingClientRect();

        /** setup xy positioning of the entity */

        let innerWidth = global.appWidth;
        let innerHeight = global.appHeight;
        let centerX = innerWidth / 2;
        let centerY = innerHeight / 2;

        let windowWidth = global.viewPortWidth;
        let windowHeight = global.viewPortHeight;

        let top = rect.top - appRect.top;
        let left = rect.left - appRect.left;
        if (mrjsUtils.xr.isPresenting) {
            top = (top / window.screen.height) * mrjsUtils.display.VIRTUAL_DISPLAY_RESOLUTION;
            left = (left / window.innerWidth) * mrjsUtils.display.VIRTUAL_DISPLAY_RESOLUTION;
        }
        let centeredX = left - centerX;
        let centeredY = top - centerY;

        let threeX = (centeredX / innerWidth) * windowWidth;
        let threeY = (centeredY / innerHeight) * windowHeight;

        threeX += entity.width / 2;
        threeY += entity.height / 2;

        entity.panel.position.setX(threeX);
        entity.panel.position.setY(-threeY);

        /** setup z-index positioning of the entity */

        if (entity.compStyle.zIndex != 'auto') {
            // default zIndex values in css are in the 1000s - using this arbitrary divide to convert to an actual usable threejs value.
            entity.panel.position.setZ(parseFloat(entity.compStyle.zIndex) / 1000);

            if (entity.compStyle.zIndex == entity.parentElement.compStyle.zIndex) {
                entity.panel.position.z += 0.0001;
            }
        } else {
            entity.panel.position.z = 0;
        }
    }
}
