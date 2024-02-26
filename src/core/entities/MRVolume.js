import { MREntity } from 'mrjs/core/MREntity';

export class MRVolume extends MREntity {
    constructor() {
        super();
        this.volume = new THREE.Object3D();
        this.object3D.add(this.volume);
    }

    connected() {
        this.clipping = new MRClippingGeometry(new THREE.BoxGeometry(1, 1, 1));
        this.ignoreStencil = true;

        this.addEventListener('anchored', () => {
            if (this.plane) {
                let height = this.plane.dimensions.x <= this.plane.dimensions.z ? this.plane.dimensions.x : this.plane.dimensions.z;
                this.volume.position.y += height / 2;
                this.clipping.geometry.copy(new THREE.BoxGeometry(this.plane.dimensions.x, height, this.plane.dimensions.z));
            }
        });
    }
}

customElements.get('mr-volume') || customElements.define('mr-volume', MRVolume);
