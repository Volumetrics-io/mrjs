import { Entity } from '../../core/entity'

export class LayoutEntity extends Entity {

    get height() {
        super.height

        if(global.inXR) {
            this.windowScale = this.parentElement.windowScale
                return (this.compStyle.height.split('px')[0] / window.innerHeight) * this.windowScale
            }
            return (this.compStyle.height.split('px')[0] / window.innerHeight) * global.viewPortHeight
        }

    get width() {
        super.width

        if(global.inXR) {
            this.windowScale = this.parentElement.windowScale
            return (this.compStyle.width.split('px')[0] / window.innerWidth) * this.windowScale
        }
        return (this.compStyle.width.split('px')[0] / window.innerWidth) * global.viewPortWidth
    }


    constructor(){
        super()
        this.worldScale = new THREE.Vector3()
        this.halfExtents = new THREE.Vector3()
        this.physics.type = 'ui'

        this.windowScale = 1
    }

    updatePhysicsData() {
        this.physics.halfExtents = new THREE.Vector3()
        this.object3D.userData.bbox.setFromCenterAndSize(this.object3D.position,new THREE.Vector3(this.width, this.height, 0.002))
        
        this.worldScale.setFromMatrixScale(this.object3D.matrixWorld)
        this.object3D.userData.bbox.getSize(this.object3D.userData.size)
        this.object3D.userData.size.multiply(this.worldScale)

        this.physics.halfExtents.copy(this.object3D.userData.size)
        this.physics.halfExtents.divideScalar(2)
    }
}