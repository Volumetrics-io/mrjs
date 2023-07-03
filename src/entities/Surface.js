import * as THREE from 'three'
import { Entity } from '../core/entity.js'
import { UIPlane } from '../geometry/UIPlane.js'

const QUAD_PINCH_THRESHOLD = 0.03

export class Surface extends Entity {
  constructor(aspectRatio = 1.77777778) {
    super()

    this.rotationPlane = new THREE.Group()
    this.translation = new THREE.Group()
    this.group = new THREE.Group()
    this.orientation = 'horizontal'

    this.object3D.add(this.rotationPlane)
    this.rotationPlane.add(this.translation)

    this.rotationPlane.receiveShadow = true
    this.rotationPlane.renderOrder = 3

    this.translation.receiveShadow = true
    this.translation.renderOrder = 3

    this.aspectRatio = aspectRatio
    this.placed = false
    this.width = this.aspectRatio
    this.height = 1
    this.worldPosition = new THREE.Vector3()
    this.lookPosition = new THREE.Vector3()

    this.material = new THREE.MeshStandardMaterial({
      color: 0x3498db,
      roughness: 0.0,
      metalness: 0.7,
      transparent: true,
      opacity: 0.7,
      side: 2,
    })

    this.geometry = UIPlane(this.aspectRatio, 1, 0.02, 18)

    this.mesh = new THREE.Mesh(this.geometry, this.material)

    this.onDoublePinch = this.onDoublePinch.bind(this)
    this.onDoublePinchEnded = this.onDoublePinchEnded.bind(this)

    document.addEventListener('doublepinch', this.onDoublePinch)
    document.addEventListener('doublepinchended', this.onDoublePinchEnded)
  }

  add(entity) {
    this.group.add(entity.object3D)
  }

  remove(entity) {
    this.group.remove(entity.object3D)
  }

  onDoublePinch(event) {
    this.user.getWorldPosition(this.worldPosition)
    this.lookPosition.copy(this.worldPosition)

    this.lookPosition.setY(event.detail.center.y)

    if (this.mesh.parent == null) {
      this.translation.add(this.mesh)
    }

    if (this.group.parent != null) {
      this.group.removeFromParent()
    }

    this.object3D.position.setX(event.detail.center.x)
    this.object3D.position.setY(event.detail.center.y)
    this.object3D.position.setZ(event.detail.center.z)
    this.object3D.scale.setScalar(event.detail.distance)

    this.object3D.lookAt(this.lookPosition)

    this.setRotation(
      Math.abs(event.detail.center.y - this.worldPosition.y),
      0.3
    )
  }

  setRotation(delta, threshold) {
    if (delta < threshold) {
      this.orientation = 'vertical'
      this.translation.position.setY(0)
      this.rotationPlane.rotation.x = 0
    } else {
      this.orientation = 'horizontal'
      this.translation.position.setY(0.5)
      this.rotationPlane.rotation.x = 3 * (Math.PI / 2)
    }
  }

  editPosition() {
    document.addEventListener('doublepinch', this.onDoublePinch)
    document.addEventListener('doublepinchended', this.onDoublePinchEnded)
  }

  onDoublePinchEnded(event) {
    this.dispatchEvent(
      new CustomEvent(`surfaceplaced`, {
        bubbles: true,
        detail: { orientation: this.orientation },
      })
    )
    this.mesh.removeFromParent()
    this.translation.add(this.group)
    document.removeEventListener('doublepinch', this.onDoublePinch)
    document.removeEventListener('doublepinchended', this.onDoublePinchEnded)
  }
}

customElements.get('mr-surface') || customElements.define('mr-surface', Surface)
