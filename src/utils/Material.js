import * as THREE from 'three';

/**
 * @namespace Material
 * @description Useful namespace for helping with Materials and threejs utility functions
 */
let Material = {};

// todo - follow same convention as loadModel.js

/**
 * @function
 * @memberof Material
 * @description ...
 */
Material.getObjectMaterial = function (parent) {
    // let foundMesh = false;
    // let material;

    // if (parent instanceof THREE.Group) {
    //     parent.traverse((child) => {
    //         if (!foundMesh && child instanceof THREE.Mesh) {
    //             material = child.material;
    //             foundMesh = true;
    //         }
    //     });
    // } else {
    //     material = parent.material;
    // }

    // return material;

    if (parent instanceof THREE.Group) {
        // Traverse the group to find the first Mesh and return its material
        let material = null;
        parent.traverse((child) => {
            if (!material && child instanceof THREE.Mesh) {
                material = child.material;
            }
        });
        return material;
    } else if (parent instanceof THREE.Mesh) {
        // If it's a Mesh, return its material directly
        return parent.material;
    } else {
        // Handle unsupported object types or cases where no material is found
        console.warn("Unsupported object type or no material found.");
        return null;
    }
};

/**
 * @function
 * @memberof Material
 * @description ...
 */
Material.setObjectMaterial = function (parent, material) {
    // if (parent instanceof THREE.Group) {
    //     parent.traverse((child) => {
    //         if (child instanceof THREE.Mesh) {
    //             child.material = material;
    //             child.material.needsUpdate = true;
    //         }
    //     });
    // } else {
    //     parent.material = material;
    //     parent.material.needsUpdate = true;
    // }
    // return parent;

    if (parent instanceof THREE.Group) {
        parent.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                if (child.material) {
                    // Only update if the child has a material
                    child.material = material;
                    child.material.needsUpdate = true;
                }
            }
        });
    } else if (parent instanceof THREE.Mesh) {
        if (parent.material) {
            // Only update if the parent has a material
            parent.material = material;
            parent.material.needsUpdate = true;
        }
    } else {
        // Handle unsupported object types
        console.warn("Unsupported object type.");
    }
    
    return parent;
};

export { Material };
