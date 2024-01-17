import * as THREE from 'three';

import { MRSystem } from 'mrjs/core/MRSystem';
import { MREntity } from 'mrjs/core/MREntity';
import { MRDivEntity } from 'mrjs/core/MRDivEntity';
import { MRPanel } from 'mrjs/core/entities/MRPanel';

/**
 * @class LayoutSystem
 * @classdesc System that allows for setup and handling of changing layout.
 * @augments MRSystem
 */
export class LayoutSystem extends MRSystem {
    /**
     * @class
     * @description Constructor for the layout system. Uses the default System setup.
     */
    constructor() {
        super(false);
        this.tempPosition = new THREE.Vector3();
    }

    /**
     * @function
     * @description Called when a new entity is added to this system
     * @param {MREntity} entity - the entity being added.
     */
    onNewEntity(entity) {
        if (entity instanceof MRPanel) {
            return;
        }
        if (entity instanceof MRDivEntity) {
            this.registry.add(entity);
            this.setLayoutPosition(entity);
        }
    }

    /**
     * @function
     * @description The generic system update call. Handles updating all 3D items to match whatever layout position is expected.
     * @param {number} deltaTime - given timestep to be used for any feature changes
     * @param {object} frame - given frame information to be used for any feature changes
     */
    update(deltaTime, frame) {
        for (const entity of this.registry) {
            this.setLayoutPosition(entity);
        }
    }

    /**
     * @function
     * @description Helper function for the update call. Sets the entity's appropriate 3D layout position based on window and entity expectations.
     * @param {MREntity} entity - the entity being updated.
     */
    setLayoutPosition(entity) {
        const rect = entity.getBoundingClientRect();
        const panel = entity.closest('mr-panel');

        const innerWidth = mrjsUtils.xr.isPresenting ? mrjsUtils.Display.VIRTUAL_DISPLAY_RESOLUTION : window.innerWidth;
        const innerHeight = mrjsUtils.xr.isPresenting ? mrjsUtils.Display.VIRTUAL_DISPLAY_RESOLUTION : window.innerHeight;

        // Calculate the center of the viewport
        const centerX = window.innerWidth / 2;
        const centerY = innerHeight / 2;

        let windowWidth = mrjsUtils.xr.isPresenting ? panel.windowHorizontalScale : global.viewPortWidth;
        let windowHeight = mrjsUtils.xr.isPresenting ? panel.windowVerticalScale : global.viewPortHeight;

        // Adjust the element's position to be relative to the center of the viewport
        const centeredX = rect.left - centerX;
        const centeredY = rect.top - centerY;

        let threeX = (centeredX / innerWidth) * windowWidth;
        let threeY = (centeredY / innerHeight) * windowHeight;

        threeX += entity.width / 2;
        threeY += entity.height / 2;

        this.tempPosition.setX(threeX);
        this.tempPosition.setY(-threeY);

        entity.object3D.position.setX(this.tempPosition.x);
        entity.object3D.position.setY(this.tempPosition.y);
    }
}
