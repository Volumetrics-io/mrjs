import * as THREE from 'three'
import { MRHand } from '../interaction/hand'
import System from '../core/System'
import { RAPIER, COLLIDER_ENTITY_MAP, INPUT_COLLIDER_HANDLE_NAMES} from '../component-systems/RapierPhysicsSystem'

export class ControlSystem extends System {
  constructor() {
    super()
    this.leftHand = new MRHand('left', this.app)
    this.rightHand = new MRHand('right', this.app)

    this.pointerPosition = new THREE.Vector3()
    this.ray = new RAPIER.Ray({ x: 1.0, y: 2.0, z: 3.0 }, { x: 0.0, y: 1.0, z: 0.0 });
    this.hit

    this.restPosition = new THREE.Vector3(1000,1000,1000)
    this.hitPosition = new THREE.Vector3()
    this.timer


    const rigidBodyDesc = RAPIER.RigidBodyDesc.kinematicPositionBased()

    this.cursor = this.app.physicsWorld.createRigidBody(rigidBodyDesc)

    // This should be replaced with a cone or something
    let hoverColDesc = RAPIER.ColliderDesc.ball(0.02)
    this.cursor.collider = this.app.physicsWorld.createCollider(
      hoverColDesc,
      this.cursor
    )

    this.cursor.setTranslation({ ...this.restPosition }, true)

    INPUT_COLLIDER_HANDLE_NAMES[this.cursor.collider.handle] = 'cursor-hover'

    this.app.renderer.domElement.addEventListener('click', this.onClick)
    this.app.renderer.domElement.addEventListener('mousemove', this.mouseOver)
  }

  update(deltaTime, frame) {
    this.leftHand.setMesh()
    this.rightHand.setMesh()

    this.leftHand.update()
    this.rightHand.update()
  }

  mouseOver = (event) => {
    this.pointerPosition.set(( event.clientX / window.innerWidth ) * 2 - 1,
      - ( event.clientY / window.innerHeight ) * 2 + 1,
      0.5)
      this.pointerPosition.unproject(this.app.user)
      this.pointerPosition.sub( this.app.user.position ).normalize();
      this.ray.origin = {...this.app.user.position}
      this.ray.dir = {...this.pointerPosition}
      this.hit = this.app.physicsWorld.castRay(this.ray, 100, true, null, null, null, this.cursor);

      if (this.hit != null) {

        this.hitPosition.copy(this.ray.pointAt(this.hit.toi))
        this.cursor.setTranslation({ ...this.hitPosition }, true)
      }
  }

  removeCursor = () => {
    this.cursor.setTranslation({ ...this.restPosition }, true)
  }

  onClick = (event) => {
    this.removeCursor()
    this.pointerPosition.set(( event.clientX / window.innerWidth ) * 2 - 1,
      - ( event.clientY / window.innerHeight ) * 2 + 1,
      0.5)
      this.pointerPosition.unproject(this.app.user)
      this.pointerPosition.sub( this.app.user.position ).normalize();
      this.ray.origin = {...this.app.user.position}
      this.ray.dir = {...this.pointerPosition}
      this.hit = this.app.physicsWorld.castRay(this.ray, 100, true, null, null, null, this.cursor);
      if (this.hit != null) {
        this.app.focusEntity = COLLIDER_ENTITY_MAP[this.hit.collider.handle]
        this.hitPosition.copy(this.ray.pointAt(this.hit.toi))
        this.app.focusEntity.object3D.worldToLocal(this.hitPosition)
        this.app.focusEntity.dispatchEvent(
          new CustomEvent(`click`, {
            bubbles: true,
            detail: {
              position: this.hitPosition
            },
          }))
      }
  }
}
