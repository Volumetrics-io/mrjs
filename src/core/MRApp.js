import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { ClearPass } from 'three/addons/postprocessing/ClearPass.js';
import { MaskPass } from 'three/addons/postprocessing/MaskPass.js';

// import { OutPass } from 'three/addons/postprocessing/OutPass.js';
// import { ClearMaskPass } from 'three/addons/postprocessing/ClearMaskPass.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';




import { ARButton } from 'three/addons/webxr/ARButton.js';

import Stats from 'stats.js';

import { MRElement } from 'mrjs/core/MRElement';
import { MRDivEntity } from 'mrjs/core/MRDivEntity';
import { Panel } from 'mrjs/core/entities/Panel';

import { mrjsUtils } from 'mrjs';

import { MREntity } from 'mrjs/core/MREntity';
import { MRSystem } from 'mrjs/core/MRSystem';
import { ClippingSystem } from 'mrjs/core/componentSystems/ClippingSystem';
import { ControlSystem } from 'mrjs/core/componentSystems/ControlSystem';
import { LayoutSystem } from 'mrjs/core/componentSystems/LayoutSystem';
import { MaskingSystem } from 'mrjs/core/componentSystems/MaskingSystem';
import { PhysicsSystem } from 'mrjs/core/componentSystems/PhysicsSystem';
import { SurfaceSystem } from 'mrjs/core/componentSystems/SurfaceSystem';
import { StyleSystem } from 'mrjs/core/componentSystems/StyleSystem';
import { TextSystem } from 'mrjs/core/componentSystems/TextSystem';

('use strict');
window.mobileCheck = function () {
    return mrjsUtils.Display.mobileCheckFunction();
};

/**
 * @class MRApp
 * @classdesc The engine handler for running MRjs as an App. `mr-app`
 * @augments MRElement
 */
