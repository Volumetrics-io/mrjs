import System from '../core/System';
import { Container } from '../entities/layout/Container';

/**
 *
 */
export class LayoutSystem extends System {
    /**
     *
     */
    constructor() {
        super(false);

        this.tempPosition = new THREE.Vector3()

        document.addEventListener('DOMContentLoaded', (event) => {
            const containers = this.app.querySelectorAll('mr-container');

            for (const container of containers) {
                container.dispatchEvent(new CustomEvent('container-mutated', { bubbles: true }));
            }
        });
    }

    onNewEntity(entity) { 
        if (entity instanceof Container) { return }
        if(entity.closest('mr-container')) {
            this.registry.add(entity);
            this.setLayoutPosition(entity)
        }
    }

    /**
     *
     * @param deltaTime
     * @param frame
     */
    update(deltaTime, frame) {
        for (const entity of this.registry) {
            this.setLayoutPosition(entity)

        }
    }

    setLayoutPosition(entity) {
        const rect = entity.getBoundingClientRect();
        const container = entity.closest('mr-container')

        // Calculate the center of the viewport
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        // Adjust the element's position to be relative to the center of the viewport
        const centeredX = rect.left - centerX
        const centeredY = rect.top - centerY - window.innerHeight

        let threeX = (centeredX / window.innerWidth) * global.viewPortWidth;
        let threeY = (centeredY / window.innerHeight) * global.viewPortHeight;


        threeX += entity.width / 2
        threeY += entity.height / 2


        this.tempPosition.setX(threeX)
        this.tempPosition.setY(-threeY)

       let local = container.object3D.worldToLocal(this.tempPosition)

        entity.object3D.position.setX(this.tempPosition.x)
        entity.object3D.position.setY(this.tempPosition.y)
        
    }

    adjustContainerSize = (container) => {
        container.dispatchEvent(new CustomEvent('container-mutated', { bubbles: true }));
    };
}
