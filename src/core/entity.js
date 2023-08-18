import * as THREE from 'three'
import { parseVector } from '../utils/parser.js'
import { MRElement } from './MRElement.js'
import { BodyOffset } from '../datatypes/BodyOffset.js'

export class Entity extends MRElement {

  #width = 'auto'
  set width(value) {
    this.#width = value
    this.dimensionsUpdate()
  }
  get width() {
    return this.#width
  }

  get computedWidth() {
    let computed = this.#width == 'auto' ? 1 : this.#width
    return computed + this.margin.horizontal
  }

  get computedInternalWidth() {
    let computed = this.#width == 'auto' ? 1 : this.#width
    return computed - this.padding.horizontal
  }

  #height = 'auto'
  set height(value) {
    this.#height = value
    this.dimensionsUpdate()
  }
  get height() {
    return this.#height
  }

  get computedHeight() {
    let computed = this.#height == 'auto' ? 1 : this.#height
    return computed + this.margin.vertical
  }

  get computedInternalHeight() {
    let computed = this.#height == 'auto' ? 1 : this.#height
    return computed - this.padding.vertical
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
    this.setAttribute('style', 'display: none;')

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

    this.observer = new MutationObserver(this.mutationCallback)
    this.observer.observe(this, { attributes: true, childList: true })

    for (const attr of this.attributes) {
      switch (attr.name.split('-')[0]) {
        case 'comp':
          this.componentMutated(attr.name)
          break
        case 'scale':
          this.object3D.scale.setScalar(parseFloat(attr.value))
          break
        case 'position':
          this.object3D.position.fromArray(parseVector(attr.value))
          console.log(this.object3D.position);
          break
        case 'width':
          this.width = parseFloat(attr.value)
          break
        case 'height':
          this.height = parseFloat(attr.value)
          break
        case 'margin':
          this.margin.setFromVector(parseVector(attr.value))
          break
        case 'padding':
          this.padding.setFromVector(parseVector(attr.value))
          break
        default:
          break
      }
    }

    this.connected()

    document.addEventListener('DOMContentLoaded', (event) => {
      this.checkForText()
    })

    document.addEventListener('engine-started', (event) => {
      this.dispatchEvent(new CustomEvent(`new-entity`, {bubbles: true}))
    })

    this.dispatchEvent(new CustomEvent(`new-entity`, {bubbles: true}))
  }

  checkForText = () => {
    if (this.textContent.trim() == this.innerHTML.trim()) {
      this.dispatchEvent(
        new CustomEvent(`has-text`, {
          bubbles: true,
          detail: { entity: this },
        })
      )
    }
  }

  connected() {}

  disconnected() {}

  mutated = (mutation) => {}

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

  mutationCallback = (mutationList, observer) => {
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
      console.log(child);
      child.traverse(callBack)
    }
  }
}

customElements.get('mr-entity') || customElements.define('mr-entity', Entity)
