import * as THREE from 'three';

import { MRSystem } from 'mrjs/core/MRSystem';
import { MREntity } from 'mrjs/core/MREntity';
import { MRDivEntity } from 'mrjs/core/entities/MRDivEntity';
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
        if (!panel) {
            return;
        }
        const panelRect = panel.getBoundingClientRect();

        /** setup xy positioning of the entity **/

        let innerWidth = parseFloat(panel.compStyle.width.split('px')[0]);
        let innerHeight = parseFloat(panel.compStyle.height.split('px')[0]);
        let centerX = innerWidth / 2;
        let centerY = innerHeight / 2;

        let windowWidth = panel.width;
        let windowHeight = panel.height;
        let centeredX = rect.left - panelRect.left - centerX;
        let centeredY = rect.top - panelRect.top - centerY;

        let threeX = (centeredX / innerWidth) * windowWidth;
        let threeY = (centeredY / innerHeight) * windowHeight;

        threeX += entity.width / 2;
        threeY += entity.height / 2;

        entity.object3D.position.setX(threeX);
        entity.object3D.position.setY(-threeY);

        /** setup z-index positioning of the entity **/

        if (entity.compStyle.zIndex != 'auto') {
            // default zIndex values in css are in the 1000s - using this arbitrary divide to convert to an actual usable threejs value.
            entity.object3D.position.setZ(parseFloat(entity.compStyle.zIndex) / 1000);

            if (entity.compStyle.zIndex == entity.parentElement.compStyle.zIndex) {
                entity.object3D.position.z += 0.0001;
            }
        } else {
            entity.object3D.position.z = entity.parentElement.object3D.position.z + 0.001;
        }
    }
}
