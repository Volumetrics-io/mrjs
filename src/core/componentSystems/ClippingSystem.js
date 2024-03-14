import * as THREE from 'three';

import { MRSystem } from 'mrjs/core/MRSystem';
import { MREntity } from 'mrjs/core/MREntity';

import { MRClippingGeometry } from 'mrjs/dataTypes/MRClippingGeometry';
import { MRVolume } from '../entities/MRVolume';

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
        // The plane geometry.
        this.geometry = new THREE.BufferGeometry();
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
        this.geometry = entity.clipping.geometry.toNonIndexed();
        let geoPositionArray = this.geometry.attributes.position.array;

        let planeIndex = 0;
        for (let f = 0; f < this.geometry.attributes.position.count * 3; f += 9) {
            if (!entity.clipping.planeIDs.includes(f)) {
                continue;
            }

            this.coplanarPointA.set(-geoPositionArray[f], -geoPositionArray[f + 1], -geoPositionArray[f + 2]);
            this.coplanarPointB.set(-geoPositionArray[f + 3], -geoPositionArray[f + 4], -geoPositionArray[f + 5]);
            this.coplanarPointC.set(-geoPositionArray[f + 6], -geoPositionArray[f + 7], -geoPositionArray[f + 8]);

            if (entity instanceof MRVolume) {
                entity.volume.localToWorld(this.coplanarPointA);
                entity.volume.localToWorld(this.coplanarPointB);
                entity.volume.localToWorld(this.coplanarPointC);
            } else {
                entity.panel.localToWorld(this.coplanarPointA);
                entity.panel.localToWorld(this.coplanarPointB);
                entity.panel.localToWorld(this.coplanarPointC);
            }

            entity.clipping.planes[planeIndex].setFromCoplanarPoints(this.coplanarPointA, this.coplanarPointB, this.coplanarPointC);
            planeIndex += 1;
        }
    }

    /**
     * @function
     * @description Helper method for `onNewEntity`. Actually applies the clipping planes to the material setup for rendering.
     * Uses threejs in the background following https://threejs.org/docs/?q=material#api/en/materials/Material.clippingPlanes
     * @param {object} object - the object3D item to be clipped
     * @param {MRClippingGeometry} clipping - the clipping information to be passed to the material
     */
    applyClipping(object, clipping) {
        if (!object.isMesh) {
            return;
        }
        object.material.clippingPlanes = clipping.planes;
        object.material.clipIntersection = clipping.intersection;
    }

    /**
     * @function
     * @description Helper method for `onNewEntity`. Creates a clipping planes information (still writing this description)
     * @param {MREntity} entity - the entity to which we're adding the clipping planes information
     */
    addClippingPlanes(entity) {
        this.geometry = entity.clipping.geometry.toNonIndexed();
        let geoPositionArray = this.geometry.attributes.position.array;

        for (let f = 0; f < this.geometry.attributes.position.count * 3; f += 9) {
            this.coplanarPointA.set(-geoPositionArray[f], -geoPositionArray[f + 1], -geoPositionArray[f + 2]);
            this.coplanarPointB.set(-geoPositionArray[f + 3], -geoPositionArray[f + 4], -geoPositionArray[f + 5]);
            this.coplanarPointC.set(-geoPositionArray[f + 6], -geoPositionArray[f + 7], -geoPositionArray[f + 8]);

            if (entity instanceof MRVolume) {
                entity.volume.localToWorld(this.coplanarPointA);
                entity.volume.localToWorld(this.coplanarPointB);
                entity.volume.localToWorld(this.coplanarPointC);
            } else {
                entity.panel.localToWorld(this.coplanarPointA);
                entity.panel.localToWorld(this.coplanarPointB);
                entity.panel.localToWorld(this.coplanarPointC);
            }

            const newPlane = new THREE.Plane();
            newPlane.setFromCoplanarPoints(this.coplanarPointA, this.coplanarPointB, this.coplanarPointC);
            // if (this.app.debug) {
            //     const helper = new THREE.PlaneHelper( newPlane, 1, 0xff00ff );
            //     this.app.scene.add( helper );
            // }

            entity.clipping.planes.push(newPlane);
            entity.clipping.planeIDs.push(f);
        }
    }

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
                    entity.object3D.traverse((child) => {
                        // only apply clipping planes to entities that arent masked through the stencil
                        // since doubling up on that is redundant and not helpful for runtime
                        if (entity.ignoreStencil) {
                            this.applyClipping(child, parent.clipping);
                        }
                    });
                }
            }
            return;
        }

        this.registry.add(entity);
        this.addClippingPlanes(entity);
        entity.object3D.traverse((child) => {
            // only apply clipping planes to entities that arent masked through the stencil
            // since doubling up on that is redundant and not helpful for runtime
            if (entity.ignoreStencil) {
                this.applyClipping(child, entity.clipping);
            }
        });
    }
}
