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

        // the texture is filled-in in the connected function
        this.texture = null;
        this.subImageMesh = null; // only used for 'contain' and 'scaleDown' object-fit case
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
        let width = this.objectFitDimensions?.width;
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
        let height = this.objectFitDimensions?.height;
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

        this.objectFitDimensions = { height: 0, width: 0 };
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

    _subImageNotNeeded() {
        if (this.subImageMesh !== undefined && this.subImageMesh != null) {
            mrjsUtils.model.disposeObject3D(this.subImageMesh);
        }
    }


    _contain() {
        console.log('in contain');
         // want contain to have the same object setup as fill, but texture setup is different

        
    }
    
    _scaleDown() {
        // want contain to have the same object setup as fill, but texture setup is different
        // object
        this.objectFitDimensions = { width: this.parentElement.width, height: this.parentElement.height };
        // the image texture
        console.log('--- scale-down', 'content width', this.contentWidth, 'actual width', this.width);
        let ratio = Math.min(this.parentElement.width / this.img.width, this.parentElement.height / this.img.height);
        let scaledWidth = this.img.width * ratio;
        let scaledHeight = this.img.height * ratio;

        scaledWidth = Math.min(scaledWidth, this.img.width);
        scaledHeight = Math.min(scaledHeight, this.img.height);

        this.objectFitDimensions = { width: scaledWidth, height: scaledHeight };
    }

    /**
     * @function
     * @description computes the width and height values for the image considering the value of object-fit
     */
    computeObjectFitDimensions() {
        if (!this.texture) {
            // We assume every image has its attached texture.
            // If texture doesnt exist, it's just not loaded in yet, meaning
            // we can skip the below until it is.
            return;
        }

        let containerWidth = this.parentElement.width;
        let containerHeight = this.parentElement.height;
        let imageWidth = this.img.width;
        let imageHeight = this.img.height;
        const imageAspect = imageWidth / imageHeight;
        const containerAspect = containerWidth / containerHeight;
        switch (this.compStyle.objectFit) {
            case 'fill':
                this._subImageNotNeeded();
                this.objectFitDimensions = { width: containerWidth, height: containerHeight };

                break;

            case 'contain':
                // Plane dimensions in 3D space
                const planeWidth = containerWidth;
                const planeHeight = containerHeight;
                this.objectFitDimensions = {
                    width: containerWidth,
                    height: containerHeight
                };

                // Check if the image's dimensions are larger than the plane's in 3D space
                // Only resize if image's dimensions are larger than the plane's; otherwise, 
                // leave them at the image's original size.
                if (imageWidth > planeWidth || imageHeight > planeHeight) {
                    const widthRatio = planeWidth / imageWidth;
                    const heightRatio = planeHeight / imageHeight;
                    const scaleRatio = Math.min(widthRatio, heightRatio);

                    imageWidth = scaleRatio * imageWidth;
                    imageHeight = scaleRatio * imageHeight;
                }

                const imageGeometry = new THREE.PlaneGeometry(imageWidth, imageHeight);
                const imageMaterial = new THREE.MeshStandardMaterial({
                    map: this.texture,
                    transparent: true
                });
                this._subImageNotNeeded();
                this.subImageMesh = new THREE.Mesh(imageGeometry, imageMaterial);

                // make them render properly
                let planeMesh = this.object3D;
                let imageMesh = this.subImageMesh;
                planeMesh.material.visible = false;
                planeMesh.add(imageMesh);
                imageMesh.material.visible = true;

                break;

            case 'scale-down':
                this._scaleDown();

                break;

            case 'cover':
                this._subImageNotNeeded();
                this.texture.matrixAutoUpdate = false;
                this.subImageMesh

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
                    objectHeight = containerHeight;
                    // objectHeight - doesnt match scaled Height to prevent overflow
                    // TODO - should it and we just clip it?
                }

                // Apply UV transformation with the corrected scale and update the model to hold it
                this.texture.matrix.setUvTransform(offsetX, offsetY, scaledWidth, scaledHeight, 0, 0.5, 0.5);
                this.objectFitDimensions = {
                    width: objectWidth,
                    height: objectHeight,
                };

                break;

            case 'none':
                this._subImageNotNeeded();
                this.objectFitDimensions = { width: this.img.width, height: this.img.height };

                break;

            default:
                throw new Error(`Unsupported object-fit value ${this.compStyle.objectFit}`);
        }
    }
}

customElements.get('mr-img') || customElements.define('mr-img', MRImage);
