import * as THREE from 'three';
import { XRControllerModelFactory } from 'three/addons/webxr/XRControllerModelFactory.js';
import { XRHandModelFactory } from 'three/addons/webxr/XRHandModelFactory.js';

export class MRHands {

    constructor(renderer){

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

        this.onConnected = this.onConnected.bind(this)

        this.leftHand.addEventListener('connected', this.onConnected)

        this.rightGrip = renderer.xr.getControllerGrip( 1 );
        this.rightGrip.add( this.controllerModelFactory.createControllerModel( this.rightGrip ) );

        this.rightHand = renderer.xr.getHand( 1 );
        this.rightModel = this.handModelFactory.createHandModel( this.rightHand, 'mesh' )
        this.rightHand.add( this.rightModel );

        this.rightHand.addEventListener('connected', this.onConnected)
    }

    addHandsTo(scene){
        scene.add(this.leftController)
        scene.add(this.rightController) 

        scene.add(this.leftGrip)
        scene.add(this.rightGrip)

        scene.add(this.leftHand)
        scene.add(this.rightHand)
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
}