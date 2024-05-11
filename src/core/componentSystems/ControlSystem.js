import * as THREE from 'three';

import { MRSystem } from 'mrjs/core/MRSystem';
import { MRHand } from 'mrjs/core/user/MRHand';

import { mrjsUtils } from 'mrjs';

/**
 * @class ControlSystem
 * @classdesc This system supports interaction event information including mouse and controller interfacing.
 * @augments MRSystem
 */
export class ControlSystem extends MRSystem {
    /**
     * @class
     * @description ControlSystem's Default constructor that sets up the app's mouse information along with any relevant physics and cursor information.
     */
    constructor() {
        super(false);
        this.activeHand = this.app.user.hands.left;

        document.addEventListener('selectstart', (event) => {
            if (event.detail == null) {
                return;
            }
            if (event.detail?.handedness == 'left') {
                this.activeHand = this.app.user.hands.left;
            } else {
                this.activeHand = this.app.user.hands.right;
            }

            this.down = true;
            this.cursorViz.material.color.setStyle('blue');
            this.onMouseDown(event);
        });

        document.addEventListener('selectend', (event) => {
            if (event.detail.handedness == null) {
                return;
            }
            this.down = false;
            this.cursorViz.material.color.setStyle('black');

            this.onMouseUp(event);
        });

        this.origin = new THREE.Vector3();
        this.direction = new THREE.Vector3();
        this.ray = new mrjsUtils.physics.RAPIER.Ray({ x: 0.0, y: 0.0, z: 0.0 }, { x: 0.0, y: 1.0, z: 0.0 });
        this.hit;

        this.restPosition = new THREE.Vector3(1000, 1000, 1000);
        this.hitPosition = new THREE.Vector3();
        this.hitNormal = new THREE.Vector3();

        this.tempWorldPosition = new THREE.Vector3();
        this.tempLocalPosition = new THREE.Vector3();
        this.tempPreviousPosition = new THREE.Vector3();
        this.touchDelta = new THREE.Vector3();

        this.directTouch = false;

        this.currentEntity = null;

        this.cursorViz = new THREE.Mesh(new THREE.RingGeometry(0.005, 0.007, 32), new THREE.MeshBasicMaterial({ color: 0x000000, opacity: 0.7, transparent: true }));

        this.app.scene.add(this.cursorViz);
        this.cursorViz.visible = false;

        this.down = false;

        this.app.renderer.domElement.addEventListener('mousedown', this.onMouseDown);
        this.app.renderer.domElement.addEventListener('mouseup', this.onMouseUp);
        this.app.renderer.domElement.addEventListener('mousemove', this.mouseOver);
        this.app.renderer.domElement.addEventListener('mouseover', this.mouseOver);

        this.app.renderer.domElement.addEventListener('touchstart', this.onMouseDown);
        this.app.renderer.domElement.addEventListener('touchend', this.onMouseUp);
        this.app.renderer.domElement.addEventListener('touchmove', this.mouseOver);
        this.app.renderer.domElement.addEventListener('touch', this.mouseOver);
    }

    /**
     * @function
     * @description The generic system update call. Updates the meshes and states for both the left and right hand visuals.
     * @param {number} deltaTime - given timestep to be used for any feature changes
     * @param {object} frame - given frame information to be used for any feature changes
     */
    update(deltaTime, frame) {
        if (!mrjsUtils.xr.isPresenting) {
            return;
        }

        if (!this.down) {
            mrjsUtils.physics.eventQueue.drainCollisionEvents((handle1, handle2, started) => {
                /* Handle the collision event. */
                if (started) {
                    this.onContactStart(handle1, handle2);
                } else {
                    this.onContactEnd(handle1, handle2);
                }
            });

            this.checkCollisions(this.app.user.hands.left);
            this.checkCollisions(this.app.user.hands.right);
        }

        if (!this.directTouch) {
            this.pointerRay();
        } else if (this.cursorViz.visible) {
            this.clearPointer();
        }
        this.directTouch = false;
    }

    /**
     * @function
     * @description Check for any collisions with this MRHand and the rapier physics world.
     * @param {object} hand - the MRHand object whose collisions we are checking with this function.
     */
    checkCollisions(hand) {
        for (let jointCursor of hand.jointCursors) {
            mrjsUtils.physics.world.contactPairsWith(jointCursor.collider, (collider2) => {
                const entity = mrjsUtils.physics.COLLIDER_ENTITY_MAP[collider2.handle];

                if (entity) {
                    this.directTouch = true;
                    this.tempPreviousPosition.copy(this.tempLocalPosition);

                    this.tempLocalPosition.copy(jointCursor.collider.translation());
                    entity.object3D.worldToLocal(this.tempLocalPosition);

                    this.touchDelta.subVectors(this.tempLocalPosition, this.tempPreviousPosition);

                    if (!jointCursor.name.includes('hover') && entity.touch) {
                        entity.dispatchEvent(
                            new CustomEvent('touchmove', {
                                bubbles: true,
                                detail: {
                                    joint: jointCursor.name,
                                    worldPosition: jointCursor.collider.translation(),
                                    position: this.tempLocalPosition,
                                    delta: this.touchDelta,
                                },
                            })
                        );
                    } else if (jointCursor.name.includes('hover') && !entity.touch) {
                        entity.dispatchEvent(
                            new CustomEvent('hovermove', {
                                bubbles: true,
                                detail: {
                                    joint: jointCursor.name,
                                    worldPosition: jointCursor.collider.translation(),
                                    position: this.tempLocalPosition,
                                    delta: this.touchDelta,
                                },
                            })
                        );
                    }
                }
            });
        }
    }

