import * as THREE from 'three'
import { parseDegVector, parseDimensionValue, parseVector } from '../utils/parser.js'
import { MRElement } from './MRElement.js'
import { BodyOffset } from '../datatypes/BodyOffset.js'

export class Entity extends MRElement {

  physics = {
    type: 'none'
  }

  #absoluteWidth = 1
  set absoluteWidth(value) {
    this.#absoluteWidth = value
  }

  get absoluteWidth() {
    return this.#absoluteWidth
  }

  #width = 'auto'
  set width(value) {
    this.#width = !isNaN(value) ? parseFloat(value) : parseDimensionValue(value)
    this.dimensionsUpdate()
  }
  get width() {
    switch (this.#width) {
      case 'auto':
        return 1
      default:
        return this.#width
    }
  }

  get computedWidth() {
    return this.absoluteWidth + this.margin.horizontal
  }

  get computedInternalWidth() {
    return this.absoluteWidth - this.padding.horizontal
  }

  #absoluteHeight = 1
  set absoluteHeight(value) {
    this.#absoluteHeight = value
  }

  get absoluteHeight() {
    return this.#absoluteHeight
  }

  #height = 'auto'
  set height(value) {
    this.#height = !isNaN(value) ? parseFloat(value) : parseDimensionValue(value)
    this.dimensionsUpdate()
  }
  get height() {
    switch (this.#height) {
      case 'auto':
        return 1
      default:
        return this.#height
    }
  }

  get computedHeight() {
    return this.#absoluteHeight + this.margin.vertical
  }

  get computedInternalHeight() {
    return this.#absoluteHeight - this.padding.vertical
  }

  #zOffeset = 0.001
  set zOffeset(value) {
    this.#zOffeset = value
  }
  get zOffeset() {
    return this.#zOffeset
  }

  margin = new BodyOffset(this.dimensionsUpdate)

  padding = new BodyOffset(this.dimensionsUpdate)

  dimensionsUpdate = () => {
    this.dispatchEvent( new CustomEvent('dimensions-mutated', { bubbles: true }))
  }

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

  onTouch = (joint, position) => { 
    console.log(`${joint} touch at:`, position);
  }

  onGrab = (position) => {
    console.log('grab');
  }

  connectedCallback() {
    if (!this.parentElement.tagName.toLowerCase().includes('mr-')) {
      return
    }
    this.parentElement.add(this)

    this.parent = this.parentElement

    // if (this.parent) { this.scale *= this.parent.scale ?? 1}

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

    this.connected()

    document.addEventListener('DOMContentLoaded', (event) => {
      this.loadAttributes()

    })
    this.loadAttributes()

    document.addEventListener('engine-started', (event) => {
      this.dispatchEvent(new CustomEvent(`new-entity`, {bubbles: true}))
    })

    this.dispatchEvent(new CustomEvent(`new-entity`, {bubbles: true}))
  }

  loadAttributes() {
    this.components = new Set()
    let name
    for (const attr of this.attributes) {      
      switch (attr.name.split('-')[0]) {
        case 'comp':
          this.componentMutated(attr.name)
          break
        case 'rotation':
          this.object3D.rotation.fromArray(parseDegVector(attr.value))
          break
        case 'scale':
          this.object3D.scale.setScalar(parseFloat(attr.value))
          break
        case 'position':
          this.object3D.position.fromArray(parseVector(attr.value))
          break
        case 'width':
          this.width = attr.value
          break
        case 'height':
          this.height = attr.value
          break
        case 'margin':
          this.margin.setFromVector(parseVector(attr.value))
          break
        case 'padding':
          this.padding.setFromVector(parseVector(attr.value))
          break
        default:
          this[attr.name] = attr.value
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
