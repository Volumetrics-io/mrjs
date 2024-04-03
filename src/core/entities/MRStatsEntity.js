import { MRTextEntity } from 'mrjs/core/entities/MRTextEntity';

/**
 * @class MRStatsEntity
 * @classdesc The FPS counter entity. For simplicity, easy implementation, and good performance,
 *            it is based on MRTextEntity and just shows the FPS counter number as text for now.
 *            Ideally we want to improve later, like improving the visual quality and more info.
 *            Note that stats entity that has a huge bad performance impact doesn't really make
 *            sense so it should be kept simple and fast.
 * @augments MRTextEntity
 */
export class MRStatsEntity extends MRTextEntity {
    /**
     * @class
     * @description Constructor for the MRStatsEntity object.
     *              Initializes some variables used to track and calculate the fps.
     */
    constructor() {
        super();
        this.frame = 0;
        this.elapsedTime = 0.0;
    }
}

customElements.get('mr-stats') || customElements.define('mr-stats', MRStatsEntity);
