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
            transparent: true,
            // opacity: 0.5,
        });
        // Object3D for mr-image is the actual image itself in 3D space
        this.object3D = new THREE.Mesh(undefined, material);
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
        return this.textureWidth; // return super.width;
    }

    get textureWidth() {
        let width = this.imageObject3DFitDimensions?.width;
        return width > 0 ? width : super.width;
    }

    /**
     * @function
     * @description Calculates the height of the img based on the img tag in the shadow root
     * @returns {number} - the resolved height
     */
    get height() {
        return this.textureHeight; //super.height;
    }

    get textureHeight() {
        let height = this.imageObject3DFitDimensions?.height;
        return height > 0 ? height : super.height;
    }

    /**
     * @function
     * @description Callback function of MREntity - handles setting up this Image and associated 3D geometry style (from css) once it is connected to run as an entity component.
     */
    connected() {
        this.img = document.createElement('img');
        this.img.setAttribute('src', mrjsUtils.html.resolvePath(this.getAttribute('src')));
        this.img.setAttribute('style', 'object-fit:inherit; width:inherit');
        this.shadowRoot.appendChild(this.img);

        this.imageObject3DFitDimensions = { height: 0, width: 0 };
        this.computeImageObject3DFitDimensions();

        // first creation of the object3D geometry. dispose is not needed but adding just in case.
        if (this.object3D.geometry !== undefined) {
            this.object3D.geometry.dispose();
        }
        this.object3D.geometry = mrjsUtils.geometry.UIPlane(this.width, this.height, this.borderRadii, 18);
        mrjsUtils.material
            .loadTextureAsync(this.img.src)
            .then((texture) => {
                this.texture = texture;
                this.object3D.material.map = texture;
            })
            .catch((error) => {
                console.error('Error loading texture:', error);
            });
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
            this.computeImageObject3DFitDimensions();

            mrjsUtils.material
                .loadTextureAsync(this.img.src)
                .then((texture) => {
                    this.texture = texture;
                    this.object3D.material.map = texture;
                })
                .catch((error) => {
                    console.error('Error loading texture:', error);
                });
        }
    }

    /**
     * @function
     * @description computes the width and height values for the image considering the value of object-fit
     */
    computeObjectFitDimensions() {
        console.log('in image computeObjectFitDimensions');
        console.log('this.')
        console.log(this.compStyle.objectFit);
        switch (this.compStyle.objectFit) {
            case 'fill':
                console.log('fill', 'content width', this.contentWidth, 'actual width', this.width);
                this.imageObject3DFitDimensions = { width: this.parentElement.width, height: this.parentElement.height };
                break
            case 'contain':
                console.log('contain');
            case 'scale-down':
                console.log('--- scale-down', 'content width', this.contentWidth, 'actual width', this.width);
                let ratio = Math.min(this.parentElement.width / this.img.width, this.parentElement.height / this.img.height);
                let scaledWidth = this.img.width * ratio;
                let scaledHeight = this.img.height * ratio;

                if (this.compStyle.objectFit === 'scale-down') {
                    scaledWidth = Math.min(scaledWidth, this.img.width);
                    scaledHeight = Math.min(scaledHeight, this.img.height);
                }

                this.imageObject3DFitDimensions = { width: scaledWidth, height: scaledHeight };
                break;
            case 'cover':
                console.log('cover', 'content width', this.contentWidth, 'actual width', this.width);
                let imageRatio = this.img.width / this.img.height;
                let containerRatio = this.parentElement.width / this.parentElement.height;
                if (containerRatio > imageRatio) {
                    this.imageObject3DFitDimensions = { width: this.parentElement.width, height: this.parentElement.height };
                    if (this.texture) {
                        this.cover(this.texture, containerRatio);
                    }
                } else {
                    this.imageObject3DFitDimensions = { width: this.parentElement.height * imageRatio, height: this.parentElement.height };
                }
                console.log(this.imageObject3DFitDimensions);
                break;

            case 'none':
                console.log('none', 'content width', this.contentWidth, 'actual width', this.width);
                this.imageObject3DFitDimensions = { width: this.img.width, height: this.img.height };
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
