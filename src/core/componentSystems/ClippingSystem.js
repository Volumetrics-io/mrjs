import * as THREE from 'three';

import { MRSystem } from 'mrjs/core/MRSystem';
import { MREntity } from 'mrjs/core/MREntity';

import { MRClippingGeometry } from 'mrjs/dataTypes/MRClippingGeometry';
import { MRVolumeEntity } from '../entities/MRVolumeEntity';
import { MRModelEntity } from '../entities/MRModelEntity';

const PLANE_NUM = 6;

/**
 * @class ClippingSystem
 * @classdesc   This system supports 3D clipping following threejs's clipping planes setup.
 *              See https://threejs.org/docs/?q=material#api/en/materials/Material.clippingPlanes for more information.
 * @augments MRSystem
 */
export class ClippingSystem extends MRSystem {
    /**
     * @class
     * @description ClippingSystem's default constructor that sets up coplanar points and the default clipping information.
     */
    constructor() {
        super(false);
        // Using coplanar points to calculate the orientation and position of the plane.
        // They're here to be reused for every plane so we're not generating a ton of vectors
        // to be garbage collected.
        this.coplanarPointA = new THREE.Vector3();
        this.coplanarPointB = new THREE.Vector3();
        this.coplanarPointC = new THREE.Vector3();
    }

    /**
     * @function
     * @description The generic system update call. Updates the clipped view of every entity in this system's registry.
     * @param {number} deltaTime - given timestep to be used for any feature changes
     * @param {object} frame - given frame information to be used for any feature changes
     */
    update(deltaTime, frame) {
        for (const entity of this.registry) {
            this.updatePlanes(entity);
        }
    }

    /**
     * @function
     * @description Updates the stored clipping planes to be based on the passed in entity.
     * @param {MREntity} entity - given entity that will be used to create the clipping planes positioning.
     */
    updatePlanes(entity) {
        // clipping.geometry is one segment BoxGeometry. See MRClippingGeometry.

        const geometry = entity.clipping.geometry;
        const positions = geometry.getAttribute('position').array;
        const indices = geometry.getIndex().array;

        for (let i = 0; i < PLANE_NUM; i++) {
            const indexOffset = i * 6;
            const positionIndexA = indices[indexOffset] * 3;
            const positionIndexB = indices[indexOffset + 1] * 3;
            const positionIndexC = indices[indexOffset + 2] * 3;

            this.coplanarPointA.set(-positions[positionIndexA], -positions[positionIndexA + 1], -positions[positionIndexA + 2]);
            this.coplanarPointB.set(-positions[positionIndexB], -positions[positionIndexB + 1], -positions[positionIndexB + 2]);
            this.coplanarPointC.set(-positions[positionIndexC], -positions[positionIndexC + 1], -positions[positionIndexC + 2]);

            if (entity instanceof MRVolumeEntity) {
                entity.volume.localToWorld(this.coplanarPointA);
                entity.volume.localToWorld(this.coplanarPointB);
                entity.volume.localToWorld(this.coplanarPointC);
            } else {
                entity.panel.localToWorld(this.coplanarPointA);
                entity.panel.localToWorld(this.coplanarPointB);
                entity.panel.localToWorld(this.coplanarPointC);
            }

            entity.clipping.planes[i].setFromCoplanarPoints(this.coplanarPointA, this.coplanarPointB, this.coplanarPointC);
        }
    }

    /**
     * @function
     * @description Helper method for `onNewEntity`. Actually applies the clipping planes to the material setup for rendering.
     * Uses threejs in the background following https://threejs.org/docs/?q=material#api/en/materials/Material.clippingPlanes
     * @param {MREntity} entity - the entity to be clipped
     * @param {MRClippingGeometry} clipping - the clipping information to be passed to the material
     */
    applyClipping(entity, clipping) {
        // only apply clipping planes to entities that arent masked through the stencil
        // since doubling up on that is redundant and not helpful for runtime
        if (!entity.ignoreStencil) {
            return;
        }

        entity.traverseObjects((object) => {
            if (object.isMesh) {
                object.material.clippingPlanes = clipping.planes;
                object.material.clipIntersection = clipping.intersection;
            }
        });
    }

    /**
     * @function
     * @description Helper method for `onNewEntity`. Creates a clipping planes information (still writing this description)
     * @param {MREntity} entity - the entity to which we're adding the clipping planes information
     */
    addClippingPlanes(entity) {
        for (let i = 0; i < PLANE_NUM; i++) {
            const newPlane = new THREE.Plane();

            // if (this.app.debug) {
            //     const helper = new THREE.PlaneHelper( newPlane, 1, 0xff00ff );
            //     this.app.scene.add( helper );
            // }

            entity.clipping.planes.push(newPlane);
        }
        this.updatePlanes(entity);
    }

    // TODO: polish and move this into MRSystem
    /**
     * @function
     * @description a function called when a specific entity has an event update
     * @param {Event} e - the event generated by the entity
     */
    entityEventUpdate = (e) => {
        let entity = e.target;
        for (const parent of this.registry) {
            if (parent.contains(entity)) {
                this.applyClipping(entity, parent.clipping);
            }
        }
    };

    /**
     * @function
     * @description When the system swaps to a new entity, this handles applying the clipping planes as needed in the system run.
     * @param {MREntity} entity - given entity that will be clipped by the planes.
     */
    onNewEntity(entity) {
        if (!entity.ignoreStencil) {
            // only apply clipping planes to entities that arent masked through the stencil
            // since doubling up on that is redundant and not helpful for runtime
            return;
        }

        if (!entity.clipping) {
            for (const parent of this.registry) {
                if (parent.contains(entity)) {
                    entity.traverse((child) => {
                        this.applyClipping(child, parent.clipping);
                    });
                    if (entity instanceof MRModelEntity) {
                        entity.addEventListener('modelchange', this.entityEventUpdate);
                    }
                }
            }
            return;
        }

        this.registry.add(entity);
        this.addClippingPlanes(entity);
        entity.traverse((child) => {
            if (entity === child) {
                return;
            }
            this.applyClipping(child, entity.clipping);
            if (entity instanceof MRModelEntity) {
                entity.addEventListener('modelchange', this.entityEventUpdate);
            }
        });
    }
}
