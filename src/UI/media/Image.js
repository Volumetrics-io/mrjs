import { UIPlane } from '../../geometry/UIPlane';
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
        this.geometry = UIPlane(1, 1, 0.0001, 18);
        this.material = new THREE.MeshStandardMaterial({
            side: 0,
        });
        this.object3D = new THREE.Mesh(this.geometry, this.material);
        this.object3D.receiveShadow = true;
        this.object3D.renderOrder = 3;
    }

    /**
     *
     */
    connected() {
        const borderRadii = this.compStyle.borderRadius.split(' ').map((r) => this.domToThree(r));
        this.object3D.geometry = UIPlane(this.width, this.height, borderRadii, 18);
        this.texture = new THREE.TextureLoader().load(this.getAttribute('src'), (texture) => {
            switch (this.compStyle.objectFit) {
                case 'cover':
                    this.cover(texture, this.width / this.height);
                    break;
                case 'fill':
                default:
                    break;
            }
        });
        this.object3D.material.map = this.texture;

        // slight bump needed to avoid overlapping, glitchy visuals.
        // I'm sure there's a better solution lol.
        this.object3D.position.z += 0.001;
    }

    /**
     *
     */
    updateStyle() {
        super.updateStyle();
        const borderRadii = this.compStyle.borderRadius.split(' ').map((r) => this.domToThree(r));
        this.object3D.geometry = UIPlane(this.width, this.height, borderRadii, 18);
        if (this.texture.image) {
            this.cover(this.texture, this.width / this.height);
        }
    }

    /**
     *
     * @param mutation
     */
    mutated(mutation) {
        super.mutated();
        if (mutation.type != 'attributes' && mutation.attributeName == 'src') {
            this.object3D.material.map = new THREE.TextureLoader().load(this.getAttribute('src'), (texture) => {
                switch (this.compStyle.objectFit) {
                    case 'cover':
                        this.cover(texture, this.width / this.height);
                        break;
                    case 'fill':
                    default:
                        break;
                }
            });
        }
    }

    /**
     *
     * @param texture
     * @param aspect
     */
    cover(texture, aspect) {
        texture.matrixAutoUpdate = false;

        const imageAspect = texture.image.width / texture.image.height;

        if (aspect < imageAspect) {
            texture.matrix.setUvTransform(0, 0, aspect / imageAspect, 1, 0, 0.5, 0.5);
        } else {
            texture.matrix.setUvTransform(0, 0, 1, imageAspect / aspect, 0, 0.5, 0.5);
        }
    }
}

customElements.get('mr-img') || customElements.define('mr-img', MRImage);
