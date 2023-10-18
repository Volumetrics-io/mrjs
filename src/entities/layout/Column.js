import { MRUIEntity } from '../../UI/UIEntity'
import { Entity } from '../../core/entity'
import { ClippingGeometry } from '../../datatypes/ClippingGeometry'

export class Column extends MRUIEntity {

  set absoluteHeight(value) {
    super.absoluteHeight = value
    this.clipping.geometry.copy(new THREE.BoxGeometry(this.absoluteWidth, this.absoluteHeight, 0.1))
    
  }
  get absoluteHeight() {
    return super.absoluteHeight
  }

  set absoluteWidth(value) {
    super.absoluteWidth = value
    this.clipping.geometry.copy(new THREE.BoxGeometry(this.absoluteWidth, this.absoluteHeight, 0.1))
  }
  get absoluteWidth() {
    return super.absoluteWidth
  }

  constructor() {
    super()
    this.shuttle = new THREE.Group() // will shift based on bounding box width
    this.object3D.userData.bbox = new THREE.Box3()
    this.object3D.userData.size = new THREE.Vector3()
    this.object3D.add(this.shuttle)
    this.clipping = new ClippingGeometry(new THREE.BoxGeometry(this.absoluteWidth, this.absoluteHeight, 0.1))
    this.rows = 0

    this.zOffeset = 0.01

    this.currentPosition = new THREE.Vector3()
    this.prevPosition = new THREE.Vector3()
    this.delta = new THREE.Vector3()
  }

  add(entity) {
    this.shuttle.add(entity.object3D)
  }

  remove(entity) {
    this.shuttle.remove(entity.object3D)
  }

  onTouch = (event) => {
    if(event.type =='touch-end') {
      this.prevPosition.set(0,0,0)
      return
    }
    event.stopPropagation()
    let scrollMax = (this.fixedHeight) - (this.parentElement.computedInternalHeight / 2)
    let scrollMin = (this.parentElement.computedInternalHeight / 2)
    this.currentPosition.copy(event.detail.worldPosition)
    this.object3D.worldToLocal(this.currentPosition)
    if(this.prevPosition.y != 0) {
      this.delta.subVectors(this.currentPosition, this.prevPosition)
    }
    this.prevPosition.copy(this.currentPosition)

    if(this.delta.y > 0.1) {
      console.log('big delta', this.delta.y);
      console.log(event);
    }

    if( this.shuttle.position.y + this.delta.y > scrollMin && this.shuttle.position.y + this.delta.y < scrollMax){
      this.shuttle.position.y += this.delta.y * 1.33
    }
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
