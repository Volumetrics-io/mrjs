import { MRUIEntity } from "../../UI/UIEntity";
import { ClippingGeometry } from '../../datatypes/ClippingGeometry'
import { Surface } from "../Surface";

export class Container extends MRUIEntity {
  
  get height() {
    super.height

    if(this.parentElement instanceof Surface && global.inXR) {
      return (this.compStyle.height.split('px')[0] / window.innerHeight) * this.parentElement.scale
    }
    return (this.compStyle.height.split('px')[0] / window.innerHeight) * global.viewPortHeight
  }

  get width() {
    super.width

    if(this.parentElement instanceof Surface && global.inXR) {
      return (this.compStyle.width.split('px')[0] / window.innerWidth) * this.parentElement.aspectRatio * this.parentElement.scale
    }
    return (this.compStyle.width.split('px')[0] / window.innerWidth) * global.viewPortWidth
  }

  constructor() {
    super()
    this.shuttle = new THREE.Group() // will shift based on bounding box width
    this.object3D.userData.bbox = new THREE.Box3()
    this.object3D.userData.size = new THREE.Vector3()
    this.object3D.add(this.shuttle)

    this.currentPosition = new THREE.Vector3()
    this.prevPosition = new THREE.Vector3()
    this.delta = new THREE.Vector3()
  }

  connected(){
    this.clipping = new ClippingGeometry(new THREE.BoxGeometry(this.width, this.height, 0.3))
    document.addEventListener('DOMContentLoaded', (event) => {
      this.dispatchEvent( new CustomEvent('container-mutated', { bubbles: true }))
    })

    window.addEventListener('resize', (event) => {
      this.dispatchEvent( new CustomEvent('container-mutated', { bubbles: true }))
    })

    this.parentElement.addEventListener('surface-placed', (event) => {
      this.dispatchEvent( new CustomEvent('container-mutated', { bubbles: true }))
    })

    this.parentElement.addEventListener('surface-removed', (event) => {
      this.dispatchEvent( new CustomEvent('container-mutated', { bubbles: true }))

    })

    this.parentElement.addEventListener('container-mutated', (event) => {
      this.clipping.geometry.copy(new THREE.BoxGeometry(this.width, this.height, 0.3))
    })


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
    let scrollMax = (this.contentHeight) - this.height
    let scrollMin =  0
    this.currentPosition.copy(event.detail.worldPosition)
    this.object3D.worldToLocal(this.currentPosition)
    if(this.prevPosition.y != 0) {
      this.delta.subVectors(this.currentPosition, this.prevPosition)
    }
    this.prevPosition.copy(this.currentPosition)

    let delta = this.delta.y * 1.33

    if( this.shuttle.position.y + delta > scrollMin && this.shuttle.position.y + delta < scrollMax){
      this.shuttle.position.y += delta
    }
  }

  onScroll = (event) => {
    let scrollMax = (this.contentHeight) - this.height
    let scrollMin =  0
    let delta = event.deltaY * 0.001
    if( this.shuttle.position.y + delta > scrollMin && this.shuttle.position.y + delta <= scrollMax){
      this.shuttle.position.y += delta
    }
  }
}

customElements.get('mr-container') ||
  customElements.define('mr-container', Container)
