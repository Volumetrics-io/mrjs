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


    _contain() {
        console.log('in contain');
         // want contain to have the same object setup as fill, but texture setup is different
        // object
        // // the image texture
        // console.log('--- scale-down', 'content width', this.contentWidth, 'actual width', this.width);
        // let ratio = Math.min(this.parentElement.width / this.img.width, this.parentElement.height / this.img.height);
        // let scaledWidth = this.img.width * ratio;
        // let scaledHeight = this.img.height * ratio;

        // this.imageObjectFitDimensions = { width: scaledWidth, height: scaledHeight };
// Calculate aspect ratios

        let containerWidth = this.parentElement.width;
        let containerHeight = this.parentElement.height;
        let containerAspectRatio = containerWidth / containerHeight;
        let imageWidth = this.img.width;
        let imageHeight = this.img.height;
        let imageAspectRatio = imageWidth / imageHeight;

        // let scaleWidth = 1;
          // let scaleHeight = 1;
        let scale = 1;


        // if (containerHeight > imageHeight && containerWidth < imageWidth) {
        //     // image is wider than mesh
        //     scale = containerAspectRatio / imageAspectRatio;
        // } else if (containerHeight < imageHeight && containerWidth > imageWidth) {
        //     // image is taller than mesh
        //     scale = imageAspectRatio / containerAspectRatio;
        // } else if (containerHeight > imageHeight && containerWidth > imageWidth) {
        //     // do nothing
        // } else if (containerHeight < imageHeight && containerWidth < imageWidth) {
        //     // scale in the biggest dimension down
        //     if (imageWidth > imageHeight && containerWidth > containerHeight) {
        //         // TODO
        //     } else if (imageWidth < imageHeight && containerWidth > containerHeight) {
        //         // want image height to match container height
        //         // TODO - figure out the scale for that
        //     } else if (imageWidth > imageHeight && containerWidth < containerHeight) {
        //         // want image width to match container width
        //         // TODO - figure out the scale for that
        //     } else if (imageWidth < imageHeight && containerWidth < containerHeight) {
        //         // TODO... not sure
        //     }
        // }

        // Calculate aspect ratios
        // const containerAspectRatio = containerWidth / containerHeight;
        // const imageAspectRatio = imageWidth / imageHeight;
        // let scale = 1; // Default scale

        if (containerAspectRatio > imageAspectRatio) {
            // Container is wider than the image in proportion
            if (containerWidth > imageWidth && containerHeight < imageHeight) {
                // Image needs to be scaled down/up to fit height-wise
                scale = containerHeight / imageHeight;
            } else {
                // Scale image to fit width-wise
                scale = containerWidth / imageWidth;
            }
        } else {
            // Container is taller than the image in proportion or they are equal
            if (containerHeight > imageHeight && containerWidth < imageWidth) {
                // Image needs to be scaled down/up to fit width-wise
                scale = containerWidth / imageWidth;
            } else {
                // Scale image to fit height-wise
                scale = containerHeight / imageHeight;
            }
        }

        this.imageObjectFitDimensions = {
            width: containerWidth,
            height: containerHeight
        };

        const shaderMaterial = new THREE.ShaderMaterial({
          uniforms: {
            texture: { type: 't', value: this.texture },
            planeSize: { type: 'v2', value: new THREE.Vector2(containerWidth, containerHeight) },
            textureSize: { type: 'v2', value: new THREE.Vector2(imageWidth * scale, imageHeight * scale) },
          },
          vertexShader: `
            varying vec2 vUv;
            varying vec4 pos;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              pos = gl_Position;
            }
          `,
          fragmentShader: `
            uniform sampler2D texture;
            uniform vec2 planeSize;
            uniform vec2 textureSize;
            varying vec2 vUv;
            varying vec4 pos;

            void main() {
              // Calculate center offset for texture
              vec2 centerOffset = (planeSize - textureSize) / planeSize / 2.0;
              
              // Calculate bounds for texture rendering
              vec2 minBounds = centerOffset;
              vec2 maxBounds = vec2(1.0) - centerOffset;

              // Adjust UV coordinates based on the bounds
              vec2 adjustedUv = vUv;
              
              // Discard fragments outside the texture bounds
              if (adjustedUv.x < minBounds.x || adjustedUv.x > maxBounds.x ||
                  adjustedUv.y < minBounds.y || adjustedUv.y > maxBounds.y) {
                discard;
              }

              // Map the valid UVs to [0,1] range within the texture area
              adjustedUv = (adjustedUv - minBounds) / (maxBounds - minBounds);

              // Correctly sample the texture with adjusted UVs
              gl_FragColor = vec4(adjustedUv, 0, 1);//pos;//texture(texture, adjustedUv);
            }
          `,
          transparent: true, // Enable transparency so that the discarded fragments are transparent
        });
        this.object3D.material = shaderMaterial;
        this.object3D.material.needsUpdate = true;
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
        switch (this.compStyle.objectFit) {
            case 'fill':
                this.imageObjectFitDimensions = { width: containerWidth, height: containerHeight };

                break;

            case 'contain':
                this._contain();

                break;

            case 'scale-down':
                this._scaleDown();

                break;

            case 'cover':
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

                break;

            case 'none':
                this.imageObjectFitDimensions = { width: this.img.width, height: this.img.height };

                break;

            default:
                throw new Error(`Unsupported object-fit value ${this.compStyle.objectFit}`);
        }
    }
}

customElements.get('mr-img') || customElements.define('mr-img', MRImage);
