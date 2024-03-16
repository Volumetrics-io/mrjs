import { mrjsUtils } from 'mrjs';
import { MRSystem } from 'mrjs/core/MRSystem';
import { MRStats } from 'mrjs/core/entities/MRStats';

import Stats from 'stats.js';

import { HTMLMesh } from 'three/addons/interactive/HTMLMesh.js';
import { InteractiveGroup } from 'three/addons/interactive/InteractiveGroup.js';

// TODO: JSDoc

export class StatsSystem extends MRSystem {
    constructor() {
        super(false);
        this.statsEntities = [];
    }

    update() {
        for (const entity of this.statsEntities) {
            if (entity.stats === null && this.app) {
                entity.stats = new Stats();
                entity.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
                document.body.appendChild(entity.stats.dom);

                // Note: InteractiveGroup API is refactored in the newer Three.js rev.
                //       Don't forget to update the followings when upgrading Three.js
                entity.interactiveGroup = new InteractiveGroup(this.app.renderer, this.app.camera);
                entity.object3D.add(entity.interactiveGroup);

                // Note: HTMLMesh seems to have a bug that image is not displayed at a correct position.
                //       in Three.js r161 or older.
                // TODO: Upgrade Three.js to fix

                // Question: Circle pointer doesn't seem to be displayed on the Stats panel object
                //           and the clickable area seems to be a difference place from the panel object, why?
                // TODO: Fix it
                entity.statsMesh = new HTMLMesh(entity.stats.dom);
                entity.interactiveGroup.add(entity.statsMesh);
            }

            if (entity.stats) {
                entity.stats.update();
                if (mrjsUtils.xr.isPresenting) {
                    entity.statsMesh.visible = true;
                    entity.statsMesh.material.map.update();
                } else {
                    entity.statsMesh.visible = false;
                }
            }
        }
    }

    onNewEntity(entity) {
        // Question: How can we detect the removal of entities?
        if (entity instanceof MRStats) {
            this.statsEntities.push(entity);
        }
    }
}