import * as THREE from 'three'
import { System } from '../core/System.js'
import { Entity } from '../core/entity.js'
import { parseVector } from '../utils/parser.js'

export let RAPIER = null

export const JOINT_COLLIDER_HANDLE_NAMES = {}
export const COLLIDER_ENTITY_MAP = {}

// The physics system functions differently from other systems,
// Rather than attaching components, physical properties such as
// shape, body, mass, etc are definied as attributes.
// if shape and body are not defined, they default to the geometry
// of the entity, if there is no geometry, there is no physics defined
// on the entity.
//
// Alternatively, you can also expressly attatch a comp-physics
// attribute for more detailed control.
export class RapierPhysicsSystem extends System {
  constructor() {
    super()
    this.debug = this.app.debug
    this.tempWorldPosition = new THREE.Vector3()
    this.tempWorldScale = new THREE.Vector3()
    this.tempWorldQuaternion = new THREE.Quaternion()
    this.tempHalfExtents = new THREE.Vector3()

    this.eventQueue = new RAPIER.EventQueue(true);

    const entities = this.app.querySelectorAll('*')

    if (this.debug && this.debug == "true") {
      const material = new THREE.LineBasicMaterial({
        color: 0xffffff,
        vertexColors: true,
      })
      const geometry = new THREE.BufferGeometry()
      this.lines = new THREE.LineSegments(geometry, material)
      this.app.scene.add(this.lines)
    }
  }

  update(deltaTime) {
    this.app.physicsWorld.step(this.eventQueue);

    this.eventQueue.drainCollisionEvents((handle1, handle2, started) => {
      /* Handle the collision event. */
      let joint = JOINT_COLLIDER_HANDLE_NAMES[handle1] ?? JOINT_COLLIDER_HANDLE_NAMES[handle2]
      let entity =  COLLIDER_ENTITY_MAP[handle1] ??  COLLIDER_ENTITY_MAP[handle2]
      if (joint && entity){
        entity.dispatchEvent(
          new CustomEvent(`touch-${started ? 'start' : 'end'}`, {
            bubbles: true,
            detail: {
              joint: joint
            },
          })
        )
      }
    });

    for (const entity of this.registry) {
      if (entity.physics.update) {
        this.updateBody(entity)
        entity.physics.update = false
      }
    }

    this.updateDebugRenderer()
  }

  onNewEntity(entity) {
    if (!entity.object3D.isMesh) {
      return
    }
    this.initPhysicsBody(entity)
    this.registry.add(entity)
  }

  initPhysicsBody(entity) {
    entity.physics = {}

    entity.object3D.geometry.computeBoundingBox()
    entity.object3D.userData.bbox.copy(entity.object3D.geometry.boundingBox)
    entity.object3D.userData.bbox.applyMatrix4(entity.object3D.matrixWorld)
    entity.object3D.userData.bbox.getSize(entity.object3D.userData.size)

    entity.object3D.getWorldPosition(this.tempWorldPosition)
    entity.object3D.getWorldQuaternion(this.tempWorldQuaternion)
    const rigidBodyDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(
      ...this.tempWorldPosition
    )
    entity.physics.body = this.app.physicsWorld.createRigidBody(rigidBodyDesc)
    entity.physics.body.setRotation(...this.tempWorldQuaternion)

    // Create a cuboid collider attached to the dynamic rigidBody.
    this.tempHalfExtents.copy(entity.object3D.userData.size)
    this.tempHalfExtents.divideScalar(2)
    const colliderDesc = RAPIER.ColliderDesc.cuboid(...this.tempHalfExtents)
    entity.physics.collider = this.app.physicsWorld.createCollider(
      colliderDesc,
      entity.physics.body
    )

    COLLIDER_ENTITY_MAP[entity.physics.collider.handle] = entity

    entity.physics.collider.setActiveCollisionTypes(RAPIER.ActiveCollisionTypes.DEFAULT|
      RAPIER.ActiveCollisionTypes.KINEMATIC_FIXED);
    entity.physics.collider.setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);

  }

  updateBody(entity) {
    entity.object3D.getWorldPosition(this.tempWorldPosition)
    entity.physics.body.setTranslation({ ...this.tempWorldPosition }, true)

    entity.object3D.getWorldQuaternion(this.tempWorldQuaternion)
    entity.physics.body.setRotation(this.tempWorldQuaternion, true)

    entity.object3D.geometry.computeBoundingBox()
    entity.object3D.userData.bbox.copy(entity.object3D.geometry.boundingBox)
    this.tempWorldScale.setFromMatrixScale(entity.object3D.matrixWorld)
    entity.object3D.userData.bbox.getSize(entity.object3D.userData.size)
    entity.object3D.userData.size.multiply(this.tempWorldScale)

    this.tempHalfExtents.copy(entity.object3D.userData.size)
    this.tempHalfExtents.divideScalar(2)

    entity.physics.collider.setHalfExtents(this.tempHalfExtents)
  }

  updateDebugRenderer() {
    if(!this.debug || this.debug == "false") { return }
    const buffers = this.app.physicsWorld.debugRender()
    this.lines.geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(buffers.vertices, 3)
    )
    this.lines.geometry.setAttribute(
      'color',
      new THREE.BufferAttribute(buffers.colors, 4)
    )
  }
}