export class MRApp extends MRElement {
    /**
     * @class
     * @description Constructs the base information of the app including system, camera, engine, xr, and rendering defaults.
     */
    constructor() {
        super();
        Object.defineProperty(this, 'isApp', {
            value: true,
            writable: false,
        });

        this.xrsupport = false;
        this.isMobile = window.mobileCheck(); // resolves true/false
        global.inXR = false;

        this.clock = new THREE.Clock();
        this.systems = new Set();
        this.scene = new THREE.Scene();

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.session;

        this.lighting = {
            enabled: true,
            color: 0xffffff,
            intensity: 1,
            radius: 5,
            shadows: true,
        };

        this.cameraOptions = {
            camera: 'orthographic',
        };
        this.render = this.render.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);

    }

    /**
     * @function Connected
     * @memberof MRApp
     * @description The connectedCallback function that runs whenever this entity component becomes connected to something else.
     */
    connectedCallback() {
        this.init();

        this.observer = new MutationObserver(this.mutationCallback);
        this.observer.observe(this, { attributes: true, childList: true });

        this.layoutSystem = new LayoutSystem();
        this.styleSystem = new StyleSystem();

        // initialize built in Systems
        document.addEventListener('engine-started', (event) => {
            this.physicsWorld = new mrjsUtils.Physics.RAPIER.World({ x: 0.0, y: -9.81, z: 0.0 });
            this.physicsSystem = new PhysicsSystem();
            this.controlSystem = new ControlSystem();
            this.textSystem = new TextSystem();

            // these must be the last three systems since
            // they affect rendering. Clipping must happen
            // before masking. Rendering must be the last step.
            this.clippingSystem = new ClippingSystem();
            this.maskingSystem = new MaskingSystem();
            // this.renderSystem = new RenderSystem();
        });
    }

    /**
     * @function Disconnected
     * @memberof MRApp
     * @description The disconnectedCallback function that runs whenever this entity component becomes connected to something else.
     */
    disconnectedCallback() {
        this.denit();
        this.observer.disconnect();
    }

    // TODO: These are for toggling debug and app level flags in realtime.
    //       Currently only 'debug' is implemented. but we should add:
    //       - stats
    //       - lighting
    //       - controllers
    //       - ?
    /**
     * @function
     * @param {object} mutation - TODO
     */
    mutatedAttribute(mutation) {}

    /**
     * @function
     * @param {object} mutation - TODO
     */
    mutatedChildList(mutation) {}

    /**
     * @function
     * @description The mutationCallback function that runs whenever this entity component should be mutated.
     * @param {object} mutationList - the list of update/change/mutation(s) to be handled.
     * @param {object} observer - w3 standard object that watches for changes on the HTMLElement
     */
    mutationCallback = (mutationList, observer) => {
        for (const mutation of mutationList) {
            if (mutation.type === 'childList') {
                this.mutatedChildList(mutation);
            }
            if (mutation.type === 'attributes') {
                this.mutatedAttribute(mutation);
            }
        }
    };

    /**
     * @function
     * @description Initializes the engine state for the MRApp. This function is run whenever the MRApp is connected.
     */
    init() {
        this.debug = this.getAttribute('debug') ?? false;
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.autoClear = false;
        this.renderer.shadowMap.enabled = true;
        this.renderer.xr.enabled = true;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1;
        this.renderer.localClippingEnabled = true;

        this.cameraOptionString = this.getAttribute('camera');
        if (this.cameraOptionString) {
            this.cameraOptions = mrjsUtils.StringUtils.stringToJson(this.cameraOptionString);
        }

        this.initUser();
        mrjsUtils.Physics.initializePhysics();

        this.user.position.set(0, 0, 1);

        const layersString = this.getAttribute('layers');

        if (layersString) {
            this.layers = mrjsUtils.StringUtils.stringToVector(layersString);

            for (const layer of this.layers) {
                this.user.layers.enable(layer);
            }
        }

        if (this.debug) {
            this.stats = new Stats();
            this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
            document.body.appendChild(this.stats.dom);

            const orbitControls = new OrbitControls(this.user, this.renderer.domElement);
            orbitControls.minDistance = 1;
            orbitControls.maxDistance = 2;
            orbitControls.enabled = false;

            document.addEventListener('keydown', (event) => {
                if (event.key == '=') {
                    orbitControls.enabled = true;
                }
            });

            document.addEventListener('keyup', (event) => {
                if (event.key == '=') {
                    orbitControls.enabled = false;
                }
            });
        }

        this.appendChild(this.renderer.domElement);

        navigator.xr?.isSessionSupported('immersive-ar').then((supported) => {
            this.xrsupport = supported;

            if (this.xrsupport) {
                this.ARButton = ARButton.createButton(this.renderer, {
                    requiredFeatures: ['hand-tracking'],
                    optionalFeatures: ['hit-test'],
                });

                this.ARButton.addEventListener('click', () => {
                    if (!this.surfaceSystem) {
                        this.surfaceSystem = new SurfaceSystem();
                    }
                    this.ARButton.blur();
                    global.inXR = true;
                    this.dispatchEvent(new CustomEvent('enterXR', { bubbles: true }));
                });
                document.body.appendChild(this.ARButton);

                this.ARButton.style.position = 'fixed';
                this.ARButton.style.zIndex = 10000;
            }
        });

        this.renderer.setAnimationLoop(this.render);

        window.addEventListener('resize', this.onWindowResize);

        const lightString = this.getAttribute('lighting');

        if (lightString) {
            this.lighting = mrjsUtils.StringUtils.stringToJson(this.lighting);
        }

        this.initLights(this.lighting);
    }

    /**
     * @function
     * @description Initializes the user information for the MRApp including appropriate HMD direction and camera information and the default scene anchor location.
     */
    initUser = () => {
        switch (this.cameraOptions.camera) {
            case 'orthographic':
                global.viewPortWidth = window.innerWidth / 1000;
                global.viewPortHeight = window.innerHeight / 1000;

                this.user = new THREE.OrthographicCamera(global.viewPortWidth / -2, global.viewPortWidth / 2, global.viewPortHeight / 2, global.viewPortHeight / -2, 0.01, 1000);
                break;
            case 'perspective':
            default:
                this.user = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);
                this.vFOV = THREE.MathUtils.degToRad(this.user.fov);
                global.viewPortHeight = 2 * Math.tan(this.vFOV / 2);
                global.viewPortWidth = global.viewPortHeight * this.user.aspect;
                break;
        }

        // weird bug fix in getting camera position in webXR
        this.forward = new THREE.Object3D();
        this.user.add(this.forward);

        this.forward.position.setZ(-0.5);

        // for widnow placement
        this.userOrigin = new THREE.Object3D();
        this.anchor = new THREE.Object3D();
        this.user.add(this.userOrigin);
        this.user.add(this.anchor);

        this.userOrigin.position.setX(0.015);
        this.anchor.position.setX(0.015);
        this.anchor.position.setZ(-0.5);
    };

    /**
     * @function
     * @description Initializes default lighting and shadows for the main scene.
     * @param {object} data - the lights data (color, intensity, shadows, etc)
     */
    initLights = (data) => {
        if (!data.enabled) {
            return;
        }
        this.globalLight = new THREE.AmbientLight(data.color);
        this.globalLight.intensity = data.intensity;
        this.globalLight.position.set(0, 0, 0);
        this.scene.add(this.globalLight);

        if (!this.isMobile) {
            if (data.shadows) {
                this.shadowLight = new THREE.PointLight(data.color);
                this.shadowLight.position.set(-1, 1, 1);
                this.shadowLight.intensity = data.intensity;
                this.shadowLight.castShadow = data.shadows;
                this.shadowLight.shadow.radius = data.radius;
                this.shadowLight.shadow.camera.near = 0.01; // default
                this.shadowLight.shadow.camera.far = 20; // default
                this.shadowLight.shadow.mapSize.set(2048, 2048);
                this.scene.add(this.shadowLight);
            }
        }
    };

    /**
     * @function
     * @description De-initializes rendering and MR
     */
    denit() {
        document.body.removeChild(this.renderer.domElement);
        this.removeChild(this.ARButton);
        window.removeEventListener('resize', this.onWindowResize);
    }

    /**
     * @function
     * @description Registers a new system addition to the MRApp engine.
     * @param {MRSystem} system - the system to be added.
     */
    registerSystem(system) {
        this.systems.add(system);
    }

    /**
     * @function
     * @description Unregisters a system from the MRApp engine.
     * @param {MRSystem} system - the system to be removed.
     */
    unregisterSystem(system) {
        this.systems.delete(system);
    }

    /**
     * @function
     * @description Adding an entity as an object in this MRApp engine's scene.
     * @param {MREntity} entity - the entity to be added.
     */
    add(entity) {
        this.scene.add(entity.object3D);
    }

    /**
     * @function
     * @description Removing an entity as an object in this MRApp engine's scene.
     * @param {MREntity} entity - the entity to be removed.
     */
    remove(entity) {
        this.scene.remove(entity.object3D);
    }

    /**
     * @function
     * @description Handles what is necessary rendering, camera, and user-wise when the viewing window is resized.
     */
    onWindowResize() {
        switch (this.cameraOptions.camera) {
            case 'orthographic':
                global.viewPortWidth = window.innerWidth / 1000;
                global.viewPortHeight = window.innerHeight / 1000;

                this.user.left = global.viewPortWidth / -2;
                this.user.right = global.viewPortWidth / 2;
                this.user.top = global.viewPortHeight / 2;
                this.user.bottom = global.viewPortHeight / -2;
                break;
            case 'perspective':
            default:
                this.user.aspect = window.innerWidth / window.innerHeight;
                global.viewPortWidth = global.viewPortHeight * this.user.aspect;
                break;
        }
        this.user.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    renderPassCount = 0;

    /**
     * @function
     * @description Default function header needed by threejs. The render function that is called during ever frame. Calls every systems' update function.
     * @param {number} timeStamp - timeStamp of the current frame.
     * @param {object} frame - given frame information to be used for any feature changes
     */
    render(timeStamp, frame) {
        console.log('starting renderpass:');
        console.log(this.renderPassCount);
        // ----- grab important vars ----- //

        const deltaTime = this.clock.getDelta();

        // ----- Update needed items ----- //

        if (global.inXR && !this.session) {
            this.session = this.renderer.xr.getSession();
            if (!this.session) {
                return;
            }

            this.session.addEventListener('inputsourceschange', (e) => {
                console.log(e);
            });

            this.session.addEventListener('end', () => {
                global.inXR = false;
                this.user.position.set(0, 0, 1);
                this.user.quaternion.set(0, 0, 0, 1);
                this.session = null;
                this.onWindowResize();
                this.dispatchEvent(new CustomEvent('exitXR', { bubbles: true }));
            });
        }

        if (this.debug) {
            this.stats.begin();
        }
        for (const system of this.systems) {
            system.__update(deltaTime, frame);
        }
        if (this.debug) {
            this.stats.end();
        }

        // ----- Actually Render ----- //

        if (this.maskingSystem == undefined) { return; }


        const renderTargetBackgroundNoEntities = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
        const renderTargetFullBackground = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
        const renderTargetPanelsMask = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
        const renderTargetEntitiesMask = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);

        // create needed materials
        // const panelMaterial = new THREE.ShaderMaterial({
        //     vertexShader: `
        //         void main() {
        //             gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        //         }
        //     `,
        //     fragmentShader: `
        //         void main() {
        //             // // Condition to check if the fragment is part of the object
        //             // if (gl_FragCoord.z < 1.0) {
        //             //     gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0); // Render blue where object exists
        //             // } else {
        //             //     gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // Render red
        //             // }
        //             void main() {
        //                 gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0); // Render white
        //             }
        //         }
        //     `,
        // });
        // const shaderMaterialUniforms = {
        //     texture1: { value: renderTarget.texture },
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
        // const entityMaterial = new THREE.ShaderMaterial({
        //     ...objectShaderMaterial,
        //     //uniforms: shaderMaterialUniforms,
        //     // vertexShader: `
        //     //     void main() {
        //     //         gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        //     //     }
        //     // `,
        //     fragmentShader: `
        //         uniform sampler2D texture1;
        //         uniform vec2 resolution;
        //         varying vec2 vUv;

        //         // void main() {
        //         //     vec4 textureColor = texture2D(texture1, gl_FragCoord.xy / resolution); //vUv);//

        //         //     // gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
        //         //     // pass thru right now 
        //         //     if (textureColor.r==0.0 && textureColor.g==0.0 && textureColor.b==1.0) {
        //         //         gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0); // pink
        //         //     } else {
        //         //         gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // red//Use the passed color
        //         //     }
        //         // }

        //         // // void main() {
        //         // //     // Calculate the screenspace coordinates
        //         // //     vec2 screenSpaceCoord = gl_FragCoord.xy / resolution;

        //         // //     // Sample the texture at the screenspace coordinates
        //         // //     vec4 textureColor = texture2D(texture1, screenSpaceCoord);

        //         // //     // Check if the texture color is blue (assuming blue is in the R channel)
        //         // //     if (textureColor.r == 0.0 && textureColor.g == 0.0 && textureColor.b == 1.0) {
        //         // //         // Render pink when blue is detected
        //         // //         gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);
        //         // //     } else {
        //         // //         // Discard this fragment if it's not in a blue spot
        //         // //         discard;
        //         // //     }
        //         // // }

        //         void main() {
        //             vec4 textureColor = texture2D(texture1, gl_FragCoord.xy / resolution);
        //             if (textureColor.r < 0.1) {
        //                 discard;
        //             } else {
        //                 gl_FragColor = vec4(0.0, 1.0, 1.0, 1); // Blue color
        //             }
        //         }
        //     `
        // });

        const camera = this.user;

        console.log(this.scene.children);
        
        console.log(this.maskingSystem.panels);
        const panelMesh = this.maskingSystem.panels[0].object3D.children[0];
        console.log(panelMesh);

        console.log('start render pass for panels');

        // Adjusted render pass for panels
        // this.renderer.clear();
        // this.renderer.setRenderTarget(renderTarget);
        // let panelMatOrig = null;
        // let material = panelMesh.material;
        // panelMesh.material = panelMaterial;
        // panelMatOrig = material;
        // this.renderer.render(this.scene, camera);
        // this.renderer.setRenderTarget(null);

        console.log('end render pass for panels');

        console.log('start entity setup');

        // const texture1Uniform = { value: renderTarget.texture };
        // entityMaterial.uniforms.texture1 = texture1Uniform;
        // entityMaterial.needsUpdate = true;

        // for (let e of this.maskingSystem.panels[0].object3D.children) {
        //     e.traverse((child) => {
        //         console.log(child);
        //         if (child instanceof Panel || child.ignoreStencil) {
        //             return;
        //         }
        //         if (child.isMesh) {
        //             if (child === panelMesh) { return; }
        //             child.material = entityMaterial;
        //             child.material.needsUpdate = true;
        //         }
        //     });
        // }

        // console.log('do all scene render');
        // this.renderer.render(this.scene, camera);

        // // console.log('set entity material back');

        // const standardMaterial = new THREE.MeshStandardMaterial();// not saving atm
        // for (let e of this.maskingSystem.panels[0].object3D.children) {
        //     e.traverse((child) => {
        //         console.log(child);
        //         if (child instanceof Panel || child.ignoreStencil) {
        //             return;
        //         }
        //         if (child.isMesh) {
        //             if (child === panelMesh) { return; }
        //             child.material = standardMaterial;
        //             child.material.needsUpdate = true;
        //         }
        //     });
        // }
        // panelMesh.material = panelMatOrig;

        // console.log('ending renderpass:');
        // console.log(this.renderPassCount);
        // this.renderPassCount++;

        ////----------

        // 2. Render the scene to create the background texture
        this.renderer.setRenderTarget(renderTargetFullBackground);
        this.renderer.clear(); // Clear the render target
        this.renderer.render(this.scene, camera);
        this.renderer.setRenderTarget(null);

        // 3. Toggle visibility of objects as needed
        function toggleVisibility(objects, visible) {
          for (const object of objects) {
            object.visible = visible;
          }
        }

        const entities = [];
        for (let e of this.maskingSystem.panels[0].object3D.children) {
            e.traverse((child) => {
                console.log(child);
                if (child instanceof Panel || child.ignoreStencil) {
                    return;
                }
                if (child.isMesh) {
                    if (child === panelMesh) { return; }
                    entities.push(child);
                }
            });
        }

        // 4. Render the scene to create the entityless background texture
        toggleVisibility([panelMesh], true);
        toggleVisibility(entities, false);
        this.renderer.setRenderTarget(renderTargetBackgroundNoEntities);
        this.renderer.clear(); // Clear the render target
        this.renderer.render(this.scene, camera);
        this.renderer.setRenderTarget(null);

        const whiteMaskMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });

        // Function to set material for all objects in the scene
        function setMaterialForAllObjects(scene, material) {
            const originalMaterials = []; // Store the original materials

            scene.traverse((object) => {
                if (object.isMesh) {
                    originalMaterials.push(object.material); // Store the original material
                    object.material = material; // Assign the temporary material
                }
            });

            // Return a function to restore the original materials
            return () => {
                originalMaterials.forEach((originalMaterial, index) => {
                    scene.traverse((object) => {
                        if (object.isMesh && object.material === material) {
                            object.material = originalMaterial; // Restore the original material
                        }
                    });
                });
            };
        }

        // white out the objects in the scene
        const restoreMaterials = setMaterialForAllObjects(this.scene, whiteMaskMaterial); // Set temporary material

        // 4. Render the scene to create panel only mask texture
        toggleVisibility([panelMesh], true);
        toggleVisibility(entities, false);
        this.renderer.setRenderTarget(renderTargetPanelsMask);
        this.renderer.clear(); // Clear the render target
        this.renderer.render(this.scene, camera);
        this.renderer.setRenderTarget(null);

        // 6. Render the scene to create entities only mask texture
        toggleVisibility([panelMesh], false);
        toggleVisibility(entities, true);
        this.renderer.setRenderTarget(renderTargetEntitiesMask);
        this.renderer.clear(); // Clear the render target
        this.renderer.render(this.scene, camera);
        this.renderer.setRenderTarget(null);
        
        // Restore original materials after the pass
        restoreMaterials();

        // 7. Use post-processing shader to composite final image
        const compositeMaterial = new THREE.ShaderMaterial({
            uniforms: {
                maskTexture: { value: renderTargetPanelsMask.texture },
                entitiesMaskTexture: { value: renderTargetEntitiesMask.texture },
                backgroundTexture: { value: renderTargetBackgroundNoEntities.texture },
                fullBackgroundTexture: { value: renderTargetFullBackground.texture },
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = vec4(position, 1.0); // projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
            varying vec2 vUv;
                uniform sampler2D maskTexture;
                uniform sampler2D entitiesMaskTexture;
                uniform sampler2D backgroundTexture;
                uniform sampler2D fullBackgroundTexture;

                void main() {
                  vec4 maskColor = texture2D(maskTexture, vUv);
                  vec4 entitiesMaskColor = texture2D(entitiesMaskTexture, vUv);
                  vec4 backgroundColor = texture2D(backgroundTexture, vUv);
                  vec4 fullBackgroundColor = texture2D(fullBackgroundTexture, vUv);

                  // gl_FragColor = fullBackgroundColor;
                  
                  // Check if entitiesMaskColor is white and maskColor is black
                  if (entitiesMaskColor.r == 1.0 && maskColor.r == 0.0) {
                    gl_FragColor = backgroundColor;
                  } else {
                    gl_FragColor = fullBackgroundColor;
                  }
                }
            `,
        });

        // Create a full-screen quad to apply the composite material
        const quadGeometry = new THREE.PlaneGeometry(2, 2);
        const quad = new THREE.Mesh(quadGeometry, compositeMaterial);

        // Add the quad to the scene
        const scene2 = new THREE.Scene();
        scene2.add(quad);

        // 9. Render the final result on the screen
        this.renderer.render(scene2, camera.clone());

        // Reset visibility if needed for next pass
        toggleVisibility([panelMesh], true);
        toggleVisibility(entities, true);
    }
}

customElements.get('mr-app') || customElements.define('mr-app', MRApp);
