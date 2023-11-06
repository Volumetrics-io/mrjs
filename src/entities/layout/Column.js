import { MRUIEntity } from '../../UI/UIEntity'

export class Column extends MRUIEntity {

  constructor() {
    super()
    this.shuttle = new THREE.Group() // will shift based on bounding box width
    this.object3D.userData.bbox = new THREE.Box3()
    this.object3D.userData.size = new THREE.Vector3()
    this.object3D.add(this.shuttle)
    this.accumulatedY = 0

    document.addEventListener('container-mutated', (event) => {
      if (event.target != this.closest('mr-container')) { return }
      this.update()
    })
  }

  update = () => {
        const children = Array.from(this.children)
        this.accumulatedY = -this.padding.top
        for (const index in children) {
            let child = children[index]
            this.accumulatedY -= child.margin.top
            child.object3D.position.setY( this.accumulatedY - child.height / 2)
            this.accumulatedY -= child.height 
            this.accumulatedY -= child.margin.bottom
        }
        this.shuttle.position.setY(this.parentElement.height / 2)
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

customElements.get('mr-column') || customElements.define('mr-column', Column)
