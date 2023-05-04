import * as THREE from 'three';
import { XRControllerModelFactory } from 'three/addons/webxr/XRControllerModelFactory.js';
import { XRHandModelFactory } from 'three/addons/webxr/XRHandModelFactory.js';

export class MRHands {
    static controllerModelFactory
	static handModelFactory


    constructor(renderer){

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
    }

    addHandsTo(scene){
        scene.add(this.leftController)
        scene.add(this.rightController) 

        scene.add(this.leftGrip)
        scene.add(this.rightGrip)

        scene.add(this.leftHand)
        scene.add(this.rightHand)
    }

    onHandConnected(event) {
        console.log(this.hands.leftModel);
      }
}