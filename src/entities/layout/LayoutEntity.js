import { MRUIEntity } from '../../UI/UIEntity';

/**
 *
 */
export class LayoutEntity extends MRUIEntity {
  /**
   *
   */
  constructor() {
    super();
    this.shuttle = new THREE.Group(); // will shift based on bounding box width
    this.object3D.userData.bbox = new THREE.Box3();
    this.object3D.userData.size = new THREE.Vector3();
    this.object3D.add(this.shuttle);

    this.shuttle.position.setZ(0.0001);
  }
}
