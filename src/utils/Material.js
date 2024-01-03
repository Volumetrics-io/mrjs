import * as THREE from 'three';

/**
 * @namespace Material
 * @description Useful namespace for helping with Materials and threejs utility functions
 */
let Material = {};

/**
 * @function
 * @memberof Material
 * @param {object} parent - either a THREE.Group or a THREE.mesh/object
 * @description Given the parent, grabs either the parent's direct material or (in the case of a group) the
 * material of the first child hit.
 * @returns {object} material - the grabbed material
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
 * @param {object} parent - either a THREE.Group or a THREE.mesh/object
 * @param {object} material - a threejs material to be set for either the parent's direct material or 
 * (in the case of a group) the material of all children within the parent group.
 * @description Given the parent, grabs either the parents direct material or (in the case of a group) the
 * material of the first child hit.
 * @returns {object} parent - the updated parent object
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
