import { MRUIEntity } from '../UI/UIEntity';
import System from '../core/System';
import { Panel } from '../entities/Panel';

/**
 *
 */
export class LayoutSystem extends System {
    /**
     *
     */
    constructor() {
        super(false);

        this.tempPosition = new THREE.Vector3();
    }

    /**
     *
     * @param entity
     */
    onNewEntity(entity) {
        if (entity instanceof Panel) {
            return;
        }
        if (entity instanceof MRUIEntity) {
            this.registry.add(entity);
            this.setLayoutPosition(entity);
        }
    }

    /**
     *
     * @param deltaTime
     * @param frame
     */
    update(deltaTime, frame) {
        for (const entity of this.registry) {
            this.setLayoutPosition(entity);
        }
    }

    /**
     *
     * @param entity
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
