import * as THREE from 'three';

/**
 * @namespace js
 * @description Useful namespace for helping with common needed JS quick functions
 */
let js = {};

/**
 * @function
 * @memberof js
 * @param {object} instance - the object whose class is being checked
 * @param {object} BaseClass - the given name of the BaseClass being checked against. Not in quotes.
 * @example JS.isInstanceOfBaseClassOnly(entity, MRDivEntity) would return true only on <mr-div> entities.
 * @description Given the parent, grabs either the parent's direct material or (in the case of a group) the
 * material of the first child hit.
 * @returns {object} material - the grabbed material
 */
js.isInstanceOfBaseClassOnly = function (instance, BaseClass) {
    return instance.constructor === BaseClass;
};

js.getSuperclassNameFromInstance = function (instance) {
    console.log('inside getSuperclassNameFromInstance');
    // Get the prototype of the instance's constructor (i.e., Dog.prototype)
    const instanceProto = Object.getPrototypeOf(instance);
    // Get the prototype of the instanceProto (i.e., Animal.prototype)
    const superProto = Object.getPrototypeOf(instanceProto);
    console.log('instanceProto:', instanceProto, 'superProto:', superProto);
    // Check if there's a superclass and return its name
    if (superProto && superProto.constructor) {
        return superProto.constructor.name;
    }
    return null;  // If no superclass, return null
}

js.applyAttributes = function (object, attribMap) {
    Object.entries(attributeMap).forEach(([key, value]) => {
        if (key in object) {
            object[key] = value;
        }
    });
};

js.isVariableDeclared = function (myVar) {
    return typeof myVar !== 'undefined';
};

export { js };
