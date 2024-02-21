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
        let width = this.imageObjectFitDimensions?.width;
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
        let height = this.imageObjectFitDimensions?.height;
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

        this.imageObjectFitDimensions = { height: 0, width: 0 };
        this.computeObjectFitDimensions();

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
            this.computeObjectFitDimensions();

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

    _fill() {
        // HAPPY
        this.imageObjectFitDimensions = { width: this.parentElement.width, height: this.parentElement.height };
    }
    _cover() {
        const updateTextureForCover = (containerWidth, containerHeight, imageWidth, imageHeight) => {
            if (!this.texture) return;

            this.texture.matrixAutoUpdate = false;

            // Calculate aspect ratios
            const imageAspect = imageWidth / imageHeight;
            const containerAspect = containerWidth / containerHeight;

            let scaledWidth, scaledHeight, offsetX = 0, offsetY = 0;

            if (imageAspect > containerAspect) {
                // Image is wider than container, scale based on height
                scaledHeight = containerHeight;
                scaledWidth = scaledHeight * imageAspect;
                offsetX = -(scaledWidth - containerWidth) / 2; // Center the image
            } else {
                // Image is taller than container, scale based on width
                scaledWidth = containerWidth;
                scaledHeight = scaledWidth / imageAspect;
                offsetY = -(scaledHeight - containerHeight) / 2; // Center the image
            }

            // Apply UV transformation with the corrected scale
            // Since we're scaling the same in both directions, we ensure the aspect ratio is maintained
            this.texture.matrix.setUvTransform(offsetX, offsetY, scaledWidth, scaledHeight, 0, 0.5, 0.5);
        };


        const imageAspectRatio = this.img.width / this.img.height;
        const containerAspectRatio = this.parentElement.width / this.parentElement.height;


        // Set dimensions to fill the container while maintaining the aspect ratio
        if (containerAspectRatio > imageAspectRatio) {
            this.imageObjectFitDimensions = { width: this.parentElement.width, height: this.parentElement.height };
        } else {
            this.imageObjectFitDimensions = { width: this.parentElement.height * imageAspectRatio, height: this.parentElement.height };
        }
        updateTextureForCover(this.parentElement.width, this.parentElement.height, this.img.width, this.img.height);//

    }

    _none() {
        // HAPPY
        this.imageObjectFitDimensions = { width: this.img.width, height: this.img.height };
    }



    _contain() {
         // want contain to have the same object setup as fill, but texture setup is different
        // object
        this.imageObjectFitDimensions = { width: this.parentElement.width, height: this.parentElement.height };
        // the image texture
        console.log('--- scale-down', 'content width', this.contentWidth, 'actual width', this.width);
        let ratio = Math.min(this.parentElement.width / this.img.width, this.parentElement.height / this.img.height);
        let scaledWidth = this.img.width * ratio;
        let scaledHeight = this.img.height * ratio;

        if (this.compStyle.objectFit === 'scale-down') {
            scaledWidth = Math.min(scaledWidth, this.img.width);
            scaledHeight = Math.min(scaledHeight, this.img.height);
        }

        this.imageObjectFitDimensions = { width: scaledWidth, height: scaledHeight };
    }
    _scaleDown() {
        // want contain to have the same object setup as fill, but texture setup is different
        // object
        this.imageObjectFitDimensions = { width: this.parentElement.width, height: this.parentElement.height };
        // the image texture
        console.log('--- scale-down', 'content width', this.contentWidth, 'actual width', this.width);
        let ratio = Math.min(this.parentElement.width / this.img.width, this.parentElement.height / this.img.height);
        let scaledWidth = this.img.width * ratio;
        let scaledHeight = this.img.height * ratio;

        if (this.compStyle.objectFit === 'scale-down') {
            scaledWidth = Math.min(scaledWidth, this.img.width);
            scaledHeight = Math.min(scaledHeight, this.img.height);
        }

        this.imageObjectFitDimensions = { width: scaledWidth, height: scaledHeight };
    }

    /**
     * @function
     * @description computes the width and height values for the image considering the value of object-fit
     */
    computeObjectFitDimensions() {
        console.log('in image computeObjectFitDimensions');
        console.log(this.compStyle.objectFit);
        switch (this.compStyle.objectFit) {
            case 'fill':
                this._fill();
                break;
            case 'contain':
                this._contain();
                break;
            case 'scale-down':
                this.scaleDown();
                break;
            case 'cover':
                this._cover();
                break;
            case 'none':
                this._none();
                break;

            default:
                throw new Error(`Unsupported object-fit value ${this.compStyle.objectFit}`);
        }
    }
}

customElements.get('mr-img') || customElements.define('mr-img', MRImage);
