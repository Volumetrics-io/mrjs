import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { ARButton } from 'three/addons/webxr/ARButton.js'
import { MRElement } from './MRElement.js'
import { SpatialControls } from '../interaction/SpatialControls.js'
import { PhysicsSystem } from '../component-systems/PhysicsSystem.js'

;('use strict')

export class Environment extends MRElement {
  constructor() {
    super()
    Object.defineProperty(this, 'isEnvironment', {
      value: true,
      writable: false,
    })

    this.environment = this
    this.systems = new Set() // systemName : System

    this.app = new THREE.Scene()

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    this.user = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.01,
      20
    )
    this.user.position.set(0, 0, 3)

    const appLight = new THREE.AmbientLight(0xffffff)
    this.app.add(appLight)

    this.shadowLight = new THREE.DirectionalLight(0xffffff)
    this.shadowLight.position.set(0, 1, 1)
    this.shadowLight.castShadow = true
    this.shadowLight.shadow.camera.top = 2
    this.shadowLight.shadow.camera.bottom = -2
    this.shadowLight.shadow.camera.right = 2
    this.shadowLight.shadow.camera.left = -2
    this.shadowLight.shadow.mapSize.set(4096, 4096)
    this.app.add(this.shadowLight)

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
    this.setAttribute('style', 'position: absolute;')
    this.observer = new MutationObserver(this.mutationCallback)
    this.observer.observe(this, { attributes: true, childList: true })
    this.physicsSystem = new PhysicsSystem()
    this.registerSystem(this.physicsSystem)
  }

  disconnectedCallback() {
    this.denit()

    this.environment = null
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

    this.spatialControls = new SpatialControls(this.renderer, this.app)

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
    this.app.add(entity.object3D)
  }

  remove(entity) {
    this.app.remove(entity.object3D)
  }

  mutatedAttribute(mutation) {}

  mutatedChildList(mutation) {}

  onWindowResize() {
    this.user.aspect = window.innerWidth / window.innerHeight
    this.user.updateProjectionMatrix()

    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  render() {
    for (const system of this.systems) {
      system.update()
    }

    this.spatialControls.update()

    this.shadowLight.target = this.user

    this.renderer.render(this.app, this.user)
  }
}

customElements.get('mr-env') || customElements.define('mr-env', Environment)
