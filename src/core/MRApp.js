import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { XRButton } from 'three/addons/webxr/XRButton.js';

import Stats from 'stats.js';

import { MRElement } from 'mrjs/core/MRElement';
import { MRSkyBox } from 'mrjs/core/entities/MRSkyBox';

import { mrjsUtils } from 'mrjs';

import { MREntity } from 'mrjs/core/MREntity';
import { MRSystem } from 'mrjs/core/MRSystem';
import { AnimationSystem } from 'mrjs/core/componentSystems/AnimationSystem';
import { ClippingSystem } from 'mrjs/core/componentSystems/ClippingSystem';
import { ControlSystem } from 'mrjs/core/componentSystems/ControlSystem';
import { LayoutSystem } from 'mrjs/core/componentSystems/LayoutSystem';
import { MaskingSystem } from 'mrjs/core/componentSystems/MaskingSystem';
import { PhysicsSystem } from 'mrjs/core/componentSystems/PhysicsSystem';
import { AnchorSystem } from 'mrjs/core/componentSystems/AnchorSystem';
import { SkyBoxSystem } from 'mrjs/core/componentSystems/SkyBoxSystem';
import { StyleSystem } from 'mrjs/core/componentSystems/StyleSystem';
import { TextSystem } from 'mrjs/core/componentSystems/TextSystem';
import { AudioSystem } from 'mrjs/core/componentSystems/AudioSystem';
import { PanelSystem } from 'mrjs/core/componentSystems/PanelSystem';

('use strict');
window.mobileCheck = function () {
    return mrjsUtils.display.mobileCheckFunction();
};

/**
 * @class MRApp
 * @classdesc The engine handler for running MRjs as an App. `mr-app`
 * @augments MRElement
 */
export class MRApp extends MRElement {
    /**
     *
     */
    get appWidth() {
        return parseFloat(this.compStyle.width.split('px')[0]);
    }

    /**
     *
     */
    get appHeight() {
        return parseFloat(this.compStyle.height.split('px')[0]);
    }

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

        this.clock = new THREE.Clock();
        this.systems = new Set();
        this.scene = new THREE.Scene();

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

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
        this.compStyle = window.getComputedStyle(this);
        this.init();

        this.observer = new MutationObserver(this.mutationCallback);
        this.observer.observe(this, { attributes: true, childList: true });

        this.panelSystem = new PanelSystem();
        this.layoutSystem = new LayoutSystem();
        this.textSystem = new TextSystem();
        this.styleSystem = new StyleSystem();
        this.audioSystem = new AudioSystem();

