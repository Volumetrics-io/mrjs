import * as THREE from 'three';

// todo - follow same convention as loadModel.js

const grabObjectMaterial = (parent) => {
    let foundMesh = false;
    let material;

    if (parent instanceof THREE.Group) {
        parent.traverse((child) => {
            if (!foundMesh && child instanceof THREE.Mesh) {
                material = child.material;
                foundMesh = true;
            }
        });
    } else {
        material = parent.material;
    }

    return material;
};
const setObjectMaterial = (parent, material) => {
    if (parent instanceof THREE.Group) {
        parent.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.material = material;
            }
        });
    } else {
        parent.material = material;
    }
    return parent;
};
