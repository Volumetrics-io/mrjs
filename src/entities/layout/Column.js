import { Entity } from '../../core/entity'

export class Column extends Entity {
  constructor() {
    super()
    this.shuttle = new THREE.Group() // will shift based on bounding box width
    this.object3D.userData.bbox = new THREE.Box3()
    this.object3D.userData.size = new THREE.Vector3()
    this.object3D.add(this.shuttle)
    this.rows = 0
    this.height = 'auto'
    this.width = 'auto'
  }

  add(entity) {
    this.shuttle.add(entity.object3D)
  }

  remove(entity) {
    this.shuttle.remove(entity.object3D)
  }

  getRowCount(){
    const children = Array.from(this.children)
    for (const child of children) {
        if (!child instanceof Entity) { continue }
        this.rows += child.height == 'auto' ? 1 : child.height
      }
  }
}

customElements.get('mr-column') || customElements.define('mr-column', Column)
