import * as THREE from 'three'
import * as Ammo from 'three/examples/jsm/libs/ammo.wasm.js'

import { System } from '../core/System.js'

export class PhysicsSystem extends System {
  constructor() {
    super()
  }

  // called when the component is initialized
  attachedComponent(entity) {
    console.log(
      `attached ${this.componentName} ${entity.getAttribute(
        this.componentName
      )}`
    )
  }

  updatedComponent(entity) {
    console.log(
      `updated ${this.componentName} ${entity.getAttribute(this.componentName)}`
    )
  }

  // called when the component is removed
  detachedComponent(entity) {
    console.log(`detached ${this.componentName}`)
  }
}
