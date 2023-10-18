import { MRUIEntity } from '../../UI/UIEntity'
import { Entity } from '../../core/entity'

export class Column extends MRUIEntity {
  constructor() {
    super()
    this.shuttle = new THREE.Group() // will shift based on bounding box width
    this.object3D.userData.bbox = new THREE.Box3()
    this.object3D.userData.size = new THREE.Vector3()
    this.object3D.add(this.shuttle)
    this.rows = 0
  }

  add(entity) {
    this.shuttle.add(entity.object3D)
  }

  remove(entity) {
    this.shuttle.remove(entity.object3D)
  }

  onScroll = (event) => {
    let scrollMax = (this.fixedHeight) - (this.parentElement.computedInternalHeight / 2)
    let scrollMin = (this.parentElement.computedInternalHeight / 2)
    let delta = event.deltaY * 0.001
    if( this.shuttle.position.y + delta > scrollMin && this.shuttle.position.y + delta < scrollMax){
      this.shuttle.position.y += delta
    }
  }

  getRowCount(){
    const children = Array.from(this.children)
    this.rows = 0
    for (const child of children) {
        if (!child instanceof Entity) { continue }
        this.rows +=child.height + child.margin.vertical
      }
  }
}

customElements.get('mr-column') || customElements.define('mr-column', Column)
