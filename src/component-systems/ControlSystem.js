import * as THREE from 'three'
import { MRHand } from '../interaction/hand'
import { System } from '../core/System'


export class ControlSystem extends System {
    constructor(){
        super()
        this.leftHand = new MRHand('left', this.app)
        this.rightHand = new MRHand('right', this.app)

        const geometry = new THREE.SphereGeometry(0.01)
        const material = new THREE.MeshBasicMaterial()
        material.color.setStyle('red')

        this.leftCursor = new THREE.Mesh(geometry, material)
        this.rightCursor = new THREE.Mesh(geometry, material)

        this.ROI = new THREE.Box3()
    }

    update(deltaTime){
        this.leftHand.setMesh()
        this.rightHand.setMesh()
    }

}