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
    }

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

            // Cube and sphere materials
            // const determinedMaterial = new THREE.ShaderMaterial({
            //     ...object.material,
            //     fragmentShader: `
            //         uniform sampler2D texture1;
            //         uniform vec2 resolution;
            //         varying vec2 vUv;

            //         void main() {
            //             vec4 textureColor = texture2D(texture1, gl_FragCoord.xy / resolution);
            //             if (textureColor.r < 0.1) {
            //                 gl_FragColor = vec4(1, 1, 0, 1); // yellow color // discard
            //             } else {
            //                 gl_FragColor = vec4(1, 0, 0, 1); // Red color
            //             }
            //         }
            //     `
            // });
            // material = determinedMaterial;

            // This is necessary to update the material with the new shader
            material.needsUpdate = true;
            return material;
        };

        if (entity instanceof Panel) {
            this.panels.add(entity);

            // handle panel material
            
            
            // handle all children MRDivEntities
            entity.traverse((child) => {
                if (child instanceof MRDivEntity && !child.ignoreStencil && entity.contains(child)) {
                    let material = mrjsUtils.Material.grabObjectMaterial(child.object3D);
                    material = updateLiveMaterial(material, global.renderTarget.texture, new THREE.Vector2(window.innerWidth, window.innerHeight));
                    mrjsUtils.Material.setObjectMaterial(child.object3D, material)
                    this.registry.add(child);
                }
            });
        }
        // otherwise ignore.
    }
}
