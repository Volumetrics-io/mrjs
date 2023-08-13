import * as THREE from 'three'
import { XRControllerModelFactory } from 'three/addons/webxr/XRControllerModelFactory.js'
import { XRHandModelFactory } from 'three/addons/webxr/XRHandModelFactory.js'
import { RAPIER } from '../component-systems/RapierPhysicsSystem'

const HOVER_DISTANCE = 0.05
const PINCH_DISTANCE = 0.02

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
}

export class MRHand {
  constructor(handedness, app) {
    this.handedness = handedness
    this.pinch = false
    this.hover = false

    this.jointPhysicsBodies = {}

    this.tempJointPosition = new THREE.Vector3()
    this.tempJointOrientation = new THREE.Quaternion()

    this.hoverInitPosition = new THREE.Vector3()
    this.hoverPosition = new THREE.Vector3()

    this.controllerModelFactory = new XRControllerModelFactory()
    this.handModelFactory = new XRHandModelFactory()

    this.mesh
    this.controller = app.renderer.xr.getController(HAND_MAPPING[handedness])

    this.grip = app.renderer.xr.getControllerGrip(HAND_MAPPING[handedness])
    this.grip.add(this.controllerModelFactory.createControllerModel(this.grip))

    this.hand = app.renderer.xr.getHand(HAND_MAPPING[handedness])
    this.model = this.handModelFactory.createHandModel(this.hand, 'mesh')

    this.hand.add(this.model)

    this.hand.addEventListener('pinchstart', this.onPinch)
    this.hand.addEventListener('pinchend', this.onPinch)

    app.scene.add(this.controller)
    app.scene.add(this.grip)
    app.scene.add(this.hand)
    this.initPhysicsBodies(app)
  }

  initPhysicsBodies(app){
    for(const joint of joints) {
      this.tempJointPosition = this.getJointPosition(joint)
      this.tempJointOrientation = this.getJointOrientation(joint)
      const rigidBodyDesc = RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(
        ...this.tempJointPosition
      )

      const colliderDesc = RAPIER.ColliderDesc.ball(0.01)

      this.jointPhysicsBodies[joint] = {body: app.physicsWorld.createRigidBody(rigidBodyDesc)}
      this.jointPhysicsBodies[joint].body.setRotation(...this.tempJointOrientation)

      this.jointPhysicsBodies[joint].collider = app.physicsWorld.createCollider(
        colliderDesc,
        this.jointPhysicsBodies[joint].body
      )

      this.jointPhysicsBodies[joint].collider.setActiveCollisionTypes(RAPIER.ActiveCollisionTypes.DEFAULT|
        RAPIER.ActiveCollisionTypes.KINEMATIC_FIXED);
      this.jointPhysicsBodies[joint].collider.setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);
    }
  }

  updatePhysicsBodies() {
    for(const joint of joints) {
      this.tempJointPosition = this.getJointPosition(joint)
      this.tempJointOrientation = this.getJointOrientation(joint)
      this.jointPhysicsBodies[joint].body.setTranslation({ ...this.tempJointPosition }, true)
      this.jointPhysicsBodies[joint].body.setRotation(this.tempJointOrientation, true)
    }
  }

  setMesh = () => {
    if (this.mesh) {
      return
    }
    this.mesh = this.hand.getObjectByProperty('type', 'SkinnedMesh')
    if (!this.mesh) {
      return
    }
    this.mesh.material.colorWrite = false
    this.mesh.renderOrder = 2
  }

  onPinch = (event) => {
    this.pinch = event.type == 'pinchstart'
    const position = this.getCursorPosition()
    document.dispatchEvent(
      new CustomEvent(event.type, {
        bubbles: true,
        detail: {
          handedness: this.handedness,
          position,
        },
      })
    )
  }

  getJointOrientation(jointName){
    const result = new THREE.Quaternion()

    if (!this.mesh) {
      return result
    }
    const joint = this.mesh.skeleton.getBoneByName(jointName)

    if (joint == null) {
      return result
    }

    joint.getWorldQuaternion(result)

    return result
  }

  getJointPosition(jointName) {
    const result = new THREE.Vector3()

    if (!this.mesh) {
      return result
    }
    const joint = this.mesh.skeleton.getBoneByName(jointName)

    if (joint == null) {
      return result
    }

    joint.getWorldPosition(result)

    return result
  }

  getCursorPosition() {
    const index = this.getJointPosition('index-finger-tip')
    const thumb = this.getJointPosition('thumb-tip')
    return index.lerp(thumb, 0.5)
  }
}
