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
        this.stencilMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            stencilWrite: true,
            stencilRef: 0,
            stencilFunc: THREE.EqualStencilFunc,
            stencilFail: THREE.ReplaceStencilOp,
            stencilZFail: THREE.ReplaceStencilOp,
            stencilZPass: THREE.ReplaceStencilOp,
        });

        // // Set up render targets
        // this.renderTargetMask = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
        // this.renderTargetStencilObject = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);

        // Configure materials
        this.maskMaterial.stencilWrite = true;
        this.maskMaterial.stencilRef = -1;
        this.maskMaterial.stencilFunc = THREE.AlwaysStencilFunc;
        this.maskMaterial.stencilFail = THREE.ReplaceStencilOp;
        this.maskMaterial.stencilZFail = THREE.ReplaceStencilOp;
        this.maskMaterial.stencilZPass = THREE.ReplaceStencilOp;

        this.stencilMaterial.stencilWrite = true;
        this.stencilMaterial.stencilRef = -1;
        this.stencilMaterial.stencilFunc = THREE.EqualStencilFunc;
        this.stencilMaterial.stencilFail = THREE.KeepStencilOp;
        this.stencilMaterial.stencilZFail = THREE.KeepStencilOp;
        this.stencilMaterial.stencilZPass = THREE.KeepStencilOp;

        this.activeRefNumbers = {};
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
        if (entity instanceof MRDivEntity && !entity.ignoreStencil) {
            this.setupMaterials(entity);
            this.registry.add(entity);
        }
    }

    setMaskMaterial(entity, stencilRef) {
        entity.maskMaterial.stencilWrite = this.maskMaterial.stencilWrite;
        entity.maskMaterial.stencilRef = stencilRef;
        entity.maskMaterial.stencilFunc = this.maskMaterial.stencilFunc;
        entity.maskMaterial.stencilFail = this.maskMaterial.stencilFail;
        entity.maskMaterial.stencilZFail = this.maskMaterial.stencilZFail;
        entity.maskMaterial.stencilZPass = this.maskMaterial.stencilZPass;
    }

    setStencilMaterial(panel, stencilRef) {
        panel.material.stencilWrite = this.stencilMaterial.stencilWrite;
        panel.material.stencilRef = stencilRef;
        panel.material.stencilFunc = this.stencilMaterial.stencilFunc;
        panel.material.stencilFail = this.stencilMaterial.stencilFail;
        panel.material.stencilZFail = this.stencilMaterial.stencilZFail;
        panel.material.stencilZPass = this.stencilMaterial.stencilZPass;
    }

    pickNewActiveRefNumber() {
        // Finds the next active ref number first by searching within an available range
        // otherwise just adds based on the next max value.

        // we dont want to allow 0 as a min value.
        const allowedMin = 1;

        if (this.activeRefNumbers.length === 0) {
            return allowedMin;
        }

        let minVal = Math.min(...this.activeRefNumbers);
        if (minVal > allowedMin) {
            return minVal - 1;
        }
        let maxVal = Math.max(...this.activeRefNumbers);

        // todo - switch the below to be radix style for determining next available slot
        // or something more optimal for the algorithm (including 2x choosing)
        for (let num = minVal; num < maxVal; ++num) {
            if (!numberSet.includes(num)) {
                return num;
            }
        }
        return maxVal + 1;
    }

    setupMaterials(entity, panel) {
        // set entity as having mask material and its main mrDiv as having stencil material if not already set to that

        // Setup it and its children to mask based on its parent panel
        // If the parent panel is already set to stencil for the mask properly, use its pre-existing
        // ref number; otherwise, create a new ref number.
        for (const parent of this.registry) {
            if (parent instanceof Panel && parent.contains(entity)) {
                // ---- Handle parent and parent info ---- //
                // try to grab the parent panel's stencil ref info or make a new one. If parent already
                // has one, it does not need to have its stencil material reset.
                let stencilRef = -1;
                if (parent.material.stencilRef != 0 || parent.material.stencilRef != -1) {
                    // 0 is the default stencil ref, so we're avoiding that number and
                    // we're avoiding -1 since that is our default as 'un-setup'
                    // For this case we need to pick a new ref number.
                    stencilRef = this.pickNewActiveRefNumber();
                    this.activeRefNumbers.push(stencilRef);
                    // set the panel to stencil properly
                    this.setStencilMaterial(parent, stencilRef);
                } else {
                    // use the stencil ref from parent
                    stencilRef = parent.material.stencilRef;
                }

                // ---- Handle self and child info ---- //
                // make sure the entity and all ui children are masked by the panel
                this.setMaskMaterial(entity, stencilRef);
                entity.object3D.traverse((child) => {
                    if (child instanceof MRDivEntity && !child.ignoreStencil) {
                        this.setMaskMaterial(child, stencilRef);
                    }
                });
            }
        }
    }
}
