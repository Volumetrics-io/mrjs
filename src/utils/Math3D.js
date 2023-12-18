import * as THREE from 'three';

/**
 * @namespace Math3D
 * @description Useful namespace for helping with Math3D and threejs utility functions
 */
var Math3D = {};

/**
 * @function
 * @memberof Math3D
 * @description Computes the bounding sphere of an inputted three group object.
 * @param {THREE.group} group - the group to be enclosed in the bounding sphere.
 * @param {THREE.group} relativeTo - object that the group is relative to. For example if the group is an apple held in a
 * character's hand, relativeTo would be the characters hand. When left as null, the bounding sphere defaults to the inputted groups original world matrix.
 * @returns {THREE.Sphere} - the resolved bounding sphere
 */
Math3D.computeBoundingSphere = function (group, relativeTo = null) {
    let sphere = new THREE.Sphere();
    let box = new THREE.Box3();

    box.setFromObject(group);
    box.getBoundingSphere(sphere);

    sphere.applyMatrix4(relativeTo ? relativeTo.matrixWorld : group.matrixWorld);

    return sphere;
};

export { Math3D };
