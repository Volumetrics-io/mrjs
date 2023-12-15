import * as THREE from 'three';
import { XRControllerModelFactory } from 'three/addons/webxr/XRControllerModelFactory.js';
import { XRHandModelFactory } from 'three/addons/webxr/XRHandModelFactory.js';

import { mrjsUtils } from 'mrjs';

const HOVER_DISTANCE = 0.05;
const PINCH_DISTANCE = 0.005;

const joints = [
    'wrist',
    'thumb-metacarpal',
    'thumb-phalanx-proximal',
    'thumb-phalanx-distal',
    'thumb-tip',
    'index-finger-metacarpal',
    'index-finger-phalanx-proximal',
    'index-finger-phalanx-intermediate',
    'index-finger-phalanx-distal',
    'index-finger-tip',
    'middle-finger-metacarpal',
    'middle-finger-phalanx-proximal',
    'middle-finger-phalanx-intermediate',
    'middle-finger-phalanx-distal',
    'middle-finger-tip',
    'ring-finger-metacarpal',
    'ring-finger-phalanx-proximal',
    'ring-finger-phalanx-intermediate',
    'ring-finger-phalanx-distal',
    'ring-finger-tip',
    'pinky-finger-metacarpal',
    'pinky-finger-phalanx-proximal',
    'pinky-finger-phalanx-intermediate',
    'pinky-finger-phalanx-distal',
    'pinky-finger-tip',
];

const HAND_MAPPING = {
    left: 0,
    right: 1,
};

/**
 * @class MRHand
 * @classdesc Class describing the MRHand object representing the UX of the hand object for MR interactions.
 * @property {boolean} pinch - Indicates if the hand is in a pinch gesture.
 * @property {boolean} hover - Indicates if the hand is hovering over an interactive object.
 * @property {THREE.Vector3} cursorPosition - The position of the cursor in 3D space.
 * @property {Object} jointPhysicsBodies - Physics bodies associated with the hand joints.
 * @property {THREE.Vector3} identityPosition - A reference position for the hand.
 * @property {THREE.Vector3} tempJointPosition - Temporary storage for a joint's position.
 * @property {THREE.Quaternion} tempJointOrientation - Temporary storage for a joint's orientation.
 * @property {THREE.Quaternion} orientationOffset - An offset for the hand's orientation.
 * @property {THREE.Vector3} hoverInitPosition - Initial position when hover starts.
 * @property {THREE.Vector3} hoverPosition - Current position during a hover.
 * @property {XRControllerModelFactory} controllerModelFactory - Factory for creating controller models.
 * @property {XRHandModelFactory} handModelFactory - Factory for creating hand models.
 * @property {THREE.Mesh} mesh - The 3D mesh representing the hand.
 * @property {THREE.Object3D} controller - The controller object.
 * @property {THREE.Object3D} grip - The grip associated with the controller.
 * @property {THREE.Object3D} hand - The 3D object representing the hand.
 * @property {THREE.Object3D} model - The model of the hand.
 */
export class MRHand {
    /**
     * @constructor
     * @description Constructor for the MRHand class object. Setups up all attributes for MRHand including physics, mouse/cursor information, hand tracking and state, and model information.
     * @param {object} handedness - enum for the `left`` or `right` hand.
     * @param {object} app - the current MRApp that contains the scene for the hand.
     */
    constructor(handedness, app) {
        this.handedness = handedness;
        this.pinch = false;
        this.hover = false;

        this.cursorPosition = new THREE.Vector3();

        this.jointPhysicsBodies = {};

        this.identityPosition = new THREE.Vector3();

        this.tempJointPosition = new THREE.Vector3();
        this.tempJointOrientation = new THREE.Quaternion();

        this.orientationOffset = new THREE.Quaternion(0.7071068, 0, 0, 0.7071068);

        this.hoverInitPosition = new THREE.Vector3();
        this.hoverPosition = new THREE.Vector3();

        this.controllerModelFactory = new XRControllerModelFactory();
        this.handModelFactory = new XRHandModelFactory();

        this.mesh;
        this.controller = app.renderer.xr.getController(HAND_MAPPING[handedness]);

        this.grip = app.renderer.xr.getControllerGrip(HAND_MAPPING[handedness]);
        this.grip.add(this.controllerModelFactory.createControllerModel(this.grip));

        this.hand = app.renderer.xr.getHand(HAND_MAPPING[handedness]);
        this.model = this.handModelFactory.createHandModel(this.hand, 'mesh');

        this.hand.add(this.model);

        this.hand.addEventListener('pinchstart', this.onPinch);
        this.hand.addEventListener('pinchend', this.onPinch);

        app.scene.add(this.controller);
        app.scene.add(this.grip);
        app.scene.add(this.hand);
        this.initPhysicsBodies(app);
    }

