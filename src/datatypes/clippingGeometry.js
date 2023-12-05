// NOTE: There is probably a better way to do this

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
