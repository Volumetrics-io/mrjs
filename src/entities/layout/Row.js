import { Entity } from '../../core/entity'
import { ClippingGeometry } from '../../datatypes/ClippingGeometry'

export class Row extends Entity {

  // set absoluteHeight(value) {
  //   super.absoluteHeight = value
  //   this.clipping.geometry.copy(new THREE.BoxGeometry(this.absoluteWidth, this.absoluteHeight, 0.1))
    
  // }
  // get absoluteHeight() {
  //   return super.absoluteHeight
  // }

  // set absoluteWidth(value) {
  //   super.absoluteWidth = value
  //   this.clipping.geometry.copy(new THREE.BoxGeometry(this.absoluteWidth, this.absoluteHeight, 0.1))
  // }
  // get absoluteWidth() {
  //   return super.absoluteWidth
  // }

  constructor() {
    super()
    this.shuttle = new THREE.Group() // will shift based on bounding box width
    this.object3D.userData.bbox = new THREE.Box3()
    this.object3D.userData.size = new THREE.Vector3()
    this.object3D.add(this.shuttle)
    //this.clipping = new ClippingGeometry(new THREE.BoxGeometry(this.absoluteWidth, this.absoluteHeight, 0.1))
    this.columns = 0
  }

  add(entity) {
    this.shuttle.add(entity.object3D)
  }

  remove(entity) {
    this.shuttle.remove(entity.object3D)
  }

  getColumnCount(){
    const children = Array.from(this.children)
    this.columns = 0
    for (const child of children) {
        if (!child instanceof Entity) { continue }
        this.columns += child.width + child.margin.horizontal
    }
  }
}

customElements.get('mr-row') || customElements.define('mr-row', Row)
