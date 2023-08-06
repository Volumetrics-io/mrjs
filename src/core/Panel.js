import * as THREE from 'three'
import { Entity } from './entity.js'
import { UIPlane } from '../geometry/UIPlane.js'

export default class Panel extends Entity {
  static get observedAttributes() {
    return [
      'width',
      'height',
      'corner-radius',
      'smoothness',
      'color',
    ]
  }
  radius = 0.05
  smoothness = 18

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
      color: 0xecf0f1,
      roughness: 0.7,
      metalness: 0.0,
      side: 2,
    })

    this.object3D = new THREE.Mesh(this.geometry, this.material)
    this.object3D.receiveShadow = true
    this.object3D.renderOrder = 3

  }

  // TODO: Switch to overriding MutationCallback instead
  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'width':
        this.width = parseFloat(newValue)
        break
      case 'height':
        this.height = parseFloat(newValue)
        break
      case 'corner-radius':
        this.radius = parseFloat(newValue)
        break
      case 'smoothness':
        this.smoothness = parseFloat(newValue)
        break
      case 'color':
        this.object3D.material.color.setStyle(newValue)
        break
      default:
        break
    }

    this.object3D.geometry = UIPlane(
      this.width,
      this.height,
      this.radius,
      this.smoothness
    )
  }
}

customElements.get('mr-panel') || customElements.define('mr-panel', Panel)
