import { MRUIEntity } from '../../UI/UIEntity'
import { Entity } from '../../core/entity'
import { ClippingGeometry } from '../../datatypes/ClippingGeometry'

export class Column extends MRUIEntity {

  set height(value) {
    super.height = value
    this.clipping.geometry.copy(new THREE.BoxGeometry(this.width, this.height, 0.3))
    
  }
  get height() {
    return super.height
  }

  set width(value) {
    super.width = value
    this.clipping.geometry.copy(new THREE.BoxGeometry(this.width, this.height, 0.3))
  }
  get width() {
    return super.width
  }

  constructor() {
    super()
    this.shuttle = new THREE.Group() // will shift based on bounding box width
    this.object3D.userData.bbox = new THREE.Box3()
    this.object3D.userData.size = new THREE.Vector3()
    this.object3D.add(this.shuttle)
    this.clipping = new ClippingGeometry(new THREE.BoxGeometry(this.width, this.height, 0.3))
    this.accumulatedY = 0

    document.addEventListener('container-mutated', (event) => {
      if (event.target != this.parentElement) { return }
      this.height = this.parentElement.height
      this.width = this.parentElement.width
      this.update()
    })

    this.currentPosition = new THREE.Vector3()
    this.prevPosition = new THREE.Vector3()
    this.delta = new THREE.Vector3()
  }

  update = () => {
        const children = Array.from(this.children)
        this.accumulatedY = 0
        for (const index in children) {
            let child = children[index]
            this.accumulatedY -= child.margin.top
            child.object3D.position.setY( this.accumulatedY - child.height / 2)
            this.accumulatedY -= child.height 
            this.accumulatedY -= child.margin.bottom
        }
        this.shuttle.position.setY(this.parentElement.computedInternalHeight / 2)
    }

  add(entity) {
    this.shuttle.add(entity.object3D)
    this.update()
  }

  remove(entity) {
    this.shuttle.remove(entity.object3D)
    this.update()
  }

  onTouch = (event) => {
    if(event.type =='touch-end') {
      this.prevPosition.set(0,0,0)
      return
    }
    event.stopPropagation()
    let scrollMax = (this.contentHeight) - (this.parentElement.computedInternalHeight / 2)
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
    let scrollMax = (this.contentHeight) - (this.parentElement.computedInternalHeight / 2)
    let scrollMin = (this.parentElement.computedInternalHeight / 2)
    let delta = event.deltaY * 0.001
    if( this.shuttle.position.y + delta > scrollMin && this.shuttle.position.y + delta < scrollMax){
      this.shuttle.position.y += delta
    }
  }
}

customElements.get('mr-column') || customElements.define('mr-column', Column)
