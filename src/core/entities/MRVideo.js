import * as THREE from 'three';

import { MRDivEntity } from 'mrjs/core/MRDivEntity';

import { mrjsUtils } from 'mrjs';

/**
 * @class MRVideo
 * @classdesc Base html video represented in 3D space. `mr-video`
 * @augments MRDivEntity
 */
export class MRVideo extends MRDivEntity {
    /**
     * @class
     * @description Constructs a base video entity using a UIPlane and other 3D elements as necessary.
     */
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.video = document.createElement('video');

        // Create the object3D. Dont need default value for geometry
        // until the connected call since this will get overwritten anyways.
        let material = new THREE.MeshStandardMaterial({
            side: 0,
            transparent: true,
            // opacity: 0.5,
        });
        // Object3D for mr-video is the actual video itself in 3D space
        this.object3D = new THREE.Mesh(undefined, material);
        this.object3D.receiveShadow = true;
        this.object3D.renderOrder = 3;
        this.object3D.name = 'video';
        
    }

    /**
     * @function
     * @description Calculates the width of the video based on the video tag in the shadow root
     * @returns {number} - the resolved width
     */
    get width() {
        let width = mrjsUtils.css.pxToThree(this.videoObject3DFitDimensions?.width);
        return width > 0 ? width : super.width;
    }

    /**
     * @function
     * @description Calculates the height of the video based on the video tag in the shadow root
     * @returns {number} - the resolved height
     */
    get height() {
        let height = mrjsUtils.css.pxToThree(this.videoObject3DFitDimensions?.height);
        return height > 0 ? height : super.height;
    }

    /**
     * @function
     * @description Callback function of MREntity - handles setting up this video and associated 3D geometry style (from css) once it is connected to run as an entity component.
     */
    connected() {
        this.video = document.createElement('video');

        this.video.setAttribute('src', mrjsUtils.html.resolvePath(this.getAttribute('src')));
        this.video.setAttribute('style', 'object-fit:inherit; width:inherit');
        this.video.setAttribute('crossorigin', 'anonymous');
            
        this.videoObject3DFitDimensions = { height: 0, width: 0 };
        if(this.getAttribute('src') !== undefined) {
            this.computeVideoObject3DFitDimensions();
            this.object3D.geometry = mrjsUtils.geometry.UIPlane(this.width, this.height, this.borderRadii, 18);
        mrjsUtils.material
            .loadVideoTextureAsync(this.video)
            .then((texture) => {
                this.texture = texture;
                this.object3D.material.map = texture;
            })
            .catch((error) => {
                console.error('Error loading texture:', error);
            });
        }
        

        // first creation of the object3D geometry. dispose is not needed but adding just in case.
        if (this.object3D.geometry !== undefined) {
            this.object3D.geometry.dispose();
        }
        
    }

    /**
     * @function
     * @description Callback function of MREntity - Updates the video's cover,fill,etc based on the mutation request.
     * @param {object} mutation - the update/change/mutation to be handled.
     */
    mutated(mutation) {
        super.mutated();
        if (mutation.type != 'attributes' && mutation.attributeName == 'src') {
            this.video.setAttribute('src', this.getAttribute('src'));
            this.computeVideoObject3DFitDimensions();

            mrjsUtils.material
                .loadTextureAsync(this.video.src)
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
     * @description computes the width and height values for the video considering the value of object-fit
     */
    computeVideoObject3DFitDimensions() {
        
        switch (this.compStyle.objectFit) {
            case 'fill':
                this.videoObject3DFitDimensions = { width: this.offsetWidth, height: this.offsetHeight };

            case 'contain':
            case 'scale-down': {
                let ratio = Math.min(this.offsetWidth / this.video.videoWidth, this.offsetHeight / this.video.videoHeight);
                let scaledWidth = this.video.videoWidth * ratio;
                let scaledHeight = this.video.videoHeight * ratio;

                if (this.compStyle.objectFit === 'scale-down') {
                    scaledWidth = Math.min(scaledWidth, this.video.videoWidth);
                    scaledHeight = Math.min(scaledHeight, this.video.videoHeight);
                }

                this.videoObject3DFitDimensions = { width: scaledWidth, height: scaledHeight };
                break;
            }

            case 'cover': {
                let videoRatio = this.video.videoWidth / this.video.videoHeight;
                let containerRatio = this.offsetWidth / this.offsetHeight;

                if (containerRatio > videoRatio) {
                    this.videoObject3DFitDimensions = { width: this.offsetWidth, height: this.offsetWidth / videoRatio };
                } else {
                    this.videoObject3DFitDimensions = { width: this.offsetHeight * videoRatio, height: this.offsetHeight };
                }
                break;
            }

            case 'none':
                this.videoObject3DFitDimensions = { width: this.video.videoWidth, height: this.video.videoHeight };
                break;

            default:
                throw new Error(`Unsupported object-fit value ${this.compStyle.objectFit}`);
        }
        // set the video width and height to the video size
        this.video.width = this.videoObject3DFitDimensions.width;
        this.video.height = this.videoObject3DFitDimensions.height;
        // set this width and height to video 
        this.style.width = `${this.videoObject3DFitDimensions.width}px`;
        this.style.height = `${this.videoObject3DFitDimensions.height}px`;
    }

    //setter for srcObject 
    set srcObject(src) {
        this.video.srcObject = src;
        // on loadeddata event, update the videoObject3DFitDimensions
        this.video.addEventListener('loadeddata', () => {
            this.computeVideoObject3DFitDimensions();
        });
    }

     /**
     * @function
     * @description Plays the video in the shadow root
     */
    play() {
        this.video.play();
    }

    //pause 
    /**
     * @function
     * @description Pauses the video in the shadow root
     */
    pause() {
        this.video.pause();
    }

    /**
     * @function
     * @description Calculates the texture UV transformation change based on the video's aspect ratio.
     * @param {object} texture - the texture to augment
     * @param {number} aspect - a given expected aspect ratio
     */
    cover(texture, aspect) {
        texture.matrixAutoUpdate = false;

        const videoAspect = texture.video.width / texture.video.height;

        if (aspect < videoAspect) {
            texture.matrix.setUvTransform(0, 0, aspect / videoAspect, 1, 0, 0.5, 0.5);
        } else {
            texture.matrix.setUvTransform(0, 0, 1, videoAspect / aspect, 0, 0.5, 0.5);
        }
    }
}

customElements.get('mr-video') || customElements.define('mr-video', MRVideo);