import * as THREE from 'three';

/**
 * @namespace Material
 * @description Useful namespace for helping with Materials and threejs utility functions
 */
let Material = {};

/**
 * @function
 * @memberof Material
 * @description ...
 */
Material.getObjectMaterial = function (parent) {
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

/**
 * @function
 * @memberof Material
 * @description ...
 */
Material.setObjectMaterial = function (parent, material) {
    if (parent instanceof THREE.Group) {
        parent.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.material = material;
                child.material.needsUpdate = true;
            }
        });
    } else {
        parent.material = material;
        parent.material.needsUpdate = true;
    }
    return parent;
};

export { Material };
