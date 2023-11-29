import * as THREE from 'three';

import Stats from 'stats.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { ARButton } from 'three/addons/webxr/ARButton.js';
import { RAPIER } from './rapier';
import { MRElement } from './MRElement.js';

// built in Systems
import { TextSystem } from '../component-systems/TextSystem.js';
import { ControlSystem } from '../component-systems/ControlSystem.js';
import { RapierPhysicsSystem } from '../component-systems/RapierPhysicsSystem.js';
import { LayoutSystem } from '../component-systems/LayoutSystem.js';
import { parseAttributeString, parseVector } from '../utils/parser.js';
import { SurfaceSystem } from '../component-systems/SurfaceSystem.js';
import { ClippingSystem } from '../component-systems/ClippingSystem';
import { StyleSystem } from '../component-systems/StyleSystem';

('use strict');

window.mobileCheck = function () {
    let check = false;
    (function (a) {
        if (
            /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
                a
            ) ||
            /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
                a.substr(0, 4)
            )
        )
            check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};

/**
 *
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
        this.systems = new Array(); // needs to be array as order will matter
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
            this.physicsSystem = new RapierPhysicsSystem();
            this.controlSystem = new ControlSystem();
            this.textSystem = new TextSystem();

            // these must be the last two systems since 
            // they affect rendering.
            this.clippingSystem = new ClippingSystem();
            // this.maskingSystem = new MaskingSystem();
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
            this.cameraOptions = parseAttributeString(this.cameraOptionString);
        }

        this.initUser();

        this.user.position.set(0, 0, 1);

        const layersString = this.getAttribute('layers');

        if (layersString) {
            this.layers = parseVector(layersString);

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
            this.lighting = parseAttributeString(this.lighting);
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

        // for window placement
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
