import * as THREE from 'three';
import { XRControllerModelFactory } from 'three/addons/webxr/XRControllerModelFactory.js';
import { XRHandModelFactory } from 'three/addons/webxr/XRHandModelFactory.js';

export class MRHands {

    constructor(renderer){

        this.leftPinch = false
        this.rightPinch = false
        this.doublePinch = false

        this.doublePinchObject = new THREE.Object3D()
        this.doublePinchObject.name = 'doublepinchtracker'

        this.leftMesh
        this.rightMesh

        this.leftController  = renderer.xr.getController( 0 );
        this.rightController = renderer.xr.getController( 1 );

        this.controllerModelFactory = new XRControllerModelFactory()
        this.handModelFactory = new XRHandModelFactory()

        this.leftGrip = renderer.xr.getControllerGrip( 0 );
		this.leftGrip.add( this.controllerModelFactory.createControllerModel( this.leftGrip ) );

        this.leftHand = renderer.xr.getHand( 0 );
        this.leftModel = this.handModelFactory.createHandModel( this.leftHand, 'mesh' )

		this.leftHand.add( this.leftModel );

        this.rightGrip = renderer.xr.getControllerGrip( 1 );
        this.rightGrip.add( this.controllerModelFactory.createControllerModel( this.rightGrip ) );

        this.rightHand = renderer.xr.getHand( 1 );
        this.rightModel = this.handModelFactory.createHandModel( this.rightHand, 'mesh' )
        this.rightHand.add( this.rightModel );

        this.onConnected = this.onConnected.bind(this)
        this.onPinch = this.onPinch.bind(this)

        this.leftHand.addEventListener('connected', this.onConnected)
        this.rightHand.addEventListener('connected', this.onConnected)

        this.leftHand.addEventListener('pinchstart', this.onPinch)
        this.rightHand.addEventListener('pinchstart', this.onPinch)

        this.leftHand.addEventListener('pinchend', this.onPinch)
        this.rightHand.addEventListener('pinchend', this.onPinch)
    }

    addHandsTo(scene){
        scene.add(this.leftController)
        scene.add(this.rightController) 

        scene.add(this.leftGrip)
        scene.add(this.rightGrip)

        scene.add(this.leftHand)
        scene.add(this.rightHand)

        scene.add(this.doublePinchObject)
    }

    onConnected(event){

        if (event.data.handedness == 'left' && this.leftMesh == null) {
            this.leftMesh = event.target.getObjectByProperty( 'type', 'SkinnedMesh' );
            this.leftMesh.material.colorWrite = false
            this.leftMesh.renderOrder = 2;
        }

        if (event.data.handedness == 'right' && this.rightMesh == null) {
            this.rightMesh = event.target.getObjectByProperty( 'type', 'SkinnedMesh' );
            this.rightMesh.material.colorWrite = false
            this.rightMesh.renderOrder = 2;
        }
    }

    getJointPosition(handedness, jointName) {
        let result = new THREE.Vector3()

        let hand = handedness == 'left' ? this.leftMesh : this.rightMesh
        if (!hand) { return result}
        let joint = hand.skeleton.getBoneByName(jointName)

        if (joint == null) { return result }

        joint.getWorldPosition(result)

        return result
    }

    getPinchPosition(handedness){
        let index = this.getJointPosition(handedness, 'index-finger-tip')
        let thumb = this.getJointPosition(handedness, 'thumb-tip')
        return index.lerp(thumb, 0.5)
    }

    onPinch(event) {

        if (event.handedness == 'left') {
            this.leftPinch = event.type == 'pinchstart'
            let position = this.getPinchPosition('left')
            document.dispatchEvent(new CustomEvent(event.type, { bubbles: true, detail: { 
                handedness: 'left',
                position: position      
            }}))
        }

        if (event.handedness == 'right') {
            this.rightPinch = event.type == 'pinchstart'
            let position = this.getPinchPosition('right')
            document.dispatchEvent(new CustomEvent(event.type, { bubbles: true, detail: { 
                handedness: 'right',
                position: position      
            }}))
        }

        if (this.rightPinch && this.leftPinch) {
            this.doublePinch = true
            document.dispatchEvent(new CustomEvent(`doublepinchstart`, { bubbles: true, detail: this }))
        } else if (this.doublePinch) {
            this.doublePinch = false
            document.dispatchEvent(new CustomEvent(`doublepinchended`, { bubbles: true, detail: this }))
        }
    }

    update() {
        if (this.doublePinch){
            let leftPosition = this.getPinchPosition('left')
            let rightPosition = this.getPinchPosition('right')
            document.dispatchEvent(new CustomEvent(`doublepinch`, { bubbles: true, detail: { 
              leftPosition: leftPosition,
              rightPosition: rightPosition,
              center: leftPosition.lerp(rightPosition, 0.5),
              distance: leftPosition.distanceTo(rightPosition)      
            }}))
          } else if (this.leftPinch) {
            let position = this.getPinchPosition('left')
            document.dispatchEvent(new CustomEvent(`pinch`, { bubbles: true, detail: { 
              handedness: 'left',
              position: position      
            }}))
          } else if (this.rightPinch) {
            let position = this.getPinchPosition('right')
            document.dispatchEvent(new CustomEvent(`pinch`, { bubbles: true, detail: { 
              handedness: 'right',
              position: position      
            }}))
          }
    }
}