import * as THREE from 'three';
import System from '../core/System';
import { COLLIDER_CURSOR_MAP } from './RapierPhysicsSystem';

/**
 *
 */
export class DeveloperSystem extends System {
  /**
   *
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
