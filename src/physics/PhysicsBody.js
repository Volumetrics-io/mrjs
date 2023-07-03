export class PhysicsBody {
  constructor(data) {
    this.body = this.deserialize(data)
  }

  deserialize(bodyData) {
    // Create the collision shape based on the type
    let collisionShape

    switch (bodyData.shape.toLowerCase()) {
      case 'sphere':
        collisionShape = new Ammo.btSphereShape(bodyData.radius)
        break
      case 'box':
        collisionShape = new Ammo.btBoxShape(new Ammo.btVector3(1, 1, 1))
        break
      default:
        console.error('unsupported', error)
        break
      // case "convexhull":
      // collisionShape = new Ammo.btConvexHullShape(); // Add your desired points using addPoint() method
      // break;
      // case "convextrianglemesh":
      // collisionShape = new Ammo.btConvexTriangleMeshShape(); // Initialize with your desired triangle mesh
      // break;
      // case "bvhtrianglemesh":
      // collisionShape = new Ammo.btBvhTriangleMeshShape(); // Initialize with your desired triangle mesh
      // break;
      // case "terrain":
      // collisionShape = new Ammo.btHeightfieldTerrainShape(); // Initialize with your desired parameters
      // break;
      // default:
      // console.log("Unknown shape type.");
      // break;
    }

    // Create the transform for position and rotation
    const transform = new Ammo.btTransform()
    transform.setIdentity()
    transform.setOrigin(new Ammo.btVector3(...bodyData.position))
    transform.setRotation(new Ammo.btQuaternion(...bodyData.rotation))

    // Create the motion state and set the transform
    const motionState = new Ammo.btDefaultMotionState(transform)

    // Define the body's properties
    const localInertia = new Ammo.btVector3(0, 0, 0)
    collisionShape.calculateLocalInertia(bodyData.mass, localInertia)
    const rbInfo = new Ammo.btRigidBodyConstructionInfo(
      bodyData.mass,
      motionState,
      collisionShape,
      localInertia
    )
    const body = new Ammo.btRigidBody(rbInfo)

    return body
  }

  serialize(body) {
    const bodyData = {
      type: body.getCollisionShape().constructor.name, // Shape type
      mass: body.getMass(),
      position: body.getWorldTransform().getOrigin().toArray(), // [x, y, z] position
      rotation: body.getWorldTransform().getRotation().toArray(), // [x, y, z, w] quaternion rotation
      linearVelocity: body.getLinearVelocity().toArray(), // [x, y, z] linear velocity
      angularVelocity: body.getAngularVelocity().toArray(), // [x, y, z] angular velocity
    }

    return JSON.stringify(bodyData)
  }
}
