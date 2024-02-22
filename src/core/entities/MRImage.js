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
        // HAPPY
        let containerWidth = this.parentElement.width;
        let containerHeight = this.parentElement.height;
        let imageWidth = this.img.width;
        let imageHeight = this.img.height;

        
        this.texture.matrixAutoUpdate = false;

        // Calculate aspect ratios
        const imageAspect = imageWidth / imageHeight;
        const containerAspect = containerWidth / containerHeight;

        // Calculate scalings and offsets
        let scaledWidth, scaledHeight, offsetX, offsetY, objectWidth, objectHeight;
        if (imageAspect > containerAspect) {
            // Scale image texture to fit container height, calculate width to maintain aspect ratio
            scaledHeight = containerHeight;
            scaledWidth = scaledHeight * imageAspect;

            // Center horizontally
            offsetX = (containerWidth - scaledWidth) / 2;
            offsetY = 0;

            // the object model itself
            // todo: this might need to be container width instead, but this works for now
            //          see note when calculating the else statement's object Height.
            objectWidth = scaledWidth;
            objectHeight = scaledHeight;
        } else {
            // Scale image texture to fit container width, calculate height to maintain aspect ratio
            scaledWidth = containerWidth;
            scaledHeight = scaledWidth / imageAspect;

            // Center vertically
            offsetX = 0;
            offsetY = (containerHeight - scaledHeight) / 2;

            // the object model itself
            objectWidth = scaledWidth;
            objectHeight = containerHeight; // this doesnt match scaled Height to prevent overflow
        }

        // Apply UV transformation with the corrected scale and update the model to hold it
        this.texture.matrix.setUvTransform(offsetX, offsetY, scaledWidth, scaledHeight, 0, 0.5, 0.5);
        this.imageObjectFitDimensions = {
            width: objectWidth,
            height: objectHeight,
        };
    }

    _none() {
        // HAPPY
        this.imageObjectFitDimensions = { width: this.img.width, height: this.img.height };
    }


    _contain() {
         // want contain to have the same object setup as fill, but texture setup is different
        // object
        this.imageObjectFitDimensions = { width: this.parentElement.width, height: this.parentElement.height };
        // // the image texture
        // console.log('--- scale-down', 'content width', this.contentWidth, 'actual width', this.width);
        // let ratio = Math.min(this.parentElement.width / this.img.width, this.parentElement.height / this.img.height);
        // let scaledWidth = this.img.width * ratio;
        // let scaledHeight = this.img.height * ratio;

        // this.imageObjectFitDimensions = { width: scaledWidth, height: scaledHeight };
// Calculate aspect ratios

        let objectWidth = this.parentElement.width;
        let objectHeight = this.parentElement.height;
        let imageWidth = this.img.width;
        let imageHeight = this.img.height;


  // Calculate the aspect ratios
  const imageAspect = imageWidth / imageHeight;
  const objectAspect = objectWidth / objectHeight;

  let uvScaleX, uvScaleY, uvOffsetX, uvOffsetY;

  if (imageAspect > objectAspect) {
    // Image is wider than object: Fit to height and calculate width scaling
    uvScaleY = 1; // Use full height of the image
    uvScaleX = objectAspect / imageAspect; // Scale width to maintain aspect ratio
    uvOffsetX = (1 - uvScaleX) / 2; // Center horizontally
    uvOffsetY = 0; // No vertical offset
  } else {
    // Image is taller than object or they have the same aspect ratio: Fit to width and calculate height scaling
    uvScaleX = 1; // Use full width of the image
    uvScaleY = imageAspect / objectAspect; // Scale height to maintain aspect ratio
    uvOffsetX = 0; // No horizontal offset
    uvOffsetY = (1 - uvScaleY) / 2; // Center vertically
  }

  // Apply the UV transformation
  // This pseudocode assumes you have a way to set UV transformations for your texture. Adjust as necessary.
  this.texture.matrix.setUvTransform(uvOffsetX, uvOffsetY, uvScaleX, uvScaleY, 0, 0.5, 0.5);
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

        scaledWidth = Math.min(scaledWidth, this.img.width);
        scaledHeight = Math.min(scaledHeight, this.img.height);

        this.imageObjectFitDimensions = { width: scaledWidth, height: scaledHeight };
    }

    /**
     * @function
     * @description computes the width and height values for the image considering the value of object-fit
     */
    computeObjectFitDimensions() {
        console.log('in image computeObjectFitDimensions');
        console.log(this.compStyle.objectFit);
        if (!this.texture) {
            // We assume every image has its attached texture.
            // If texture doesnt exist, it's just not loaded in yet, meaning
            // we can skip the below until it is.
            return;
        }
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
