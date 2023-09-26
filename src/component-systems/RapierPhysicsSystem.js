import * as THREE from 'three'
import System from '../core/System.js'
import { MRUIEntity } from '../UI/UIEntity.js'

export let RAPIER = null

export const JOINT_COLLIDER_HANDLE_NAMES = {}
export const COLLIDER_CURSOR_MAP = {}
export const COLLIDER_ENTITY_MAP = {}
export const COLLIDER_TOOL_MAP = {}

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

  update(deltaTime, frame) {
    this.app.physicsWorld.step(this.eventQueue);

    this.eventQueue.drainCollisionEvents((handle1, handle2, started) => {
      /* Handle the collision event. */

      if(started) {
        this.onContactStart(handle1, handle2)
      } else {
        this.onContactEnd(handle1, handle2)
      }

    });

    for (const entity of this.registry) {
      if (entity.physics?.body == null) { continue }
      this.updateBody(entity)

      if (entity.touch && !entity.grabbed){
        this.app.physicsWorld.contactsWith(entity.physics.collider, (collider2) => {
          let joint = JOINT_COLLIDER_HANDLE_NAMES[collider2.handle]

          if (joint) {
            entity.onTouch(joint, collider2.translation())
          }
        })
      }

      if (entity.grabbed){
        this.app.physicsWorld.contactsWith(entity.physics.collider, (collider2) => {
          let cursor = COLLIDER_CURSOR_MAP[collider2.handle]

          if (cursor) {
            entity.onGrab(collider2.translation())
          }
        })
      }
    }

    this.updateDebugRenderer()
  }

  onContactStart = ( handle1, handle2 ) => {
    let collider1 = this.app.physicsWorld.colliders.get(handle1)
    let collider2 = this.app.physicsWorld.colliders.get(handle2)

    let joint = JOINT_COLLIDER_HANDLE_NAMES[handle1]
    let entity =  COLLIDER_ENTITY_MAP[handle2]

    if (joint && entity){
      this.touchStart(collider1, collider2, entity)
      return
    }

    let cursor = COLLIDER_CURSOR_MAP[handle1]

    if(cursor){
      let tool = COLLIDER_TOOL_MAP[handle2] 

      if (tool) {
        tool.grabbed = true
        return
      }

      if (entity) {
        this.grab(collider1, collider2, entity)
        return
      }
    }

  }

  onContactEnd(handle1, handle2) {
    let joint = JOINT_COLLIDER_HANDLE_NAMES[handle1]
    let cursor =  COLLIDER_CURSOR_MAP[handle1]
    let entity =  COLLIDER_ENTITY_MAP[handle2]

    if (joint && entity){
      this.touchEnd(entity)
      return
    }

    if(cursor){
      let tool = COLLIDER_TOOL_MAP[handle2] 
      console.log(COLLIDER_TOOL_MAP);

      if (tool) {
        tool.grabbed = false
        return
      }

      if (entity) {
        this.release(entity)
        return
      }
    }
  }

  touchStart = (collider1, collider2, entity) => {
    entity.touch = true
    this.app.physicsWorld.contactPair(collider1, collider2, (manifold, flipped) => {
      // Contact information can be read from `manifold`. 
      entity.dispatchEvent(
        new CustomEvent(`touch-start`, {
          bubbles: true,
          detail: {
            position: manifold.localContactPoint2(0)
          },
        })
      )
   });
  }

  touchEnd = (entity) => {
      // Contact information can be read from `manifold`. 
      entity.touch = false
      entity.dispatchEvent(
        new CustomEvent(`touch-end`, {
          bubbles: true,
        })
      )
  }

  grab = (collider1, collider2, entity) => {
    entity.grabbed = true
    this.app.physicsWorld.contactPair(collider1, collider2, (manifold, flipped) => {
      // Contact information can be read from `manifold`. 
      entity.dispatchEvent(
        new CustomEvent(`grab`, {
          bubbles: true,
          detail: {
            position: manifold.localContactPoint2(0)
          },
        })
      )
   });
  }

  release = (entity) => {
    entity.grabbed = false
      // Contact information can be read from `manifold`. 
    entity.dispatchEvent(
      new CustomEvent(`release`, {
        bubbles: true
      })
    )
  }

  onNewEntity(entity) {
    this.initPhysicsBody(entity)
    this.registry.add(entity)
  }

  initPhysicsBody(entity) {
    if(entity.physics.type == 'none') { return }
    entity.updatePhysicsData()

    entity.object3D.getWorldPosition(this.tempWorldPosition)
    entity.object3D.getWorldQuaternion(this.tempWorldQuaternion)
    const rigidBodyDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(
      ...this.tempWorldPosition
    )
    entity.physics.body = this.app.physicsWorld.createRigidBody(rigidBodyDesc)
    entity.physics.body.setRotation(this.tempWorldQuaternion, true)

    // Create a cuboid collider attached to the dynamic rigidBody.
    const colliderDesc = this.initColliderDesc(entity.physics)
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
    if(entity.physics.type == 'none') { return }
    entity.object3D.getWorldPosition(this.tempWorldPosition)
    entity.physics.body.setTranslation({ ...this.tempWorldPosition }, true)

    entity.object3D.getWorldQuaternion(this.tempWorldQuaternion)
    entity.physics.body.setRotation(this.tempWorldQuaternion, true)

    entity.updatePhysicsData()
    this.updateCollider(entity)

  }

  initColliderDesc(physicsData) {
    switch (physicsData.type) {
      case 'box':
      case 'ui':
        return RAPIER.ColliderDesc.cuboid(...physicsData.halfExtents)    
      default:
        break;
    }
  }

  updateCollider(entity) {
    switch (entity.physics.type) {
      case 'box':
      case 'ui':
        entity.physics.collider.setHalfExtents(entity.physics.halfExtents)
        break
      default:
        break;
    }
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
