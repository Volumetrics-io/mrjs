import * as THREE from 'three';

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

        // object3D and rest of mrvideo is pre-created in MRMedia
        this.object3D.name = 'video';
        this.playing = false;
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
    // connected() {
    //     this.media = document.createElement('video');
    //     this.media.setAttribute('crossorigin', 'anonymous');
    //     super.connected();
    // }
    connected() {
        this.media = document.createElement('video');

        this.media.setAttribute('src', mrjsUtils.html.resolvePath(this.getAttribute('src')));
        this.media.setAttribute('style', 'object-fit:inherit; width:inherit');
        this.media.setAttribute('crossorigin', 'anonymous');
            
        this.videoObject3DFitDimensions = { height: 0, width: 0 };
        if(this.getAttribute('src') !== undefined) {
            this.computeVideoObject3DFitDimensions();
            this.object3D.geometry = mrjsUtils.geometry.UIPlane(this.width, this.height, this.borderRadii, 18);
        mrjsUtils.material
            .loadVideoTextureAsync(this.media)
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
        mrjsUtils.material
            .loadVideoTextureAsync(this.media)
            .then((texture) => {
                this.texture = texture;
                this.object3D.material.map = texture;
            })
            .catch((error) => {
                console.error('Error loading texture:', error);
            });
    }

    // computeObjectFitDimensions() {
    //     super.computeObjectFitDimensions();

    //     // set the video width and height to the video size
    //     // this.media.width = this.objectFitDimensions.width;
    //     // this.media.height = this.objectFitDimensions.height;
    //     // set this width and height to video 
    //     this.style.width = `${this.objectFitDimensions.width}px`;
    //     this.style.height = `${this.objectFitDimensions.height}px`;
    // }
    /**
     * @function
     * @description computes the width and height values for the video considering the value of object-fit
     */
    computeVideoObject3DFitDimensions() {
        if (!this.texture || !this.media) {
            // We assume every media item exists and has its attached texture.
            // If texture doesnt exist, it's just not loaded in yet, meaning
            // we can skip the below until it is.
            return;
        }
        
        switch (this.compStyle.objectFit) {
            case 'fill':
                this.videoObject3DFitDimensions = { width: this.offsetWidth, height: this.offsetHeight };

            case 'contain':
            case 'scale-down': {
                let ratio = Math.min(this.offsetWidth / this.media.videoWidth, this.offsetHeight / this.media.videoHeight);
                let scaledWidth = this.media.videoWidth * ratio;
                let scaledHeight = this.media.videoHeight * ratio;

                if (this.compStyle.objectFit === 'scale-down') {
                    scaledWidth = Math.min(scaledWidth, this.media.videoWidth);
                    scaledHeight = Math.min(scaledHeight, this.media.videoHeight);
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
        this.media.width = this.videoObject3DFitDimensions.width;
        this.media.height = this.videoObject3DFitDimensions.height;
        // set this width and height to video 
        this.style.width = `${this.videoObject3DFitDimensions.width}px`;
        this.style.height = `${this.videoObject3DFitDimensions.height}px`;
    }

    set srcObject(src) {
        this.media.srcObject = src;
        this.media.addEventListener('loadeddata', () => {
            this.computeObjectFitDimensions();
        });
    }

    /**
     * @function
     * @description Plays the video in the shadow root
     */
    play() {
        this.media.play();
        this.playing = true;
    }

    /**
     * @function
     * @description Pauses the video in the shadow root
     */
    pause() {
        this.media.pause();
        this.playing = false;
    }
}

customElements.get('mr-video') || customElements.define('mr-video', MRVideo);
