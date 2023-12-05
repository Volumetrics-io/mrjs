import * as THREE from 'three';

import { MRSystem } from 'MRJS/core/mrSystem';
import { COLLIDER_CURSOR_MAP } from 'MRJS/utils/physics';

// TODO - is this item still needed?

/**
 *
 */
export class DeveloperSystem extends MRSystem {
    /**
     * DeveloperSystem's default constructor
     * // TODO - add more info
     */
    constructor() {
        super();

        const devVolume = document.querySelector('mr-dev-volume');

        this.tempWorldPosition = new THREE.Vector3();
        this.tempWorldQuaternion = new THREE.Quaternion();

        this.registry.add(devVolume);
    }

    /**
     *
     * @param deltaTime
     * @param frame
     */
    update(deltaTime, frame) {
        for (const env of this.registry) {
            for (const tool of env.registry) {
                this.updateBody(tool);
                if (tool.grabbed) {
                    this.app.physicsWorld.contactsWith(tool.collider, (collider2) => {
                        const cursor = COLLIDER_CURSOR_MAP[collider2.handle];

                        if (cursor) {
                            tool.onGrab(collider2.translation());
                        }
                    });
                }
            }
        }
    }

    /**
     *
     * @param tool
     */
    updateBody(tool) {
        tool.object3D.getWorldPosition(this.tempWorldPosition);
        tool.body.setTranslation({ ...this.tempWorldPosition }, true);

        tool.object3D.getWorldQuaternion(this.tempWorldQuaternion);
        tool.body.setRotation(this.tempWorldQuaternion, true);
    }
}
