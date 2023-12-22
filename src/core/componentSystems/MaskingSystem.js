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
        // entities
        // this.maskingMaterial = new THREE.MeshBasicMaterial({
        //     color:          0xff0000,
        //     stencilWrite:   true,
        //     stencilRef:     -1,
        //     stencilFunc:    THREE.EqualStencilFunc,
        //     stencilFail:    THREE.ReplaceStencilOp,
        //     stencilZFail:   THREE.ReplaceStencilOp,
        //     stencilZPass:   THREE.ReplaceStencilOp
        // });
        // // panels
        // this.stencilMaterial = new THREE.MeshBasicMaterial({
        //     color:          0x00ff00,
        //     stencilWrite:   true,
        //     stencilRef:     -1,
        //     stencilFunc:    THREE.AlwaysStencilFunc,
        //     stencilFail:    THREE.KeepStencilOp,
        //     stencilZFail:   THREE.KeepStencilOp,
        //     stencilZPass:   THREE.KeepStencilOp,
        // });

        // this.activeRefNumbers = new Set();
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

        const updateLiveMaterial = (material, texture, resolution) => {
            material.onBeforeCompile = (shader) => {
                // Add uniforms
                shader.uniforms.texture1 = { value: texture };
                shader.uniforms.resolution = { value: resolution };

                // Inject custom code into the fragment shader
                shader.fragmentShader = shader.fragmentShader.replace(
                    '#include <common>',
                    `
// ::BEGIN MRJS MODIFIED::
uniform sampler2D texture1;
uniform vec2 resolution;
#include <common>
// ::END MRJS MODIFIED::
                    `
                );

                // Modify the main gl_FragColor assignment
                // Here we use a regular expression to find the right place to inject the code
                shader.fragmentShader = shader.fragmentShader.replace(
                    '#include <output_fragment>',
                    `
// ::BEGIN MRJS MODIFIED::
// Modify the gl_FragColor
vec4 textureColor = texture2D(texture1, gl_FragCoord.xy / resolution);
if (textureColor.r < 0.1) {
    gl_FragColor = vec4(1, 1, 0, 1); // Green color // discard;
} else {
    gl_FragColor = vec4(1, 0, 0, 1); // Red color
}

// Include the Three.js output_fragment
#include <output_fragment>
// ::END MRJS MODIFIED::
                    `
                );

                console.log('hiiiiii');
                console.log('Fragment Shader:', shader.fragmentShader);
            };

            // This is necessary to update the material with the new shader
            material.needsUpdate = true;
            return material;
        };

        // todo - the below order of the logic is odd - would be nice to clean up to be panel first and entity children based off it

        console.log
        if (entity instanceof Panel) {
            this.panels.add(entity.background);
            return;
        }
        if (entity instanceof MRDivEntity && !entity.ignoreStencil) {
            const parent = entity.parent;
            if (parent instanceof Panel && parent.contains(entity)) {
                let object = entity.object3D;
                let material = mrjsUtils.Material.grabObjectMaterial(object);
                material = updateLiveMaterial(material, global.renderTarget.texture, new THREE.Vector2(window.innerWidth, window.innerHeight));
                object = mrjsUtils.Material.setObjectMaterial(object, material)
                this.registry.add(object);
            }
        }
    }

    // /**
    //  * Applies mask material to an entity. If the entity is a Group, apply to all Mesh children.
    //  * @param entity
    //  * @param stencilRef
    //  */
    // setMaskMaterial(entity, stencilRef) {
    //     console.log('this.maskingMaterial');
    //     console.log(this.maskingMaterial);
    //     const applyMask = (obj) => {
    //         obj.material.stencilWrite = this.maskingMaterial.stencilWrite;
    //         obj.material.stencilRef = stencilRef;
    //         obj.material.stencilFunc = this.maskingMaterial.stencilFunc;
    //         obj.material.stencilFail = this.maskingMaterial.stencilFail;
    //         obj.material.stencilZFail = this.maskingMaterial.stencilZFail;
    //         obj.material.stencilZPass = this.maskingMaterial.stencilZPass;
    //     };

    //     if (entity.object3D instanceof THREE.Group) {
    //         entity.object3D.traverse(child => {
    //             if (child instanceof THREE.Mesh) {
    //                 applyMask(child);
    //             }
    //         });
    //     } else {
    //         applyMask(entity.object3D);
    //     }
    // }

    // /**
    //  * Applies stencil material to a panel. If the panel is a Group, apply to all Mesh children.
    //  * @param panel
    //  * @param stencilRef
    //  */
    // setStencilMaterial(panel, stencilRef) {
    //     const applyStencil = (obj) => {
    //         obj.material.stencilWrite = this.stencilMaterial.stencilWrite;
    //         obj.material.stencilRef = stencilRef;
    //         obj.material.stencilFunc = this.stencilMaterial.stencilFunc;
    //         obj.material.stencilFail = this.stencilMaterial.stencilFail;
    //         obj.material.stencilZFail = this.stencilMaterial.stencilZFail;
    //         obj.material.stencilZPass = this.stencilMaterial.stencilZPass;
    //     };

    //     if (panel.object3D instanceof THREE.Group) {
    //         panel.object3D.traverse(child => {
    //             if (child instanceof THREE.Mesh) {
    //                 applyStencil(child);
    //             }
    //         });
    //     } else {
    //         applyStencil(panel.object3D);
    //     }
    // }

    // /**
    //  *
    //  */
    // pickNewActiveRefNumber() {
    //     // we dont want to allow 0 or -1 as values.
    //     // 0 is default by webgl and -1 we want to leave as 'un-setup'
    //     const allowedMin = 1;

    //     // If no active numbers, return the minimum allowed value.
    //     if (this.activeRefNumbers.size === 0) {
    //         return allowedMin;
    //     }

    //     // Find the smallest number greater than the minimum allowed value that is not already in the set.
    //     let currentNumber = allowedMin;
    //     while (this.activeRefNumbers.has(currentNumber)) {
    //         ++currentNumber;
    //     }

    //     return currentNumber;
    // }

    // /**
    //  *
    //  * @param entity
    //  */
    // setupMaterials(entity) {
    //     const grabStencilRef = (parent) => {
    //         let foundMesh = false;
    //         let stencilRef;

    //         if (parent.object3D instanceof THREE.Group) {
    //             parent.object3D.traverse((child) => {
    //                 if (!foundMesh && child instanceof THREE.Mesh) {
    //                     stencilRef = child.material.stencilRef;
    //                     foundMesh = true;
    //                 }
    //             });
    //         } else {
    //             stencilRef = parent.material.stencilRef;
    //         }

    //         return stencilRef;
    //     };

    //     // Setup it and its children to mask based on its parent panel
    //     // If the parent panel is already set to stencil for the mask properly, use its pre-existing
    //     // ref number; otherwise, create a new ref number.
    //     let parent = entity.parent;
    //     if (parent instanceof Panel && parent.contains(entity)) {
    //         // ---- Handle parent and parent info ---- //
    //         // try to grab the parent panel's stencil ref info or make a new one. If parent already
    //         // has one, it does not need to have its stencil material reset.
    //         let stencilRef = grabStencilRef(parent);
    //         if (stencilRef == undefined || stencilRef == 0 || stencilRef == -1) {
    //             // For this case we need to pick a new ref number. We're avoiding the two noted numbers:
    //             //  0: because it is the default stencil ref
    //             // -1: because that is our default as 'un-setup'
    //             stencilRef = this.pickNewActiveRefNumber();
    //             this.activeRefNumbers.add(stencilRef);
    //             // set the panel to stencil properly
    //             this.setStencilMaterial(parent, stencilRef);
    //         }

    //         // ---- Handle self and child info ---- //
    //         // make sure the entity and all ui children are masked by the panel
    //         this.setMaskMaterial(entity, stencilRef);
    //         entity.object3D.traverse((child) => {
    //             if (child instanceof MRDivEntity && !child.ignoreStencil) {
    //                 this.setMaskMaterial(child, stencilRef);
    //                 console.log('setting the mask material ')
    //             }
    //         });
    //     }
    // }
}