        // initialize built in Systems
        document.addEventListener('engine-started', (event) => {
            this.physicsWorld = new mrjsUtils.physics.RAPIER.World({ x: 0.0, y: -9.81, z: 0.0 });
            this.physicsSystem = new PhysicsSystem();
            this.controlSystem = new ControlSystem();
            this.anchorSystem = new AnchorSystem();
            this.animationSystem = new AnimationSystem();
            this.skyBoxSystem = new SkyBoxSystem();

            // these must be the last three systems since
            // they affect rendering. Clipping must happen
            // before masking. Rendering must be the last step.
            this.clippingSystem = new ClippingSystem();
            this.maskingSystem = new MaskingSystem();
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
        this.renderer.setSize(this.appWidth, this.appHeight);
        this.renderer.autoClear = false;
        this.renderer.shadowMap.enabled = true;
        this.renderer.xr.enabled = true;
        mrjsUtils.xr = this.renderer.xr;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1;
        this.renderer.localClippingEnabled = true;

        this.cameraOptionString = this.getAttribute('camera');
        if (this.cameraOptionString) {
            this.cameraOptions = mrjsUtils.stringUtils.stringToJson(this.cameraOptionString);
        }

        this.initUser();
        mrjsUtils.physics.initializePhysics();

        this.user.position.set(0, 0, 1);

        const layersString = this.getAttribute('layers');

        if (layersString) {
            this.layers = mrjsUtils.stringUtils.stringToVector(layersString);

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

        // allows for mr-app style to have background:value to set the skybox
        if (this.compStyle.backgroundImage !== 'none') {
            let skybox = new MRSkyBox();
            let imageUrl = this.compStyle.backgroundImage.match(/url\("?(.+?)"?\)/)[1];
            skybox.setAttribute('src', imageUrl);
            skybox.connected();
            this.add(skybox);

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

        this.renderer.setAnimationLoop(this.render);

        window.addEventListener('resize', this.onWindowResize);

        const lightString = this.getAttribute('lighting');

        if (lightString) {
            this.lighting = mrjsUtils.stringUtils.stringToJson(this.lighting);
        }

        this.initLights(this.lighting);
    }

    /**
     * @function
     * @description Initializes the user information for the MRApp including appropriate HMD direction and camera information and the default scene anchor location.
     */
    initUser = () => {
        global.appWidth = this.appWidth;
        global.appHeight = this.appHeight;
        switch (this.cameraOptions.camera) {
            case 'orthographic':
                global.viewPortWidth = this.appWidth / 1000;
                global.viewPortHeight = this.appHeight / 1000;

                // In an orthographic camera, unlike perspective, objects are rendered at the same scale regardless of their
                // distance from the camera, meaning near and far clipping planes are more about what objects are visible in
                // terms of their distance from the camera, rather than affecting the size of the objects.
                this.user = new THREE.OrthographicCamera(global.viewPortWidth / -2, global.viewPortWidth / 2, global.viewPortHeight / 2, global.viewPortHeight / -2, 0.01, 1000);
                break;
            case 'perspective':
            default:
                this.user = new THREE.PerspectiveCamera(70, this.appWidth / this.appHeight, 0.01, 20);
                this.vFOV = THREE.MathUtils.degToRad(this.user.fov);
                global.viewPortHeight = 2 * Math.tan(this.vFOV / 2);
                global.viewPortWidth = global.viewPortHeight * this.user.aspect;
                break;
        }

        // weird bug fix in getting camera position in webXR
        this.forward = new THREE.Object3D();
        this.user.add(this.forward);

        this.forward.position.setZ(-0.5);

        // for window placement
        this.userOrigin = new THREE.Object3D();
        this.anchor = new THREE.Object3D();
        this.user.add(this.userOrigin);
        this.user.add(this.anchor);

        this.userOrigin.position.setX(0.015);
        this.anchor.position.setX(0.015);
        this.anchor.position.setZ(-0.5);

        // Audio listner needed for spatial audio
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
        global.appWidth = this.appWidth;
        global.appHeight = this.appHeight;
        switch (this.cameraOptions.camera) {
            case 'orthographic':
                global.viewPortWidth = this.appWidth / 1000;
                global.viewPortHeight = this.appHeight / 1000;

                this.user.left = global.viewPortWidth / -2;
                this.user.right = global.viewPortWidth / 2;
                this.user.top = global.viewPortHeight / 2;
                this.user.bottom = global.viewPortHeight / -2;
                break;
            case 'perspective':
            default:
                this.user.aspect = this.appWidth / this.appHeight;
                global.viewPortWidth = global.viewPortHeight * this.user.aspect;
                break;
        }
        this.user.updateProjectionMatrix();
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

        // ----- Update needed items ----- //

        if (mrjsUtils.xr.isPresenting && !mrjsUtils.xr.session) {
            mrjsUtils.xr.session = this.renderer.xr.getSession();
            mrjsUtils.xr.referenceSpace = mrjsUtils.xr.getReferenceSpace();

            this.dispatchEvent(new CustomEvent('enterXR', { bubbles: true }));
            console.log('enter xr');

            mrjsUtils.xr.session.addEventListener('end', () => {
                this.user.position.set(0, 0, 1);
                this.user.quaternion.set(0, 0, 0, 1);
                mrjsUtils.xr.session = undefined;
                mrjsUtils.xr.referenceSpace = undefined;
                this.classList.remove('inXR');

                this.onWindowResize();
                this.dispatchEvent(new CustomEvent('exitXR', { bubbles: true }));
            });
        }

        // ----- System Updates ----- //

        if (this.debug) {
            this.stats.begin();
        }
        for (const system of this.systems) {
            system._update(deltaTime, frame);
        }
        if (this.debug) {
            this.stats.end();
        }

        // ----- Actually Render ----- //

        // TODO (in future) - once this gets more complicated, it will be nice to have a render system separate
        // from the pure loop but it is okay as is here for now.

        // Need to wait until we have all needed rendering-associated systems loaded.
        if (this.maskingSystem != undefined) {
            this.renderer.clear();

            // Render panel to stencil buffer and objects through it based on THREE.Group hierarchy
            // and internally handled stenciling functions.
            this.renderer.state.buffers.stencil.setTest(true);
            this.renderer.state.buffers.stencil.setMask(0xff);
            this.renderer.render(this.scene, this.user);

            // Render the main scene without stencil operations
            this.renderer.state.buffers.stencil.setTest(false);
        }
        this.renderer.render(this.scene, this.user);
    }
}

customElements.get('mr-app') || customElements.define('mr-app', MRApp);
