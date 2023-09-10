import * as THREE from 'three'
import { RGBELoader } from '../utils/RGBELoader.js'

import Stats from 'stats.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { ARButton } from 'three/addons/webxr/ARButton.js'
import { MRElement } from './MRElement.js'

// built in Systems
import { TextSystem } from '../component-systems/TextSystem.js'
import { ControlSystem } from '../component-systems/ControlSystem.js'
import {
  RAPIER,
  RapierPhysicsSystem,
} from '../component-systems/RapierPhysicsSystem.js'

;import { LayoutSystem } from '../component-systems/LayoutSystem.js'
import { TextInputSystem } from '../component-systems/TextInputSystem.js'
import { parseAttributeString } from '../utils/parser.js'
('use strict')

export class MRApp extends MRElement {
  constructor() {
    super()
    Object.defineProperty(this, 'isApp', {
      value: true,
      writable: false,
    })

    this.xrsupport = false

    navigator.xr.isSessionSupported( 'immersive-ar' ).then( ( supported ) => {

      this.xrsupport = supported

    } )
    this.env = this

    this.focusEntity = null

    this.clock = new THREE.Clock()
    this.systems = new Set()
    this.scene = new THREE.Scene()

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    this.user = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.01,
      20
    )

    this.vFOV = THREE.MathUtils.degToRad( this.user.fov ); // convert vertical fov to radians

    this.viewPortHieght = 2 * Math.tan( this.vFOV / 2 )

    this.viewPortWidth = this.viewPortHieght * this.user.aspect;           // visible width


    this.lighting = {
      enabled: true,
      color: 0xffffff,
      intensity: 5,
      shadows: true
    }


    this.user.position.set(0, 0, 1)

    this.render = this.render.bind(this)
    this.onWindowResize = this.onWindowResize.bind(this)

    if (this.xrsupport) {
      this.ARButton = ARButton.createButton(this.renderer, {
        requiredFeatures: ['hand-tracking'],
      })
  
      this.ARButton.addEventListener('click', () => {
        this.ARButton.blur()
      })
    }
  }

  connectedCallback() {
    this.init()

    this.observer = new MutationObserver(this.mutationCallback)
    this.observer.observe(this, { attributes: true, childList: true })

    document.addEventListener('touch-start', (event) => {
      this.focusEntity = event.target
    })

    this.layoutSystem = new LayoutSystem()

    // initialize built in Systems
    document.addEventListener('DOMContentLoaded', (event) => {
      import('@dimforge/rapier3d').then((rap) => {
        RAPIER = rap
        this.physicsWorld = new RAPIER.World({ x: 0.0, y: -9.81, z: 0.0 })
        this.physicsSystem = new RapierPhysicsSystem()
        this.controlSystem = new ControlSystem()
        this.textInputSystem = new TextInputSystem()
        this.textSystem = new TextSystem()
        this.dispatchEvent(new CustomEvent(`engine-started`, {bubbles: true}))
      })

    })
  }

  disconnectedCallback() {
    this.denit()
    this.observer.disconnect()
  }

  mutationCallback = (mutationList, observer) => {
    for (const mutation of mutationList) {
      if (mutation.type === 'childList') {
        this.mutatedChildList(mutation)
      }
      if (mutation.type === 'attributes') {
        this.mutatedAttribute(mutation)
      }
    }
  }

  // TODO: These are for toggling debug and app level flags in realtime. 
  //       Currently only 'debug' is implemented. but we should add:
  //       - stats
  //       - lighting
  //       - controllers
  //       - ?
  mutatedAttribute(mutation) {}

  mutatedChildList(mutation) {}

  init() {
    this.debug = this.getAttribute('debug') ?? false
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.autoClear = false
    this.renderer.shadowMap.enabled = true
    this.renderer.xr.enabled = true
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1;

    if(this.debug){
      this.stats = new Stats()
      this.stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
      document.body.appendChild(this.stats.dom)
      
      const orbitControls = new OrbitControls(this.user, this.renderer.domElement)
      orbitControls.minDistance = 0
      orbitControls.maxDistance = 8
    }

    this.appendChild(this.renderer.domElement)

    if (this.xrsupport) {
      document.body.appendChild(this.ARButton)
    }

    this.renderer.setAnimationLoop(this.render)

    window.addEventListener('resize', this.onWindowResize)

    let lightString = this.getAttribute('lighting')

    if(lightString) {
      this.lighting = parseAttributeString(this.lighting)
    }

    this.initLights(this.lighting)

  }

  initLights = (data) => {
    if(!data.enabled) { return }
    this.defaultLight = new THREE.PointLight(data.color)
    this.defaultLight.position.set(0, 1, 1)
    this.defaultLight.intensity = data.intensity
    this.defaultLight.castShadow = data.shadows
    this.defaultLight.shadow.camera.top = 2
    this.defaultLight.shadow.camera.bottom = -2
    this.defaultLight.shadow.camera.right = 2
    this.defaultLight.shadow.camera.left = -2
    this.defaultLight.shadow.mapSize.set(4096, 4096)
    this.scene.add(this.defaultLight)
  }

  denit() {
    document.body.removeChild(this.renderer.domElement)
    document.body.removeChild(this.ARButton)
    window.removeEventListener('resize', this.onWindowResize)
  }

  registerSystem(system) {
    this.systems.add(system)
  }

  unregisterSystem(system) {
    this.systems.delete(system)
  }

  add(entity) {
    this.scene.add(entity.object3D)
  }

  remove(entity) {
    this.scene.remove(entity.object3D)
  }

  onWindowResize() {
    this.user.aspect = window.innerWidth / window.innerHeight
    this.user.updateProjectionMatrix()

    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  render() {
    const deltaTime = this.clock.getDelta()

    if( this.debug ) { this.stats.begin() }
    for (const system of this.systems) {
      system.update(deltaTime)
    }
    if( this.debug ) { this.stats.end() }

    if(this.lighting.enabled){
      this.defaultLight.target = this.user
    }

    this.renderer.render(this.scene, this.user)
  }
}

customElements.get('mr-app') || customElements.define('mr-app', MRApp)
