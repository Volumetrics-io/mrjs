class InstancingWithModsSystem extends System {

    constructor() {
        super();

        console.log(this.componentName);

        const this.instanceCount = 5;

        // DOD arrays
        let this.positions = null;
        let this.scales = null;
        let this.rotations = null;
        let this.meshes = [];
    }

    update(deltaTime, frame) {
        for(const entity of this.registry){
            switch (entity.animation?.type) {
                case 'rotate':
                    this.rotate(entity)
                    break;
            
                default:
                    break;
            }
        }
    }

    attachedComponent(entity, data) {
        console.log(entity);
        console.log(data);

        createInstances();
        addToScene(entity.geometry);
    }

    createInstances() {
        // Create buffers for positions, scales, and rotations of instances
        this.positions = new Float32Array(instanceCount * 3);
        this.scales = new Float32Array(instanceCount * 3);
        this.rotations = new Array(instanceCount);

        for (let i = 0; i < instanceCount; ++i) {
            const x = Math.random() * 10.0 - 5.0;
            const y = Math.random() * 10.0 - 5.0;
            const z = Math.random() * 10.0 - 5.0;

            this.positions[i * 3] = x;
            this.positions[i * 3 + 1] = y;
            this.positions[i * 3 + 2] = z;

            const scale = Math.random() * 2.0; // Random scale between 0 and 2
            this.scales[i * 3] = scale;
            this.scales[i * 3 + 1] = scale;
            this.scales[i * 3 + 2] = scale;

            const rotationSpeed = Math.random() * 0.05 + 0.02; // Random rotation speed
            this.rotations[i] = {
                x: Math.random() * Math.PI * 2.0,
                y: Math.random() * Math.PI * 2.0,
                z: Math.random() * Math.PI * 2.0,
                speed: rotationSpeed,
            };
        }
    }

    addToScene(geometry) {
        const instancedGeometry = new THREE.InstancedBufferGeometry();
        instancedGeometry.copy(geometry);

        instancedGeometry.setAttribute('instancePosition', new THREE.InstancedBufferAttribute(positions, 3));
        instancedGeometry.setAttribute('instanceScale', new THREE.InstancedBufferAttribute(scales, 3));

        const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });

        const matrix = new THREE.Matrix4();

        for (let i = 0; i < instanceCount; i++) {
            const mesh = new THREE.Mesh(instancedGeometry, material);
            mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
            this.meshes.push(mesh);
            // todo - how to grab this below part? THREE.add..
            scene.add(mesh);
        }
    }

    updatedComponent(entity, data) {
        
    }

    detachedComponent(entity) {
        
    }

    animate = (entity) => {
        // if (Math.abs(entity.animation.speed) < Math.abs(entity.animation.maxspeed)) {
        //     entity.animation.speed += parseFloat(entity.animation.acceleration)
        // }
        // entity.object3D.rotation.z += entity.animation.speed;

        // todo - how to let one entity have more than one object3D in it??
        // i have my list of meshes - go from there? or are they not linked as references - to resolve
        for (let i = 0; i < instanceCount; ++i) {
            const rotation = this.rotations[i];
            rotation.x += rotation.speed;
            rotation.y += rotation.speed;
            rotation.z += rotation.speed;

            matrix.identity()
                .makeRotationX(rotation.x)
                .makeRotationY(rotation.y)
                .makeRotationZ(rotation.z);

            this.meshes[i].instanceMatrix.multiplyMatrices(matrix, meshes[i].matrix);
        }
    }
}

let instModsSystem = new InstancingWithModsSystem();


//--------------


// function animate() {
//     requestAnimationFrame(animate);

//     for (let i = 0; i < instanceCount; i++) {
//         const rotation = rotations[i];
//         rotation.x += rotation.speed;
//         rotation.y += rotation.speed;
//         rotation.z += rotation.speed;

//         matrix.identity()
//             .makeRotationX(rotation.x)
//             .makeRotationY(rotation.y)
//             .makeRotationZ(rotation.z);

//         meshes[i].instanceMatrix.multiplyMatrices(matrix, meshes[i].matrix);
//     }

//     renderer.render(scene, camera);
// }
// animate();
