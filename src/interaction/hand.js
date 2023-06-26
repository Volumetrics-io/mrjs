import * as THREE from 'three';
import { XRControllerModelFactory } from 'three/addons/webxr/XRControllerModelFactory.js';
import { XRHandModelFactory } from 'three/addons/webxr/XRHandModelFactory.js';

const HOVER_DISTANCE = 0.05
const PINCH_DISTANCE = 0.02

const HAND_MAPPING = {
    'left': 0,
    'right': 1
}

export class MRHand {
    constructor(handedness, renderer) {
        this.handedness = handedness
        this.pinch = false
        this.hover = false

        this.hoverInitPosition = new THREE.Vector3()
        this.hoverPosition = new THREE.Vector3()

        this.controllerModelFactory = new XRControllerModelFactory()
        this.handModelFactory = new XRHandModelFactory()

        this.mesh
        this.controller = renderer.xr.getController( HAND_MAPPING[handedness] );

        this.grip = renderer.xr.getControllerGrip( HAND_MAPPING[handedness] );
        this.grip.add( this.controllerModelFactory.createControllerModel( this.grip ) );

        this.hand = renderer.xr.getHand( HAND_MAPPING[handedness] );
        this.model = this.handModelFactory.createHandModel( this.hand, 'mesh' )

		this.hand.add( this.model );

        this.hand.addEventListener('connected', this.onConnected)
        this.hand.addEventListener('pinchstart', this.onPinch)
        this.hand.addEventListener('pinchend', this.onPinch)
    }

    addToScene(scene){
        scene.add(this.controller)
        scene.add(this.grip)
        scene.add(this.hand)

    }

    onConnected = (event) => {
        if (event.data.handedness == this.handedness && this.mesh == null) {
            this.mesh = event.target.getObjectByProperty( 'type', 'SkinnedMesh' );
            this.mesh.material.colorWrite = false
            this.mesh.renderOrder = 2;
        }
    }

    onPinch = (event) => {
        this.pinch = event.type == 'pinchstart'
        let position = this.getCursorPosition()
        document.dispatchEvent(new CustomEvent(event.type, { bubbles: true, detail: { 
            handedness: this.handedness,
            position: position
        }}))
    }

    getJointPosition(jointName) {
        let result = new THREE.Vector3()

        if (!this.mesh) { return result }
        let joint = this.mesh.skeleton.getBoneByName(jointName)

        if (joint == null) { return result }

        joint.getWorldPosition(result)

        return result
    }

    getCursorPosition(){
        let index = this.getJointPosition('index-finger-tip')
        let thumb = this.getJointPosition('thumb-tip')
        return index.lerp(thumb, 0.5)
    }

    checkForHover() {
        let index = this.getJointPosition('index-finger-tip')
        let thumb = this.getJointPosition('thumb-tip')
        let distance = index.distanceTo(thumb)

        if (distance > PINCH_DISTANCE && distance < HOVER_DISTANCE) {
            if(!this.hover) {
                this.hoverInitPosition = this.getCursorPosition()
                this.hover = true
            }
            this.hoverPosition.copy(this.getCursorPosition()).sub(this.hoverInitPosition)
        } else {
            this.hover = false
        }

        return this.hover
    }
}