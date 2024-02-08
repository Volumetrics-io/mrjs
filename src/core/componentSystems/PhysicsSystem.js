import * as THREE from 'three';

import { MRSystem } from 'mrjs/core/MRSystem';
import { MREntity } from 'mrjs/core/MREntity';

import { mrjsUtils } from 'mrjs';
import { MRDivEntity } from '../MRDivEntity';
import { MRPanel } from '../entities/MRPanel';
import { MRModel } from '../entities/MRModel';

/**
 * @class PhysicsSystem
 * @classdesc The physics system functions differently from other systems,
 * Rather than attaching components, physical properties such as
 * shape, body, mass, etc are definied as attributes.
 * if shape and body are not defined, they default to the geometry
 * of the entity, if there is no geometry, there is no physics defined
 * on the entity.
 *
 * Alternatively, you can also expressly attach a comp-physics
 * attribute for more detailed control.
 * @augments MRSystem
 */
export class PhysicsSystem extends MRSystem {
    /**
     * @class
     * @description PhysicsSystem's default constructor - sets up useful world and debug information alongside an initial `Rapier` event queue.
     */
    constructor() {
        super(false);
        this.debug = this.app.debug;
        this.tempWorldPosition = new THREE.Vector3();
        this.tempWorldQuaternion = new THREE.Quaternion();

        this.currentEntity = null;

        this.tempWorldScale = new THREE.Vector3();
        this.tempBBox = new THREE.Box3();
        this.tempSize = new THREE.Vector3();


        if (this.debug && this.debug == 'true') {
            const material = new THREE.LineBasicMaterial({
                color: 0xffffff,
                vertexColors: true,
            });
            const geometry = new THREE.BufferGeometry();
            this.lines = new THREE.LineSegments(geometry, material);
            this.app.scene.add(this.lines);
        }
    }

    /**
     * @function
     * @description The generic system update call. Based on the captured physics events for the frame, handles all items appropriately.
     * @param {number} deltaTime - given timestep to be used for any feature changes
     * @param {object} frame - given frame information to be used for any feature changes
     */
    update(deltaTime, frame) {
        this.app.physicsWorld.step(mrjsUtils.Physics.eventQueue);

        for (const entity of this.registry) {
            if (entity.physics?.body == null) {
                continue;
            }
            this.updateBody(entity);

        }

        this.updateDebugRenderer();
    }


    /**
     * @function
     * @description When a new entity is created, adds it to the physics registry and initializes the physics aspects of the entity.
     * @param {MREntity} entity - the entity being set up
     */
    onNewEntity(entity) {
        if (entity.physics.type == 'none') {
            return;
        }

        if(entity instanceof MRDivEntity) {
            this.initPhysicsBody(entity);
            this.registry.add(entity);
        }
    }

    /**
     * @function
     * @description Initializes the rigid body used by the physics part of the entity
     * @param {MREntity} entity - the entity being updated
     */
    initPhysicsBody(entity) {

        if(entity instanceof MRModel){
            this.initSimpleBody(entity)

        } else if( entity instanceof MRDivEntity) {
            this.initUIEntityBody(entity)
        }

        entity.object3D.getWorldPosition(this.tempWorldPosition);
        entity.object3D.getWorldQuaternion(this.tempWorldQuaternion);

        entity.physics.body.setTranslation(...this.tempWorldPosition, true);
        entity.physics.body.setRotation(this.tempWorldQuaternion, true);

    }

