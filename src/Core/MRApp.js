import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { ARButton } from 'three/addons/webxr/ARButton.js';

import Stats from 'stats.js';

import { MRElement } from 'MRJS/Core/MRElement';

import { RAPIER } from 'MRJS/Utils/Physics';
import { stringToJson, stringToVector } from 'MRJS/Utils/String';
import { mobileCheckFunction } from 'MRJS/Utils/Display';


import { TextSystem } from 'MRJS/Core/ComponentSystems/TextSystem';
import { ControlSystem } from 'MRJS/Core/ComponentSystems/ControlSystem';
import { PhysicsSystem } from 'MRJS/Core/ComponentSystems/PhysicsSystem';
import { LayoutSystem } from 'MRJS/Core/ComponentSystems/LayoutSystem';
import { SurfaceSystem } from 'MRJS/Core/ComponentSystems/SurfaceSystem';
import { ClippingSystem } from 'MRJS/Core/ComponentSystems/ClippingSystem';
import { StyleSystem } from 'MRJS/Core/ComponentSystems/StyleSystem';

('use strict');
window.mobileCheck = mobileCheckFunction();

// TODO - to complete descriptions.
/**
 * The engine handler for running MRjs as an App.
 */
export class MRApp extends MRElement {
    /**
     *
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

        this.focusEntity = null;

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
            camera: 'perspective',
        };
        this.render = this.render.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);
    }

    /**
     *
     */
    connectedCallback() {
        this.init();

        this.observer = new MutationObserver(this.mutationCallback);
        this.observer.observe(this, { attributes: true, childList: true });

        this.layoutSystem = new LayoutSystem();
        this.styleSystem = new StyleSystem();

        // initialize built in Systems
        document.addEventListener('engine-started', (event) => {
            this.physicsWorld = new RAPIER.World({ x: 0.0, y: -9.81, z: 0.0 });
            this.physicsSystem = new PhysicsSystem();
            this.controlSystem = new ControlSystem();
            this.textSystem = new TextSystem();

            this.clippingSystem = new ClippingSystem();
        });
    }

    /**
     *
     */
    disconnectedCallback() {
        this.denit();
        this.observer.disconnect();
    }

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

    // TODO: These are for toggling debug and app level flags in realtime.
    //       Currently only 'debug' is implemented. but we should add:
    //       - stats
    //       - lighting
    //       - controllers
    //       - ?
    /**
     *
     * @param mutation
     */
    mutatedAttribute(mutation) {}

    /**
     *
     * @param mutation
     */
    mutatedChildList(mutation) {}

    /**
     *
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
            this.cameraOptions = stringToJson(this.cameraOptionString);
        }

        this.initUser();

        this.user.position.set(0, 0, 1);

        const layersString = this.getAttribute('layers');

        if (layersString) {
            this.layers = stringToVector(layersString);

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
                });
                this.appendChild(this.ARButton);

                this.ARButton.style.position = 'fixed';
            }
        });

        this.renderer.setAnimationLoop(this.render);

        window.addEventListener('resize', this.onWindowResize);

        const lightString = this.getAttribute('lighting');

        if (lightString) {
            this.lighting = stringToJson(this.lighting);
        }

        this.initLights(this.lighting);
    }

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
        this.anchor = new THREE.Object3D();
        this.user.add(this.anchor);

        this.anchor.position.setZ(-0.5);
    };

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
                this.shadowLight.position.set(0, 0, 0);
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
     *
     */
    denit() {
        document.body.removeChild(this.renderer.domElement);
        this.removeChild(this.ARButton);
        window.removeEventListener('resize', this.onWindowResize);
    }

    /**
     *
     * @param system
     */
    registerSystem(system) {
        this.systems.add(system);
    }

    /**
     *
     * @param system
     */
    unregisterSystem(system) {
        this.systems.delete(system);
    }

    /**
     *
     * @param entity
     */
    add(entity) {
        this.scene.add(entity.object3D);
    }

    /**
     *
     * @param entity
     */
    remove(entity) {
        this.scene.remove(entity.object3D);
    }

    /**
     *
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

    /**
     *
     * @param timeStamp
     * @param frame
     */
    render(timeStamp, frame) {
        const deltaTime = this.clock.getDelta();

        if (this.debug) {
            this.stats.begin();
        }
        for (const system of this.systems) {
            system.__update(deltaTime, frame);
        }
        if (this.debug) {
            this.stats.end();
        }

        this.renderer.render(this.scene, this.user);
    }
}

customElements.get('mr-app') || customElements.define('mr-app', MRApp);
