/**
 * @class ClippingGeometry
 * @classdesc Geometry used in the clipping plane step. Separated out for clarity in the calculations.
 */
export class ClippingGeometry {
    planes = [];

    planeIDs = [];

    intersection = false;

    global = false;

    // NOTE: There is probably a better way to do this

    // TODO - separate this out so it's only needed within the Clipping Geometry System. This is not useful being separate from that
    // must do that before deletion

    /**
     * @constructor
     * @description Constructor for the clipping geometry class. Sets the internal geometry object to the geometry that is passed through.
     * @param {object} geometry - The geometry to be captured internally by `this.geometry`.
     */
    constructor(geometry) {
        this.geometry = geometry;
    }
}
