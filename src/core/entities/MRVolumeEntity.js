import { MREntity } from 'mrjs/core/MREntity';

/**
 * @class MRVolumeEntity
 * @classdesc Representation of a visible region in 3D space. Models and other entities can move
 * throughout the space and leave the space, yet will only be rendered in the visual area of
 * the volume. From a conceptual perspective it is considered a ‘clipping volume’.
 * @augments MRDivEntity
 */
export class MRVolumeEntity extends MREntity {
    /**
     * @class
     * @description Creates the volume as a base THREE.js object3D
     */
    constructor() {
        super();
        this.volume = new THREE.Object3D();
        this.object3D.add(this.volume);
    }

    /**
     * @function
     * @description Callback function of MREntity - handles creating clipping geometry around the entire volume for visible restrictions.
     */
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

customElements.get('mr-volume') || customElements.define('mr-volume', MRVolumeEntity);
