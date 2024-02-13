import * as THREE from 'three';

/**
 * @namespace js
 * @description Useful namespace for helping with common needed JS quick functions
 */
let js = {};

/**
 * @function
 * @memberof js
 * @param {object} instance - the object whole class is being checked
 * @param {object} BaseClass - the given name of the BaseClass being checked against. Not in quotes.
 * @example JS.isInstanceOfBaseClassOnly(entity, MRDivEntity) would return true only on <mr-div> entities.
 * @description Given the parent, grabs either the parent's direct material or (in the case of a group) the
 * material of the first child hit.
 * @returns {object} material - the grabbed material
 */
js.isInstanceOfBaseClassOnly = function (instance, BaseClass) {
    return instance.constructor === BaseClass;
};

js.applyAttributes = function (object, attribMap) {
    Object.entries(attributeMap).forEach(([key, value]) => {
        if (key in object) {
            object[key] = value;
        }
    });
};

export { js };
