import * as THREE from 'three'
import { parseVector } from '../utils/parser.js'
import { MRElement } from './MRElement.js'
import { MaterialHelper } from '../utils/materialHelper.js'

export class Entity extends MRElement {
  static DEFAULT_ATTRIBUTES = ['position', 'scale', 'rotation']

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
        case 'mat':
          MaterialHelper.applyMaterial(this.object3D, attr.name, attr.value)
          break
        case 'tex':
          MaterialHelper.applyTexture(this.object3D, attr.name, attr.value)
          break

        default:
          break
      }
    }

    this.connected()

    document.addEventListener('DOMContentLoaded', (event) => {
      this.checkForText()
    })
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
    console.log('removed')

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
      } else if (mutation.attributeName.startsWith('mat-')) {
        MaterialHelper.applyMaterial(
          this.object3D,
          mutation.attributeName,
          this.getAttribute(mutation.attributeName)
        )
      } else if (mutation.attributeName.startsWith('tex-')) {
        MaterialHelper.applyTexture(
          this.object3D,
          mutation.attributeName,
          this.getAttribute(mutation.attributeName)
        )
      }
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
