import * as THREE from 'three';

import { MRSystem } from 'mrjs/core/MRSystem';
import { MRDivEntity } from 'mrjs/core/MRDivEntity';
import { MREntity } from 'mrjs/core/MREntity';

import { mrjsUtils } from 'mrjs';

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

        this.currentEntity = null;

        this.tempLocalPosition = new THREE.Vector3();
        this.tempPreviousPosition = new THREE.Vector3();
        this.touchDelta = new THREE.Vector3();

        this.tempWorldScale = new THREE.Vector3();
        this.tempWorldQuaternion = new THREE.Quaternion();
        this.tempHalfExtents = new THREE.Vector3();

        this.eventQueue = new mrjsUtils.Physics.RAPIER.EventQueue(true);

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
        this.app.physicsWorld.step(this.eventQueue);

        this.eventQueue.drainCollisionEvents((handle1, handle2, started) => {
            /* Handle the collision event. */

            if (started) {
                this.onContactStart(handle1, handle2);
            } else {
                this.onContactEnd(handle1, handle2);
            }
        });

        for (const entity of this.registry) {
            if (entity.physics?.body == null) {
                continue;
            }
            this.updateBody(entity);

            this.app.physicsWorld.contactPairsWith(entity.physics.collider, (collider2) => {
                const joint = mrjsUtils.Physics.INPUT_COLLIDER_HANDLE_NAMES[collider2.handle];

                if (joint) {
                    if (!joint.includes('hover') && entity.touch) {
                        this.tempPreviousPosition.copy(this.tempLocalPosition);

                        this.tempLocalPosition.copy(collider2.translation());
                        entity.object3D.worldToLocal(this.tempLocalPosition);

                        this.touchDelta.subVectors(this.tempLocalPosition, this.tempPreviousPosition);

                        entity.dispatchEvent(
                            new CustomEvent('touch', {
                                bubbles: true,
                                detail: {
                                    joint,
                                    worldPosition: collider2.translation(),
                                    position: this.tempLocalPosition,
                                    delta: this.touchDelta,
                                },
                            })
                        );
                    }
                }
            });
        }

        this.updateDebugRenderer();
    }

    /**
     * @function
     * @description Handles the start of collisions between two different colliders.
     * @param {number} handle1 - the first collider
     * @param {number} handle2 - the second collider
     */
    onContactStart = (handle1, handle2) => {
        const collider1 = this.app.physicsWorld.colliders.get(handle1);
        const collider2 = this.app.physicsWorld.colliders.get(handle2);

        const joint = mrjsUtils.Physics.INPUT_COLLIDER_HANDLE_NAMES[handle1];
        const entity = mrjsUtils.Physics.COLLIDER_ENTITY_MAP[handle2];

        if (joint && entity && !joint.includes('hover')) {
            // if(this.currentEntity) {
            //   return
            // }
            // TODO - can the above commented code be deleted? - TBD
            this.touchStart(collider1, collider2, entity);
            return;
        }

        if (joint && entity && joint.includes('hover')) {
            this.hoverStart(collider1, collider2, entity);
        }
    };

    /**
     * @function
     * @description Handles the end of collisions between two different colliders.
     * @param {number} handle1 - the first collider
     * @param {number} handle2 - the second collider
     */
    onContactEnd = (handle1, handle2) => {
        const joint = mrjsUtils.Physics.INPUT_COLLIDER_HANDLE_NAMES[handle1];
        const entity = mrjsUtils.Physics.COLLIDER_ENTITY_MAP[handle2];

        if (joint && entity && !joint.includes('hover')) {
            this.touchEnd(entity);
            return;
        }

        if (joint && entity && joint.includes('hover')) {
            this.hoverEnd(entity);
        }
    };

    /**
     * @function
     * @description Handles the start of touch between two different colliders and the current entity.
     * @param {number} collider1 - the first collider
     * @param {number} collider2 - the second collider
     * @param {MREntity} entity - the current entity
     */
    touchStart = (collider1, collider2, entity) => {
        this.currentEntity = entity;
        entity.touch = true;
        this.app.physicsWorld.contactPair(collider1, collider2, (manifold, flipped) => {
            this.tempLocalPosition.copy(manifold.localContactPoint2(0));
            this.tempWorldPosition.copy(manifold.localContactPoint2(0));
            entity.object3D.localToWorld(this.tempWorldPosition);
            entity.classList.remove('hover');

            entity.dispatchEvent(
                new CustomEvent('touch-start', {
                    bubbles: true,
                    detail: {
                        worldPosition: this.tempWorldPosition,
                        position: this.tempLocalPosition,
                    },
                })
            );
        });
    };

    /**
     * @function
     * @description Handles the end of touch for the current entity
     * @param {MREntity} entity - the current entity
     */
    touchEnd = (entity) => {
        this.currentEntity = null;
        // Contact information can be read from `manifold`.
        this.tempPreviousPosition.set(0, 0, 0);
        this.tempLocalPosition.set(0, 0, 0);
        this.tempWorldPosition.set(0, 0, 0);
        entity.touch = false;
        entity.click();

        entity.dispatchEvent(
            new CustomEvent('touch-end', {
                bubbles: true,
            })
        );
    };

    /**
     * @function
     * @description Handles the start of hovering over/around a specific entity.
     * @param {number} collider1 - the first collider
     * @param {number} collider2 - the second collider
     * @param {MREntity} entity - the current entity
     */
    hoverStart = (collider1, collider2, entity) => {
        entity.classList.add('hover');
        this.app.physicsWorld.contactPair(collider1, collider2, (manifold, flipped) => {
            this.tempLocalPosition.copy(manifold.localContactPoint2(0));
            this.tempWorldPosition.copy(manifold.localContactPoint2(0));
            entity.object3D.localToWorld(this.tempWorldPosition);
            entity.dispatchEvent(
                new CustomEvent('hover-start', {
                    bubbles: true,
                    detail: {
                        worldPosition: this.tempWorldPosition,
                        position: this.tempLocalPosition,
                    },
                })
            );

            entity.dispatchEvent(new MouseEvent('mouseover'));
        });
    };

    /**
     * @function
     * @description Handles the end of hovering over/around a specific entity.
     * @param {MREntity} entity - the current entity
     */
    hoverEnd = (entity) => {
        entity.classList.remove('hover');
        entity.dispatchEvent(
            new CustomEvent('hover-end', {
                bubbles: true,
            })
        );

        entity.dispatchEvent(new MouseEvent('mouseleave'));
    };

    /**
     * @function
     * @description When a new entity is created, adds it to the physics registry and initializes the physics aspects of the entity.
     * @param {MREntity} entity - the entity being set up
     */
    onNewEntity(entity) {
        this.initPhysicsBody(entity);
        this.registry.add(entity);
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
        //-------------CHECK ON THIS AFTER MICHAEL'S PR IS IN
        if (entity instanceof MRDivEntity) {
            this.updatePhysicsData(entity);
        }
        //-------------CHECK ON THIS AFTER MICHAEL'S PR IS IN

        entity.object3D.getWorldPosition(this.tempWorldPosition);
        entity.object3D.getWorldQuaternion(this.tempWorldQuaternion);
        const rigidBodyDesc = mrjsUtils.Physics.RAPIER.RigidBodyDesc.fixed().setTranslation(...this.tempWorldPosition);
        entity.physics.body = this.app.physicsWorld.createRigidBody(rigidBodyDesc);
        entity.physics.body.setRotation(this.tempWorldQuaternion, true);

        // Create a cuboid collider attached to the dynamic rigidBody.
        let colliderDesc = this.initColliderDesc(entity.physics);
        colliderDesc.setCollisionGroups(mrjsUtils.Physics.CollisionGroups.UI);
        entity.physics.collider = this.app.physicsWorld.createCollider(colliderDesc, entity.physics.body);

        mrjsUtils.Physics.COLLIDER_ENTITY_MAP[entity.physics.collider.handle] = entity;

        entity.physics.collider.setActiveCollisionTypes(mrjsUtils.Physics.RAPIER.ActiveCollisionTypes.DEFAULT | mrjsUtils.Physics.RAPIER.ActiveCollisionTypes.KINEMATIC_FIXED);
        entity.physics.collider.setActiveEvents(mrjsUtils.Physics.RAPIER.ActiveEvents.COLLISION_EVENTS);
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
        entity.object3D.getWorldPosition(this.tempWorldPosition);
        entity.physics.body.setTranslation({ ...this.tempWorldPosition }, true);

        entity.object3D.getWorldQuaternion(this.tempWorldQuaternion);
        entity.physics.body.setRotation(this.tempWorldQuaternion, true);

        if (entity instanceof MRDivEntity) {
            this.updatePhysicsData(entity);
        }

        this.updateCollider(entity);
    }

    /**
     * @function
     * @description Updates the physics data for the current iteration. Calculates this.physics based on current stored object3D information.
     */
    updatePhysicsData(entity) {
        entity.physics.halfExtents = new THREE.Vector3();
        entity.object3D.userData.bbox.setFromCenterAndSize(entity.object3D.position, new THREE.Vector3(entity.width, entity.height, 0.002));

        entity.worldScale.setFromMatrixScale(entity.object3D.matrixWorld);
        entity.object3D.userData.bbox.getSize(entity.object3D.userData.size);
        entity.object3D.userData.size.multiply(entity.worldScale);

        entity.physics.halfExtents.copy(entity.object3D.userData.size);
        entity.physics.halfExtents.divideScalar(2);
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
