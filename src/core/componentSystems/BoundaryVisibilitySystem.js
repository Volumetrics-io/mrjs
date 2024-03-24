import { MRSystem } from 'mrjs/core/MRSystem';
import { MRDivEntity } from 'mrjs/core/MRDivEntity';
import { MRPanel } from 'mrjs/core/entities/MRPanel';

/**
 * @function
 * @description Observe a target MRDivEntity and make the associated object visible only if it is in visible position in a root MRDivEntity
 * @param {MRDivEntity} root
 * @param {MRDivEntity} target
 */
const observe = (root, target) => {
    // TODO: Callback is fired asynchronously so no guaranteed to be called immediately when the
    //       visibility from the layout position changes. Therefore, the visibility of the associated
    //       Object3D's might be updated a few frames later after when it really need to be. It might
    //       affect the user experience. Fix it if possible.
    const observer = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                // TODO: Ensure to avoid the visibility set up collision. If multiple systems set up the visibility
                //       independently, only the last system before render call can have an effect. This callback
                //       is fired asynchronously so it may be said that this callback is executed before all the
                //       sync systems.
                entry.target.object3D.visible = entry.intersectionRatio > 0;
            }
            // Somehow callback is sometimes not fired even though crossing the threshold so as fallback
            // always refresh the info as much as possible to keep it up-to-date.
            // It seems that the callback is always called once soon after observe() is called,
            // regardless of the intersection state of the entity.
            // TODO: Confirm whether this behavior is intended. If it is not, there may be future
            //       behavior changes or it may not work as intended on certain platforms.
            // Alternative: Using multi-step threshold would mitigate the problem like [0.0, 0.05, 0.1]
            observer.disconnect();
            observer.observe(target);
        },
        {
            root: root
        }
    );
    observer.observe(target);
};

/**
 * @class BoundaryVisibilitySystem
 * @classdesc Makes the entities invisible if they are outside of their parent panels
 * @augments MRSystem
 */
export class BoundaryVisibilitySystem extends MRSystem {
    /**
     * @class
     * @description BoundaryVisibilitySystem's default constructor.
     */
    constructor() {
        super(false);
        this.observedEntities = new WeakSet();
    }

    /**
     * @function
     * @description Called when a new entity is added to the scene.
     * @param {MREntity} entity - the entity being added.
     */
    onNewEntity(entity) {
        // TODO: Support nested panels
        if (entity instanceof MRPanel) {
            this.registry.add(entity);
            entity.traverse((child) => {
                if (child === entity) {
                    return;
                }

                if (this.observedEntities.has(child)) {
                    return;
                }

                this.observedEntities.add(child);
                observe(entity, child);
            });
        } else if (!this.observedEntities.has(entity) && entity instanceof MRDivEntity) {
            // There is a chance that a child entity is added after parent panel addition.
            // Check registered panels and set up the observer if panels are found in parents.
            for (const panel of this.registry) {
                if (panel.contains(entity)) {
                    this.observedEntities.add(entity);
                    observe(panel, entity);
                    break;
                }
            }
        }
    }
}
