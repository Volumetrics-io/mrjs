/**
 * @class MRClippingGeometry
 * @classdesc Geometry used in the clipping plane step. Separated out for clarity in the calculations.
 */
export class MRClippingGeometry {
    planes = [];

    intersection = false;

    global = false;

    // NOTE: There is probably a better way to do this

    // TODO - separate this out so it's only needed within the Clipping Geometry System. This is not useful being separate from that
    // must do that before deletion

    /**
     * @class
     * @description Constructor for the clipping geometry class. Sets the internal geometry object to the geometry that is passed through.
     * @param {object} geometry - The geometry to be captured internally by `this.geometry`.
     */
    constructor(geometry) {
        // Limits to one segment BoxGeometry instance like created with
        // "new BoxGeometry(width, height, depth);" for simplicity for now.

        // The geometry type limitation may not be immediately obvious to users of this module.
        // If unsupported geometry is passed, no errors may be raised, but the behavior may
        // become erratic, and such bugs can be difficult to investigate. This check is in
        // place to avoid such unnecessary effort.
        if (geometry.type !== 'BoxGeometry' || geometry.parameters?.widthSegments !== 1 || geometry.parameters?.heightSegments !== 1 || geometry.parameters?.depthSegments !== 1) {
            throw new Error('Unsupported Clipping geometry type.');
        }

        this.geometry = geometry;
    }
}
