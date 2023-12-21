import * as THREE from 'three';

import { MRSystem } from 'mrjs/core/MRSystem';
import { MRDivEntity } from 'mrjs/core/MRDivEntity';
import { MREntity } from 'mrjs/core/MREntity';
import { Panel } from 'mrjs/core/entities/Panel';

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

        // Configure materials
        this.maskingMaterial = new THREE.MeshBasicMaterial({
            color:          0xff0000,
            stencilWrite:   true,
            stencilRef:     -1,
            stencilFunc:    THREE.AlwaysStencilFunc,
            stencilFail:    THREE.ReplaceStencilOp,
            stencilZFail:   THREE.ReplaceStencilOp,
            stencilZPass:   THREE.ReplaceStencilOp
        });
        console.log('masking material is made:');
        console.log(this.maskingMaterial);
        this.stencilMaterial = new THREE.MeshBasicMaterial({
            color:          0x00ff00,
            stencilWrite:   true,
            stencilRef:     -1,
            stencilFunc:    THREE.EqualStencilFunc,
            stencilFail:    THREE.KeepStencilOp,
            stencilZFail:   THREE.KeepStencilOp,
            stencilZPass:   THREE.KeepStencilOp,
        });
        console.log('stencil material is made:');
        console.log(this.stencilMaterial);

        this.activeRefNumbers = new Set();
        this.panels = new Set(); // needed for rendering, we dont need one for the entities though since theyre added to the registry already.
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
        console.log('in masking system, new entity is: ');
        console.log(entity);
        if (entity instanceof Panel) {
            this.panels.add(entity);
            return;
        }
        if (entity instanceof MRDivEntity && !entity.ignoreStencil) {
            console.log('masking and handling current entity');
            this.setupMaterials(entity);
            this.registry.add(entity);
        }
    }

    /**
     * Applies mask material to an entity. If the entity is a Group, apply to all Mesh children.
     * @param entity
     * @param stencilRef
     */
    setMaskMaterial(entity, stencilRef) {
        console.log('this.maskingMaterial');
        console.log(this.maskingMaterial);
        const applyMask = (obj) => {
            obj.material.stencilWrite = this.maskingMaterial.stencilWrite;
            obj.material.stencilRef = stencilRef;
            obj.material.stencilFunc = this.maskingMaterial.stencilFunc;
            obj.material.stencilFail = this.maskingMaterial.stencilFail;
            obj.material.stencilZFail = this.maskingMaterial.stencilZFail;
            obj.material.stencilZPass = this.maskingMaterial.stencilZPass;
        };

        if (entity.object3D instanceof THREE.Group) {
            entity.object3D.traverse(child => {
                if (child instanceof THREE.Mesh) {
                    applyMask(child);
                }
            });
        } else {
            applyMask(entity.object3D);
        }
    }

    /**
     * Applies stencil material to a panel. If the panel is a Group, apply to all Mesh children.
     * @param panel
     * @param stencilRef
     */
    setStencilMaterial(panel, stencilRef) {
        const applyStencil = (obj) => {
            obj.material.stencilWrite = this.stencilMaterial.stencilWrite;
            obj.material.stencilRef = stencilRef;
            obj.material.stencilFunc = this.stencilMaterial.stencilFunc;
            obj.material.stencilFail = this.stencilMaterial.stencilFail;
            obj.material.stencilZFail = this.stencilMaterial.stencilZFail;
            obj.material.stencilZPass = this.stencilMaterial.stencilZPass;
        };

        if (panel.object3D instanceof THREE.Group) {
            panel.object3D.traverse(child => {
                if (child instanceof THREE.Mesh) {
                    applyStencil(child);
                }
            });
        } else {
            applyStencil(panel.object3D);
        }
    }

    /**
     *
     */
    pickNewActiveRefNumber() {
        // Finds the next active ref number first by searching within an available range
        // otherwise just adds based on the next max value.

        // we dont want to allow 0 as a min value.
        const allowedMin = 1;

        if (this.activeRefNumbers.length === 0) {
            return allowedMin;
        }

        const activeRefNumbersArray = [...this.activeRefNumbers];
        let minVal = Math.min(...activeRefNumbersArray);
        if (minVal > allowedMin) {
            return minVal - 1;
        }
        let maxVal = Math.max(...activeRefNumbersArray);

        // todo - switch the below to be radix style for determining next available slot
        // or something more optimal for the algorithm (including 2x choosing)
        for (let num = minVal; num < maxVal; ++num) {
            if (!this.activeRefNumbers.has(num)) {
                return num;
            }
        }
        return maxVal + 1;
    }

    /**
     *
     * @param entity
     */
    setupMaterials(entity) {
        const grabStencilRef = (parent) => {
            let foundMesh = false;
            if (parent.object3D instanceof THREE.Group) {
                parent.object3D.traverse((child) => {
                    if (!foundMesh && child instanceof THREE.Mesh) {
                        return child.material.stencilRef;
                    }
                });
            } else {
                return parent.material.stencilRef;
            }
        }

        // set entity as having mask material and its main mrDiv as having stencil material if not already set to that
        console.log('setting up the materials for the entity: ');
        console.log(entity);
        console.log('parent is: ');
        console.log(entity.parent);
        let parent = entity.parent;

        // Setup it and its children to mask based on its parent panel
        // If the parent panel is already set to stencil for the mask properly, use its pre-existing
        // ref number; otherwise, create a new ref number.
        if (parent instanceof Panel && parent.contains(entity)) {
            // ---- Handle parent and parent info ---- //
            // try to grab the parent panel's stencil ref info or make a new one. If parent already
            // has one, it does not need to have its stencil material reset.
            let stencilRef = grabStencilRef(parent);
            if (stencilRef == undefined || stencilRef == 0 || stencilRef == -1) {
                // For this case we need to pick a new ref number. We're avoiding the two noted numbers:
                //  0: because it is the default stencil ref
                // -1: because that is our default as 'un-setup'
                stencilRef = this.pickNewActiveRefNumber();
                this.activeRefNumbers.add(stencilRef);
                // set the panel to stencil properly
                this.setStencilMaterial(parent, stencilRef);
            }

            // ---- Handle self and child info ---- //
            // make sure the entity and all ui children are masked by the panel
            this.setMaskMaterial(entity, stencilRef);
            entity.object3D.traverse((child) => {
                if (child instanceof MRDivEntity && !child.ignoreStencil) {
                    this.setMaskMaterial(child, stencilRef);
                    console.log('setting the mask material ')
                }
            });
        }
    }
}
