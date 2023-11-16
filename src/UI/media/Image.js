import { MRUIEntity } from '../UIEntity';

/**
 *
 */
export class MRImage extends MRUIEntity {
  /**
   *
   */
  constructor() {
    super();
  }

  /**
   *
   */
  connected() {
    this.geometry = UIPlane(this.width, this.height, borderRadii, 18);
    this.material = new THREE.MeshBasicMaterial({
      side: 1,
      map: new THREE.TextureLoader().load(this.getAttribute('src'))
    });
    this.object3D = new THREE.Mesh(this.geometry, this.material);
  }

  /**
   *
   * @param mutation
   */
  mutated(mutation) {
    super.mutated();
    if (mutation.type != 'attributes' && mutation.attributeName == 'src') {
      this.object3D.material.map = new THREE.TextureLoader().load(this.getAttribute('src'));
    }
  }
}

customElements.get('mr-image') || customElements.define('mr-image', MRImage);
