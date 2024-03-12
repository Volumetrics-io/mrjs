import * as THREE from 'three';
import { XRControllerModelFactory } from 'three/addons/webxr/XRControllerModelFactory.js';
import { XRHandModelFactory } from 'three/addons/webxr/XRHandModelFactory.js';

import { mrjsUtils } from 'mrjs';

const ORIENTATION_OFFSET = new THREE.Quaternion(0.7071068, 0, 0, 0.7071068);
const mrjs = 0x000b0001;

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
 * @property {object} jointPhysicsBodies - Physics bodies associated with the hand joints.
 * @property {THREE.Vector3} identityPosition - A reference position for the hand.
 * @property {THREE.Vector3} tempJointPosition - Temporary storage for a joint's position.
 * @property {THREE.Quaternion} tempJointOrientation - Temporary storage for a joint's orientation.
 * @property {XRControllerModelFactory} controllerModelFactory - Factory for creating controller models.
 * @property {XRHandModelFactory} handModelFactory - Factory for creating hand models.
 * @property {THREE.Mesh} mesh - The 3D mesh representing the hand.
 * @property {THREE.Object3D} controller - The controller object.
 * @property {THREE.Object3D} grip - The grip associated with the controller.
 * @property {THREE.Object3D} hand - The 3D object representing the hand.
 * @property {THREE.Object3D} model - The model of the hand.
 */
export class MRHand {
    jointCursors = [];
    /**
     * @class
     * @description Constructor for the MRHand class object. Setups up all attributes for MRHand including physics, mouse/cursor information, hand tracking and state, and model
     * @param scene
     * information.
     * @param {object} handedness - enum for the `left`` or `right` hand.
     * @param {object} app - the current MRApp that contains the scene for the hand.
     */
    constructor(handedness, scene) {
        this.handedness = handedness;
        this.pinch = false;

        this.lastPosition = new THREE.Vector3();
        this.active = false;

        this.jointPhysicsBodies = {};
        this.pointer = new THREE.Object3D();

        this.identityPosition = new THREE.Vector3();

        this.tempJointPosition = new THREE.Vector3();
        this.tempJointOrientation = new THREE.Quaternion();

        this.controllerModelFactory = new XRControllerModelFactory();
        this.handModelFactory = new XRHandModelFactory();

        this.mesh;
        this.controller = mrjsUtils.xr.getController(HAND_MAPPING[handedness]);
        this.controller.add(this.pointer);
        this.pointer.position.setZ(-0.5);

        this.grip = mrjsUtils.xr.getControllerGrip(HAND_MAPPING[handedness]);
        this.grip.add(this.controllerModelFactory.createControllerModel(this.grip));

        this.hand = mrjsUtils.xr.getHand(HAND_MAPPING[handedness]);
        this.model = this.handModelFactory.createHandModel(this.hand, 'mesh');

        this.hand.add(this.model);

        this.hand.addEventListener('selectstart', this.onSelect);
        this.hand.addEventListener('selectend', this.onSelect);

        scene.add(this.controller);
        scene.add(this.grip);
        scene.add(this.hand);
        this.initPhysicsBodies();
    }

