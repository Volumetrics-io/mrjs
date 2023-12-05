import { MRSystem } from 'MRJS/Core/MRSystem';

/**
 * This system supports 3D clipping following threejs's clipping planes setup.
 * See https://threejs.org/docs/?q=material#api/en/materials/Material.clippingPlanes for more information.
 */
export class ClippingSystem extends MRSystem {
    /**
     * ClippingSystem's default constructor
     * // TODO - add more info
     */
    constructor() {
        super(false);
        // TODO - how would you describe these vectors in relation to the clipping planes?
        this.a = new THREE.Vector3();
        this.b = new THREE.Vector3();
        this.c = new THREE.Vector3();
        this.geometry = new THREE.BufferGeometry();
    }

    /**
     * The generic system update call.
     * Updates the clipped view of every entity in this system's registry.
     * @param deltaTime - given timestep to be used for any feature changes
     * @param frame - given frame information to be used for any feature changes
     */
    update(deltaTime, frame) {
        for (const entity of this.registry) {
            this.updatePlanes(entity);
        }
    }

    /**
     * Helper method for `onNewEntity`.
     *
     * Actually applies the clipping planes to the material setup for rendering.
     * Uses threejs in the background following https://threejs.org/docs/?q=material#api/en/materials/Material.clippingPlanes
     * @param object - the object3D item to be clipped
     * @param clipping - the clipping information to be passed to the material
     */
    applyClipping(object, clipping) {
        if (!object.isMesh) {
            return;
        }
        object.material.clippingPlanes = clipping.planes;
        object.material.clipIntersection = clipping.intersection;
    }

    /**
     * When the system swaps to a new entity, this handles applying the clipping planes as needed in the system run.
     * @param entity - given entity that will be clipped by the planes.
     */
    onNewEntity(entity) {
        if (!entity.clipping) {
            for (const parent of this.registry) {
                if (parent.contains(entity)) {
                    entity.object3D.traverse((child) => {
                        this.applyClipping(child, parent.clipping);
                    });
                }
            }
            return;
        }
        this.registry.add(entity);
        this.addClippingPlanes(entity);
        entity.object3D.traverse((child) => {
            this.applyClipping(child, entity.clipping);
        });
    }

    // TODO - is this function still needed? i dont see it called at all?
    /**
     * Creates a clipping planes information (still writing this description)
     * @param entity - the entity to which we're adding the clipping planes information
     */
    addClippingPlanes(entity) {
        this.geometry = entity.clipping.geometry.toNonIndexed();

        for (let f = 0; f < this.geometry.attributes.position.count * 3; f += 9) {
            this.a.set(-this.geometry.attributes.position.array[f], -this.geometry.attributes.position.array[f + 1], -this.geometry.attributes.position.array[f + 2]);
            this.b.set(-this.geometry.attributes.position.array[f + 3], -this.geometry.attributes.position.array[f + 4], -this.geometry.attributes.position.array[f + 5]);
            this.c.set(-this.geometry.attributes.position.array[f + 6], -this.geometry.attributes.position.array[f + 7], -this.geometry.attributes.position.array[f + 8]);

            entity.object3D.localToWorld(this.a);
            entity.object3D.localToWorld(this.b);
            entity.object3D.localToWorld(this.c);

            const newPlane = new THREE.Plane();

            newPlane.setFromCoplanarPoints(this.a, this.b, this.c);
            // if (this.app.debug) {
            //     const helper = new THREE.PlaneHelper( newPlane, 1, 0xff00ff );
            //     this.app.scene.add( helper );
            // }

            entity.clipping.planes.push(newPlane);
            entity.clipping.planeIDs.push(f);
        }
    }

    /**
     * Updates the stored clipping plans information (... still writing this description).
     * @param entity
     */
    updatePlanes(entity) {
        this.geometry = entity.clipping.geometry.toNonIndexed();

        let planeIndex = 0;

        for (let f = 0; f < this.geometry.attributes.position.count * 3; f += 9) {
            if (!entity.clipping.planeIDs.includes(f)) {
                continue;
            }

            this.a.set(-this.geometry.attributes.position.array[f], -this.geometry.attributes.position.array[f + 1], -this.geometry.attributes.position.array[f + 2]);
            this.b.set(-this.geometry.attributes.position.array[f + 3], -this.geometry.attributes.position.array[f + 4], -this.geometry.attributes.position.array[f + 5]);
            this.c.set(-this.geometry.attributes.position.array[f + 6], -this.geometry.attributes.position.array[f + 7], -this.geometry.attributes.position.array[f + 8]);

            entity.object3D.localToWorld(this.a);
            entity.object3D.localToWorld(this.b);
            entity.object3D.localToWorld(this.c);

            entity.clipping.planes[planeIndex].setFromCoplanarPoints(this.a, this.b, this.c);

            planeIndex += 1;
        }
    }
}
