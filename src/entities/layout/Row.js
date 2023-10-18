import { MRUIEntity } from '../../UI/UIEntity'
import { Entity } from '../../core/entity'
import { ClippingGeometry } from '../../datatypes/ClippingGeometry'

export class Row extends MRUIEntity {

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

    this.currentPosition = new THREE.Vector3()
    this.prevPosition = new THREE.Vector3()
    this.delta = new THREE.Vector3()
  }

  onTouch = (event) => {
    if(event.type =='touch-end') {
      this.prevPosition.set(0,0,0)
      return
    }
    event.stopPropagation()
    let scrollMax = (this.fixedWidth) - (this.parentElement.computedInternalWidth / 2)
    let scrollMin = (this.parentElement.computedInternalWidth / 2)
    this.currentPosition.copy(event.detail.worldPosition)
    this.object3D.worldToLocal(this.currentPosition)
    if(this.prevPosition.x != 0) {
      this.delta.subVectors(this.currentPosition, this.prevPosition)
    }
    this.prevPosition.copy(this.currentPosition)

    if(this.delta.x > 0.1) {
      console.log('big delta', this.delta.x);
      console.log(event);
    }

    if( this.shuttle.position.x + this.delta.x > scrollMin && this.shuttle.position.x + this.delta.x < scrollMax){
      this.shuttle.position.x += this.delta.x * 1.33
    }
  }

  onScroll = (event) => {
    let scrollMax = -(this.parentElement.computedInternalWidth / 2)
    let scrollMin = (this.parentElement.computedInternalWidth / 2) - (this.fixedWidth)
    let delta = event.deltaX * 0.001
    console.log(delta);
    if(this.shuttle.position.x - delta < scrollMax && this.shuttle.position.x - delta > scrollMin){
      this.shuttle.position.x -= delta
    }
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
