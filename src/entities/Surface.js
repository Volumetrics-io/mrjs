import * as THREE from 'three'
import { Entity } from '../core/entity.js'
import { UIPlane } from '../geometry/UIPlane.js'

export class Surface extends Entity {
  constructor() {
    super()

    this.rotationPlane = new THREE.Group()
    this.translation = new THREE.Group()
    this.group = new THREE.Group()
    this.orientation = 'any'

    this.object3D.add(this.rotationPlane)
    this.rotationPlane.add(this.translation)

    this.rotationPlane.receiveShadow = true
    this.rotationPlane.renderOrder = 3

    this.translation.receiveShadow = true
    this.translation.renderOrder = 3

    this.aspectRatio = 1.333333
    this.placed = false
    this.width = this.aspectRatio / 3
    this.height = 1 / 3

    this.material = new THREE.MeshStandardMaterial({
      color: 0x3498db,
      roughness: 0.0,
      metalness: 0.7,
      transparent: true,
      opacity: 0.7,
      side: 2,
    })

    this.geometry = UIPlane(this.width, this.height, 0.01, 18)

    this.viz = new THREE.Mesh(this.geometry, this.material)

    this.translation.add(this.group)
    if (this.viz.parent == null) {
      this.translation.add(this.viz)
    }
    this.group.visible = true
    this.viz.visible = false

  }

  add(entity) {
    this.group.add(entity.object3D)
  }

  remove(entity) {
    this.group.remove(entity.object3D)
  }

  mutated(mutation) {
    if(mutation.type != 'attributes') {
      switch (mutation.attributeName) {
        case 'orientation':
          this.getAttribute('orientation')
        default:
          break
      }

    }
  }

  place() {
    this.viz.removeFromParent()
    this.group.visible = true
    this.placed = true

    this.dispatchEvent( new CustomEvent('surface-placed', { bubbles: true }))

  }
}

customElements.get('mr-surface') || customElements.define('mr-surface', Surface)
