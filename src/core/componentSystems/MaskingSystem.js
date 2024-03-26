import * as THREE from 'three';

import { MRSystem } from 'mrjs/core/MRSystem';
import { MRDivEntity } from 'mrjs/core/entities/MRDivEntity';
import { MREntity } from 'mrjs/core/MREntity';
import { MRPanelEntity } from 'mrjs/core/entities/MRPanelEntity';
import { MRTextEntity } from 'mrjs/core/entities/MRTextEntity';

/*
 * A system that handles elements that mask other elements by using stencil.
 * Eg: A Panel does not display child elements if the elements are positioned
 * outside the Panel's bounds.
 *
 * We use two rendering passes, one for writing to stencil buffer and another one
 * is for rendering the result with testing stencil. Basic idea is the following.
 *
 * 1. Have a scene, called stencil scene here to distinguish from the main scene,
 *    for writing to stencil buffer
 * 2. When an entity that mask others is added
 *   2-1. Assign an id (0-) to the entity
 *   2-2. Create a new mesh from the entity's object and add it to stencil scene
 *   2-3. Set up the material for the created mesh to write stencil buffer with 1 << id
 *   2-4. Set up the materials of the child entities to test stencil buffer with 1 << id
 * 3. In an animation loop
 *   3-1. Update the matrices of the main scene
 *   3-2. Copy the matrices to the the meshes in the stencil scene from the associated
 *        entities in the main scene
 *   3-3. Clear stencil buffer
 *   3-4. Writing to stencil buffer by calling renderer.render() with the stencil scene
 *   3-5. Rendering the main scene
 *
 * Advantage:
 *   - Simple, we don't need to manage much stencil specialities (eg: No need to control
 *     Object3D.renderOrder)
 *   - Using one stencil bit per panel allows for transparent and overlap processing.
 *
 * Limitation:
 *   - Up to eight entities that mask others because it's safe to think stencil has 8 bits.
 *
 *     > stencil buffer of at least 8 bits.
 *     https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext#stencil
 */

const MAX_PANEL_NUM = 8;

/**
 * @function
 * @description Setting up a material for an object that maskes other elements
 * @param {THREE.Material} material
 * @param {number} shiftBit
 * @param {debug} boolean
 */
const setupMaskingMaterial = (material, shiftBit, debug = false) => {
    material.transparent = true;
    // Nothing to render to color buffer so setting 0.0 unless debug mode
    material.opacity = debug ? 0.5 : 0.0;
    material.stencilWrite = true;
    material.stencilWriteMask = 1 << shiftBit;
    material.stencilRef = 1 << shiftBit;
    material.stencilFunc = THREE.AlwaysStencilFunc;
    material.stencilZPass = THREE.ReplaceStencilOp;

    // Disable depth testing to avoid complexity. Depth testing and other related
    // tasks are left to the main scene rendering.
    material.depthTest = false;
    material.depthWrite = false;
};

/**
 * @function
 * @description Setting up a material for an object that is masked by another element
 * @param {THREE.Material} material
 * @param {number} shiftBit
 */
