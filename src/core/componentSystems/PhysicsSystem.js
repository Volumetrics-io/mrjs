import * as THREE from 'three';

import { MRSystem } from 'mrjs/core/MRSystem';
import { MREntity } from 'mrjs/core/MREntity';

import { mrjsUtils } from 'mrjs';
import { MRDivEntity } from '../MRDivEntity';
import { MRPanel } from '../entities/MRPanel';

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
        if (entity.physics.type == 'none') {
            return;
        }

        this.initUIEntityBody(entity)

        entity.object3D.getWorldPosition(this.tempWorldPosition);
        entity.object3D.getWorldQuaternion(this.tempWorldQuaternion);

        entity.physics.body.setTranslation(...this.tempWorldPosition, true);
        entity.physics.body.setRotation(this.tempWorldQuaternion, true);

        mrjsUtils.Physics.COLLIDER_ENTITY_MAP[entity.physics.collider.handle] = entity;

        entity.physics.collider.setActiveCollisionTypes(mrjsUtils.Physics.RAPIER.ActiveCollisionTypes.DEFAULT | mrjsUtils.Physics.RAPIER.ActiveCollisionTypes.KINEMATIC_FIXED);
        entity.physics.collider.setActiveEvents(mrjsUtils.Physics.RAPIER.ActiveEvents.COLLISION_EVENTS);
    }

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
        // colliderDesc.setCollisionGroups(mrjsUtils.Physics.CollisionGroups.UI);
        entity.physics.collider = this.app.physicsWorld.createCollider(colliderDesc, entity.physics.body);

    }

    /**
     * @function
     * @description Updates the rigid body used by the physics part of the entity
     * @param {MREntity} entity - the entity being updated
     */
    updateBody(entity) {
        if (entity.physics.type == 'none') {
            return;
        }
        if (entity instanceof MRPanel) {
            entity.panel.getWorldPosition(this.tempWorldPosition);
        } else {
            entity.object3D.getWorldPosition(this.tempWorldPosition);
        }
        entity.physics.body.setTranslation({ ...this.tempWorldPosition }, true);

        entity.object3D.getWorldQuaternion(this.tempWorldQuaternion);
        entity.physics.body.setRotation(this.tempWorldQuaternion, true);

        this.tempBBox.setFromCenterAndSize(entity.object3D.position, new THREE.Vector3(entity.width, entity.height, 0.002));

        this.tempWorldScale.setFromMatrixScale(entity.object3D.matrixWorld);
        this.tempBBox.getSize(this.tempSize);
        this.tempSize.multiply(this.tempWorldScale);

        entity.physics.halfExtents.copy(this.tempSize);
        entity.physics.halfExtents.divideScalar(2);

        this.updateCollider(entity);
    }

    /**
     * @function
     * @description Initializes a collider based on the physics data.
     * @param {object} physicsData - data needed to be used to setup the collider interaction
     * @returns {object} - the Rapier physics collider object
     */
    initColliderDesc(physicsData) {
        switch (physicsData.type) {
            case 'box':
            case 'ui':
                return mrjsUtils.Physics.RAPIER.ColliderDesc.cuboid(...physicsData.halfExtents);
            default:
                return null;
        }
    }

    /**
     * @function
     * @description Updates the collider used by the entity based on whether it's being used as a UI element, the main box element, etc.
     * @param {MREntity} entity - the entity being updated
     */
    updateCollider(entity) {
        switch (entity.physics.type) {
            case 'box':
            case 'ui':
                entity.physics.collider.setHalfExtents(entity.physics.halfExtents);
                break;
            default:
                break;
        }
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
