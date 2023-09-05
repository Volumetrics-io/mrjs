import * as THREE from 'three'
import { MRHand } from '../interaction/hand'
import System from '../core/System'
import { RAPIER, COLLIDER_ENTITY_MAP, COLLIDER_CURSOR_MAP} from '../component-systems/RapierPhysicsSystem'

export class ControlSystem extends System {
  constructor() {
    super()
    this.leftHand = new MRHand('left', this.app)
    this.rightHand = new MRHand('right', this.app)

    this.clickPoint = new THREE.Vector3()
    this.ray = new RAPIER.Ray({ x: 1.0, y: 2.0, z: 3.0 }, { x: 0.0, y: 1.0, z: 0.0 });
    this.hit

    this.app.renderer.domElement.addEventListener('click', this.onClick)
  }

  update(deltaTime) {
    this.leftHand.setMesh()
    this.rightHand.setMesh()

    this.leftHand.update()
    this.rightHand.update()
  }

  onClick = (event) => {
    this.clickPoint.set(( event.clientX / window.innerWidth ) * 2 - 1,
      - ( event.clientY / window.innerHeight ) * 2 + 1,
      0.5)
      this.clickPoint.unproject(this.app.user)
      this.clickPoint.sub( this.app.user.position ).normalize();
      this.ray.origin = {...this.app.user.position}
      this.ray.dir = {...this.clickPoint}
      this.hit = this.app.physicsWorld.castRay(this.ray, 100, true);
      if (this.hit != null) {
        this.app.focusEntity = COLLIDER_ENTITY_MAP[this.hit.collider.handle]
        console.log(this.app.focusEntity);
      }
  }
}
