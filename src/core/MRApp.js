import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { XRButton } from 'three/addons/webxr/XRButton.js';
import Stats from 'stats.js';
// import * as SPECTOR from 'spectorjs';
// let spector = new SPECTOR.Spector();
// spector.displayUI();

import { mrjsUtils } from 'mrjs';

import { MRElement } from 'mrjs/core/MRElement';
import { MREntity } from 'mrjs/core/MREntity';
import { MRSystem } from 'mrjs/core/MRSystem';

import MRUser from 'mrjs/core/user/MRUser';
import { MRSkyBoxEntity } from 'mrjs/core/entities/MRSkyBoxEntity';
import { MRStatsEntity } from 'mrjs/core/entities/MRStatsEntity';

import { AnchorSystem } from 'mrjs/core/componentSystems/AnchorSystem';
import { AnimationSystem } from 'mrjs/core/componentSystems/AnimationSystem';
import { AudioSystem } from 'mrjs/core/componentSystems/AudioSystem';
import { BoundaryVisibilitySystem } from 'mrjs/core/componentSystems/BoundaryVisibilitySystem';
import { ClippingSystem } from 'mrjs/core/componentSystems/ClippingSystem';
import { ControlSystem } from 'mrjs/core/componentSystems/ControlSystem';
import { GeometryStyleSystem } from 'mrjs/core/componentSystems/GeometryStyleSystem';
import { LayoutSystem } from 'mrjs/core/componentSystems/LayoutSystem';
import { MaskingSystem } from 'mrjs/core/componentSystems/MaskingSystem';
import { MaterialStyleSystem } from 'mrjs/core/componentSystems/MaterialStyleSystem';
import { PanelSystem } from 'mrjs/core/componentSystems/PanelSystem';
import { PhysicsSystem } from 'mrjs/core/componentSystems/PhysicsSystem';
import { SkyBoxSystem } from 'mrjs/core/componentSystems/SkyBoxSystem';
import { StatsSystem } from 'mrjs/core/componentSystems/StatsSystem';
import { TextSystem } from 'mrjs/core/componentSystems/TextSystem';

('use strict');
window.mobileCheck = function () {
    return mrjsUtils.display.mobileCheckFunction();
};

