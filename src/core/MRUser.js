import { MRHand } from "../dataTypes/MRHand"

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

        
    }

    initSpotlight() {
        this.spotlight = new THREE.Mesh(new THREE.CircleGeometry(1.5, 64), new THREE.MeshBasicMaterial())
        this.spotlight.material.colorWrite = false;
        this.spotlight.renderOrder = 2;
        this.spotlight.rotation.x = - Math.PI / 2

        return this.spotlight
    }

    update(){
        this.hands.left.update()
        this.hands.right.update()

        if(this.spotlight) {
            this.spotlight.position.setFromMatrixPosition(this.origin.matrixWorld)
            this.spotlight.position.y = 0
        }
    }
}