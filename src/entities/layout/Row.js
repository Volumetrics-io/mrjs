import { Column } from './Column'
import { LayoutEntity } from './LayoutEntity'

export class Row extends LayoutEntity {


  constructor() {
    super()
    this.accumulatedX = 0

    document.addEventListener('container-mutated', (event) => {
      if (event.target != this.closest('mr-container')) { return }
      this.update()
    })

    this.currentPosition = new THREE.Vector3()
    this.prevPosition = new THREE.Vector3()
    this.delta = new THREE.Vector3()
  }

  update = () => {
    const children = Array.from(this.children)
    this.accumulatedX = this.pxToThree(this.compStyle.paddingLeft)
    for (const index in children) {
        let child = children[index]
        if (!(child instanceof Column)) { continue }

        this.accumulatedX += this.pxToThree(child.compStyle.marginLeft)
        child.object3D.position.setX( this.accumulatedX + child.width / 2)
        this.accumulatedX += child.width
        this.accumulatedX += this.pxToThree(child.compStyle.marginRight)
    }
    this.accumulatedX += this.pxToThree(this.compStyle.paddingRight)

    this.shuttle.position.setX(-this.parentElement.width / 2)
    }

  add(entity) {
    this.shuttle.add(entity.object3D)
    this.update()
  }

  remove(entity) {
    this.shuttle.remove(entity.object3D)
    this.update()
  }
}

customElements.get('mr-row') || customElements.define('mr-row', Row)
