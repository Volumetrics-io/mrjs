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
        // handle panel render to texture steps
        // let singlePanel = null;
        // for (const p of this.maskingSystem.panels.values()) {
        //     singlePanel = p.object3D;
        //     break;
        // }
        // const scene = new THREE.scene();
        // mrjsUtils.Material.setObjectMaterial(singlePanel,stencilRenderMaterial);
        // this.renderer.setRenderTarget(global.renderTarget);
        // this.renderer.clear();
        // this.renderer.render(scene, this.user);
        // this.renderer.setRenderTarget(null);
        // mrjsUtils.Material.setObjectMaterial(panelObject3D,torusMaterial);

        // // update children for the new uniform texture
        // yourMesh.material.uniforms.yourUniform.value = global.renderTarget.texture;


       
    }

    // texture1UniformHandle = null;
    // resolutionUniformHandle = null;

    /**
     * @function
     * @description Called when a new entity is added to the scene. Handles masking elements to their panel.
     * @param {MREntity} entity - the entity being added.
     */
    onNewEntity(entity) {

        // Shader material for cube and sphere
        // const shaderMaterialUniforms = {
        //     texture1: { value: global.renderTarget.texture },
        //     resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
        // };

        // const objectShaderMaterial = {
        //     uniforms: shaderMaterialUniforms,
        //     vertexShader: `
        //         varying vec2 vUv;
        //         void main() {
        //             vUv = uv;
        //             gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        //         }
        //     `,
        //     fragmentShader: `
        //         uniform sampler2D texture1;
        //         uniform vec2 resolution;
        //         varying vec2 vUv;

        //         void main() {
        //             vec4 textureColor = texture2D(texture1, gl_FragCoord.xy / resolution);
        //             if (textureColor.r < 0.1) {
        //                 discard;
        //             } else {
        //                 gl_FragColor = vec4(0, 0, 0, 1);
        //             }
        //         }
        //     `
        // };

        // // Cube and sphere materials
        // const cubeMaterial = new THREE.ShaderMaterial({
        //     ...objectShaderMaterial,
        //     fragmentShader: `
        //         uniform sampler2D texture1;
        //         uniform vec2 resolution;
        //         varying vec2 vUv;

        //         void main() {
        //             vec4 textureColor = texture2D(texture1, gl_FragCoord.xy / resolution);
        //             if (textureColor.r < 0.1) {
        //                 discard;
        //             } else {
        //                 gl_FragColor = vec4(1, 0, 0, 1); // Red color
        //             }
        //         }
        //     `
        // });

        // const sphereMaterial = new THREE.ShaderMaterial({
        //     ...objectShaderMaterial,
        //     fragmentShader: `
        //         uniform sampler2D texture1;
        //         uniform vec2 resolution;
        //         varying vec2 vUv;

        //         void main() {
        //             vec4 textureColor = texture2D(texture1, gl_FragCoord.xy / resolution);
        //             if (textureColor.r < 0.1) {
        //                 discard;
        //             } else {
        //                 gl_FragColor = vec4(0, 0, 1, 1); // Blue color
        //             }
        //         }
        //     `
        // });

//         const updateLiveMaterial = (material, texture, resolution) => {
//             material.onBeforeCompile = (shader) => {
//                 // Add uniforms
//                 shader.uniforms.texture1 = { value: texture };
//                 this.texture1UniformHandle = shader.uniforms.texture1; // for updating later
//                 console.log('this.texture1UniformHandle is : ');
//                 console.log(this.texture1UniformHandle);
//                 shader.uniforms.resolution = { value: resolution };
//                 this.resolutionUniformHandle = shader.uniforms.resolution; // for updating later
//                 console.log('this.resolutionUniformHandle is : ');
//                 console.log(this.resolutionUniformHandle);

//                 // Inject custom code into the fragment shader
//                 shader.fragmentShader = shader.fragmentShader.replace(
//                     '#include <common>',
//                     `
// // ::BEGIN MRJS MODIFIED::
// uniform sampler2D texture1;
// uniform vec2 resolution;
// #include <common>
// // ::END MRJS MODIFIED::
//                     `
//                 );

//                 // Modify the main gl_FragColor assignment
//                 // Here we use a regular expression to find the right place to inject the code
//                 shader.fragmentShader = shader.fragmentShader.replace(
//                     '#include <output_fragment>',
//                     `
// // ::BEGIN MRJS MODIFIED::
// // Modify the gl_FragColor
// vec4 textureColor = texture2D(texture1, gl_FragCoord.xy / resolution);
// if (textureColor.r < 0.1) {
//     gl_FragColor = vec4(1, 1, 0, 1); // Green color // discard;
// } else {
//     gl_FragColor = vec4(1, 0, 0, 1); // Red color
// }

// // Include the Three.js output_fragment
// #include <output_fragment>
// // ::END MRJS MODIFIED::
//                     `
//                 );

//                 console.log('hiiiiii');
//                 console.log('Fragment Shader:', shader.fragmentShader);
//             };

//             // This is necessary to update the material with the new shader
//             material.needsUpdate = true;
//             return material;
//         };

        if (entity instanceof Panel) {
            console.log('on new entity that is a panel');
            console.log(entity);
            console.log('added to panels listing');
            this.panels.add(entity);
            
            // handle all children MRDivEntities
            // entity.traverse((child) => {
            //     console.log('traversing panel for children');
            //     if (child instanceof MRDivEntity && !(child instanceof Panel) && !child.ignoreStencil && entity.contains(child)) {
            //         console.log('on new child to add to registry, child is:');
            //         console.log(child);
            //         this.registry.add(child);
            //     }
            // });
        }
        // otherwise ignore.
    }
}
