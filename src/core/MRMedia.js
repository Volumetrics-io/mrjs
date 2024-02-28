import * as THREE from 'three';

import { MRDivEntity } from 'mrjs/core/MRDivEntity';

import { mrjsUtils } from 'mrjs';

/**
 * @class MRMedia
 * @classdesc Base html media entity represented in 3D space. `mr-media`
 * @augments MRDivEntity
 */
export class MRMedia extends MRDivEntity {
    /**
     * @class
     * @description Constructs a base image entity using a UIPlane and other 3D elements as necessary.
     */
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

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

        // the media to be filled out.
        // for ex: document.createElement('video') or document.createElement('img');
        this.media = null;

        // This is a reference to the texture that is used as part of the
        // threejs material. Separating it out for easier use.
        // The texture is filled-in in the connected function.
        this.texture = null;

        // This is used to aid in the formatting for certain object-fit setups
        // ex: contain, scale-down
        this.subImageMesh = null;
    }

    createElement() {
        // to be overwritten by children
    }

    /**
     * @function
     * @description Calculates the width of the img based on the img tag in the shadow root
     * @returns {number} - the resolved width
     */
    get width() {
        let width = this.objectFitDimensions?.width;
        return width > 0 ? width : super.width;
    }

    /**
     * @function
     * @description Calculates the height of the img based on the img tag in the shadow root
     * @returns {number} - the resolved height
     */
    get height() {
        let height = this.objectFitDimensions?.height;
        return height > 0 ? height : super.height;
    }

    /**
     * @function
     * @description Callback function of MREntity - handles setting up this Image and associated 3D geometry style (from css) once it is connected to run as an entity component.
     */
    connected() {
        // TODO - the createElement line does exactly what the constructor this.media = ... line does
        this.createElement();
        this.media.setAttribute('src', mrjsUtils.html.resolvePath(this.getAttribute('src')));
        this.media.setAttribute('style', 'object-fit:inherit; width:inherit');
        this.shadowRoot.appendChild(this.media);

        this.objectFitDimensions = { height: 0, width: 0 };
        this.computeObjectFitDimensions();

        // first creation of the object3D geometry. dispose is not needed but adding just in case.
        if (this.getAttribute('src') == undefined) {
            return;
        }
        if (this.object3D.geometry !== undefined) {
            this.object3D.geometry.dispose();
        }
        this.object3D.geometry = mrjsUtils.geometry.UIPlane(this.width, this.height, this.borderRadii, 18);

        // the rest is filled out directly by MRImage/MRVideo's remaining connected functions
    }

    /**
     * @function
     * @description Callback function of MREntity - Updates the image's cover,fill,etc based on the mutation request.
     * @param {object} mutation - the update/change/mutation to be handled.
     */
    mutated(mutation) {
        super.mutated();
        if (mutation.type != 'attributes' && mutation.attributeName == 'src') {
            this.media.setAttribute('src', this.getAttribute('src'));
            this.computeObjectFitDimensions();

            mrjsUtils.material
                .loadTextureAsync(this.media.src)
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
        if (!this.texture || !this.media) {
            // We assume every media item exists and has its attached texture.
            // If texture doesnt exist, it's just not loaded in yet, meaning
            // we can skip the below until it is.
            return;
        }

        const _oldSubImageNotNeeded = () => {
            if (this.subImageMesh !== null) {
                mrjsUtils.model.disposeObject3D(this.subImageMesh);
                this.subImageMesh = null;
            }
        };

        let containerWidth = this.parentElement.width;
        let containerHeight = this.parentElement.height;
        let imageWidth = this.media.width;
        let imageHeight = this.media.height;
        const imageAspect = imageWidth / imageHeight;
        const containerAspect = containerWidth / containerHeight;
        switch (this.compStyle.objectFit) {
            case 'fill':
                _oldSubImageNotNeeded();
                this.objectFitDimensions = { width: containerWidth, height: containerHeight };

                break;

            case 'contain':
            case 'scale-down':
                // `contain` and `scale-down` are the same except for one factor:
                // - `contain` will always scale the image to fit
                // - `scale-down` will only scale the image to fit if the image is larger than the container

                // Plane dimensions in 3D space
                const planeWidth = containerWidth;
                const planeHeight = containerHeight;

                // Check if resize is required
                if (this.compStyle.objectFit === 'contain' || imageWidth > planeWidth || imageHeight > planeHeight) {
                    const scaleRatio = Math.min(planeWidth / imageWidth, planeHeight / imageHeight);
                    imageWidth *= scaleRatio;
                    imageHeight *= scaleRatio;
                }

                const imageGeometry = new THREE.PlaneGeometry(imageWidth, imageHeight);
                const imageMaterial = new THREE.MeshStandardMaterial({
                    map: this.texture,
                    transparent: true,
                });
                _oldSubImageNotNeeded();
                this.subImageMesh = new THREE.Mesh(imageGeometry, imageMaterial);

                // cleanup for final rendering setup
                let planeMesh = this.object3D;
                let imageMesh = this.subImageMesh;

                this.objectFitDimensions = {
                    width: planeWidth,
                    height: planeHeight,
                };
                planeMesh.material.visible = false;
                planeMesh.material.needsUpdate = true;
                planeMesh.add(imageMesh);

                imageMesh.material.visible = true;
                imageMesh.material.needsUpdate = true;

                break;

            case 'cover':
                _oldSubImageNotNeeded();

                this.texture.repeat.set(1, 1); // Reset scaling

                if (containerAspect > imageAspect) {
                    // Plane is wider than the texture
                    const scale = containerAspect / imageAspect;
                    this.texture.repeat.y = 1 / scale;
                    this.texture.offset.y = (1 - 1 / scale) / 2; // Center the texture vertically
                } else {
                    // Plane is taller than the texture
                    const scale = imageAspect / containerAspect;
                    this.texture.repeat.x = 1 / scale;
                    this.texture.offset.x = (1 - 1 / scale) / 2; // Center the texture horizontally
                }
                this.texture.needsUpdate = true; // Important to update the texture

                this.objectFitDimensions = {
                    width: containerWidth,
                    height: containerHeight,
                };

                break;

            case 'none':
                _oldSubImageNotNeeded();
                this.objectFitDimensions = { width: imageWidth, height: imageHeight };

                break;

            default:
                throw new Error(`Unsupported object-fit value ${this.compStyle.objectFit}`);
        }
    }
}

// TODO - dont want to allow users to create this as a generic item, just as a base class for all future
// media elements?
// customElements.get('mr-media') || customElements.define('mr-media', MRMedia);