    /**
     * @function
     * @description Initializes the physics bodies that the hand represents. Useful for collision detection and UX interactions in MR space.
     * @param {object} scene - the current scene.
     */
    initPhysicsBodies() {
        for (const joint of joints) {
            this.tempJointPosition = this.getJointPosition(joint);
            this.tempJointOrientation = this.getJointOrientation(joint);
            const rigidBodyDesc = mrjsUtils.physics.RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(...this.tempJointPosition);

            let colliderDesc;

            if (joint.includes('tip')) {
                colliderDesc = mrjsUtils.physics.RAPIER.ColliderDesc.ball(0.015);
            } else {
                colliderDesc = mrjsUtils.physics.RAPIER.ColliderDesc.capsule(0.01, 0.01);
            }

            colliderDesc.setCollisionGroups(mrjsUtils.physics.CollisionGroups.USER);

            this.jointPhysicsBodies[joint] = { body: mrjsUtils.physics.world.createRigidBody(rigidBodyDesc) };
            this.jointPhysicsBodies[joint].body.setRotation(...this.tempJointOrientation);

            this.jointPhysicsBodies[joint].collider = mrjsUtils.physics.world.createCollider(colliderDesc, this.jointPhysicsBodies[joint].body);

            this.jointPhysicsBodies[joint].body.enableCcd(true);

            // RAPIER.ActiveCollisionTypes.KINEMATIC_KINEMATIC for joint to joint collisions
            this.jointPhysicsBodies[joint].collider.setActiveCollisionTypes(
                mrjsUtils.physics.RAPIER.ActiveCollisionTypes.DEFAULT | mrjsUtils.physics.RAPIER.ActiveCollisionTypes.KINEMATIC_FIXED
            );
            this.jointPhysicsBodies[joint].collider.setActiveEvents(mrjsUtils.physics.RAPIER.ActiveEvents.COLLISION_EVENTS);

            if (joint.includes('index-finger-tip')) {
                this.jointPhysicsBodies[`${joint}-hover`] = { body: mrjsUtils.physics.world.createRigidBody(rigidBodyDesc) };
                this.jointPhysicsBodies[`${joint}-hover`].body.setRotation(...this.tempJointOrientation);

                // This should be replaced with a cone or something
                const hoverColDesc = mrjsUtils.physics.RAPIER.ColliderDesc.ball(0.03);
                this.jointPhysicsBodies[`${joint}-hover`].collider = mrjsUtils.physics.world.createCollider(hoverColDesc, this.jointPhysicsBodies[`${joint}-hover`].body);
                mrjsUtils.physics.INPUT_COLLIDER_HANDLE_NAMES[this.jointPhysicsBodies[joint].collider.handle] = joint;
                mrjsUtils.physics.INPUT_COLLIDER_HANDLE_NAMES[this.jointPhysicsBodies[`${joint}-hover`].collider.handle] = `${joint}-hover`;

                this.jointCursors.push({ name: joint, collider: this.jointPhysicsBodies[joint].collider });
                this.jointCursors.push({ name: `${joint}-hover`, collider: this.jointPhysicsBodies[`${joint}-hover`].collider });
            }
        }
    }

    /**
     * @function
     * @description Update function for the Hand object. Updates the physics bodies and checks whether a pinch has happened or is in progress in any way.
     */
    update() {
        this.active = !this.lastPosition.equals(this.controller.position);
        this.lastPosition.copy(this.controller.position);

        this.setMesh();
        this.updatePhysicsBodies();
        this.pinchMoved();
    }

    /**
     * @function
     * @description If a pinch happens, updates the MR cursor position while sending out an event that movement has occured from this hand.
     */
    pinchMoved() {
        if (!this.pinch) {
            return;
        }
        const position = this.getCursorPosition();
        document.dispatchEvent(
            new CustomEvent('selectmoved', {
                bubbles: true,
                detail: {
                    handedness: this.handedness,
                    position,
                },
            })
        );
    }

    /**
     * @function
     * @description Update function for the physics associated with this hand. Runs for every joint in the system and moves all elements of the hand model.
     */
    updatePhysicsBodies() {
        for (const joint of joints) {
            this.tempJointPosition = this.getJointPosition(joint);
            this.tempJointOrientation = this.getJointOrientation(joint);

            if (!joint.includes('tip')) {
                this.tempJointOrientation.multiply(ORIENTATION_OFFSET);
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
     * @function
     * @description Handles the setMesh callback.
     */
    setMesh = () => {
        if (this.mesh) {
            return;
        }
        this.mesh = this.hand.getObjectByProperty('type', 'SkinnedMesh');
        if (!this.mesh) {
            return;
        }
        this.mesh.material.colorWrite = false;
        this.mesh.renderOrder = 2;
    };

    /**
     * @function
     * @description Handles the onSelect event
     * @param {event} event - the on pinch event object
     */
    onSelect = (event) => {
        this.pinch = event.type == 'selectstart';
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
    };

    /**
     * @function
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
     * @function
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
     * @function
     * @description Gets the expected cursor position of this hand based on the index finger and thumb's tip positions.
     * @returns {number} - the resolved position of the cursor.
     */
    getCursorPosition() {
        const index = this.getJointPosition('index-finger-tip');
        const thumb = this.getJointPosition('thumb-tip');
        return index.lerp(thumb, 0.5);
    }
}
