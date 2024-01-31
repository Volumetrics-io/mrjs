import * as THREE from 'three';
import { HTML } from 'mrjsUtils/HTML';

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
 * @description Given the parent, sets either the parents direct material or (in the case of a group) sets
 * the material of the parent and all its children
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

/**
 * @function
 * @memberof Material
 * @param {object} parent - either a THREE.Group or a THREE.mesh/object
 * @param {object} attributeMap - an object map { key: value } that represents what material properties
 * that need to be changed of this object. Make sure that the key values are of the form `'key'` including the quotes.
 * @description Given the parent, updates either the parents direct material or (in the case of a group) updates
 * the material of the parent and all its children based on the inputted attribute map
 * @returns {object} parent - the updated parent object
 */
Material.adjustObjectMaterialProperties = function (parent, attributeMap) {
    if (parent instanceof THREE.Group) {
        parent.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material) {
                mrjsUtils.JS.applyAttributes(child.material, attributeMap);
                child.material.needsUpdate = true;
            }
        });
    } else if (parent.material) {
        mrjsUtils.JS.applyAttributes(parent.material, attributeMap);
        parent.material.needsUpdate = true;
    }
    return parent;
};

// Function to load the texture asynchronously and return a promise
Material.loadTextureAsync = function (src) {
    return new Promise((resolve, reject) => {
        const textureLoader = new THREE.TextureLoader();
        let resolvedSrc = HTML.resolvePath(src);

        textureLoader.load(
            resolvedSrc,
            (texture) => {
                resolve(texture);
            },
            undefined,
            (error) => {
                reject(error);
            }
        );
    });
};

export { Material };