    /**
     * @method
     * @description Initializes the physics bodies that the hand represents. Useful for collision detection and UX interactions in MR space.
     * @param {object} app - the current MRApp that contains the scene for the hand.
     */
    initPhysicsBodies(app) {
        for (const joint of joints) {
            this.tempJointPosition = this.getJointPosition(joint);
            this.tempJointOrientation = this.getJointOrientation(joint);
            const rigidBodyDesc = mrjsUtils.Physics.RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(...this.tempJointPosition);

            let colliderDesc;

            if (joint.includes('tip')) {
                colliderDesc = mrjsUtils.Physics.RAPIER.ColliderDesc.ball(0.015);
            } else {
                colliderDesc = mrjsUtils.Physics.RAPIER.ColliderDesc.capsule(0.01, 0.01);
            }

            this.jointPhysicsBodies[joint] = { body: app.physicsWorld.createRigidBody(rigidBodyDesc) };
            this.jointPhysicsBodies[joint].body.setRotation(...this.tempJointOrientation);

            this.jointPhysicsBodies[joint].collider = app.physicsWorld.createCollider(colliderDesc, this.jointPhysicsBodies[joint].body);

            this.jointPhysicsBodies[joint].body.enableCcd(true);

            // RAPIER.ActiveCollisionTypes.KINEMATIC_KINEMATIC for joint to joint collisions
            this.jointPhysicsBodies[joint].collider.setActiveCollisionTypes(
                mrjsUtils.Physics.RAPIER.ActiveCollisionTypes.DEFAULT | mrjsUtils.Physics.RAPIER.ActiveCollisionTypes.KINEMATIC_FIXED
            );
            this.jointPhysicsBodies[joint].collider.setActiveEvents(mrjsUtils.Physics.RAPIER.ActiveEvents.COLLISION_EVENTS);

            if (joint.includes('index-finger-tip')) {
                this.jointPhysicsBodies[`${joint}-hover`] = { body: app.physicsWorld.createRigidBody(rigidBodyDesc) };
                this.jointPhysicsBodies[`${joint}-hover`].body.setRotation(...this.tempJointOrientation);

                // This should be replaced with a cone or something
                const hoverColDesc = mrjsUtils.Physics.RAPIER.ColliderDesc.ball(0.03);
                this.jointPhysicsBodies[`${joint}-hover`].collider = app.physicsWorld.createCollider(hoverColDesc, this.jointPhysicsBodies[`${joint}-hover`].body);
                mrjsUtils.Physics.INPUT_COLLIDER_HANDLE_NAMES[this.jointPhysicsBodies[joint].collider.handle] = joint;
                mrjsUtils.Physics.INPUT_COLLIDER_HANDLE_NAMES[this.jointPhysicsBodies[`${joint}-hover`].collider.handle] = `${joint}-hover`;
            }
        }
    }

    /**
     * @method
     * @description Update function for the Hand object. Updates the physics bodies and checks whether a pinch has happened or is in progress in any way.
     */
    update() {
        this.updatePhysicsBodies();
        this.pinchMoved();
    }

