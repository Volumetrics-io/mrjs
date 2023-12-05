import MRSystem from '../core/MRSystem';

/**
 * Adjusts the understood container for the layout to fit all necessary items.
 */
export class LayoutSystem extends MRSystem {
    /**
     * LayoutSystem's default constructor
     * // TODO - add more info
     */
    constructor() {
        super(false);

        document.addEventListener('DOMContentLoaded', (event) => {
            const containers = this.app.querySelectorAll('mr-container');

            for (const container of containers) {
                this.registry.add(container);
            }
        });
    }

    /**
     * The generic system update call.
     * For every entity handled by the system, adjusts the container's size to fit properly.
     * 
     * @param deltaTime - given timestep to be used for any feature changes
     * @param frame - given frame information to be used for any feature changes
     */
    update(deltaTime, frame) {
        for (const entity of this.registry) {
            this.adjustContainerSize(entity);
        }
    }

// TODO - need to figure out if the auto documenter can handle this setup
// for documenting 

    adjustContainerSize = (container) => {
        container.dispatchEvent(new CustomEvent('container-mutated', { bubbles: true }));
    };
}
