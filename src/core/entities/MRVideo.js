import * as THREE from 'three';

import { MRDivEntity } from 'mrjs/core/MRDivEntity';
import { MRMedia } from 'mrjs/core/MRMedia';

import { mrjsUtils } from 'mrjs';

/**
 * @class MRVideo
 * @classdesc Base html video represented in 3D space. `mr-video`
 * @augments MRDivEntity
 */
export class MRVideo extends MRMedia {
    /**
     * @class
     * @description Constructs a base video entity using a UIPlane and other 3D elements as necessary.
     */
    constructor() {
        super();
        this.object3D.name = 'video';
        
    }

    /**
     * @function
     * @description Calculates the width of the video based on the video tag in the shadow root
     * @returns {number} - the resolved width
     */
    get width() {
        let width = mrjsUtils.css.pxToThree(this.objectFitDimensions?.width);
        return width > 0 ? width : super.width;
    }

    /**
     * @function
     * @description Calculates the height of the video based on the video tag in the shadow root
     * @returns {number} - the resolved height
     */
    get height() {
        let height = mrjsUtils.css.pxToThree(this.objectFitDimensions?.height);
        return height > 0 ? height : super.height;
    }

    get mediaWidth() {
        return this.media.videoWidth;
    }

    get mediaHeight() {
        return this.media.videoHeight;
    }

    /**
     * @function
     * @description Callback function of MREntity - handles setting up this video and associated 3D geometry style (from css) once it is connected to run as an entity component.
     */
    connected() {
        this.video = document.createElement('video');
        // this.media = this.video;

        this.video.setAttribute('src', mrjsUtils.html.resolvePath(this.getAttribute('src')));
        this.video.setAttribute('style', 'object-fit:inherit; width:inherit');
        this.video.setAttribute('crossorigin', 'anonymous');
            
        this.objectFitDimensions = { height: 0, width: 0 };
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

    loadMediaTexture() {
        console.log('hello');
        mrjsUtils.material
                .loadVideoTextureAsync(this.video.src)
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
     * @description Callback function of MREntity - Updates the video's cover,fill,etc based on the mutation request.
     * @param {object} mutation - the update/change/mutation to be handled.
     */
    mutated(mutation) {
        // super.mutated();
        if (mutation.type != 'attributes' && mutation.attributeName == 'src') {
            this.video.setAttribute('src', this.getAttribute('src'));
            this.computeVideoObject3DFitDimensions();
            this.loadMediaTexture();
        }
    }

    /**
     * @function
     * @description computes the width and height values for the video considering the value of object-fit
     */
    computeVideoObject3DFitDimensions() {
        
        switch (this.compStyle.objectFit) {
            case 'fill':
                this.objectFitDimensions = { width: this.offsetWidth, height: this.offsetHeight };

            case 'contain':
            case 'scale-down': {
                let ratio = Math.min(this.offsetWidth / this.video.videoWidth, this.offsetHeight / this.video.videoHeight);
                let scaledWidth = this.video.videoWidth * ratio;
                let scaledHeight = this.video.videoHeight * ratio;

                if (this.compStyle.objectFit === 'scale-down') {
                    scaledWidth = Math.min(scaledWidth, this.video.videoWidth);
                    scaledHeight = Math.min(scaledHeight, this.video.videoHeight);
                }

                this.objectFitDimensions = { width: scaledWidth, height: scaledHeight };
                break;
            }

            case 'cover': {
                let videoRatio = this.video.videoWidth / this.video.videoHeight;
                let containerRatio = this.offsetWidth / this.offsetHeight;

                if (containerRatio > videoRatio) {
                    this.objectFitDimensions = { width: this.offsetWidth, height: this.offsetWidth / videoRatio };
                } else {
                    this.objectFitDimensions = { width: this.offsetHeight * videoRatio, height: this.offsetHeight };
                }
                break;
            }

            case 'none':
                this.objectFitDimensions = { width: this.video.videoWidth, height: this.video.videoHeight };
                break;

            default:
                throw new Error(`Unsupported object-fit value ${this.compStyle.objectFit}`);
        }
        // set the video width and height to the video size
        this.video.width = this.objectFitDimensions.width;
        this.video.height = this.objectFitDimensions.height;
        // set this width and height to video 
        this.style.width = `${this.objectFitDimensions.width}px`;
        this.style.height = `${this.objectFitDimensions.height}px`;
    }

    //setter for srcObject 
    set srcObject(src) {
        this.video.srcObject = src;
        // on loadeddata event, update the objectFitDimensions
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