    /**
     * @function
     * @description Handles the start of collisions between two different colliders.
     * @param {number} handle1 - the first collider
     * @param {number} handle2 - the second collider
     */
    onContactStart = (handle1, handle2) => {
        const collider1 = mrjsUtils.physics.world.colliders.get(handle1);
        const collider2 = mrjsUtils.physics.world.colliders.get(handle2);

        const joint = mrjsUtils.physics.INPUT_COLLIDER_HANDLE_NAMES[handle1];
        const entity = mrjsUtils.physics.COLLIDER_ENTITY_MAP[handle2];

        if (!joint || !entity) {
            return;
        }
        if (!joint.includes('hover')) {
            this.touchStart(collider1, collider2, entity);
        } else {
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
        const joint = mrjsUtils.physics.INPUT_COLLIDER_HANDLE_NAMES[handle1];
        const entity = mrjsUtils.physics.COLLIDER_ENTITY_MAP[handle2];

        if (!joint || !entity) {
            return;
        }
        if (!joint.includes('hover')) {
            this.touchEnd(entity);
        } else {
            this.hoverEnd(entity);
        }
    };

    /**
     * @function
     * @description Handles the start of touch between two different colliders and the current entity.
     * @param {number} collider1 - the first collider
     * @param {number} collider2 - the second collider
     * @param {object} entity - the current entity
     */
    touchStart = (collider1, collider2, entity) => {
        entity.touch = true;
        mrjsUtils.physics.world.contactPair(collider1, collider2, (manifold, flipped) => {
            this.tempLocalPosition.copy(manifold.localContactPoint2(0));
            this.tempWorldPosition.copy(manifold.localContactPoint2(0));
            entity.object3D.localToWorld(this.tempWorldPosition);
            entity.classList.remove('hover');

            entity.dispatchEvent(
                new CustomEvent('touchstart', {
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
     * @param {object} entity - the current entity
     */
    touchEnd = (entity) => {
        this.tempPreviousPosition.set(0, 0, 0);
        this.tempLocalPosition.set(0, 0, 0);
        this.tempWorldPosition.set(0, 0, 0);
        entity.touch = false;
        entity.click();

        entity.dispatchEvent(
            new CustomEvent('touchend', {
                bubbles: true,
            })
        );
    };

    /**
     * @function
     * @description Handles the start of hovering over/around a specific entity.
     * @param {number} collider1 - the first collider
     * @param {number} collider2 - the second collider
     * @param {object} entity - the current entity
     */
    hoverStart = (collider1, collider2, entity) => {
        entity.classList.add('hover');
        mrjsUtils.physics.world.contactPair(collider1, collider2, (manifold, flipped) => {
            this.tempLocalPosition.copy(manifold.localContactPoint2(0));
            this.tempWorldPosition.copy(manifold.localContactPoint2(0));
            entity.object3D.localToWorld(this.tempWorldPosition);
            entity.dispatchEvent(
                new CustomEvent('hoverstart', {
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
     * @param {object} entity - the current entity
     */
    hoverEnd = (entity) => {
        entity.classList.remove('hover');
        entity.dispatchEvent(
            new CustomEvent('hoverend', {
                bubbles: true,
            })
        );

        entity.dispatchEvent(new MouseEvent('mouseout'));
    };

    /**
     * @function
     * @description Fills in the this.origin,direction,ray, and hit values based on the rapier world
     */
    pointerRay() {
        this.origin.setFromMatrixPosition(this.app.user.origin.matrixWorld);
        this.direction.setFromMatrixPosition(this.activeHand.pointer.matrixWorld).sub(this.origin).normalize();

        this.ray.origin = { ...this.origin };
        this.ray.dir = { ...this.direction };

        this.hit = mrjsUtils.physics.world.castRayAndGetNormal(this.ray, 100, true, null, mrjsUtils.physics.CollisionGroups.USER, null, null);
        if (this.hit != null) {
            this.hitPosition.copy(this.ray.pointAt(this.hit.toi));
            this.hitNormal.copy(this.hit.normal);
            this.cursorViz.visible = true;
            this.cursorViz.position.copy(this.hitPosition);

            this.cursorViz.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), this.hit.normal);

            this.interact(mrjsUtils.physics.COLLIDER_ENTITY_MAP[this.hit.collider.handle]);
        } else {
            this.cursorViz.visible = false;
        }
    }

    /**
     * @function
     * @description clears the gaze/pinch pointer from the scene
     */
    clearPointer() {
        this.cursorViz.visible = false;
        if (this.currentEntity) {
            this.currentEntity.focus = false;
            this.hoverEndEvents();
        }

        this.currentEntity = null;
    }

    /************ Interaction Events ************/

    /**
     * @function
     * @description Handles the mouse over event
     * @param {event} event - the mouse over event
     */
    mouseOver = (event) => {
        this.hit = this.pixelRayCast(event);

        if (this.hit != null) {
            this.hitPosition.copy(this.ray.pointAt(this.hit.toi));
        }

        this.interact(mrjsUtils.physics.COLLIDER_ENTITY_MAP[this.hit?.collider.handle]);
    };

    /**
     * @function
     * @description Handles the mouse down event
     * @param {event} event - the mouse down event
     */
    onMouseDown = (event) => {
        this.down = true;
        this.currentEntity?.classList.remove('hover');
        this.currentEntity?.classList.add('active');

        this.currentEntity?.dispatchEvent(
            new CustomEvent('hoverend', {
                bubbles: true,
            })
        );

        this.currentEntity?.dispatchEvent(
            new CustomEvent('touchstart', {
                bubbles: true,
                detail: {
                    worldPosition: this.hitPosition,
                },
            })
        );
    };

    /**
     * @function
     * @description Handles the mouse up event
     * @param {event} event - the mouse up event
     */
    onMouseUp = (event) => {
        this.down = false;
        this.currentEntity?.classList.remove('active');
        this.currentEntity?.dispatchEvent(new Event('click'));

        this.currentEntity?.dispatchEvent(
            new CustomEvent('touchend', {
                bubbles: true,
            })
        );

        this.hoverStartEvents();
    };

    /**
     * @function
     * @description Checks what kind of interactions should happen based on the current entity and any events that
     * have happened so far.
     * @param {object} entity - checking if there is any interaction required based on current events and this entity.
     */
    interact(entity) {
        if (!this.down && this.currentEntity != entity) {
            if (this.currentEntity) {
                this.currentEntity.focus = false;
                this.hoverEndEvents();
            }

            this.currentEntity = null;
        }

        if (!entity) {
            return;
        }

        if (this.down) {
            this.currentEntity?.dispatchEvent(
                new CustomEvent('touchmove', {
                    bubbles: true,
                    detail: {
                        worldPosition: this.hitPosition,
                    },
                })
            );
            return;
        }

        if (!this.currentEntity) {
            this.currentEntity = entity;
            this.currentEntity.focus = true;
            this.hoverStartEvents();
        }
    }

    hoverStartEvents = () => {
        this.currentEntity?.classList.add('hover');
        this.currentEntity?.dispatchEvent(
            new MouseEvent('mouseover', {
                bubbles: true,
            })
        );
        this.currentEntity?.dispatchEvent(
            new CustomEvent('hoverstart', {
                bubbles: true,
            })
        );

        // TODO: this will require slightly more complex logic to implement correctly
        // this.currentEntity.dispatchEvent(
        //     new MouseEvent('mouseenter', {
        //         bubbles: false,
        //     })
        // );
    };

    hoverEndEvents = () => {
        this.currentEntity?.classList.remove('hover');
        this.currentEntity?.dispatchEvent(
            new MouseEvent('mouseout', {
                bubbles: true,
            })
        );

        this.currentEntity?.dispatchEvent(
            new CustomEvent('hoverend', {
                bubbles: true,
            })
        );

        // TODO: this will require slightly more complex logic to implement correctly
        // this.currentEntity.dispatchEvent(
        //     new MouseEvent('mouseout', {
        //         bubbles: false,
        //     })
        // );
    };

    /************ Tools && Helpers ************/

    /**
     * @function
     * @description Raycast into the scene using the information from the event that called it.
     * @param {object} event - the event being handled
     * @returns {object} - collision item for what the ray hit in the 3d scene.
     */
    pixelRayCast(event) {
        let x = 0;
        let y = 0;
        if (event.type.includes('touchmove')) {
            if (event.touches.length == 0) {
                return null;
            }

            x = event.touches[0].clientX;
            y = event.touches[0].clientY;
        } else {
            x = event.clientX;
            y = event.clientY;
        }

        if (this.app.camera instanceof THREE.OrthographicCamera) {
            this.direction.set((x / this.app.appWidth) * 2 - 1, -(y / this.app.appHeight) * 2 + 1, -1); // z = - 1 important!
            this.direction.unproject(this.app.camera);
            const direction = new THREE.Vector3(0, 0, -1);
            direction.transformDirection(this.app.camera.matrixWorld);

            this.ray.origin = { ...this.direction };
            this.ray.dir = { ...direction };
        } else {
            this.direction.set((x / this.app.appWidth) * 2 - 1, -(y / this.app.appHeight) * 2 + 1, 0.5);
            this.direction.unproject(this.app.camera);
            this.direction.sub(this.app.camera.position).normalize();
            this.ray.origin = { ...this.app.camera.position };
            this.ray.dir = { ...this.direction };
        }

        return mrjsUtils.physics.world.castRayAndGetNormal(this.ray, 100, true, null, mrjsUtils.physics.CollisionGroups.USER, null, null);
    }
}