    /**
     * @function
     * @description Initializes the rigid body used by the physics for div or Model entity
     * @param {MREntity} entity - the entity being updated
     */
    initUIEntityBody(entity) {
        entity.physics.halfExtents = new THREE.Vector3()
        this.tempBBox.setFromCenterAndSize(entity.object3D.position, new THREE.Vector3(entity.width, entity.height, 0.002));

        this.tempWorldScale.setFromMatrixScale(entity.object3D.matrixWorld);
        this.tempBBox.getSize(this.tempSize);
        this.tempSize.multiply(this.tempWorldScale);

        entity.physics.halfExtents.copy(this.tempSize);
        entity.physics.halfExtents.divideScalar(2);

        const rigidBodyDesc = mrjsUtils.Physics.RAPIER.RigidBodyDesc.fixed()
        entity.physics.body = this.app.physicsWorld.createRigidBody(rigidBodyDesc);

        let colliderDesc = mrjsUtils.Physics.RAPIER.ColliderDesc.cuboid(...entity.physics.halfExtents);
        colliderDesc.setCollisionGroups(mrjsUtils.Physics.CollisionGroups.UI);
        entity.physics.collider = this.app.physicsWorld.createCollider(colliderDesc, entity.physics.body);
        mrjsUtils.Physics.COLLIDER_ENTITY_MAP[entity.physics.collider.handle] = entity;
        entity.physics.collider.setActiveCollisionTypes(mrjsUtils.Physics.RAPIER.ActiveCollisionTypes.DEFAULT | mrjsUtils.Physics.RAPIER.ActiveCollisionTypes.KINEMATIC_FIXED);
        entity.physics.collider.setActiveEvents(mrjsUtils.Physics.RAPIER.ActiveEvents.COLLISION_EVENTS);


    }

    /**
     * @function
     * @description Initializes a simple bounding box collider based on the visual bounds of the entity
     * @param {MREntity} entity - the entity being updated
     */
    initSimpleBody(entity) {
        entity.physics.halfExtents = new THREE.Vector3()
        this.tempBBox.setFromObject(entity.object3D, true);

        this.tempBBox.getSize(this.tempSize);

        entity.physics.halfExtents.copy(this.tempSize);
        entity.physics.halfExtents.divideScalar(2);

        const rigidBodyDesc = mrjsUtils.Physics.RAPIER.RigidBodyDesc.fixed()
        entity.physics.body = this.app.physicsWorld.createRigidBody(rigidBodyDesc);

        let colliderDesc = mrjsUtils.Physics.RAPIER.ColliderDesc.cuboid(...entity.physics.halfExtents);
        colliderDesc.setCollisionGroups(mrjsUtils.Physics.CollisionGroups.UI);
        entity.physics.collider = this.app.physicsWorld.createCollider(colliderDesc, entity.physics.body);
        mrjsUtils.Physics.COLLIDER_ENTITY_MAP[entity.physics.collider.handle] = entity;
        entity.physics.collider.setActiveCollisionTypes(mrjsUtils.Physics.RAPIER.ActiveCollisionTypes.DEFAULT | mrjsUtils.Physics.RAPIER.ActiveCollisionTypes.KINEMATIC_FIXED);
        entity.physics.collider.setActiveEvents(mrjsUtils.Physics.RAPIER.ActiveEvents.COLLISION_EVENTS);


    }

    /**
     * @function
     * @description Initializes a Rigid Body detailed convexMesh collider for the entity 
     * NOTE: not currently in use until we can sync it with animations
     * @param {MREntity} entity - the entity being updated
     */
    initDetailedBody(entity) {
    
        const rigidBodyDesc = mrjsUtils.Physics.RAPIER.RigidBodyDesc.fixed()
        entity.physics.body = this.app.physicsWorld.createRigidBody(rigidBodyDesc);

        entity.physics.colliders = []

        entity.object3D.traverse((child) => {
            if(child.isMesh) {
                let collider = this.app.physicsWorld.createCollider(this.initConvexMeshCollider(child, entity.compStyle.scale), entity.physics.body)
                collider.setCollisionGroups(mrjsUtils.Physics.CollisionGroups.UI);
                entity.physics.colliders.push(collider)
                mrjsUtils.Physics.COLLIDER_ENTITY_MAP[collider.handle] = entity;
                collider.setActiveCollisionTypes(mrjsUtils.Physics.RAPIER.ActiveCollisionTypes.DEFAULT | mrjsUtils.Physics.RAPIER.ActiveCollisionTypes.KINEMATIC_FIXED);
                collider.setActiveEvents(mrjsUtils.Physics.RAPIER.ActiveEvents.COLLISION_EVENTS);

            }
        })

    }

