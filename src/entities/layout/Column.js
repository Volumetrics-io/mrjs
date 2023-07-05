import { Entity } from '../../core/entity'

export class Column extends Entity {
  constructor() {
    super()
    this.shuttle = new THREE.Group() // will shift based on bounding box width
    this.object3D.userData.bbox = new THREE.Box3()
    this.object3D.userData.size = new THREE.Vector3()
    this.accumulatedY = 0
    this.object3D.add(this.shuttle)
  }

  connected() {
    this.update()
  }

  mutated = (mutation) => {
    if (mutation.addedNodes.length) {
      this.update()
    }
  }

  add(entity) {
    this.shuttle.add(entity.object3D)
    this.update()
  }

  remove(entity) {
    this.shuttle.remove(entity.object3D)
    this.update()
  }

  update() {
    this.accumulatedY = 0
    this.shuttle.children.forEach((child) => {
      if (!child.userData.size) {
        child.userData.size = new THREE.Vector3()
        child.userData.bbox = new THREE.Box3()
        child.userData.bbox.setFromObject(child)
        child.userData.bbox.getSize(child.userData.size)
      }

      child.position.setY(
        this.accumulatedY - (child.userData.size.y / 2) * child.scale.y
      )
      this.accumulatedY -= child.userData.size.y * child.scale.y
    })
    this.object3D.userData.bbox.setFromObject(this.shuttle)
    this.object3D.userData.bbox.getSize(this.object3D.userData.size)
    this.shuttle.position.setY(this.object3D.userData.size.y / 2)
  }
}

customElements.get('mr-column') || customElements.define('mr-column', Column)
