import { MRSystem } from 'mrjs/core/MRSystem';
import { MRDivEntity } from 'mrjs/core/MRDivEntity';
import { MREntity } from 'mrjs/core/MREntity';

/**
 * @class MaskingSystem
 * @classdesc Handles specific needs for setting up the masking for all necessary items.
 * @augments MRSystem
 */
export class MaskingSystem extends MRSystem {
    /**
     * @class
     * @description MaskingSystem's default constructor.
     */
    constructor() {
        super(false);

        this.maskingMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        this.stencilMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, stencilWrite: true, stencilRef: 0, stencilFunc: THREE.EqualStencilFunc, stencilFail: THREE.ReplaceStencilOp, stencilZFail: THREE.ReplaceStencilOp, stencilZPass: THREE.ReplaceStencilOp });

        // Set up render targets
        this.renderTargetMask = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
        this.renderTargetStencilObject = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);

        // Configure materials
        this.maskMaterial.stencilWrite = true;
        this.maskMaterial.stencilRef = 1;
        this.maskMaterial.stencilFunc = THREE.AlwaysStencilFunc;
        this.maskMaterial.stencilFail = THREE.ReplaceStencilOp;
        this.maskMaterial.stencilZFail = THREE.ReplaceStencilOp;
        this.maskMaterial.stencilZPass = THREE.ReplaceStencilOp;

        this.stencilMaterial.stencilWrite = true;
        this.stencilMaterial.stencilRef = 1;
        this.stencilMaterial.stencilFunc = THREE.EqualStencilFunc;
        this.stencilMaterial.stencilFail = THREE.KeepStencilOp;
        this.stencilMaterial.stencilZFail = THREE.KeepStencilOp;
        this.stencilMaterial.stencilZPass = THREE.KeepStencilOp;
    }

    /**
     * @function
     * @description ...
     * @param {number} deltaTime - given timestep to be used for any feature changes
     * @param {object} frame - given frame information to be used for any feature changes
     */
    update(deltaTime, frame) {
        // technically no update is needed here. just a render target change
        // TODO - should that happen here or in the actual renderer?

        // should make this easier - sort all objects in the register by the panel being masked for better efficiency with the render target change
        //
        // // Render passes
        // renderer.setRenderTarget(renderTargetMask);
        // renderer.clear();
        // renderer.render(scene, camera);

        // renderer.setRenderTarget(renderTargetObject);
        // renderer.clear();
        // renderer.render(scene, camera);

    }

    /**
     * @function
     * @description Called when a new entity is added to the scene. Handles masking elements to their panel.
     * @param {MREntity} entity - the entity being added.
     */
    onNewEntity(entity) {
        if (entity instanceof Panel) {
            return;
        }
        if (entity instanceof MRDivEntity) {
            this.setupMaterials(entity);
            this.registry.add(entity);
        }
    }

    setMaskMaterial(entity) {
        entity.maskMaterial.stencilWrite = this.maskMaterial.stencilWrite;
        entity.maskMaterial.stencilRef = this.maskMaterial.stencilRef;
        entity.maskMaterial.stencilFunc = this.maskMaterial.stencilFunc;
        entity.maskMaterial.stencilFail = this.maskMaterial.stencilFail;
        entity.maskMaterial.stencilZFail = this.maskMaterial.stencilZFail;
        entity.maskMaterial.stencilZPass = this.maskMaterial.stencilZPass;
    }

    setStencilMaterial(panel) {
        panel.material.stencilWrite = this.stencilMaterial.stencilWrite;
        panel.material.stencilRef = this.stencilMaterial.stencilRef;
        panel.material.stencilFunc = this.stencilMaterial.stencilFunc;
        panel.material.stencilFail = this.stencilMaterial.stencilFail;
        panel.material.stencilZFail = this.stencilMaterial.stencilZFail;
        panel.material.stencilZPass = this.stencilMaterial.stencilZPass;
    }

    setupMaterials(entity, panel) {
        // set entity as having mask material and its main mrDiv as having stencil material if not already set to that

        const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, stencilWrite: true, stencilRef: 0, stencilFunc: THREE.EqualStencilFunc, stencilFail: THREE.ReplaceStencilOp, stencilZFail: THREE.ReplaceStencilOp, stencilZPass: THREE.ReplaceStencilOp });

        // Setup it and its children to mask based on its parent panel
        for (const parent of this.registry) {
            if ((parent instanceof Panel) && parent.contains(entity)) {
                // make sure the entity and all ui children are masked by the panel
                entity.object3D.traverse((child) => {
                    if (child instanceof MRDivEntity) {
                        this.setMaskMaterial(child);
                    }
                });
                this.setMaskMaterial(entity);
                // set the panel to stencil properly
                this.setStencilMaterial(parent);
            }
        }
    }
}