     /**
     * @function
     * @description Initializes a convexMesh collider from a THREE.js geometry
     * NOTE: not currently in use until we can sync it with animations
     * @param {MREntity} entity - the entity being updated
     */
    initConvexMeshCollider(object3D, scale) {
        const positionAttribute = object3D.geometry.getAttribute('position');
        const vertices = [];
        for (let i = 0; i < positionAttribute.count; i++) {
            const vertex = new THREE.Vector3().fromBufferAttribute(positionAttribute, i).multiplyScalar(scale).multiplyScalar(mrjsUtils.app.scale);
            vertices.push([vertex.x, vertex.y, vertex.z]);
        }

        // Convert vertices to a flat Float32Array as required by RAPIER.ConvexHull
        const verticesFlat = new Float32Array(vertices.flat());

        return mrjsUtils.Physics.RAPIER.ColliderDesc.convexMesh(verticesFlat)

    }

    /**
     * @function
     * @description Updates the rigid body used by the physics part of the entity
     * @param {MREntity} entity - the entity being updated
     */
    updateBody(entity) {
        if (!entity.physics.body) {
            return;
        }

        if(entity.compStyle.visibility == 'hidden' && entity.physics.body.isEnabled()) {
           entity.physics.body.setEnabled(false)
        } else if (!entity.physics.body.isEnabled()) {
           entity.physics.body.setEnabled(false)
        }

        if (entity instanceof MRPanel) {
            entity.panel.getWorldPosition(this.tempWorldPosition);
        } else {
            entity.object3D.getWorldPosition(this.tempWorldPosition);
        }
        entity.physics.body.setTranslation({ ...this.tempWorldPosition }, true);

        entity.object3D.getWorldQuaternion(this.tempWorldQuaternion);
        entity.physics.body.setRotation(this.tempWorldQuaternion, true);

        if(entity instanceof MRModel) {
            this.updateSimpleBody(entity);
        } else if (entity instanceof MRDivEntity) {
            this.updateUIBody(entity);
        }
    }

    /**
     * @function
     * @description Updates the rigid body used by the physics part of the div entity
     * @param {MREntity} entity - the entity being updated
     */
    updateUIBody(entity) {
        this.tempBBox.setFromCenterAndSize(entity.object3D.position, new THREE.Vector3(entity.width, entity.height, 0.002));

        this.tempWorldScale.setFromMatrixScale(entity.object3D.matrixWorld);
        this.tempBBox.getSize(this.tempSize);
        this.tempSize.multiply(this.tempWorldScale);

        entity.physics.halfExtents.copy(this.tempSize);
        entity.physics.halfExtents.divideScalar(2);

        entity.physics.collider.setHalfExtents(entity.physics.halfExtents);
    }

    /**
     * @function
     * @description Updates the rigid body used by the physics part of the model entity
     * @param {MREntity} entity - the entity being updated
     */
    updateSimpleBody(entity) {
        this.tempBBox.setFromObject(entity.object3D, true);

        this.tempBBox.getSize(this.tempSize);

        entity.physics.halfExtents.copy(this.tempSize);
        entity.physics.halfExtents.divideScalar(2);

        entity.physics.collider.setHalfExtents(entity.physics.halfExtents);
    }

    /**
     * @function
     * @description Updates the debug renderer to either be on or off based on the 'this.debug' variable. Handles the drawing of the visual lines.
     */
    updateDebugRenderer() {
        if (!this.debug || this.debug == 'false') {
            return;
        }
        const buffers = this.app.physicsWorld.debugRender();
        this.lines.geometry.setAttribute('position', new THREE.BufferAttribute(buffers.vertices, 3));
        this.lines.geometry.setAttribute('color', new THREE.BufferAttribute(buffers.colors, 4));
    }
}
