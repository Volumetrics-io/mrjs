import * as THREE from 'three'
import { UIPlane } from '../geometry/UIPlane.js'
import { Entity } from '../core/entity.js'
import { MRUIEntity } from './UIEntity.js'

export default class Panel extends MRUIEntity {
  radius = 0.02
  smoothness = 18
  #color = 0xecf0f1

  set color(value) {
    this.#color = value
    this.object3D.material.color.setStyle(this.#color)
    
  }
  get color() {
    return this.#color
  }

  set height(value) {
    super.height = value
    this.updatePlane()
    
  }
  get height() {
    return super.height
  }

  set width(value) {
    super.width = value
    this.updatePlane()
  }
  get width() {
    return super.width
  }

  get computedInternalHeight() {
    return super.computedInternalHeight - this.radius
  }

  get computedInternalWidth() {
    return super.computedInternalWidth - this.radius
  }

  updatePlane() {
    
    this.object3D.geometry = UIPlane(
      this.width,
      this.height,
      this.radius,
      this.smoothness
    )
  }

  constructor() {
    super()

    this.geometry = UIPlane(
      this.width,
      this.height,
      this.radius,
      this.smoothness
    )
    this.material = new THREE.MeshStandardMaterial({
      color: this.color,
      roughness: 0.7,
      metalness: 0.0,
      side: 2,
    })

    this.object3D = new THREE.Mesh(this.geometry, this.material)
    this.object3D.receiveShadow = true
    this.object3D.renderOrder = 3



  }

  mutated(mutation) {
    if(mutation.type != 'attributes') {
      switch (mutation.attributeName) {
        case 'width':
          this.width = parseFloat(this.getAttribute('width'))
          break
        case 'height':
          this.height = parseFloat(this.getAttribute('height'))
          break
        case 'corner-radius':
          this.radius = parseFloat(this.getAttribute('corner-radius'))
          console.log(this.radius);
          this.padding.all = this.radius
          break
        case 'smoothness':
          this.smoothness = parseFloat(this.getAttribute('smoothness'))
          break
        case 'color':
          this.object3D.material.color.setStyle(this.getAttribute('color'))
          break
        default:
          break
      }

    }
  }
}

customElements.get('mr-panel') || customElements.define('mr-panel', Panel)
