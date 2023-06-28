class Column extends Entity {
    constructor() {
      super()
      this.shuttle = new THREE.Group() // will shift based on bounding box width
      this.bbox = new THREE.Box3()
      this.dimensions = new THREE.Vector3()
    }

    add(entity){
        this.shuttle.add(entity.object3D)
        this.order()
    }

    remove(entity){
        this.shuttle.remove(entity.object3D)
        this.order()
    }

    order(){
        this.bbox.setFromObject(this.shuttle)
        this.bbox.getSize(this.dimensions)
        this.object3D.position.setY(-this.dimensions.Y/2)
    }
  }
  
  customElements.get('mr-column') ||
    customElements.define('mr-column', Column)
  