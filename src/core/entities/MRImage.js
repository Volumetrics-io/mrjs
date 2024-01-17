import * as THREE from 'three';

import { MRDivEntity } from 'mrjs/core/MRDivEntity';

import { mrjsUtils } from 'mrjs';

/**
 * @class MRImage
 * @classdesc Base html image represented in 3D space. `mr-image`
 * @augments MRDivEntity
 */
export class MRImage extends MRDivEntity {
    /**
     * @class
     * @description Constructs a base image entity using a UIPlane and other 3D elements as necessary.
     */
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.img = document.createElement('img');

        // Create the object3D. Dont need default value for geometry
        // until the connected call since this will get overwritten anyways.
        let material = new THREE.MeshStandardMaterial({
            side: 0,
        });
        let geometry = undefined;
        this.object3D = new THREE.Mesh(undefined, this.material);
        this.object3D.receiveShadow = true;
        this.object3D.renderOrder = 3;
        this.object3D.name = 'image';
    }

    /**
     * @function
     * @description Calculates the width of the img based on the img tag in the shadow root
     * @returns {number} - the resolved width
     */
    get width() {
        let width = mrjsUtils.CSS.pxToThree(this.objectFitDimensions.width);
        return width > 0 ? width : super.width;
    }

    /**
     * @function
     * @description Calculates the height of the img based on the img tag in the shadow root
     * @returns {number} - the resolved height
     */
    get height() {
        let height = mrjsUtils.CSS.pxToThree(this.objectFitDimensions.height);
        return height > 0 ? height : super.height;
    }

    /**
     * @function
     * @description Calculates the border radius of the img based on the img tag in the shadow root
     * @returns {number} - the resolved height
     */
    get borderRadii() {
        return this.compStyle.borderRadius.split(' ').map((r) => this.domToThree(r));
    }

    /**
     * @function
     * @description Callback function of MREntity - handles setting up this Image and associated 3D geometry style (from css) once it is connected to run as an entity component.
     */
    connected() {
        this.img = document.createElement('img');
        this.img.setAttribute('src', this.getAttribute('src'));
        this.img.setAttribute('style', 'object-fit:inherit; width:inherit');
        this.shadowRoot.appendChild(this.img);

        this.objectFitDimensions = { height: 0, width: 0 };
        this.computeObjectFitDimensions();

        // first creation of the object3D geometry. dispose is not needed but adding just in case.
        if (this.object3D.geometry != undefined) {
            this.object3D.geometry.dispose();
        }
        this.object3D.geometry = mrjsUtils.Geometry.UIPlane(this.width, this.height, this.borderRadii, 18);
        this.texture = new THREE.TextureLoader().load(this.img.src);
        this.object3D.material.map = this.texture;
    }

    /**
     * @function
     * @description Updates the style for the Image's border and background based on compStyle and inputted css elements.
     */
    updateStyle() {
        super.updateStyle();
        this.computeObjectFitDimensions();

        // make sure to dispose before new geometry created
        if (this.object3D.geometry != undefined) {
            this.object3D.geometry.dispose();
        }
        this.object3D.geometry = mrjsUtils.Geometry.UIPlane(this.width, this.height, this.borderRadii, 18);
    }

    /**
     * @function
     * @description Callback function of MREntity - Updates the image's cover,fill,etc based on the mutation request.
     * @param {object} mutation - the update/change/mutation to be handled.
     */
    mutated(mutation) {
        super.mutated();
        if (mutation.type != 'attributes' && mutation.attributeName == 'src') {
            this.img.setAttribute('src', this.getAttribute('src'));
            this.computeObjectFitDimensions();
            this.texture = new THREE.TextureLoader().load(this.img.src);
        }
    }

    /**
     * @function
     * @description computes the width and height values considering the value of object-fit
     */
    computeObjectFitDimensions() {
        switch (this.compStyle.objectFit) {
            case 'fill':
                this.objectFitDimensions = { width: this.offsetWidth, height: this.offsetHeight };

            case 'contain':
            case 'scale-down': {
                let ratio = Math.min(this.offsetWidth / this.img.width, this.offsetHeight / this.img.height);
                let scaledWidth = this.img.width * ratio;
                let scaledHeight = this.img.height * ratio;

                if (this.compStyle.objectFit === 'scale-down') {
                    scaledWidth = Math.min(scaledWidth, this.img.width);
                    scaledHeight = Math.min(scaledHeight, this.img.height);
                }

                this.objectFitDimensions = { width: scaledWidth, height: scaledHeight };
                break;
            }

            case 'cover': {
                let imageRatio = this.img.width / this.img.height;
                let containerRatio = this.offsetWidth / this.offsetHeight;

                if (containerRatio > imageRatio) {
                    this.objectFitDimensions = { width: this.offsetWidth, height: this.offsetWidth / imageRatio };
                } else {
                    this.objectFitDimensions = { width: this.offsetHeight * imageRatio, height: this.offsetHeight };
                }
                break;
            }

            case 'none':
                this.objectFitDimensions = { width: this.img.width, height: this.img.height };
                break;

            default:
                throw new Error(`Unsupported object-fit value ${this.compStyle.objectFit}`);
        }
    }

    /**
     * @function
     * @description Calculates the texture UV transformation change based on the image's aspect ratio.
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

customElements.get('mr-img') || customElements.define('mr-img', MRImage);
