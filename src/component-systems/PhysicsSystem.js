import * as THREE from 'three'
import { System } from '../core/System.js'
import { Entity } from '../core/entity.js'
import { Environment } from '../core/environment.js'
import { parseVector } from '../utils/parser.js'


// The physics system functions differently from other systems,
// Rather than attaching components, physical properties such as
// shape, body, mass, etc are definied as attributes.
// if shape and body are not defined, they default to the geometry
// of the entity, if there is no geometry, there is no physics defined
// on the entity.
//
// Alternatively, you can also expressly attatch a comp-physics
// attribute for more detailed control.
export class PhysicsSystem extends System {
  constructor() {
    super()
    this.gravity = 9.8
    this.debug = this.environment.debug

    this.tempAmmoPosition = new Ammo.btVector3()
    this.tempPosition = new THREE.Vector3()
    this.tempQuaternion = new THREE.Quaternion()
    this.cache = []
    this.initPhysicsWorld()
    this.ammoInitizialed = true

    this.tempEntityTransform = new Ammo.btTransform()
    this.tempEntityTransform.setIdentity()

    this.tempFrameA = new Ammo.btTransform()
    this.tempFrameA.setIdentity()
    this.tempFrameB = new Ammo.btTransform()
    this.tempFrameB.setIdentity()

    const entities = this.environment.querySelectorAll('*')

    for (const entity of entities) {
      if (!(entity instanceof Entity)) {
        continue
      }
      this.initTransform(entity)
    }

    for (const entity of entities) {
      if (!(entity.parent instanceof Environment)) {
        continue
      }
      this.cloneHierarchy(entity)
    }

    if (this.debug) {
      this.visualizePhysicsWorld()
    }
  }

  update(deltaTime) {

    this.physicsWorld.stepSimulation(deltaTime, 10)

    for (const entity of this.registry) {
      const ms = entity.physics.body.getMotionState()

      if (ms) {
        if (entity.physics.data.update) {
          this.updatePhysicsBody(entity, ms)
          if (this.debug) {
            this.updateDebugViz(entity)
          }
          entity.physics.data.update = false
        }

        entity.object3D.getWorldPosition(this.tempPosition)
        entity.object3D.getWorldQuaternion(this.tempQuaternion)
        this.tempEntityTransform.setOrigin(new Ammo.btVector3(...this.tempPosition));
        this.tempEntityTransform.setRotation(new Ammo.btQuaternion(...this.tempQuaternion))

        ms.setWorldTransform(this.tempEntityTransform)
        ms.getWorldTransform(this.tempEntityTransform)
        const p = this.tempEntityTransform.getOrigin()
        const q = this.tempEntityTransform.getRotation()
        this.tempPosition.set(p.x(), p.y(), p.z())

        if (this.debug) {
          entity.debugViz.position.copy(this.tempPosition)
          entity.debugViz.quaternion.set(q.x(), q.y(), q.z(), q.w())
        }
      }
    }
  }

  initTransform(entity) {
    const position = entity.getAttribute('position')
    const scale = entity.getAttribute('scale')
    const rotation = entity.getAttribute('rotation')

    entity.width = entity.getAttribute('width') ?? entity.parent.width
    entity.height = entity.getAttribute('height') ?? 1
    entity.radius =
      entity.getAttribute('corner-radius') ?? entity.parent.radius ?? 0

    if (position) {
      entity.object3D.position.fromArray(parseVector(position))
    }

    if (scale) {
      entity.scale *= scale
      entity.object3D.scale.setScalar(scale)
      entity.traverse((child) => {
        child.physics.data.size = child.physics.data.size.map((x) => x * scale)
        child.physics.data.update = true
      })
    }

    if (rotation) {
      const euler = new THREE.Euler()
      const array = parseVector(rotation).map(radToDeg)
      euler.fromArray(array)
      entity.object3D.setRotationFromEuler(euler)
    }
  }

