import * as THREE from 'three'
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

;('use strict')

export class MRApp extends MRElement {
  constructor() {
    super()
    Object.defineProperty(this, 'isApp', {
      value: true,
      writable: false,
    })

    this.clock = new THREE.Clock()
    this.systems = new Set()

    this.scene = new THREE.Scene()

    this.stats = new Stats()
    this.stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(this.stats.dom)

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    this.user = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.01,
      20
    )
    this.user.position.set(0, 0, 2)

    const appLight = new THREE.AmbientLight(0xffffff)
    this.scene.add(appLight)

    this.shadowLight = new THREE.DirectionalLight(0xffffff)
    this.shadowLight.position.set(0, 1, 1)
    this.shadowLight.castShadow = true
    this.shadowLight.shadow.camera.top = 2
    this.shadowLight.shadow.camera.bottom = -2
    this.shadowLight.shadow.camera.right = 2
    this.shadowLight.shadow.camera.left = -2
    this.shadowLight.shadow.mapSize.set(4096, 4096)
    this.scene.add(this.shadowLight)

    this.render = this.render.bind(this)
    this.onWindowResize = this.onWindowResize.bind(this)

    this.ARButton = ARButton.createButton(this.renderer, {
      requiredFeatures: ['hand-tracking'],
    })
  }

  connectedCallback() {
    this.init()
    document.documentElement.setAttribute(
      'style',
      `
        bottom: 0;
        left: 0;
        position: fixed;
        right: 0;
        top: 0;`
    )

    document.body.setAttribute(
      'style',
      `
      height: 100%;
      margin: 0;
      overflow: hidden;
      padding: 0;
      width: 100%;`
    )

    this.debug = this.getAttribute('debug') ?? false
    this.setAttribute('style', 'position: absolute;')
    this.observer = new MutationObserver(this.mutationCallback)
    this.observer.observe(this, { attributes: true, childList: true })

    document.addEventListener('DOMContentLoaded', (event) => {
      import('@dimforge/rapier3d').then((rap) => {
        RAPIER = rap
        this.physicsWorld = new RAPIER.World({ x: 0.0, y: -9.81, z: 0.0 })
        // Run the simulation.
        this.physicsSystem = new RapierPhysicsSystem()
      })
    })
    this.controlSystem = new ControlSystem()
    this.textSystem = new TextSystem()
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

  init() {
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.autoClear = false
    this.renderer.shadowMap.enabled = true
    this.renderer.outputEncoding = THREE.sRGBEncoding
    this.renderer.xr.enabled = true

    const orbitControls = new OrbitControls(this.user, this.renderer.domElement)
    orbitControls.minDistance = 0
    orbitControls.maxDistance = 8

    let renderStyle = this.renderer.domElement.getAttribute('style')

    renderStyle += 'background-color: #fff;'

    this.renderer.domElement.setAttribute('style', renderStyle)
    this.setAttribute('data-html2canvas-ignore', true)
    this.ARButton.setAttribute('data-html2canvas-ignore', true)

    this.appendChild(this.renderer.domElement)
    document.body.appendChild(this.ARButton)

    this.renderer.setAnimationLoop(this.render)

    window.addEventListener('resize', this.onWindowResize)
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

  mutatedAttribute(mutation) {}

  mutatedChildList(mutation) {}

  onWindowResize() {
    this.user.aspect = window.innerWidth / window.innerHeight
    this.user.updateProjectionMatrix()

    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  render() {
    const deltaTime = this.clock.getDelta()

    this.stats.begin()
    for (const system of this.systems) {
      system.update(deltaTime)
    }
    this.stats.end()

    this.shadowLight.target = this.user

    this.renderer.render(this.scene, this.user)
  }
}

customElements.get('mr-app') || customElements.define('mr-app', MRApp)
