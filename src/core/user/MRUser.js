import { MRHand } from "./MRHand"

export default class MRUser {

    forward = new THREE.Object3D()

    origin = new THREE.Object3D()

    spotlight = null

    hands = {
        left: null,
        right: null
    }
    constructor(camera, scene) {
        this.camera = camera

        this.hands.left = new MRHand('left', scene)
        this.hands.right = new MRHand('right', scene)

        this.camera.add(this.forward);
        this.forward.position.setZ(-0.5);
        this.forward.position.setX(0.015);

        this.camera.add(this.origin);
        this.origin.position.setX(0.015);

        this.leftWorldPosition = new THREE.Vector3()
        this.rightWorldPosition = new THREE.Vector3()
        this.worldPosition = new THREE.Vector3()

        this.leftDistance = 0
        this.rightDistance = 0

        this.spotLightScale = 1
        
    }

    initSpotlight() {
        this.spotlight = new THREE.Mesh(new THREE.CircleGeometry(1.3, 64), new THREE.MeshBasicMaterial())
        this.spotlight.material.colorWrite = false;
        this.spotlight.renderOrder = 2;
        this.spotlight.rotation.x = - Math.PI / 2

        return this.spotlight
    }

    update(){
        this.hands.left.update()
        this.hands.right.update()

        if(this.spotlight) {
            this.worldPosition.setFromMatrixPosition(this.origin.matrixWorld)
            this.worldPosition.y = 0

            if(this.hands.left.active){
                this.hands.left.controller.getWorldPosition(this.leftWorldPosition)
                this.leftWorldPosition.y = 0
                this.leftDistance = this.worldPosition.distanceTo(this.leftWorldPosition)
            } else {
                this.leftDistance = 0
            }

            if(this.hands.right.active) {
                this.hands.right.controller.getWorldPosition(this.rightWorldPosition)
                this.rightWorldPosition.y = 0
                this.rightDistance = this.worldPosition.distanceTo(this.rightWorldPosition)
            } else {
                this.rightDistance = 0
            }


            this.spotLightScale = this.leftDistance > this.rightDistance ? this.leftDistance : this.rightDistance

            if (this.spotLightScale > 0) {
                this.spotLightScale += 1
                this.spotlight.scale.setScalar(this.spotLightScale)

            }

            this.spotlight.position.setFromMatrixPosition(this.origin.matrixWorld)
            this.spotlight.position.y = 0
        }
    }
}