import { MRUIEntity } from '../../UI/UIEntity'
import { Entity } from '../../core/entity'
import { ClippingGeometry } from '../../datatypes/ClippingGeometry'
import { Column } from './Column'

export class Row extends MRUIEntity {

  // set height(value) {
  //   super.height = value
  //   this.clipping.geometry.copy(new THREE.BoxGeometry(this.absoluteWidth, this.height, 0.3))
    
  // }
  // get height() {
  //   return super.height
  // }

  // set width(value) {
  //   super.width = value
  //   this.clipping.geometry.copy(new THREE.BoxGeometry(this.width, this.height, 0.3))
  // }
  // get width() {
  //   return super.width
  // }


  constructor() {
    super()
    this.shuttle = new THREE.Group() // will shift based on bounding box width
    this.object3D.userData.bbox = new THREE.Box3()
    this.object3D.userData.size = new THREE.Vector3()
    this.object3D.add(this.shuttle)
    //this.clipping = new ClippingGeometry(new THREE.BoxGeometry(this.width, this.height, 0.3))
    this.columns = 0
    this.accumulatedX = 0

    document.addEventListener('container-mutated', (event) => {
      if (event.target != this.parentElement) { return }
      this.height = this.parentElement.height
      this.update()
    })


    this.currentPosition = new THREE.Vector3()
    this.prevPosition = new THREE.Vector3()
    this.delta = new THREE.Vector3()
  }

  update = () => {
    this.getColumnCount()
    const children = Array.from(this.children)
    this.accumulatedX = 0
    for (const index in children) {
        let child = children[index]
        this.accumulatedX += child.margin.left
        child.object3D.position.setX( this.accumulatedX + child.width / 2)
        this.accumulatedX += child.width
        this.accumulatedX += child.margin.right

        if (child instanceof Column) {
          child.height = this.height
        }

    }
    this.shuttle.position.setX(-this.parentElement.offsetWidth / 2)
    }

  onTouch = (event) => {
    if(event.type =='touch-end') {
      this.prevPosition.set(0,0,0)
      return
    }
    event.stopPropagation()
    let scrollMax = -(this.parentElement.offsetWidth / 2)
    let scrollMin = (this.parentElement.offsetWidth / 2) - (this.contentWidth)
    this.currentPosition.copy(event.detail.worldPosition)
    this.object3D.worldToLocal(this.currentPosition)
    if(this.prevPosition.x != 0) {
      this.delta.subVectors(this.currentPosition, this.prevPosition)
    }
    this.prevPosition.copy(this.currentPosition)

    if( this.shuttle.position.x + this.delta.x > scrollMin && this.shuttle.position.x + this.delta.x < scrollMax){
      this.shuttle.position.x += this.delta.x * 1.33
    }
  }

  onScroll = (event) => {
    let scrollMax = -(this.parentElement.offsetWidth / 2)
    let scrollMin = (this.parentElement.offsetWidth / 2) - (this.contentWidth)
    let delta = event.deltaX * 0.001
    if(this.shuttle.position.x - delta < scrollMax && this.shuttle.position.x - delta > scrollMin){
      this.shuttle.position.x -= delta
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
