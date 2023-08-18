import { Entity } from '../../core/entity'
import { PositionTool } from './tools/PositionTool'

// THERE WILL BE BUGS daniel plainview 

export class DevVolume extends Entity {
  constructor() {
    super()
    this.registry = new Set()
    document.addEventListener('engine-started', (event) => {
      this.traverse((child) => {
        if (child == this) { return }
        this.addTools(child)
      })

      this.addEventListener('new-entity', (event) => {
        event.target.traverse((child) => {
          this.addTools(child)
        })
      })
    })
  }

  add(entity) {
    this.object3D.add(entity.object3D)
  }

  remove(entity) {
    this.object3D.remove(entity.object3D)
  }

  addTools(child) {
    let posTool = new PositionTool(child)
    child.object3D.add(posTool.object3D)
    posTool.initBody(this.env.physicsWorld)

    this.registry.add(posTool)
  }
}

customElements.get('mr-dev-volume') || customElements.define('mr-dev-volume', DevVolume)
