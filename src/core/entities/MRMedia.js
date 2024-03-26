import * as THREE from 'three';

import { MRDiv } from 'mrjs/core/entities/MRDiv';

import { mrjsUtils } from 'mrjs';

/**
 * @class MRMedia
 * @classdesc Base html media entity represented in 3D space. `mr-media`
 * @augments MRDiv
 */
export class MRMedia extends MRDiv {
    /**
     * @class
     * @description Constructs a base media entity using a UIPlane and other 3D elements as necessary.
     */
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        // Create the object3D. Dont need default value for geometry
        // until the connected call since this will get overwritten anyways.
        const material = new THREE.MeshStandardMaterial({
            side: THREE.FrontSide,
        });
        // Object3D for MRMedia (mrimage,mrvideo,etc) is the actual image/video/etc itself in 3D space
        this.object3D = new THREE.Mesh(undefined, material);
        this.object3D.receiveShadow = true;
        this.object3D.renderOrder = 3;
        this.object3D.name = 'media';

        // the media to be filled out.
        // for ex: document.createElement('video') or document.createElement('img');
        this.media = null;

        // This is a reference to the texture that is used as part of the
        // threejs material. Separating it out for easier updating after it is loaded.
        // The texture is filled-in in the connected function.
        this.texture = null;

        // This is used to aid in the formatting for certain object-fit setups
        // ex: contain, scale-down
        this.subMediaMesh = new THREE.Mesh();
        this.subMediaMesh.receiveShadow = true;
        this.subMediaMesh.renderOrder = 3;
        this.subMediaMesh.name = 'subMedia';
        this.object3D.add(this.subMediaMesh);
    }

    /**
     * @function
     * @description Calculates the width of the media based on the media tag in the shadow root
     * @returns {number} - the resolved width
     */
    get width() {
        let width = this.objectFitDimensions?.width;
        return width > 0 ? width : super.width;
    }

    /**
     * @function
     * @description Calculates the height of the media based on the media tag in the shadow root
     * @returns {number} - the resolved height
     */
    get height() {
        let height = this.objectFitDimensions?.height;
        return height > 0 ? height : super.height;
    }

    get mediaWidth() {
        mrjsUtils.error.emptyParentFunction();
    }

    get mediaHeight() {
        mrjsUtils.error.emptyParentFunction();
    }

    generateNewMediaPlaneGeometry() {
        if (this.object3D.geometry !== undefined) {
            this.object3D.geometry.dispose();
        }
        this.object3D.geometry = mrjsUtils.geometry.UIPlane(this.width, this.height, this.borderRadii, 18);
    }

    loadMediaTexture() {
        mrjsUtils.error.emptyParentFunction();
    }

    /**
     * @function
     * @description Callback function of MREntity - handles setting up this media and associated 3D geometry style (from css) once it is connected to run as an entity component.
     */
    connected() {
        this.media.setAttribute('src', mrjsUtils.html.resolvePath(this.getAttribute('src')));
        this.media.setAttribute('style', 'object-fit:inherit; width:inherit');

        this.objectFitDimensions = { height: 0, width: 0 };
        if (this.getAttribute('src') !== undefined) {
            this.computeObjectFitDimensions();
            this.generateNewMediaPlaneGeometry();
            this.loadMediaTexture();
        }
    }

    /**
     * @function
     * @description Callback function of MREntity - Updates the media's cover,fill,etc based on the mutation request.
     * @param {object} mutation - the update/change/mutation to be handled.
     */
    mutated(mutation) {
        super.mutated();

        if (mutation.type != 'attributes' && mutation.attributeName == 'src') {
            this.media.setAttribute('src', this.getAttribute('src'));
            this.computeObjectFitDimensions();
            this.loadMediaTexture();
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

        const _oldSubMediaMeshNotNeeded = () => {
            // All switch options other than 'contain' and 'scale-down' start with this
            // function.
            //
            // 'contain' and 'scale-down' are the only options that use this additional
            // mesh for positioning.
            mrjsUtils.model.disposeObject3D(this.subMediaMesh);
        };

        const _showMainMediaMesh = () => {
            // used if transitioning away from 'contain' or 'scale-down'
            // to make sure that texture is set properly
            this.object3D.material.visible = true;
            this.object3D.material.needsUpdate = true;
        }

        const _hideMainMediaMesh = () => {
            // to parallel the '_makeSureMainMediaMeshHasTexture' for readability
            // and debugging later on.
            this.object3D.material.visible = false;
            this.object3D.material.needsUpdate = true;
        }

        let containerWidth = this.parentElement.width;
        let containerHeight = this.parentElement.height;
        let mediaWidth = this.mediaWidth;
        let mediaHeight = this.mediaHeight;
        const mediaAspect = mediaWidth / mediaHeight;
        const containerAspect = containerWidth / containerHeight;
        switch (this.compStyle.objectFit) {
            case 'fill':
                _oldSubMediaMeshNotNeeded();
                _showMainMediaMesh();
                this.objectFitDimensions = { width: containerWidth, height: containerHeight };

                break;

            case 'contain':
            case 'scale-down':
                // `contain` and `scale-down` are the same except for one factor:
                // - `contain` will always scale the media to fit
                // - `scale-down` will only scale the media to fit if the media is larger than the container
                //
                // Implemented by making the main mesh turn into the same dimensions as the container
                // and making the submesh scale itself based on those values. This allows the original hit
                // box of mr-media to stay as expected while the media itself still changes based on object-fit.

                if (this.compStyle.objectFit === 'contain' || mediaWidth > containerWidth || mediaHeight > containerHeight) {
                    const scaleRatio = Math.min(containerWidth / mediaWidth, containerHeight / mediaHeight);
                    mediaWidth *= scaleRatio;
                    mediaHeight *= scaleRatio;
                }

                const mediaGeometry = new THREE.PlaneGeometry(mediaWidth, mediaHeight);
                const mediaMaterial = new THREE.MeshStandardMaterial({
                    map: this.texture,
                });
                _oldSubMediaMeshNotNeeded();
                this.subMediaMesh.geometry = mediaGeometry;
                this.subMediaMesh.material = mediaMaterial;
                this.subMediaMesh.geometry.needsUpdate = true;
                this.subMediaMesh.material.visible = true;
                this.subMediaMesh.material.needsUpdate = true;
                _hideMainMediaMesh();

                this.objectFitDimensions = {
                    width: containerWidth,
                    height: containerHeight,
                };

                break;

            case 'cover':
                _oldSubMediaMeshNotNeeded();
                _showMainMediaMesh();

                this.texture.repeat.set(1, 1); // Reset scaling

                if (containerAspect > mediaAspect) {
                    // Plane is wider than the texture
                    const scale = containerAspect / mediaAspect;
                    this.texture.repeat.y = 1 / scale;
                    this.texture.offset.y = (1 - 1 / scale) / 2; // Center the texture vertically
                } else {
                    // Plane is taller than the texture
                    const scale = mediaAspect / containerAspect;
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
                _oldSubMediaMeshNotNeeded();
                _showMainMediaMesh();
                this.objectFitDimensions = { width: mediaWidth, height: mediaHeight };

                break;

            default:
                throw new Error(`Unsupported object-fit value ${this.compStyle.objectFit}`);
        }

        this.style.width = `${this.objectFitDimensions.width}px`;
        this.style.height = `${this.objectFitDimensions.height}px`;
    }
}
