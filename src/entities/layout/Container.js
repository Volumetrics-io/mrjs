import { MRUIEntity } from "../../UI/UIEntity";
import { ClippingGeometry } from '../../datatypes/ClippingGeometry'
import { Surface } from "../Surface";
import { LayoutEntity } from "./LayoutEntity";

export class Container extends LayoutEntity {


  constructor() {
    super()
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
