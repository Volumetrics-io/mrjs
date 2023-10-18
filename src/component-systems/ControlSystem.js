import * as THREE from 'three'
import { RAPIER } from '../core/rapier'
import { MRHand } from '../interaction/hand'
import System from '../core/System'
import { COLLIDER_ENTITY_MAP, INPUT_COLLIDER_HANDLE_NAMES} from '../component-systems/RapierPhysicsSystem'

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
    let colDesc = RAPIER.ColliderDesc.ball(0.0001)

    this.cursorClick = this.app.physicsWorld.createRigidBody(rigidBodyDesc)
    this.cursorHover = this.app.physicsWorld.createRigidBody(rigidBodyDesc)

    this.cursorHover.collider = this.app.physicsWorld.createCollider(
      colDesc,
      this.cursorHover
    )
    this.cursorClick.collider = this.app.physicsWorld.createCollider(
      colDesc,
      this.cursorClick
    )

    this.cursorClick.setTranslation({ ...this.restPosition }, true)
    this.cursorHover.setTranslation({ ...this.restPosition }, true)

    INPUT_COLLIDER_HANDLE_NAMES[this.cursorClick.collider.handle] = 'cursor'
    INPUT_COLLIDER_HANDLE_NAMES[this.cursorHover.collider.handle] = 'cursor-hover'

    this.cursor = this.cursorHover


    this.app.renderer.domElement.addEventListener('click', this.onClick)
    this.app.renderer.domElement.addEventListener('mousedown', this.onMouseDown)
    this.app.renderer.domElement.addEventListener('mouseup', this.onMouseUp)
    this.app.renderer.domElement.addEventListener('mousemove', this.mouseOver)

    this.app.renderer.domElement.addEventListener('touchstart', this.onMouseDown)
    this.app.renderer.domElement.addEventListener('touchend', this.onMouseUp)
    this.app.renderer.domElement.addEventListener('touchmove', this.mouseOver)
  }

  update(deltaTime, frame) {
    this.leftHand.setMesh()
    this.rightHand.setMesh()

    this.leftHand.update()
    this.rightHand.update()
  }

  mouseOver = (event) => {
    event.stopPropagation()
    
      this.hit = this.castRay(event)

      if (this.hit != null) {

        this.hitPosition.copy(this.ray.pointAt(this.hit.toi))
        this.cursor.setTranslation({ ...this.hitPosition }, true)
      }
  }

  castRay(event) {
    let x = 0
    let y = 0
    if (event.type.includes('touch')){
      x = event.touches[0].clientX
      y = event.touches[0].clientY
    } else {
      x = event.clientX
      y = event.clientY
    }

    if(this.app.user instanceof THREE.OrthographicCamera) {
      this.pointerPosition.set( ( x / window.innerWidth ) * 2 - 1, - ( y / window.innerHeight ) * 2 + 1, - 1 ); // z = - 1 important!
      this.pointerPosition.unproject( this.app.user );
      let direction = new THREE.Vector3(0, 0, -1)
      direction.transformDirection( this.app.user.matrixWorld );

      this.ray.origin = {...this.pointerPosition}
      this.ray.dir = {...direction}

    } else {
      this.pointerPosition.set(( x / window.innerWidth ) * 2 - 1,
      - ( y / window.innerHeight ) * 2 + 1,
      0.5)
      this.pointerPosition.unproject(this.app.user)
      this.pointerPosition.sub( this.app.user.position ).normalize();
      this.ray.origin = {...this.app.user.position}
      this.ray.dir = {...this.pointerPosition}
    }

      return this.app.physicsWorld.castRay(this.ray, 100, true, null, null, null, this.cursor);
  }

  removeCursor = () => {
    this.cursorHover.setTranslation({ ...this.restPosition }, true)
    this.cursorClick.setTranslation({ ...this.restPosition }, true)
  }

  onMouseDown = (event) => {
    event.stopPropagation()
    this.removeCursor()

    this.cursor = this.cursorClick

    this.hit = this.castRay(event)

    if (this.hit != null) {
      this.hitPosition.copy(this.ray.pointAt(this.hit.toi))
      this.cursor.setTranslation({ ...this.hitPosition }, true)
    }
  }

  onMouseUp = (event) => {
    event.stopPropagation()
    this.removeCursor()
    this.cursor = this.cursorHover
  }

  // onClick = (event) => {
  //   this.removeCursor()
  //   this.cursor = this.cursorClick

  //     this.hit = this.castRay(event)
  //     if (this.hit != null) {
  //       this.app.focusEntity = COLLIDER_ENTITY_MAP[this.hit.collider.handle]
  //     }
  // }
}
