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
     * @param {MREntity} entity
     */
    onNewEntity(entity) {
        if (entity instanceof MRStatsEntity) {
            this.registry.add(entity);
        }
    }

    /**
     * @function
     * @description Tracks the elapsed time and updates the fps counter periodically.
     * @param {number} deltaTime
     */
    update(deltaTime) {
        for (const stats of this.registry) {
            stats.frame++;
            stats.elapsedTime += deltaTime;
            if (stats.elapsedTime >= REFRESH_SEC) {
                stats.textContent = (stats.frame / stats.elapsedTime).toFixed(2) + 'fps';

                // Ideally this copying from .textContent to .textObj.text should
                // be done in TextSystem but currently there doesn't seem to be
                // a way to fire it from outside of TextSystem. As a workaround
                // explicitly copying here.
                // TODO: Fix it.
                stats.textObj.text = stats.textContent;

                stats.frame = 0;
                stats.elapsedTime = 0.0;
            }
        }
    }
}
