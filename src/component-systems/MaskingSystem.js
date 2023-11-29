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
    }

    /**
     *
     * @param deltaTime
     * @param frame
     */
    update(deltaTime, frame) {
        // todo - figure out where this goes

        // Use stencil operation for each stencil object
        stencilMeshes.forEach((stencilMesh, index) => {
            stencilMesh.renderOrder = index + 1;
            stencilMesh.onBeforeRender = function (renderer) {
                renderer.clearStencil();
                renderer.clearDepth();
                renderer.state.buffers.stencil.setTest(true);
                renderer.state.buffers.stencil.setOp(THREE.StencilOp.REPLACE, THREE.StencilOp.REPLACE, THREE.StencilOp.REPLACE);
                renderer.state.buffers.stencil.setFunc(THREE.AlwaysStencilFunc, index + 1, 0xff);
            };
        });

        // Apply stencil masking to each masked object - this will include all objects that we want to be viewed as if theyre 'on the screen directly'
        maskedMeshes.forEach((maskedMesh) => {
            maskedMesh.renderOrder = stencilMeshes.length + 1;
            maskedMesh.onBeforeRender = function (renderer) {
                renderer.state.buffers.stencil.setOp(THREE.KeepStencilOp, THREE.KeepStencilOp, THREE.KeepStencilOp);
                stencilMeshes.forEach((stencilMesh, index) => {
                    renderer.state.buffers.stencil.setFunc(THREE.EqualStencilFunc, index + 1, 0xff);
                });
            };
        });

    }

    /**
     *
     * @param entity
     */
    onNewEntity(entity) {
        // todo?
    }

    /**
     *
     * @param entity
     */
    applyMasking(entity) {
        // todo?
    }
}
