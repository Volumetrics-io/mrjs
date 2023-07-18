import * as THREE from 'three'
import { XRControllerModelFactory } from 'three/addons/webxr/XRControllerModelFactory.js'
import { XRHandModelFactory } from 'three/addons/webxr/XRHandModelFactory.js'

const HOVER_DISTANCE = 0.05
const PINCH_DISTANCE = 0.02

const HAND_MAPPING = {
  left: 0,
  right: 1,
}

export class MRHand {
  constructor(handedness, environment) {
    this.handedness = handedness
    this.pinch = false
    this.hover = false

    this.hoverInitPosition = new THREE.Vector3()
    this.hoverPosition = new THREE.Vector3()

    this.controllerModelFactory = new XRControllerModelFactory()
    this.handModelFactory = new XRHandModelFactory()

    this.mesh
    this.controller = environment.renderer.xr.getController(HAND_MAPPING[handedness])

    this.grip = environment.renderer.xr.getControllerGrip(HAND_MAPPING[handedness])
    this.grip.add(this.controllerModelFactory.createControllerModel(this.grip))

    this.hand = environment.renderer.xr.getHand(HAND_MAPPING[handedness])
    this.model = this.handModelFactory.createHandModel(this.hand, 'mesh')

    this.hand.add(this.model)

    this.hand.addEventListener('pinchstart', this.onPinch)
    this.hand.addEventListener('pinchend', this.onPinch)

    environment.app.add(this.controller)
    environment.app.add(this.grip)
    environment.app.add(this.hand)
  }

  setMesh = () => {
    if(this.mesh) { return }
    this.mesh = this.hand.getObjectByProperty('type', 'SkinnedMesh')
    if(!this.mesh) { return }
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