  initPhysicsWorld = () => {
    this.collisionConfiguration = new Ammo.btDefaultCollisionConfiguration()
    this.dispatcher = new Ammo.btCollisionDispatcher(
      this.collisionConfiguration
    )
    this.overlappingPairCache = new Ammo.btDbvtBroadphase()
    this.solver = new Ammo.btSequentialImpulseConstraintSolver()

    this.physicsWorld = new Ammo.btDiscreteDynamicsWorld(
      this.dispatcher,
      this.overlappingPairCache,
      this.solver,
      this.collisionConfiguration
    )
    this.physicsWorld.setGravity(new Ammo.btVector3(0, -this.gravity, 0))
  }

  updatePhysicsBody = (entity, ms) => {
    const { data } = entity.physics
    // Get the collision shape from the rigid body
    const collisionShape = entity.physics.body.getCollisionShape()

    // Check the type of the collision shape and set the size accordingly
    if (collisionShape instanceof Ammo.btBoxShape) {
      const newSize = new Ammo.btVector3(
        data.size[0] / 2,
        data.size[1] / 2,
        data.size[2] / 2
      ) // New size for the box shape
      collisionShape.setHalfExtentsWithMargin(newSize)
    }
  }

  createCollisionShape(data) {
    switch (data.shape.toLowerCase()) {
      case 'sphere':
        return new Ammo.btSphereShape(data.radius)
        break
      case 'box':
        return new Ammo.btBoxShape(
          new Ammo.btVector3(
            data.size[0] / 2,
            data.size[1] / 2,
            data.size[2] / 2
          )
        )
        break
      default:
        console.error('unsupported', error)
        break
    }
  }

  createRigidBody(entity, transform) {
    const collisionShape = this.createCollisionShape(entity.physics.data) // Create the appropriate Ammo.js collision shape for the parent object

    // Create the motion state and set the transform
    const motionState = new Ammo.btDefaultMotionState(transform)

    // Define the body's properties
    const localInertia = new Ammo.btVector3(0, 0, 0)
    collisionShape.calculateLocalInertia(entity.physics.data.mass, localInertia)
    const rbInfo = new Ammo.btRigidBodyConstructionInfo(
      entity.physics.data.mass,
      motionState,
      collisionShape,
      localInertia
    )
    entity.physics.body = new Ammo.btRigidBody(rbInfo)
  }

  cloneHierarchy(entity, parentTransform) {
    // Create Ammo.js motion state for the parent object
    const transform = new Ammo.btTransform()
    transform.setIdentity()
    entity.object3D.getWorldPosition(this.tempPosition)
    transform.setOrigin(new Ammo.btVector3(...this.tempPosition));
    transform.setRotation(new Ammo.btQuaternion(...entity.object3D.quaternion))

    this.createRigidBody(entity, transform)
    this.physicsWorld.addRigidBody(entity.physics.body)
    this.registry.add(entity)
    if (entity.parent.physics) {
      entity.physics.constraint = new Ammo.btGeneric6DofConstraint(
        entity.parent.physics.body,
        entity.physics.body,
        parentTransform,
        transform,
        true
      )
      this.physicsWorld.addConstraint(entity.physics.constraint)
    }

    // Iterate through the children of the parent object
    const children = Array.from(entity.children)
    for (const childEntity of children) {
      // Recursively translate the parent-child structure for the child object
      this.cloneHierarchy(childEntity, transform)
    }
  }

  updateDebugViz(entity) {
    entity.debugViz.geometry = new THREE.BoxGeometry(
      entity.physics.data.size[0],
      entity.physics.data.size[1],
      entity.physics.data.size[2]
    )
  }

  visualizePhysicsWorld() {
    for (const entity of this.registry) {
      const scale = entity.scale ?? 1
      const geometry = new THREE.BoxGeometry(
        entity.physics.data.size[0],
        entity.physics.data.size[1],
        entity.physics.data.size[2]
      )
      const material = new THREE.MeshBasicMaterial({ wireframe: true })
      material.color.setStyle('blue')
      entity.debugViz = new THREE.Mesh(geometry, material)
      this.environment.app.add(entity.debugViz)
    }
  }
}
