import * as THREE from 'three';

import { MRSystem } from 'MRJS/core/mrSystem';

/**
 * System that allows for instancing of meshes based on a given entity where the instances can be modified separately.
 */
class InstancingSystem extends MRSystem {
    /**
     * InstancingSystem's default constructor
     * // TODO - add more info
     */
    constructor() {
        super();

        this.instanceCount = 5;
        this.transformations = [];
        this.instancedMesh = null;
    }

    /**
     * The generic system update call.
     * Updates the entity and its instances to their appropriate transformations and visuals
     * based on the picked predefined option.
     * @param deltaTime - given timestep to be used for any feature changes
     * @param frame - given frame information to be used for any feature changes
     */
    update(deltaTime, frame) {
        for (const entity of this.registry) {
            switch (entity.components.get('instancing')?.type) {
                case 'random':
                    this.random(entity);
                    break;

                default:
                    break;
            }
        }
    }

    /**
     * Determines what meshes are attached from this entity and
     * When a component is attached, setups up instancing based on the predefined setup option and the entity's geometry (handling properly whether
     * that be a group or mesh).
     * @param entity - the entity with the geometry to be instanced and the chosen setup option
     */
    attachedComponent(entity) {
        // ----- setup for instanced geometry -----

        let originalMesh = entity.object3D;
        let combinedGeometry = new THREE.BufferGeometry();

        // grab usable mesh
        if (originalMesh instanceof THREE.Mesh) {
            combinedGeometry = originalMesh.geometry.clone();
        } else if (originalMesh instanceof THREE.Group) {
            originalMesh.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    const geometry = child.geometry.clone();
                    geometry.applyMatrix4(child.matrixWorld); // Apply the child's world matrix
                    combinedGeometry.merge(geometry);
                }
            });
        }

        // ----- create instances information -----

        // Setup for the to-be-used instance
        const instancedGeometry = new THREE.InstancedBufferGeometry();
        instancedGeometry.copy(combinedGeometry);
        for (let i = 0; i < this.instanceCount; ++i) {
            const matrix = new THREE.Matrix4();
            matrix.makeTranslation(Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5);

            this.transformations.push(matrix);
        }

        // ----- add instances to scene -----

        // Create an InstancedMesh using the instanced geometry and matrices
        const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        const instancedMesh = new THREE.InstancedMesh(instancedGeometry, material, this.instanceCount);
        instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

        // Set matrices for instances
        for (let i = 0; i < this.instanceCount; ++i) {
            instancedMesh.setMatrixAt(i, this.transformations[i]);
        }
        instancedMesh.instanceMatrix.needsUpdate = true;
        this.instancedMesh = instancedMesh;

        // Add the instanced mesh to the scene
        entity.object3D.add(instancedMesh);
    }

    // TODO - can i delete the below two items?
    /**
     *
     * @param entity
     */
    updatedComponent(entity) {}

    /**
     *
     * @param entity
     */
    detachedComponent(entity) {}

    /************ Some options for default instancing setup ************/

    // TODO - need to figure out if the auto documenter can handle this setup
    // for documenting

    random = (entity) => {
        // update mesh for each instance
        for (let i = 0; i < this.instanceCount; ++i) {
            const matrix = new THREE.Matrix4();
            matrix.makeScale(Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5);
            matrix.makeRotation(Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5);
            matrix.makeTranslation(Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5);

            this.transformations[i].copy(matrix);
            this.instancedMesh.setMatrixAt(i, this.transformations[i]);
        }
    };
}

let instancingSystem = new InstancingSystem();
