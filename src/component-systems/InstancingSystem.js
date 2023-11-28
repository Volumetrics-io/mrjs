/**
 *
 */
class InstancingSystem extends System {
    // System that allows for instancing of meshes based on a given
    // entity where the instances can be modified separately.

    /**
     *
     */
    constructor() {
        super();

        this.instanceCount = 5;
        this.transformations = [];
        this.instancedMesh = null;
    }

    /**
     *
     * @param deltaTime
     * @param frame
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
     *
     * @param entity
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