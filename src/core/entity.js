import * as THREE from 'three'
import { parseDegVector, parseVector } from '../utils/parser.js'
import { MRElement } from './MRElement.js'

export class Entity extends MRElement {

  physics = {
    type: 'none'
  }

  aabb = new THREE.Box3()
  size = new THREE.Vector3()
  
  get width() {
    return (this.compStyle.width.split('px')[0] / window.innerWidth) * global.viewPortWidth
  }

  get contentWidth() {
    this.aabb.setFromObject(this.object3D).getSize(this.size)
    return this.size.x
  }

  get height() {
    let styleHeight = this.compStyle.height.split('px')[0] > 0 ? this.compStyle.height.split('px')[0] : window.innerHeight
    return (styleHeight / window.innerHeight) * global.viewPortHeight

  }

  get contentHeight() {
    this.aabb.setFromObject(this.object3D).getSize(this.size)
    return this.size.y
  }

  #zOffeset = 0.001
  set zOffeset(value) {
    this.#zOffeset = value
  }
  get zOffeset() {
    return this.#zOffeset
  }

  layer = 0

  constructor() {
    super()

    Object.defineProperty(this, 'isApp', {
      value: false,
      writable: false,
    })

    this.object3D = new THREE.Group()
    this.components = new Set()
    this.object3D.userData.bbox = new THREE.Box3()
    this.object3D.userData.size = new THREE.Vector3()

    this.object3D.receiveShadow = true
    this.object3D.renderOrder = 3

    this.scale = 1

    this.componentMutated = this.componentMutated.bind(this)

    this.touch = false
    this.grabbed = false
    this.focus = false

  }

  updatePhysicsData() {

  }

  onHover = (event) => {
    //console.log(`${event.detail.joint} hover at:`, event.detail.position);
  }

  onTouch = (event) => { 
    //console.log(`${event.detail.joint} touch at:`, event.detail.position);
  }

  onScroll = (event) => {
    this.parentElement?.onScroll(event)
  }

  connectedCallback() {
    this.compStyle = window.getComputedStyle(this)
    
    if (!this.parentElement.tagName.toLowerCase().includes('mr-')) {
      return
    }
    this.parentElement.add(this)

    this.parent = this.parentElement

    if (this.parentElement.user) {
      this.user = this.parentElement.user
    }
    if (this.parentElement.env) {
      this.env = this.parentElement.env
    }

    this.object3D.userData.element = this

    this.object3D.userData.bbox = new THREE.Box3()
    this.object3D.userData.size = new THREE.Vector3()

    this.object3D.userData.bbox.setFromObject(this.object3D)

    this.object3D.userData.bbox.getSize(this.object3D.userData.size)

    this.mutationCallback = this.mutationCallback.bind(this)
    this.observer = new MutationObserver(this.mutationCallback)
    this.observer.observe(this, { attributes: true, childList: true })

    document.addEventListener('DOMContentLoaded', (event) => {
      this.loadAttributes()

    })
    this.loadAttributes()

    this.connected()

    document.addEventListener('engine-started', (event) => {
      this.dispatchEvent(new CustomEvent(`new-entity`, {bubbles: true}))
    })

    this.addEventListener('touch-start', (event) => { this.onTouch(event) })
    this.addEventListener('touch', (event) => { this.onTouch(event) })
    this.addEventListener('touch-end', (event) => { this.onTouch(event) })
    this.addEventListener('hover-start', (event) => { this.onHover(event) })
    this.addEventListener('hover-end', (event) => { this.onHover(event) })

    this.dispatchEvent(new CustomEvent(`new-entity`, {bubbles: true}))
  }

  loadAttributes() {
    this.components = new Set()
    for (const attr of this.attributes) {      
      switch (attr.name.split('-')[0]) {
        case 'comp':
          this.componentMutated(attr.name)
          break
        case 'rotation':
          this.object3D.rotation.fromArray(parseDegVector(attr.value))
          break
        case 'position':
          this.object3D.position.fromArray(parseVector(attr.value))
          break
        case 'zoffset':
          this.zOffeset = parseFloat(attr.value)
          break
        case 'layer':
          this.layer = parseFloat(attr.value)
          this.object3D.layers.set(this.layer)
          break
      }
    }
  }

  connected() {}

  disconnected() {}


  disconnectedCallback() {
    while (this.object3D.parent) {
      this.object3D.removeFromParent()
    }

    if(this.physics){
      this.env.physicsWorld.removeRigidBody(this.physics.body)
    }

    this.environment = null
    this.observer.disconnect()

    this.disconnected()
  }

  mutated(mutation) {

  }

  mutationCallback(mutationList, observer) {
    for (const mutation of mutationList) {
      this.mutated(mutation)

      if (mutation.type != 'attributes') {
        continue
      }
      if (mutation.attributeName.startsWith('comp-')) {
        this.componentMutated(mutation.attributeName)
      }

      switch (mutation.attributeName) {
        case 'position':
          this.object3D.position.fromArray(parseVector(this.getAttribute('position')))
          console.log(this.object3D.position);
          break;
        case 'scale':
          this.object3D.scale.setScalar(parseFloat(this.getAttribute('scale')))
          break
        case 'rotation':
          this.object3D.rotation.fromArray(parseDegVector(this.getAttribute('rotation')))
          break
      
        default:
          break;
      }
        this.traverse((child) => {
          if (!child.physics) { return }
          child.physics.update = true
        })
      }
  }

  componentMutated(componentName) {
    const component = this.getAttribute(componentName)
    if (!component) {
      this.components.delete(componentName)
      this.dispatchEvent(
        new CustomEvent(`${componentName}-detached`, {
          bubbles: true,
          detail: { entity: this, component },
        })
      )
    } else if (!this.components.has(componentName)) {
      this.components.add(componentName)
      this.dispatchEvent(
        new CustomEvent(`${componentName}-attached`, {
          bubbles: true,
          detail: { entity: this, component },
        })
      )
    } else {
      this.dispatchEvent(
        new CustomEvent(`${componentName}-updated`, {
          bubbles: true,
          detail: this,
          detail: { entity: this, component },
        })
      )
    }
  }

  add(entity) {
    entity.object3D.receiveShadow = true
    entity.object3D.renderOrder = 3
    this.object3D.add(entity.object3D)
  }

  remove(entity) {
    this.object3D.remove(entity.object3D)
  }

  traverse(callBack) {
    callBack(this)
    const children = Array.from(this.children)
    for (const child of children) {
      // if o is an object, traverse it again
      if (!child instanceof Entity) {
        continue
      }
      child.traverse(callBack)
    }
  }
}

customElements.get('mr-entity') || customElements.define('mr-entity', Entity)
