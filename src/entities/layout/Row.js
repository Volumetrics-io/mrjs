import { Entity } from '../../core/entity'

class Row extends Entity {
    constructor() {
      super()
      this.shuttle = new THREE.Group() // will shift based on bounding box width
      this.bbox = new THREE.Box3()
      this.dimensions = new THREE.Vector3()
      this.accumulatedX = 0
      this.object3D.add(this.shuttle)
    }

    add(entity){
        this.shuttle.add(entity.object3D)

        this.update()
    }

    remove(entity){
        this.shuttle.remove(entity.object3D)
        this.update()
    }

    update(){
        console.log('update');
        this.accumulatedX = 0
        this.shuttle.children.forEach((child) => {
            if (!child.userData.size) {
                child.userData.size = new THREE.Vector3()
                child.userData.bbox = new THREE.Box3()
                child.userData.bbox.setFromObject(child)
                child.userData.bbox.getSize(child.userData.size)
            }
            child.position.setX(this.accumulatedX + ((child.userData.size.x / 2) * child.scale.x))
            this.accumulatedX += child.userData.size.x * child.scale.x

            console.log(child.scale);
        })
        this.bbox.setFromObject(this.shuttle)
        this.bbox.getSize(this.dimensions)
        this.object3D.position.setX(-this.dimensions.x/2)
    }
  }
  
  customElements.get('mr-row') ||
    customElements.define('mr-row', Row)
  