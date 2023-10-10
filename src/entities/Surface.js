import * as THREE from 'three'
import { Entity } from '../core/entity.js'
import { UIPlane } from '../geometry/UIPlane.js'

export class Surface extends Entity {
  constructor() {
    super()

    this.anchored = false
    this.anchorPosition = new THREE.Vector3()
    this.anchorQuaternion = new THREE.Quaternion()

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
    this.width = 1
    this.height = 1

    this.material = new THREE.MeshStandardMaterial({
      color: 0x3498db,
      roughness: 0.0,
      metalness: 0.7,
      transparent: true,
      opacity: 0.7,
      side: 2,
    })

    this.geometry = UIPlane(this.aspectRatio / 3, 1 / 3, 0.01, 18)

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

  replace() {
    console.log('replace');
    this.object3D.position.copy(this.anchorPosition)
    this.object3D.quaternion.copy(this.anchorQuaternion)

    this.placed = true
    this.dispatchEvent( new CustomEvent('surface-placed', { bubbles: true }))
  }

  remove() {
    console.log('remove');
    this.placed = false
    this.object3D.position.set(0,0,0)
    this.object3D.quaternion.set(0,0,0,1)
    this.dispatchEvent( new CustomEvent('surface-removed', { bubbles: true }))

  }
}

customElements.get('mr-surface') || customElements.define('mr-surface', Surface)
