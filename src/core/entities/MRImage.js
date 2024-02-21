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
        function updateTextureForCover(aspect) {
            if (!this.texture) { return; }

            this.texture.matrixAutoUpdate = false;

            const imageAspect = this.texture.image.width / this.texture.image.height;
            let scale = (aspect < imageAspect) 
                ? { x : aspect / imageAspect,   y : 1.0                     }
                : { x : 1.0,                    y : imageAspect / aspect    };
            this.texture.matrix.setUvTransform(0, 0, scale.x, scale.y, 0, 0.5, 0.5);
        }

        // HAPPY
        let imageRatio = this.img.width / this.img.height;
        let containerRatio = this.parentElement.width / this.parentElement.height;
        if (containerRatio > imageRatio) {
            this.imageObjectFitDimensions = { width: this.parentElement.width, height: this.parentElement.height };
            updateTextureForCover(containerRatio);
        } else {
            this.imageObjectFitDimensions = { width: this.parentElement.height * imageRatio, height: this.parentElement.height };
        }
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
