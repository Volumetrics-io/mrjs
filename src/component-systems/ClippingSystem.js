import System from "../core/System";


export class ClippingSystem extends System {
    constructor(){
        super()
        this.a = new THREE.Vector3();
        this.b = new THREE.Vector3();
        this.c = new THREE.Vector3();
        this.geometry = new THREE.BufferGeometry()
    }

    update(deltaTime, frame){
        for (const entity of this.registry) {
          this.updatePlanes(entity)
    
        }
      }

    onNewEntity(entity) {
        if (entity.clipping == null) { return }
        this.registry.add(entity)
        this.addClippingPlanes(entity)
        entity.object3D.traverse(child => {
            this.applyClipping(child, entity.clipping)
        })
    }

    addClippingPlanes(entity) {
        this.geometry = entity.clipping.geometry.toNonIndexed()

        for(let f=0; f<this.geometry.attributes.position.count * 3; f += 9){
            
            this.a.set(-this.geometry.attributes.position.array[f], -this.geometry.attributes.position.array[f+1], -this.geometry.attributes.position.array[f+2])
            this.b.set(-this.geometry.attributes.position.array[f+3], -this.geometry.attributes.position.array[f+4], -this.geometry.attributes.position.array[f+5])
            this.c.set(-this.geometry.attributes.position.array[f+6], -this.geometry.attributes.position.array[f+7], -this.geometry.attributes.position.array[f+8])
            
            entity.object3D.localToWorld(this.a)
            entity.object3D.localToWorld(this.b)
            entity.object3D.localToWorld(this.c)
            
            let newPlane = new THREE.Plane()

            newPlane.setFromCoplanarPoints(this.a, this.b, this.c)
            // if (this.app.debug) {
            //     const helper = new THREE.PlaneHelper( newPlane, 1, 0xff00ff );
            //     this.app.scene.add( helper );
            // }
    
            entity.clipping.planes.push(newPlane)
            entity.clipping.planeIDs.push(f)
        }
    }

    applyClipping(object, clipping) {
        if (!object.isMesh) {return}
        object.material.clippingPlanes = clipping.planes
        object.material.clipIntersection = clipping.intersection
    }

    updatePlanes(entity) {
        this.geometry = entity.clipping.geometry.toNonIndexed()

        let planeIndex = 0

        for(let f=0; f<this.geometry.attributes.position.count * 3; f += 9){
            if(!entity.clipping.planeIDs.includes(f)) { continue }

            
            this.a.set(-this.geometry.attributes.position.array[f], -this.geometry.attributes.position.array[f+1], -this.geometry.attributes.position.array[f+2])
            this.b.set(-this.geometry.attributes.position.array[f+3], -this.geometry.attributes.position.array[f+4], -this.geometry.attributes.position.array[f+5])
            this.c.set(-this.geometry.attributes.position.array[f+6], -this.geometry.attributes.position.array[f+7], -this.geometry.attributes.position.array[f+8])
            
            entity.object3D.localToWorld(this.a)
            entity.object3D.localToWorld(this.b)
            entity.object3D.localToWorld(this.c)
            
            entity.clipping.planes[planeIndex].setFromCoplanarPoints(this.a, this.b, this.c)

            planeIndex += 1
        }
    }
}