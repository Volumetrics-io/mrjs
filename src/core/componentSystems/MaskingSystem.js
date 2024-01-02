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

        this.panelStencilMaterial = new THREE.MeshBasicMaterial();
        this.panelStencilMaterial.stencilWrite = true;
        this.panelStencilMaterial.stencilFunc = THREE.AlwaysStencilFunc;
        this.panelStencilMaterial.stencilRef = 1;
        this.panelStencilMaterial.stencilZPass = THREE.ReplaceStencilOp;

        this.objectStencilMaterial = new THREE.MeshBasicMaterial();
        this.objectStencilMaterial.stencilWrite = true;
        this.objectStencilMaterial.stencilFunc = THREE.EqualStencilFunc;
        this.objectStencilMaterial.stencilRef = 1;

        // this.activeRefNumbers = new Set();
        // this.panels = new Set(); // needed for rendering, we dont need one for the entities though since theyre added to the registry already.
        this.panelsToEntities = new Map();
        this.panels = [];
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
            this.panels.push(entity);
            let children = [];
            let panel = null;
            entity.traverse((child) => {
                // TODO - the below logic for the children array is slightly off - fix if needed
                // but might not need the children array anymore
                console.log(child);
                console.log(child.object3D);
                console.log(child.object3D.material);

                if (child instanceof MRDivEntity && !(child instanceof Panel) && !child.ignoreStencil) {
                    if (!child.object3D.isGroup) {
                        child.object3D.material.color.set(0xffff00); // yellow
                        child.object3D.material.stencilWrite = this.objectStencilMaterial.stencilWrite;
                        child.object3D.material.stencilFunc = this.objectStencilMaterial.stencilFunc;
                        child.object3D.material.stencilRef = this.objectStencilMaterial.stencilRef;

                        child.object3D.material.needsUpdate = true;
                        console.log('updated child mesh material');
                    }

                    //     console.log(`in weird state for panel's child, should be a group object, is:`);
                    //     console.log(child.object3D);
                    // } else {
                    //     console.log('on new child to add, added');
                    //     // let objectMesh = child.object3D.children[0];

                    //     child.object3D.children[0].material.stencilWrite = this.objectStencilMaterial.stencilWrite;
                    //     child.object3D.children[0].material.stencilFunc = this.objectStencilMaterial.stencilFunc;
                    //     child.object3D.children[0].material.stencilRef = this.objectStencilMaterial.stencilRef;

                    //     child.object3D.children[0].material.needsUpdate = true;

                    //     // child.object3D.children[0] = objectMesh;

                    //     children.push(child.object3D);
                    // }
                } else if (child instanceof Panel) {
                    if (child.object3D.isGroup) {
                        // grab background

                        let mesh = child.background;
                        mesh.material.color.set(0xff00ff); // pink
                        mesh.material.stencilWrite = this.panelStencilMaterial.stencilWrite;
                        mesh.material.stencilFunc = this.panelStencilMaterial.stencilFunc;
                        mesh.material.stencilRef = this.panelStencilMaterial.stencilRef;
                        mesh.material.stencilZPass = this.panelStencilMaterial.stencilZPass;

                        mesh.material.needsUpdate = true;

                        console.log('updated panel material');
                    }

                    //     console.log('in weird state for panel, should be a group object, is:');
                    //     console.log(child.object3D);
                    // } else {
                    //     console.log('on panel to add');
                    //     // panel is always the first mesh child of the group
                    //     // let panelMesh = child.object3D.children[0];

                    //     child.object3D.children[0].material.stencilWrite = this.panelStencilMaterial.stencilWrite;
                    //     child.object3D.children[0].material.stencilFunc = this.panelStencilMaterial.stencilFunc;
                    //     child.object3D.children[0].material.stencilRef = this.panelStencilMaterial.stencilRef;
                    //     child.object3D.children[0].material.stencilZPass = this.panelStencilMaterial.stencilZPass;

                    //     child.object3D.children[0].material.needsUpdate = true;

                    //     // child.object3D.children[0] = panelMesh;

                    //     panel = child.object3D;
                    // }
                } else if (child.object3D.isGroup) {
                    console.log('skipping child group:');
                    console.log(child);
                    console.log(child.object3D);
                } else {
                    console.log('on new child to add, ignored:');
                    console.log(child);
                }
            });
            this.panelsToEntities.set(panel, children);
            console.log('traversing panel for children');
        }
    }
}