// events that trigger the eventUpdate call for all MRSystems
const GLOBAL_UPDATE_EVENTS = ['enterxr', 'exitxr', 'load', 'anchored', 'panelupdate', 'engine-started', 'resize'];

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

        this.inspect = false;

        this.clock = new THREE.Clock();
        this.systems = new Set();
        this.scene = new THREE.Scene();
        this.scene.matrixWorldAutoUpdate = false;
        this.anchor = null;
        this.origin = new THREE.Object3D();

        this.scene.add(this.origin);

        // The rest of the renderer is filled out in this.connectedCallback()-->this.init() since
        // the renderer relies on certain component flags attached to the <mr-app> itself.
        this.renderer = null;

        this.lighting = {
            enabled: true,
            color: 0xffffff,
            intensity: 1,
            radius: 5,
            shadows: true,
        };

        this.cameraOptions = {
            mode: 'orthographic',
        };
        this.render = this.render.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);
    }

    /**
     * @function
     * @memberof MRApp
     * @returns {number} width in 3d or pixel space (depending on if in xr) of the current open app
     */
    get appWidth() {
        let result = parseFloat(this.compStyle.width.split('px')[0]);
        if (mrjsUtils.xr.isPresenting) {
            result = (result / window.innerWidth) * mrjsUtils.display.VIRTUAL_DISPLAY_RESOLUTION;
        }
        return result;
    }

    /**
     * @function
     * @memberof MRApp
     * @returns {number} height in 3d or pixel space (depending on if in xr) of the current open app
     */
    get appHeight() {
        let result = parseFloat(this.compStyle.height.split('px')[0]);
        if (mrjsUtils.xr.isPresenting) {
            result = (result / window.screen.height) * mrjsUtils.display.VIRTUAL_DISPLAY_RESOLUTION;
        }
        return result;
    }

    /**
     * @function Connected
     * @memberof MRApp
     * @description The connectedCallback function that runs whenever this entity component becomes connected to something else.
     */
    connectedCallback() {
        this.compStyle = window.getComputedStyle(this);
        mrjsUtils.physics.initializePhysics();
        this.init();

        this.observer = new MutationObserver(this.mutationCallback);
        this.observer.observe(this, { attributes: true, childList: true });

        // initialize built in Systems
        document.addEventListener('engine-started', (event) => {
            this.user = new MRUser(this.camera, this.scene);

            if (this.getAttribute('occlusion') == 'spotlight') {
                this.scene.add(this.user.initSpotlight());
            }

            // order matters for all the below system creation items
            this.panelSystem = new PanelSystem();
            this.layoutSystem = new LayoutSystem();
            this.textSystem = new TextSystem();
            this.geometryStyleSystem = new GeometryStyleSystem();
            this.materialStyleSystem = new MaterialStyleSystem();
            this.boundaryVisibilitySystem = new BoundaryVisibilitySystem();
            this.statsSystem = new StatsSystem();
            this.physicsSystem = new PhysicsSystem();
            this.controlSystem = new ControlSystem();
            this.anchorSystem = new AnchorSystem();
            this.animationSystem = new AnimationSystem();
            this.skyBoxSystem = new SkyBoxSystem();
            this.audioSystem = new AudioSystem();

            // These must be the last three systems since
            // they affect rendering. Clipping must happen
            // before masking. Rendering must be the last step.
            this.clippingSystem = new ClippingSystem();
            this.maskingSystem = new MaskingSystem();
        });

        this.addEventListener('entityadded', (event) => {
            for (const system of this.systems) {
                system._onNewEntity(event.target);
            }
        });

        document.addEventListener('entityremoved', async (event) => {
            for (const system of this.systems) {
                system._entityRemoved(event.detail.entity);
            }

            while (event.detail.entity.object3D.parent) {
                event.detail.entity.object3D.removeFromParent();
            }
        });

        // Call `eventUpdate` on all systems if any of the global events are triggered
        for (const eventType of GLOBAL_UPDATE_EVENTS) {
            document.addEventListener(eventType, (event) => {
                for (const system of this.systems) {
                    system.eventUpdate();
                }
            });
        }
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
        window.addEventListener('resize', this.onWindowResize);

        this.debug = this.getAttribute('debug') ?? false;

        /* --- Renderer Setup --- */

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            // There's issues in the timing to enable taking screenshots of threejs scenes unless you have direct access to the code.
            // Using the preserveDrawingBuffer to ignore timing issues is the best approach instead. Though this has a performance hit,
            // we're allowing it to be enabled by users when necessary.
            //
            // References:
            // https://stackoverflow.com/questions/15558418/how-do-you-save-an-image-from-a-three-js-canvas
            // https://stackoverflow.com/questions/30628064/how-to-toggle-preservedrawingbuffer-in-three-js
            preserveDrawingBuffer: this.getAttribute('preserve-drawing-buffer') ?? false,
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.appWidth, this.appHeight);
        this.renderer.autoClear = false;
        this.renderer.shadowMap.enabled = true;
        this.renderer.xr.enabled = true;
        mrjsUtils.xr = this.renderer.xr;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1;
        this.renderer.localClippingEnabled = true;

        this.appendChild(this.renderer.domElement);

        this.renderer.setAnimationLoop(this.render);

        /* --- Camera Setup --- */

        this.initCamera();

        const layersString = this.getAttribute('layers');
        if (layersString) {
            this.layers = mrjsUtils.string.stringToVector(layersString);

            for (const layer of this.layers) {
                this.camera.layers.enable(layer);
            }
        }

        const orbitalOptionsString = this.getAttribute('orbital');
        let orbitalOptions = {};
        if (orbitalOptionsString) {
            orbitalOptions = mrjsUtils.string.stringToJson(orbitalOptionsString);
        }
        this.orbital = orbitalOptions.mode ?? false;
        if (this.debug || this.orbital) {
            const orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
            orbitControls.minDistance = 1;
            orbitControls.maxDistance = 2;

            // set target location if requested
            if (orbitalOptions.targetPos) {
                if (orbitalOptions.targetPos.length !== 3) {
                    console.error('Invalid orbital target position format. Please provide "x y z".');
                }
                orbitControls.target.set(orbitalOptions.targetPos[0], orbitalOptions.targetPos[1], orbitalOptions.targetPos[2]);
                orbitControls.update();
            }

            // Note: order of the two below if-statements matter.
            // Want if both debug=true and orbital=true for orbital to take priority.
            if (this.orbital) {
                // always allow orbital controls
                orbitControls.enabled = true;
            } else if (this.debug) {
                // only allow orbital controls on += keypress
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
        }

        /* --- Lighting Setup --- */

        if (this.getAttribute('lighting') ?? false) {
            this.lighting = mrjsUtils.string.stringToJson(this.lighting);
        }
        this.initLights(this.lighting);

        /* --- Stats Setup --- */

        if (this.getAttribute('stats') ?? false) {
            // Old version of stats using the Stats.js visual
            // setup. Leaving to allow for top left quick visual of stats.
            // Is /not/ performant in headset. Documentation notes this.
            //
            this.stats = new Stats();
            this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
            document.body.appendChild(this.stats.dom);
        }

        /* --- Background Setup --- */

        // allows for mr-app style to have background:value to set the skybox
        if (this.compStyle.backgroundImage !== 'none') {
            let skybox = new MRSkyBoxEntity();
            let imageUrl = this.compStyle.backgroundImage.match(/url\("?(.+?)"?\)/)[1];
            skybox.setAttribute('src', imageUrl);
            this.appendChild(skybox);

            // Need to zero out the background-image property otherwise
            // we'll end up with a canvas background as well as the skybox
            // when the canvas background is not needed in this 3d setup.
            //
            // We can do this because panel backgrounds are actual webpage
            // backgrounds and the app itself's background is separate from
            // that, being understood as the skybox of the entire app itself.
            this.style.setProperty('background-image', 'none', 'important');
            this.compStyle = window.getComputedStyle(this);
        }

        /* --- Mobile VS XR Setup --- */

        // We don't support mobile XR yet
        if (!this.isMobile) {
            navigator.xr?.isSessionSupported('immersive-ar').then((supported) => {
                this.xrsupport = supported;

                if (this.xrsupport) {
                    this.XRButton = XRButton.createButton(this.renderer, {
                        requiredFeatures: ['local', 'hand-tracking'],
                        optionalFeatures: ['hit-test', 'anchors', 'plane-detection'],
                    });

                    this.XRButton.addEventListener('click', () => {
                        this.classList.add('inXR');
                        this.XRButton.blur();
                    });
                    document.body.appendChild(this.XRButton);

                    this.XRButton.style.position = 'fixed';
                    this.XRButton.style.zIndex = 10000;
                }
            });
        }
    }

    /**
     * @function
     * @description Initializes the user information for the MRApp including appropriate HMD direction and camera information and the default scene anchor location.
     */
    initCamera = () => {
        const cameraOptionsString = this.getAttribute('camera') ?? '';
        if (cameraOptionsString) {
            Object.assign(this.cameraOptions, mrjsUtils.string.stringToJson(this.cameraOptionString) ?? {});
        }

        global.appWidth = this.appWidth;
        global.appHeight = this.appHeight;

        switch (this.cameraOptions.mode) {
            case 'orthographic':
                global.viewPortWidth = this.appWidth / 1000;
                global.viewPortHeight = this.appHeight / 1000;

                // In an orthographic camera, unlike perspective, objects are rendered at the same scale regardless of their
                // distance from the camera, meaning near and far clipping planes are more about what objects are visible in
                // terms of their distance from the camera, rather than affecting the size of the objects.
                this.camera = new THREE.OrthographicCamera(global.viewPortWidth / -2, global.viewPortWidth / 2, global.viewPortHeight / 2, global.viewPortHeight / -2, 0.01, 1000);
                break;
            case 'perspective':
            default:
                this.camera = new THREE.PerspectiveCamera(70, this.appWidth / this.appHeight, 0.01, 20);
                this.vFOV = THREE.MathUtils.degToRad(this.camera.fov);
                global.viewPortHeight = 2 * Math.tan(this.vFOV / 2);
                global.viewPortWidth = global.viewPortHeight * this.camera.aspect;
                break;
        }
        this.camera.matrixWorldAutoUpdate = false;

        let posUpdated = false;
        if (this.cameraOptions.hasOwnProperty('startPos')) {
            const startPosString = comp.startPos;
            if (startPosString) {
                const startPosArray = startPosString.split(' ').map(parseFloat);
                if (startPosArray.length === 3) {
                    const [x, y, z] = startPosArray;
                    this.camera.position.set(x, y, z);
                    posUpdated = true;
                } else {
                    console.error('Invalid camera starting position format. Please provide "x y z".');
                }
            }
        }
        if (!posUpdated) {
            // default
            this.camera.position.set(0, 0, 1);
        }
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
        this.globalLight.position.set(0, 5, 0);
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
        this.removeChild(this.XRButton);
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
        this.origin.add(entity.object3D);
    }

    /**
     * @function
     * @description Removing an entity as an object in this MRApp engine's scene.
     * @param {MREntity} entity - the entity to be removed.
     */
    removeEntity(entity) {
        this.origin.remove(entity.object3D);
    }

    /**
     * @function
     * @description Handles what is necessary rendering, camera, and user-wise when the viewing window is resized.
     */
    onWindowResize() {
        global.appWidth = this.appWidth;
        global.appHeight = this.appHeight;
        switch (this.cameraOptions.camera) {
            case 'orthographic':
                global.viewPortWidth = this.appWidth / 1000;
                global.viewPortHeight = this.appHeight / 1000;

                this.camera.left = global.viewPortWidth / -2;
                this.camera.right = global.viewPortWidth / 2;
                this.camera.top = global.viewPortHeight / 2;
                this.camera.bottom = global.viewPortHeight / -2;
                break;
            case 'perspective':
            default:
                this.camera.aspect = this.appWidth / this.appHeight;
                global.viewPortWidth = global.viewPortHeight * this.camera.aspect;
                break;
        }
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.appWidth, this.appHeight);
    }

    /**
     * @function
     * @description Default function header needed by threejs. The render function that is called during ever frame. Calls every systems' update function.
     * @param {number} timeStamp - timeStamp of the current frame.
     * @param {object} frame - given frame information to be used for any feature changes
     */
    render(timeStamp, frame) {
        // ----- grab important vars ----- //

        const deltaTime = this.clock.getDelta();

        // ----- If using the threejs stats for 'stats=true' ---- //

        if (this.stats) {
            this.stats.update();
        }

        // ----- Update needed items ----- //

        if (mrjsUtils.xr.isPresenting && !mrjsUtils.xr.session) {
            mrjsUtils.xr.session = this.renderer.xr.getSession();
            mrjsUtils.xr.referenceSpace = mrjsUtils.xr.getReferenceSpace();

            this.dispatchEvent(new CustomEvent('enterxr', { bubbles: true }));

            mrjsUtils.xr.session.addEventListener('end', () => {
                this.camera.position.set(0, 0, 1);
                this.camera.quaternion.set(0, 0, 0, 1);
                mrjsUtils.xr.session = undefined;
                mrjsUtils.xr.referenceSpace = undefined;
                this.classList.remove('inXR');

                this.onWindowResize();
                this.dispatchEvent(new CustomEvent('exitxr', { bubbles: true }));
            });
        }

        this.user?.update();

        // ----- System Updates ----- //

        for (const system of this.systems) {
            system._update(deltaTime, frame);
        }

        // ----- Actually Render ----- //

        // TODO (in future) - once this gets more complicated, it will be nice to have a render system separate
        // from the pure loop but it is okay as is here for now.

        this.scene.updateMatrixWorld();
        if (this.camera.parent === null) {
            this.camera.updateMatrixWorld();
        }
        this.renderer.clear();

        // Need to wait until we have all needed rendering-associated systems loaded.
        if (this.maskingSystem !== undefined) {//} && this.maskingSystem.scene.length > 0) {
            this.maskingSystem.sync();
            const currentShadowEnabled = this.renderer.shadowMap.enabled;
            this.renderer.shadowMap.enabled = false;
            this.renderer.render(this.maskingSystem.scene, this.camera);
            this.renderer.shadowMap.enabled = currentShadowEnabled;
        }

        // this.scene.traverse((object) => {
        //   if (object.isMesh) {
        //     console.log(`Rendering `, object, `name: ${object.name} with num children: ${object.children.length} with material ${object.material.name}`);
        //   }
        // });

        this.renderer.render(this.scene, this.camera);

        // Log the number of draw calls
        console.log(this.renderer.info);
        console.log('NumDrawCalls:', this.renderer.info.render.calls, 'should be 2xNumGLPrograms(', this.renderer.info.programs.length, ') = ', 2*this.renderer.info.programs.length);
        // this.renderer.info.programs.forEach(program => {
        //     console.log(`Program ID: ${program.id}, Linked Material: ${yourCustomMapping[program.id] || 'Unknown'}`);
        // });
        // console.log(this.renderer.info);
        if (this.renderer.info.programs) {
            // this.renderer.info.programs.forEach(program => {
            //     console.log(`Program: `, program, `Used times in last frame: ${program.usedTimes}`);
            // });
            function printSceneObjectsAndMaterials(scene, renderer) {
                let groupedByMaterial = {};

                // Traverse the scene and group objects by material UUID
                scene.traverse(function (object) {
                    if (object.isMesh && object.material) {
                        const uuid = object.material.uuid;
                        if (!groupedByMaterial[uuid]) {
                            groupedByMaterial[uuid] = [];  // Initialize array if it doesn't exist
                        }
                        groupedByMaterial[uuid].push({
                            objectName: object.name,
                            objectType: object.type
                        });
                    }
                });

                // Log details about each group
                Object.keys(groupedByMaterial).forEach(uuid => {
                    console.log(`Material UUID: ${uuid}, num items: ${groupedByMaterial[uuid].length}`);
                    groupedByMaterial[uuid].forEach(entry => {
                        console.log(`Object: ${entry.objectName} | Type: ${entry.objectType}`);
                    });
                });

                // Then, log all active WebGL programs separately.
                if (renderer.info.programs) {
                    renderer.info.programs.forEach(program => {
                        console.log(`Program ID: ${program.id}, Program Info:`, program);
                    });
                }
            }

            // Call this function where appropriate in your application
            printSceneObjectsAndMaterials(this.scene, this.renderer);

        }
    }
}

customElements.get('mr-app') || customElements.define('mr-app', MRApp);
