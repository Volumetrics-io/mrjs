import { Entity } from "../core/entity";

export class MRUIEntity extends Entity {
    constructor(){
        super()
        this.worldScale = new THREE.Vector3()
        this.halfExtents = new THREE.Vector3()
        this.physics.type = 'ui'
    }

    updatePhysicsData() {
        this.physics.halfExtents = new THREE.Vector3()
        this.object3D.userData.bbox.setFromCenterAndSize(this.object3D.position,new THREE.Vector3(this.absoluteWidth, this.absoluteHeight, 0.002))
        
        this.worldScale.setFromMatrixScale(this.object3D.matrixWorld)
        this.object3D.userData.bbox.getSize(this.object3D.userData.size)
        this.object3D.userData.size.multiply(this.worldScale)

        this.physics.halfExtents.copy(this.object3D.userData.size)
        this.physics.halfExtents.divideScalar(2)
    }
}