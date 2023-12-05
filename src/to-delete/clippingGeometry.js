// NOTE: There is probably a better way to do this

// TODO - separate this out so it's only needed within the Clipping Geometry System. This is not useful being separate from that
// must do that before deletion

/**
 *
 */
export class ClippingGeometry {
    planes = [];

    planeIDs = [];

    intersection = false;

    global = false;

    /**
     *
     * @param geometry
     */
    constructor(geometry) {
        this.geometry = geometry;
    }
}
