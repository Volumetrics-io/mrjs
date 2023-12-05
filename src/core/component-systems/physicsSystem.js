import * as THREE from 'three';
import { RAPIER } from '../core/rapier.js';
import MRSystem from '../core/MRSystem.js';

export const INPUT_COLLIDER_HANDLE_NAMES = {};
export const COLLIDER_ENTITY_MAP = {};

// TODO - more to fill out here still

/**
 * The physics system functions differently from other systems,
 * Rather than attaching components, physical properties such as
 * shape, body, mass, etc are definied as attributes.
 * if shape and body are not defined, they default to the geometry
 * of the entity, if there is no geometry, there is no physics defined
 * on the entity.
 * 
 * Alternatively, you can also expressly attatch a comp-physics
 * attribute for more detailed control.
 */
export class PhysicsSystem extends MRSystem {
    /**
     * PhysicsSystem's default constructor
     * // TODO - add more info
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

        this.eventQueue = new RAPIER.EventQueue(true);

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
     * The generic system update call.
     * Based on the captured physics events for the frame, handles all items appropriately.
     * 
     * @param deltaTime - given timestep to be used for any feature changes
     * @param frame - given frame information to be used for any feature changes
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

            this.app.physicsWorld.contactsWith(entity.physics.collider, (collider2) => {
                const joint = INPUT_COLLIDER_HANDLE_NAMES[collider2.handle];

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

    onContactStart = (handle1, handle2) => {
        const collider1 = this.app.physicsWorld.colliders.get(handle1);
        const collider2 = this.app.physicsWorld.colliders.get(handle2);

        const joint = INPUT_COLLIDER_HANDLE_NAMES[handle1];
        const entity = COLLIDER_ENTITY_MAP[handle2];

        if (joint && entity && !joint.includes('hover')) {
            // if(this.currentEntity) {
            //   return
            // }
            this.touchStart(collider1, collider2, entity);
            return;
        }

        if (joint && entity && joint.includes('hover')) {
            this.hoverStart(collider1, collider2, entity);
        }
    };

    /**
     *
     * @param handle1
     * @param handle2
     */
    onContactEnd(handle1, handle2) {
        const joint = INPUT_COLLIDER_HANDLE_NAMES[handle1];
        const entity = COLLIDER_ENTITY_MAP[handle2];

        if (joint && entity && !joint.includes('hover')) {
            // if(entity != this.currentEntity) {
            //   return
            // }
            this.touchEnd(entity);
            return;
        }

        if (joint && entity && joint.includes('hover')) {
            this.hoverEnd(entity);
        }
    }

    touchStart = (collider1, collider2, entity) => {
        this.currentEntity = entity;
        entity.touch = true;
        this.app.physicsWorld.contactPair(collider1, collider2, (manifold, flipped) => {
            this.app.focusEntity = entity;
            this.tempLocalPosition.copy(manifold.localContactPoint2(0));
            this.tempWorldPosition.copy(manifold.localContactPoint2(0));
            entity.object3D.localToWorld(this.tempWorldPosition);

            // Contact information can be read from `manifold`.
            entity.dispatchEvent(
                new CustomEvent('click', {
                    bubbles: true,
                    detail: {
                        worldPosition: this.tempWorldPosition,
                        position: this.tempLocalPosition,
                    },
                })
            );
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

    touchEnd = (entity) => {
        this.currentEntity = null;
        // Contact information can be read from `manifold`.
        this.tempPreviousPosition.set(0, 0, 0);
        this.tempLocalPosition.set(0, 0, 0);
        this.tempWorldPosition.set(0, 0, 0);
        entity.touch = false;
        entity.dispatchEvent(
            new CustomEvent('touch-end', {
                bubbles: true,
            })
        );
    };

    hoverStart = (collider1, collider2, entity) => {
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
        });
    };

    hoverEnd = (entity) => {
        entity.dispatchEvent(
            new CustomEvent('hover-end', {
                bubbles: true,
            })
        );
    };

    /**
     *
     * @param entity
     */
    onNewEntity(entity) {
        this.initPhysicsBody(entity);
        this.registry.add(entity);
    }

    /**
     *
     * @param entity
     */
    initPhysicsBody(entity) {
        if (entity.physics.type == 'none') {
            return;
        }
        entity.updatePhysicsData();

        entity.object3D.getWorldPosition(this.tempWorldPosition);
        entity.object3D.getWorldQuaternion(this.tempWorldQuaternion);
        const rigidBodyDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(...this.tempWorldPosition);
        entity.physics.body = this.app.physicsWorld.createRigidBody(rigidBodyDesc);
        entity.physics.body.setRotation(this.tempWorldQuaternion, true);

        // Create a cuboid collider attached to the dynamic rigidBody.
        const colliderDesc = this.initColliderDesc(entity.physics);
        entity.physics.collider = this.app.physicsWorld.createCollider(colliderDesc, entity.physics.body);

        COLLIDER_ENTITY_MAP[entity.physics.collider.handle] = entity;

        entity.physics.collider.setActiveCollisionTypes(RAPIER.ActiveCollisionTypes.DEFAULT | RAPIER.ActiveCollisionTypes.KINEMATIC_FIXED);
        entity.physics.collider.setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);
    }

    /**
     *
     * @param entity
     */
    updateBody(entity) {
        if (entity.physics.type == 'none') {
            return;
        }
        entity.object3D.getWorldPosition(this.tempWorldPosition);
        entity.physics.body.setTranslation({ ...this.tempWorldPosition }, true);

        entity.object3D.getWorldQuaternion(this.tempWorldQuaternion);
        entity.physics.body.setRotation(this.tempWorldQuaternion, true);

        entity.updatePhysicsData();
        this.updateCollider(entity);
    }

    /**
     * Initializes a collider based on the physics data.
     * 
     * @param physicsData - data needed to be used to setup the collider interaction
     */
    initColliderDesc(physicsData) {
        switch (physicsData.type) {
            case 'box':
            case 'ui':
                return RAPIER.ColliderDesc.cuboid(...physicsData.halfExtents);
            default:
                break;
        }
    }

    /**
     *
     * @param entity
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
     * Updates the debug renderer to either be on or off based on the 'this.debug' variable.
     * Handles the drawing of the visual lines.
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
