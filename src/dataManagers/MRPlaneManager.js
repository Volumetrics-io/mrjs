import { mrjsUtils } from 'mrjs';
import { MRPlane } from 'mrjs/dataTypes/MRPlane';

/**
 * @class MRPlaneManager
 * @classdesc creates and manages the mr.js representation of XR planes.
 * The resulting planes have RAPIER rigid bodies and THREE.js meshes that occlude virtual content by default
 */
export class MRPlaneManager {
    /**
     *
     * @param scene
     * @param physicsWorld
     */
    constructor(scene, physicsWorld) {
        // TODO: add app level controls for:
        // - planes
        // - mesh

        this.scene = scene;
        this.physicsWorld = physicsWorld;

        this.matrix = new THREE.Matrix4();

        this.currentPlanes = new Map();

        this.tempPosition = new THREE.Vector3();
        this.tempQuaternion = new THREE.Quaternion();
        this.tempScale = new THREE.Vector3();

        this.tempDimensions = new THREE.Vector3();

        document.addEventListener('exitXR', () => {
            for (const [plane, mrplane] of this.currentPlanes) {
                mrplane.mesh.geometry.dispose();
                mrplane.mesh.material.dispose();
                this.scene.remove(mrplane.mesh);

                this.physicsWorld.removeRigidBody(mrplane.body);

                this.currentPlanes.delete(plane);
            }
        });

        mrjsUtils.xr.addEventListener('planesdetected', (event) => {
            const planes = event.data.detectedPlanes;

            mrjsUtils.xr.session.requestAnimationFrame((t, frame) => {
                for (const plane of planes) {
                    if (this.currentPlanes.has(plane) === false) {
                        const pose = frame.getPose(plane.planeSpace, mrjsUtils.xr.referenceSpace);
                        this.matrix.fromArray(pose.transform.matrix);
                        this.matrix.decompose(this.tempPosition, this.tempQuaternion, this.tempScale);

                        const polygon = plane.polygon;

                        let minX = Number.MAX_SAFE_INTEGER;
                        let maxX = Number.MIN_SAFE_INTEGER;
                        let minZ = Number.MAX_SAFE_INTEGER;
                        let maxZ = Number.MIN_SAFE_INTEGER;

                        for (const point of polygon) {
                            minX = Math.min(minX, point.x);
                            maxX = Math.max(maxX, point.x);
                            minZ = Math.min(minZ, point.z);
                            maxZ = Math.max(maxZ, point.z);
                        }

                        const width = maxX - minX;
                        const height = maxZ - minZ;

                        let mrPlane = new MRPlane();

                        mrPlane.label = plane.semanticLabel;
                        mrPlane.orientation = plane.orientation;
                        mrPlane.dimensions.setX(width);
                        mrPlane.dimensions.setY(0.001);
                        mrPlane.dimensions.setZ(height);

                        const geometry = new THREE.BoxGeometry(width, 0.01, height);
                        const material = new THREE.MeshBasicMaterial({ color: 0xffffff });

                        mrPlane.mesh = new THREE.Mesh(geometry, material);
                        mrPlane.mesh.position.setFromMatrixPosition(this.matrix);
                        mrPlane.mesh.quaternion.setFromRotationMatrix(this.matrix);
                        mrPlane.mesh.material.colorWrite = false;
                        mrPlane.mesh.renderOrder = 2;
                        this.scene.add(mrPlane.mesh);

                        this.tempDimensions.setX(width / 2);
                        this.tempDimensions.setY(0.01);
                        this.tempDimensions.setZ(height / 2);

                        mrPlane.body = this.initPhysicsBody(plane);

                        this.currentPlanes.set(plane, mrPlane);
                    }
                }
            });
        });
    }

    /**
     * @function
     * @description initializes the physics body of an MR Plane
     * @param plane
     */
    initPhysicsBody(plane) {
        const rigidBodyDesc = mrjsUtils.Physics.RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(...this.tempPosition);
        let colliderDesc = mrjsUtils.Physics.RAPIER.ColliderDesc.cuboid(...this.tempDimensions);
        colliderDesc.setCollisionGroups(mrjsUtils.Physics.CollisionGroups.PLANES);
        let body = this.physicsWorld.createRigidBody(rigidBodyDesc);
        body.setRotation(this.tempQuaternion, true);
        let collider = this.physicsWorld.createCollider(colliderDesc, body);

        collider.setActiveCollisionTypes(mrjsUtils.Physics.RAPIER.ActiveCollisionTypes.DEFAULT | mrjsUtils.Physics.RAPIER.ActiveCollisionTypes.KINEMATIC_FIXED);
        collider.setActiveEvents(mrjsUtils.Physics.RAPIER.ActiveEvents.COLLISION_EVENTS);

        return body;
    }
}
