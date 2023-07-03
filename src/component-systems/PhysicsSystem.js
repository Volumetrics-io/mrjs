import * as THREE from 'three'
import * as AmmoLib from 'ammo.js'
import { System } from '../core/System.js'

// The physics system functions differently from other systems,
// Rather than attaching components, physical properties such as
// shape, body, mass, etc are definied as attributes. 
// if shape and body are not defined, they default to the geometry
// of the entity, if there is no geometry, there is no physics defined
// on the entity.
export class PhysicsSystem extends System {
  constructor() {
    super()
    this.ammoInitizialed = false
    this.gravity = 9.8
    this.tempTransform
    this.tempPosition = new THREE.Vector3()
    this.cache = []
    AmmoLib().then((Ammo) => {
      Ammo = Ammo
      this.initPhysicsWorld()
      this.ammoInitizialed = true

      this.tempTransform = new Ammo.btTransform()
      this.tempTransform.setIdentity()

      for (const pair of this.cache) {
        this.initPhysicsBody(pair.entity, pair.data)
      }
    })
  }

  update() {
    if (!this.ammoInitizialed) {
    }
  }

  // called when the component is initialized
  attachedComponent(entity, componentString) {
    const data = this.parseComponentString(componentString)
    this.initPhysicsBody(entity, data)
  }

  updatedComponent(entity, componentString) {
    const component = this.parseComponentString(componentString)
    console.log(
      `updated ${this.componentName} ${entity.getAttribute(this.componentName)}`
    )
  }

  // called when the component is removed
  detachedComponent(entity) {
    console.log(`detached ${this.componentName}`)
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

  initPhysicsBody = (entity, data) => {
    // cache data until ammo has initialized
    if (!this.ammoInitizialed) { 
        this.cache.push({ entity, data }) 
        return
    }
    let collisionShape

    switch (data.shape.toLowerCase()) {
      case 'sphere':
        collisionShape = new Ammo.btSphereShape(data.radius)
        break
      case 'box':
        collisionShape = new Ammo.btBoxShape(new Ammo.btVector3(data.size[0] / 2, data.size[1] / 2, data.size[2] / 2))
        break
      default:
        console.error('unsupported', error)
        break
    }

    // Create the transform for position and rotation
    const transform = new Ammo.btTransform()
    transform.setIdentity()

    entity.object3D.getWorldPosition(this.tempPosition)

    if ( data.offset ) { this.tempPosition.add(data.offset) }

    transform.setOrigin(new Ammo.btVector3(...this.tempPosition))
    transform.setRotation(new Ammo.btQuaternion(...entity.object3D.quaternion))

    // Create the motion state and set the transform
    const motionState = new Ammo.btDefaultMotionState(transform)

    // Define the body's properties
    const localInertia = new Ammo.btVector3(0, 0, 0)
    collisionShape.calculateLocalInertia(data.mass, localInertia)
    const rbInfo = new Ammo.btRigidBodyConstructionInfo(
      data.mass,
      motionState,
      collisionShape,
      localInertia
    )
    entity.object3D.userData.physicsBody = new Ammo.btRigidBody(rbInfo)
    this.physicsWorld.addRigidBody(entity.object3D.userData.physicsBody)
  }

  visualizePhysicsWorld() {
    // do that I guess
  }
}
