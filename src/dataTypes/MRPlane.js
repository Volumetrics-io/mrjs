/**
 * @class MRPlane
 * @classdesc a name space representation of an MR Plane
 */
export class MRPlane {
    // The semantic label of the plane
    // possible values: wall, table, ceiling, floor
    label = null;

    // The orientation of the plane
    // possible values: horizontal, vertical
    orientation = null;

    // the physical dimensions of the plane
    dimensions = new THREE.Vector3();

    // a flag indicating whether or not the plane is currently occupied by an anchored entity
    occupied = false; // Each plane can have one Entity anchored to it for simplicity.

    // the THREE.js Mesh representation
    mesh = null;

    // the RAPIER physics body
    body = null;
}
