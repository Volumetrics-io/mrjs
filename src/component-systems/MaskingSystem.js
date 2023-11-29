import System from '../core/System';

/**
 *
 */
export class MaskingSystem extends System {
    /**
     *
     */
    constructor() {
        super(false);
        // todo

const renderTargetMask = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
const renderTargetObject = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
        this.renderer thingy 
    }

    /**
     *
     * @param deltaTime
     * @param frame
     */
    update(deltaTime, frame) {
        // perform double first render pass for the connected material

        // Render passes
        renderer.setRenderTarget(renderTargetMask);
        renderer.clear();
        renderer.render(scene, camera);

        // switch back
        renderer.setRenderTarget(renderTargetObject);
        renderer.clear();
        // renderer.render(scene, camera); - this step will be done in the actual render loop
    }

    /**
     *
     * @param entity
     */
    onNewEntity(entity) {
        if (!entity.masking) {
            for (const parent of this.registry) {
                if (parent.contains(entity)) {
                    entity.object3D.traverse((child) => {
                        this.applyMasking(child, parent.masking);
                    });
                }
            }
            return;
        }
        this.registry.add(entity);
        this.addMasking(entity);
        entity.object3D.traverse((child) => {
            this.applyMasking(child, entity.masking);
        });
    }

    /**
     *
     * @param entity
     */
    applyMasking(entity) {
        // todo?
    }
}
