import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { XRButton } from 'three/addons/webxr/XRButton.js';
import Stats from 'stats.js';

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

// Events that trigger the eventUpdate call for all MRSystems.
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

        // State:
        this.xrsupport = false;
        this.isMobile = window.mobileCheck(); // resolves true/false
        this.inspect = false;

        // Objects:
        this.clock = new THREE.Clock();
        this.systems = new Set();
        this.anchor = null;
        this.originObject3D = new THREE.Object3D();

        // Scene:
        this.scene = new THREE.Scene();
        this.scene.matrixWorldAutoUpdate = false;
        this.scene.add(this.originObject3D);

        // Renderer:
        // The rest of the renderer is filled out in this.connectedCallback()-->this.initRenderer() since
        // the renderer relies on certain component flags attached to the <mr-app> itself.
        this.renderer = null;
        this.render = this.render.bind(this);

        // WindowResize:
        this.onWindowResize = this.onWindowResize.bind(this);
    }

    /* ---------- The Main init/denit Calls ---------- */

    /**
     * @function
     * @memberof MRApp
     * @description Initializes the MRApp by setting up all necessary systems, event listeners, and rendering components.
     */
    init() {
        window.addEventListener('resize', this.onWindowResize);

        mrjsUtils.physics.initializePhysics();

        this.compStyle = window.getComputedStyle(this);

        this.debug = this.dataset.debug ?? false;

        this.#initRenderer();
        this.#initCamera();
        this.#initLighting();
        this.#initStats();
        this.#initSkyBox();
        this.#initXRSetup();

        this.observer = new MutationObserver(this.mutationCallback);
        this.observer.observe(this, { attributes: true, childList: true });

        this.#initEventListeners();
    }

    /**
     * @function
     * @memberof MRApp
     * @description Destructor for the MRApp by tearing down all necessary systems, event listeners, and rendering components.
     */
    denit() {
        // Stop the rendering loop and dispose of renderer resources
        if (this.renderer) {
            this.renderer.setAnimationLoop(null);
            this.renderer.dispose();

            if (this.renderer.domElement && this.renderer.domElement.parentNode) {
                this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
            }
            this.renderer = null;
        }

        // Dispose XRButton if added
        if (this.XRButton && this.XRButton.parentNode) {
            this.XRButton.parentNode.removeChild(this.XRButton);
        }

        // Clear the scene
        if (this.scene) {
            while (this.scene.children.length > 0) {
                const object = this.scene.children[0];
                if (object.dispose) {
                    object.dispose(); // Custom dispose for loaded models or geometries
                }
                this.scene.remove(object);
            }
        }

        // Remove all systems, calling their dispose methods if available
        if (this.systems) {
            this.systems.forEach(system => {
                if (system.dispose) {
                    system.dispose();
                }
            });
            this.systems.clear();
        }

        // Remove window-specific event listeners
        window.removeEventListener('resize', this.onWindowResize);

        // Remove global event listeners
        GLOBAL_UPDATE_EVENTS.forEach(eventType => {
            document.removeEventListener(eventType, this.handleGlobalEvents);
        });

        // Assuming there's an observer for monitoring DOM changes
        if (this.observer) {
            this.observer.disconnect();
        }
    }

    /**
     * @private
     * @function
     * @memberof MRApp
     * @description Initializes the XR session to manage the rendering and tracking environment for VR/AR capabilities.
     */
    #initXRSession() {
        mrjsUtils.xr.session = this.renderer.xr.getSession();
        mrjsUtils.xr.referenceSpace = mrjsUtils.xr.getReferenceSpace();
    }

    /**
     * @private
     * @function
     * @memberof MRApp
     * @description Deinitializes the XR session and resets the camera to its default position.
     */
    #denitXRSession() {
        this.camera.position.set(0, 0, 1);
        this.camera.quaternion.set(0, 0, 0, 1);
        mrjsUtils.xr.session = undefined;
        mrjsUtils.xr.referenceSpace = undefined;
        this.classList.remove('inXR');
        this.onWindowResize();
    }

    /* ---------- init: Helper Functions ---------- */

    /**
     * @private
     * @function
     * @memberof MRApp
     * @description Sets up the WebGL renderer with specific properties for visual quality and performance.
     */
    #initRenderer() {
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
            preserveDrawingBuffer: this.dataset.preserveDrawingBuffer ?? false,
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.appWidth, this.appHeight);
        this.renderer.autoClear = false;
        this.renderer.shadowMap.enabled = true;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1;
        this.renderer.localClippingEnabled = true;
        this.renderer.xr.enabled = true;
        mrjsUtils.xr = this.renderer.xr;

        this.appendChild(this.renderer.domElement);

        this.renderer.setAnimationLoop(this.render);
    }

    /**
     * @private
     * @function
     * @memberof MRApp
     * @description Configures the camera based on JSON options provided through the dataset, supporting various modes.
     */
    #initCamera() {
        let cameraOptions = this.dataset.camera ? mrjsUtils.string.stringToJson(this.dataset.camera) : {};
        this.cameraMode = cameraOptions.mode ?? 'orthographic';

        global.appWidth = this.appWidth;
        global.appHeight = this.appHeight;

        switch (this.cameraMode) {
            case 'perspective':
                this.camera = new THREE.PerspectiveCamera();
                this.camera.fov = 70;
                this.camera.near = 0.01;
                this.camera.far = 20;

                const vFOV = THREE.MathUtils.degToRad(this.camera.fov);
                global.viewPortHeight = 2 * Math.tan(vFOV / 2);

                this.#updatePerspectiveCamera();
                break;
            case 'orthographic':
                this.camera = new THREE.OrthographicCamera();
                this.camera.near = 0.01;
                this.camera.far = 1000;

                this.#updateOrthographicCamera();
                break;
            default:
        }
        this.camera.matrixWorldAutoUpdate = false;
        this.camera.updateProjectionMatrix();

        /* ----- Set based on startPos data-attribute ----- */

        let posUpdated = false;
        let startPos = cameraOptions.startPos;
        if (startPos) {
            const [x, y, z] = startPos.split(' ').map(parseFloat);
            if (startPosArray.length !== 3) {
                console.error('Invalid camera starting position format. Please provide "x y z".');
            } else {
                this.camera.position.set(x, y, z);
                posUpdated = true;
            }
        }
        if (!posUpdated) {
            // default
            this.camera.position.set(0, 0, 1);
        }

        /* ----- Set based on layers data-attribute ----- */

        if (this.dataset.layers) {
            this.layers = mrjsUtils.string.stringToVector(this.dataset.layers);
            for (const layer of this.layers) {
                this.camera.layers.enable(layer);
            }
        }

        /* ----- Set based on orbitals data-attribute ----- */

        const orbitalOptionsString = this.dataset.orbital;
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
    }

    /**
     * @private
     * @function
     * @memberof MRApp
     * @description Updates the camera for perspective viewing mode, updating its aspect ratio based on the application dimensions.
     */
    #updatePerspectiveCamera() {
        this.camera.aspect = this.appWidth / this.appHeight;

        global.viewPortWidth = global.viewPortHeight * this.camera.aspect;
    }

    /**
     * @private
     * @function
     * @memberof MRApp
     * @description Updates the camera for orthographic viewing mode, adjusting the camera's scale based on the application dimensions.
     */
    #updateOrthographicCamera() {
        global.viewPortWidth = this.appWidth / 1000;
        global.viewPortHeight = this.appHeight / 1000;

        // In an orthographic camera, unlike perspective, objects are rendered at the same scale regardless of their
        // distance from the camera, meaning near and far clipping planes are more about what objects are visible in
        // terms of their distance from the camera, rather than affecting the size of the objects.
        this.camera.left = global.viewPortWidth / -2;
        this.camera.right = global.viewPortWidth / 2;
        this.camera.top = global.viewPortHeight / 2;
        this.camera.bottom = global.viewPortHeight / -2;
    }

    /**
     * @private
     * @function
     * @memberof MRApp
     * @description Sets up lighting in the scene, adding ambient and point lights based on configuration options.
     */
    #initLighting() {
        let lighting = {
            enabled: true,
            color: 0xffffff,
            intensity: 1,
            radius: 5,
            shadows: true,
        };
        if (this.dataset.lighting ?? false) {
            lighting = mrjsUtils.string.stringToJson(this.dataset.lighting);
        }

        if (!lighting.enabled) {
            return;
        }

        const globalLight = new THREE.AmbientLight(lighting.color);
        globalLight.intensity = lighting.intensity;
        globalLight.position.set(0, 5, 0);
        this.scene.add(globalLight);

        if (!this.isMobile) {
            if (lighting.shadows) {
                const shadowLight = new THREE.PointLight(lighting.color);
                shadowLight.position.set(-1, 1, 1);
                shadowLight.intensity = lighting.intensity;
                shadowLight.castShadow = lighting.shadows;
                shadowLight.shadow.radius = lighting.radius;
                shadowLight.shadow.camera.near = 0.01; // default
                shadowLight.shadow.camera.far = 20; // default
                shadowLight.shadow.mapSize.set(2048, 2048);
                this.scene.add(shadowLight);
            }
        }
    }

    /**
     * @private
     * @function
     * @memberof MRApp
     * @description Initializes statistics monitoring for the application, primarily for debugging and performance tracking.
     */
    #initStats() {
        if (!(this.dataset.stats ?? false)) {
            return;
        }

        // Old version of stats using the Stats.js visual
        // setup. Leaving to allow for top left quick visual of stats.
        // Is /not/ performant in headset. Documentation notes this.
        //
        this.stats = new Stats();
        this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild(this.stats.dom);
    }

    /**
     * @private
     * @function
     * @memberof MRApp
     * @description Initializes XR capabilities for the application, checking device support and setting up XR button interactions.
     */
    #initXRSetup() {
        if (this.isMobile) {
            // We don't support mobile XR yet
            return;
        }

        navigator.xr?.isSessionSupported('immersive-ar').then((supported) => {
            this.xrsupport = supported;

            if (this.xrsupport) {
                this.XRButton = XRButton.createButton(this.renderer, {
                    requiredFeatures: ['local', 'hand-tracking'],
                    optionalFeatures: ['hit-test', 'anchors', 'plane-detection'],
                });

                XRButton.addEventListener('click', () => {
                    this.classList.add('inXR');
                    XRButton.blur();
                });
                document.body.appendChild(XRButton);

                XRButton.style.position = 'fixed';
                XRButton.style.zIndex = 10000;
            }
        });
    }

    /**
     * @private
     * @function
     * @memberof MRApp
     * @description Initializes a skybox for the application based on the background-image style property.
     */
    #initSkyBox() {
        // allows for mr-app style to have background:value to set the skybox

        if (this.compStyle.backgroundImage === 'none') {
            return;
        }

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

    /**
     * @private
     * @function
     * @memberof MRApp
     * @description Initializes and adds various systems to the MRApp for managing different aspects of the MR environment.
     */
    #initSystems() {
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

        // These must be the last two systems since
        // they affect rendering. Clipping must happen
        // before masking. Rendering must be the last step.
        this.clippingSystem = new ClippingSystem();
        this.maskingSystem = new MaskingSystem();
    }

    /**
     * @private
     * @function
     * @memberof MRApp
     * @description Initializes event listeners for various global and component-specific events.
     */
    #initEventListeners() {
        // initialize built in Systems
        document.addEventListener('engine-started', (event) => {
            this.user = new MRUser(this.camera, this.scene);

            if (this.dataset.occlusion == 'spotlight') {
                this.scene.add(this.user.initSpotlight());
            }

            this.#initSystems();
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

        for (const eventType of GLOBAL_UPDATE_EVENTS) {
            // Calls `eventUpdate` on all systems if any of the global events are triggered
            document.addEventListener(eventType, (event) => {
                for (const system of this.systems) {
                    system.eventUpdate();
                }
            });
        }
    }

    /**
     * @function
     * @description Handles what is necessary rendering, camera, and user-wise when the viewing window is resized.
     */
    onWindowResize() {
        global.appWidth = this.appWidth;
        global.appHeight = this.appHeight;
        switch (this.cameraMode) {
            case 'perspective':
                this.#updatePerspectiveCamera();
                break;
            case 'orthographic':
            default:
                this.#updateOrthographicCamera();
                break;
        }
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.appWidth, this.appHeight);
    }

    /* ---------- Getters ---------- */

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

    /* ---------- Overriding Element Functions ---------- */

    /**
     * @function Connected
     * @memberof MRApp
     * @description The connectedCallback function that runs whenever this entity component becomes connected to something else.
     */
    connectedCallback() {
        this.init();
    }

    /**
     * @function Disconnected
     * @memberof MRApp
     * @description The disconnectedCallback function that runs whenever this entity component becomes connected to something else.
     */
    disconnectedCallback() {
        this.denit();
    }

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
        this.originObject3D.add(entity.object3D);
    }

    /**
     * @function
     * @description Removing an entity as an object in this MRApp engine's scene.
     * @param {MREntity} entity - the entity to be removed.
     */
    removeEntity(entity) {
        this.originObject3D.remove(entity.object3D);
    }

    /* ---------- !!! Rendering !!! ---------- */

    /**
     * @function
     * @description Default function header needed by threejs. The render function that is called during ever frame. Calls every systems' update function.
     * @param {number} timeStamp - timeStamp of the current frame.
     * @param {object} frame - given frame information to be used for any feature changes
     */
    render(timeStamp, frame) {
        // ----- Update needed items ----- //

        if (mrjsUtils.xr.isPresenting && !mrjsUtils.xr.session) {
            this.#initXRSession();
            this.dispatchEvent(new CustomEvent('enterxr', { bubbles: true }));
            mrjsUtils.xr.session.addEventListener('end', () => {
                this.#denitXRSession();
                this.dispatchEvent(new CustomEvent('exitxr', { bubbles: true }));
            });
        }

        this.stats?.update();
        this.user?.update();

        // ----- System Updates ----- //

        const deltaTime = this.clock.getDelta();
        for (const system of this.systems) {
            system._update(deltaTime, frame);
        }

        // ----- Actually Render ----- //

        // TODO (in future) - once this gets more complicated, it will be nice to have a render system separate
        // from the pure loop but it is okay as is here for now.

        // Setup to Render
        this.scene.updateMatrixWorld();
        if (this.camera.parent === null) {
            this.camera.updateMatrixWorld();
        }
        this.renderer.clear();

        // Masking RenderPass
        if (this.maskingSystem !== undefined && this.maskingSystem.scene.children.length > 0) {
            this.maskingSystem.sync();
            const currentShadowEnabled = this.renderer.shadowMap.enabled;
            this.renderer.shadowMap.enabled = false;
            this.renderer.render(this.maskingSystem.scene, this.camera);
            this.renderer.shadowMap.enabled = currentShadowEnabled;
        }

        // Main Scene RenderPass
        this.renderer.render(this.scene, this.camera);
    }
}

customElements.get('mr-app') || customElements.define('mr-app', MRApp);
