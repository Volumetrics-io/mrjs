import { mrjsUtils } from 'mrjs';
import { MRPlane } from 'mrjs/dataTypes/MRPlane';

const PLANE_LABELS = ['floor', 'wall', 'ceiling', 'table', 'desk', 'couch', 'door', 'window', 'shelf', 'bed', 'screen', 'lamp', 'plant', 'wall art', 'other']

/**
 * @class MRPlaneManager
 * @classdesc creates and manages the MRjs representation of XR planes.
 * The resulting planes have RAPIER rigid bodies and THREE.js meshes that occlude virtual content by default
 */
export class MRPlaneManager {
    /**
     *
     * @param scene
     * @param physicsWorld
     */
    constructor(scene, physicsWorld, occlusion) {
        // TODO: add app level controls for:
        // - planes
        // - mesh

        this.occlusion = !occlusion || occlusion == "true"

        this.scene = scene;
        this.physicsWorld = physicsWorld;

        this.matrix = new THREE.Matrix4();

        this.currentPlanes = new Map();

        this.planeDictionary = {}

        for(const label of PLANE_LABELS) {
            this.planeDictionary[label] = new Set();
        }

        this.tempPosition = new THREE.Vector3();
        this.tempQuaternion = new THREE.Quaternion();
        this.tempScale = new THREE.Vector3();

        this.tempDimensions = new THREE.Vector3();

        let floorPlane = {
            semanticLabel: 'floor',
            orientation: 'horizontal'
        }

        let floorMRPlane = this.initPlane(floorPlane, 10, 10)

        floorMRPlane.mesh.geometry = new THREE.CircleGeometry(2, 32)
        floorMRPlane.mesh.position.set(0,0,0)
        floorMRPlane.mesh.rotation.x = - Math.PI / 2

        floorMRPlane.mesh.visible = false
        floorMRPlane.body.setEnabled(false);

        document.addEventListener('enterxr', () => {
            floorMRPlane.mesh.visible = true
            floorMRPlane.body.setEnabled(true);
        });

        document.addEventListener('exitxr', () => {
            for (const [plane, mrplane] of this.currentPlanes) {
                this.removePlane(plane, mrplane)
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

                        if(plane.semanticLabel == 'floor') {
                            this.removePlane(floorPlane, floorMRPlane)
                        }

                        this.initPlane(plane, width, height)
                    }
                }
            });
        });
    }

    initPlane(plane, width, height) {
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

        mrPlane.mesh.visible = this.occlusion;

        this.tempDimensions.setX(width / 2);
        this.tempDimensions.setY(0.01);
        this.tempDimensions.setZ(height / 2);

        mrPlane.body = this.initPhysicsBody();

        this.currentPlanes.set(plane, mrPlane);
        this.planeDictionary[mrPlane.label].add(mrPlane)
        return mrPlane
    }

    removePlane(plane, mrplane) {
        mrplane.mesh.geometry.dispose();
        mrplane.mesh.material.dispose();
        this.scene.remove(mrplane.mesh);

        this.physicsWorld.removeRigidBody(mrplane.body);

        this.currentPlanes.delete(plane);
        this.planeDictionary[mrplane.label].delete(mrplane)
    }

    /**
     * @function
     * @description initializes the physics body of an MR Plane
     * @param plane
     */
    initPhysicsBody() {
        const rigidBodyDesc = mrjsUtils.physics.RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(...this.tempPosition);
        let colliderDesc = mrjsUtils.physics.RAPIER.ColliderDesc.cuboid(...this.tempDimensions);
        colliderDesc.setCollisionGroups(mrjsUtils.physics.CollisionGroups.PLANES);
        let body = this.physicsWorld.createRigidBody(rigidBodyDesc);
        body.setRotation(this.tempQuaternion, true);
        let collider = this.physicsWorld.createCollider(colliderDesc, body);

        collider.setActiveCollisionTypes(mrjsUtils.physics.RAPIER.ActiveCollisionTypes.DEFAULT | mrjsUtils.physics.RAPIER.ActiveCollisionTypes.KINEMATIC_FIXED);
        collider.setActiveEvents(mrjsUtils.physics.RAPIER.ActiveEvents.COLLISION_EVENTS);

        return body;
    }
}
