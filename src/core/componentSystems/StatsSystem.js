import { MREntity } from 'mrjs/core/MREntity';
import { MRSystem } from 'mrjs/core/MRSystem';
import { MRStatsEntity } from 'mrjs/core/entities/MRStatsEntity';

const REFRESH_SEC = 1.0;

/**
 * @class StatsSystem
 * @classdesc Track the elapsed time across frames and update the fps counter periodically for `mr-stats`.
 * @augments MRSystem
 */
export class StatsSystem extends MRSystem {
    /**
     * @class
     * @description StatsSystem's default constructor
     */
    constructor() {
        super(false);
    }

    /**
     * @function
     * @description Registers MRStatsEntity
     * @param {MREntity} entity - given entity that might be handled by this system
     */
    onNewEntity(entity) {
        if (entity instanceof MRStatsEntity) {
            this.registry.add(entity);
        }
    }

    /**
     * @function
     * @description Tracks the elapsed time and updates the fps counter periodically.
     * @param {number} deltaTime - the time elapsed since the last update call
     */
    update(deltaTime) {
        for (const stats of this.registry) {
            stats.frame++;
            stats.elapsedTime += deltaTime;
            if (stats.elapsedTime >= REFRESH_SEC) {
                // Note: We dont want to directly update the stats.textContent html element
                // as that will fill it in as an html value on the screen in 2D. We only
                // want to update the stats.textObj.text here directly for the 3D element
                // to update.
                stats.textObj.text = (stats.frame / stats.elapsedTime).toFixed(2) + ' fps';

                stats.frame = 0;
                stats.elapsedTime = 0.0;
            }
        }
    }
}
