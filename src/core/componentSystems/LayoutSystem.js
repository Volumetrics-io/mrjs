import { MRSystem } from 'mrjs/core/MRSystem';
import { MRDivEntity } from 'mrjs/core/MRDivEntity';
import { Panel } from 'mrjs/core/entities/Panel';

/**
 * @class Layout System
 * @classdesc System that allows for setup and handling of changing layout.
 * @augments MRSystem
 */
export class LayoutSystem extends MRSystem {
    /**
     * Constructor for the layout system. Uses the default System setup.
     */
    constructor() {
        super(false);
        this.tempPosition = new THREE.Vector3();
    }

    /**
     * Called when a new entity is added to this system
     * @param {MREntity} entity - the entity being added.
     */
    onNewEntity(entity) {
        if (entity instanceof Panel) {
            return;
        }
        if (entity instanceof MRDivEntity) {
            this.registry.add(entity);
            this.setLayoutPosition(entity);
        }
    }

    /**
     * The generic system update call.
     * Handles updating all 3D items to match whatever layout position is expected.
     * @param {number} deltaTime - given timestep to be used for any feature changes
     * @param {object} frame - given frame information to be used for any feature changes
     */
    update(deltaTime, frame) {
        for (const entity of this.registry) {
            this.setLayoutPosition(entity);
        }
    }

    /**
     * Helper function for the update call. Sets the entity's appropriate 3D layout position based on window and entity expectations.
     * @param {MREntity} entity - the entity being updated.
     */
    setLayoutPosition(entity) {
        const rect = entity.getBoundingClientRect();
        const panel = entity.closest('mr-panel');

        // Calculate the center of the viewport
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        let windowWidth = global.inXR ? panel.windowHorizontalScale : global.viewPortWidth;
        let windowHeight = global.inXR ? panel.windowVerticalScale : global.viewPortHeight;

        // Adjust the element's position to be relative to the center of the viewport
        const centeredX = rect.left - centerX;
        const centeredY = rect.top - centerY;

        let threeX = (centeredX / window.innerWidth) * windowWidth;
        let threeY = (centeredY / window.innerHeight) * windowHeight;

        threeX += entity.width / 2;
        threeY += entity.height / 2;

        this.tempPosition.setX(threeX);
        this.tempPosition.setY(-threeY);

        entity.object3D.position.setX(this.tempPosition.x);
        entity.object3D.position.setY(this.tempPosition.y);
    }
}
