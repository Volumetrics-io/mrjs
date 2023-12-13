import { MRUIEntity } from 'MRJS/Core/MRUIEntity';
import { UIPlane } from 'MRJS/Utils/Geometry';

/**
 * @class Image
 * @classdesc Base html image represented in 3D space. `mr-image`
 * @augments MRUIEntity
 */
export class Image extends MRUIEntity {
    /**
     * Constructs a base image entity using a UIPlane and other 3D elements as necessary.
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
     * Callback function of MREntity -
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
     * Updates the style for the Image's border and background based on compStyle and inputted css elements.
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
     * Callback function of MREntity - Updates the image's cover,fill,etc based on the mutation request.
     * @param {object} mutation - the update/change/mutation to be handled.
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
     * Calculates the texture UV transformation change based on the image's aspect ratio.
     * @param {object} texture - the texture to augment
     * @param {number} aspect - a given expected aspect ratio
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

customElements.get('mr-img') || customElements.define('mr-img', Image);