const setupMaskedMaterial = (material, shiftBit) => {
    material.stencilWrite = true;
    material.stencilRef |= 1 << shiftBit;
    material.stencilFunc = THREE.EqualStencilFunc;
    material.stencilFuncMask |= 1 << shiftBit;
    material.stencilFail = THREE.KeepStencilOp;
    material.stencilZFail = THREE.KeepStencilOp;
    material.stencilZPass = THREE.KeepStencilOp;
};

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

        this.scene = new THREE.Scene();
        this.scene.matrixAutoUpdate = false;
        this.scene.matrixWorldAutoUpdate = false;

        this.sourceElementMap = new Map();
        this.maskingMeshMap = new Map();
        this.panels = [];
    }

    /**
     * @function
     * @description ...
     * @param {number} deltaTime - given timestep to be used for any feature changes
     * @param {object} frame - given frame information to be used for any feature changes
     */
    update(deltaTime, frame) {
        // leave for when needed.
    }

    /**
     * @function
     * @description Copy the source world matrices to the objects writing to stencil buffer
     */
    sync() {
        // TODO: Move to update().
        // This method needs to be called after the matrices of the main scene are updated.
        // However, currently the matrices are updated MRApp after running systems' update(),
        // so the conditions are not met when executed in update(). Therefore, as a
        // temporary workaround, a new method has been added and is explicitly called
        // from MRApp. Moving this code into the update() method would reduce the specialities
        // and improve maintainability.
        for (const child of this.scene.children) {
            const source = this.sourceElementMap.get(child).background;

            // TODO: Consider a properer way.
            // It seems that the geometry of a source object can be replaced with a different
            // geometry by other systems, so this check and replacing are needed. However,
            // replacing the geometry is not an appropriate use of the Three.js API. We
            // should consider a more robust approach to copying the shape of the source object.
            if (child.geometry !== source.geometry) {
                child.geometry = source.geometry;
            }

            child.matrixWorld.copy(source.matrixWorld);
        }
    }

    /**
     * @function
     * @description Called when a new entity is added to the scene. Handles masking elements to their panel.
     * @param {MREntity} entity - the entity being added.
     */
    onNewEntity(entity) {
        if (entity instanceof MRPanelEntity) {
            if (this.panels.length >= MAX_PANEL_NUM) {
                console.warn('Masking system supports up to eight panels.');
                return;
            }

            // Ignoring panel removal for now.
            // TODO: Handle panel removal
            const stencilRefShift = this.panels.length;
            this.panels.push(entity);

            // We need to mask based off the background mesh of this object.
            const sourceObj = entity.background;

            // TODO: Optimize material.
            // Since only needs to write to the stencil buffer, no need to write to the color buffer,
            // therefore, we can use a simpler material than MeshBasicMaterial. Should we use
            // ShaderMaterial?
            const mesh = new THREE.Mesh(sourceObj.geometry, new THREE.MeshBasicMaterial());
            setupMaskingMaterial(mesh.material, stencilRefShift, this.app.debug);

            // No automatic matrices update because world matrices are updated in sync().
            mesh.matrixAutoUpdate = false;
            mesh.matrixWorldAutoUpdate = false;

            this.scene.add(mesh);
            this.sourceElementMap.set(mesh, entity);
            this.maskingMeshMap.set(entity, mesh);

            // Child elements are masked by this panel so traverse children and set up their materials for stencil
            entity.traverse((child) => {
                if (entity === child) {
                    return;
                }

                if (child instanceof MRDivEntity && !child.ignoreStencil) {
                    // The children we want to mask by the panel should only be DivEntities (ie UI elements). Other items
                    // will be clipped by the panel instead. Additionally, we want to allow for items (such as 3D elements)
                    // to be manually excluded from this masking by default or manual addition.
                    //
                    // Since we're stepping through every child, we only need to touch each mesh's material instead of
                    // updating group objects as a whole.
                    child.traverseObjects((object) => {
                        if (object.isMesh) {
                            setupMaskedMaterial(object.material, stencilRefShift);
                        }
                    });
                }
            });
        } else if (entity instanceof MRDivEntity && !entity.ignoreStencil) {
            // There is a chance that a child entity is added after parent panel addition.
            // Check registered panels and set up the material if panels are found in parents.
            for (const panel of this.panels) {
                if (panel.contains(entity)) {
                    const mesh = this.maskingMeshMap.get(panel);
                    const stencilRefShift = this.panels.indexOf(panel);
                    entity.traverseObjects((object) => {
                        if (object.isMesh) {
                            // setupMaskedMaterial is a very light function so
                            // calling again for materials already set up should not be a big deal
                            setupMaskedMaterial(object.material, stencilRefShift);
                        }
                    });
                }
            }
        }
    }
}
