import * as THREE from 'three'
import * as AmmoLib from 'ammo.js'
import { System } from '../core/System.js'
import { Surface } from '../entities/Surface.js'
import { Entity } from '../core/entity.js'
import { Row } from '../entities/layout/Row.js'
import { Column } from '../entities/layout/Column.js'
import Volume from '../entities/Volume.js'
import { Environment } from '../core/environment.js'

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
    this.ammoInitizialed = false
    this.gravity = 9.8
    this.debug = true

    this.tempTransform
    this.tempAmmoPosition
    this.tempPosition = new THREE.Vector3()
    this.cache = []
    AmmoLib().then((Ammo) => {
      Ammo = Ammo
      this.initPhysicsWorld()
      this.ammoInitizialed = true

      this.tempTransform = new Ammo.btTransform()
      this.tempTransform.setIdentity()

      let entities = this.environment.querySelectorAll('*')

      for (let entity of entities) {
        if (!(entity.parent instanceof Environment)) { continue }

        this.cloneHierarchy(entity)

      }

      if(this.debug) { this.visualizePhysicsWorld() }
    })
  }

  update(deltaTime) {
    if (!this.ammoInitizialed) { return }

    this.physicsWorld.stepSimulation( deltaTime, 10 );


    for (let entity of this.registry) {

        let ms = entity.physics.body.getMotionState();

        if ( ms ) {

          if (entity.physics.data.update){
            this.updatePhysicsBody(entity, ms)
            entity.physics.data.update = false
            
          }

            ms.getWorldTransform( this.tempTransform );
            const p = this.tempTransform.getOrigin();
            const q = this.tempTransform.getRotation();
            this.tempPosition.set( p.x(), p.y(), p.z() );

            if (this.debug){
              entity.debugViz.position.copy(this.tempPosition)
              entity.debugViz.quaternion.set( -q.x(), -q.y(), q.z(), q.w() );

            }

            if (entity.object3D.parent){
              entity.object3D.parent.worldToLocal(this.tempPosition)
            }

            entity.object3D.position.copy( this.tempPosition );
            entity.object3D.quaternion.set( -q.x(), -q.y(), q.z(), q.w() );


        }
    }
  }

  initPhysicsWorld = () => {
    this.tempTransform = new Ammo.btTransform();

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

    let data = entity.physics.data
    // Get the collision shape from the rigid body
    let collisionShape = entity.physics.body.getCollisionShape();

    // Check the type of the collision shape and set the size accordingly
    if (collisionShape instanceof Ammo.btBoxShape) {
      const newSize = new Ammo.btVector3(data.size[0] / 2, data.size[1] / 2, data.size[2] / 2); // New size for the box shape
      collisionShape.setHalfExtentsWithMargin(newSize);
    }
    // TODO: more collision shape support
  }

  createCollisionShape(data) {
    switch (data.shape.toLowerCase()) {
      case 'sphere':
        return new Ammo.btSphereShape(data.radius)
        break
      case 'box':
        return new Ammo.btBoxShape(new Ammo.btVector3(data.size[0] / 2, data.size[1] / 2, data.size[2] / 2))
        break
      default:
        console.error('unsupported', error)
        break
    }
  }

  createRigidBody(entity, transform){
    const collisionShape = this.createCollisionShape(entity.physics.data); // Create the appropriate Ammo.js collision shape for the parent object
  
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

  cloneHierarchy(parentEntity, parentTransform) {

    // Create Ammo.js motion state for the parent object
    const transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setFromOpenGLMatrix(parentEntity.object3D.matrixWorld.elements);

    this.createRigidBody(parentEntity, transform)
    this.physicsWorld.addRigidBody(parentEntity.physics.body)
    this.registry.add(parentEntity)
    if ( parentEntity.parent.physics){
      parentEntity.physics.constraint = new Ammo.btGeneric6DofConstraint(parentEntity.parent.physics.body, parentEntity.physics.body, parentTransform, transform, true);
      this.physicsWorld.addConstraint(parentEntity.physics.constraint)
    }
  
    // Iterate through the children of the parent object
    let children = Array.from(parentEntity.children)
    for (const entity of children) {
      // Recursively translate the parent-child structure for the child object
      this.cloneHierarchy(entity, transform);  
    }
  }
  

  visualizePhysicsWorld() {
    for( let entity of this.registry ) {
      let scale = entity.scale ?? 1
      const geometry = new THREE.BoxGeometry(entity.physics.data.size[0], entity.physics.data.size[1], entity.physics.data.size[2]); 
      const material = new THREE.MeshBasicMaterial( {wireframe: true}); 
      material.color.setStyle('blue')
      entity.debugViz = new THREE.Mesh( geometry, material ); 
      this.environment.app.add( entity.debugViz );

    }
  }
}