    /**
     * @method
     * @description If a pinch happens, updates the MR cursor position while sending out an event that movement has occured from this hand.
     */
    pinchMoved() {
        if (!this.pinch) {
            return;
        }
        const position = this.getCursorPosition();
        document.dispatchEvent(
            new CustomEvent('pinchmoved', {
                bubbles: true,
                detail: {
                    handedness: this.handedness,
                    position,
                },
            })
        );
    }

    /**
     * @method
     * @description Update function for the physics associated with this hand. Runs for every joint in the system and moves all elements of the hand model.
     */
    updatePhysicsBodies() {
        for (const joint of joints) {
            this.tempJointPosition = this.getJointPosition(joint);
            this.tempJointOrientation = this.getJointOrientation(joint);

            if (!joint.includes('tip')) {
                this.tempJointOrientation.multiply(this.orientationOffset);
            }

            this.jointPhysicsBodies[joint].body.setTranslation({ ...this.tempJointPosition }, true);
            this.jointPhysicsBodies[joint].body.setRotation(this.tempJointOrientation, true);

            if (joint.includes('index-finger-tip')) {
                this.jointPhysicsBodies[`${joint}-hover`].body.setTranslation({ ...this.tempJointPosition }, true);
                this.jointPhysicsBodies[`${joint}-hover`].body.setRotation(this.tempJointOrientation, true);
            }
        }
    }

    /**
     * @method
     * @description Handles the setMesh callback.
     */
    setMeshImpl() {
        if (this.mesh) {
            return;
        }
        this.mesh = this.hand.getObjectByProperty('type', 'SkinnedMesh');
        if (!this.mesh) {
            return;
        }
        this.mesh.material.colorWrite = false;
        this.mesh.renderOrder = 2;
    }
    setMesh = () => {
        return this.setMeshImpl();
    };

    /**
     * @method
     * @description Handles the onPinch event
     * @param {event} event - the on pinch event object
     */
    onPinchImpl(event) {
        this.pinch = event.type == 'pinchstart';
        const position = this.getCursorPosition();
        document.dispatchEvent(
            new CustomEvent(event.type, {
                bubbles: true,
                detail: {
                    handedness: this.handedness,
                    position,
                },
            })
        );
    }
    /**
     * @event
     */
    onPinch = (event) => {
        return this.onPinchImpl(event);
    };

    /**
     * @method
     * @description Gets the joint orientation of the named joint in the hand.
     * @param {string} jointName - the string name of the joint whose information is requested.
     * @returns {THREE.Quaternion} - the quaternion representation or the joint orientation.
     */
    getJointOrientation(jointName) {
        const result = new THREE.Quaternion();

        if (!this.mesh) {
            return result;
        }
        const joint = this.mesh.skeleton.getBoneByName(jointName);

        if (joint == null) {
            return result;
        }

        joint.getWorldQuaternion(result);

        return result;
    }

    /**
     * @method
     * @description Gets the joint position of the named joint in the hand.
     * @param {string} jointName - the string name of the joint whose information is requested.
     * @returns {THREE.Vector3} - the position representation or the joint orientation.
     */
    getJointPosition(jointName) {
        const result = new THREE.Vector3();

        // Using an offset value with rapier to throw the items into the distance when inactive since there
        // is no way at the moment to remove them when inactive.
        const offset = 10000;

        if (!this.mesh) {
            result.addScalar(offset);
            return result;
        }
        const joint = this.mesh.skeleton.getBoneByName(jointName);

        if (joint == null) {
            result.addScalar(offset);
            return result;
        }

        joint.getWorldPosition(result);

        if (result.equals(this.identityPosition)) {
            result.addScalar(offset);
        }

        return result;
    }

    /**
     * @method
     * @description Gets the expected cursor position of this hand based on the index finger and thumb's tip positions.
     * @returns {number} - the resolved position of the cursor.
     */
    getCursorPosition() {
        const index = this.getJointPosition('index-finger-tip');
        const thumb = this.getJointPosition('thumb-tip');
        return index.lerp(thumb, 0.5);
    }
}
