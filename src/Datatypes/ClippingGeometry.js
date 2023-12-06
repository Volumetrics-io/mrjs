// NOTE: There is probably a better way to do this

// TODO - separate this out so it's only needed within the Clipping Geometry System. This is not useful being separate from that
// must do that before deletion

/**
 * @class
 * @classdesc TODO
 */
export class ClippingGeometry {
    planes = [];

    planeIDs = [];

    intersection = false;

    global = false;

    /**
     *
     * @param {object} geometry - TODO
     */
    constructor(geometry) {
        this.geometry = geometry;
    }
}
