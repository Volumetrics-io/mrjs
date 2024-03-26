import * as THREE from 'three';

import { MRMedia } from 'mrjs/core/entities/MRMedia';

import { mrjsUtils } from 'mrjs';

/**
 * @class MRVideo
 * @classdesc Base html video represented in 3D space. `mr-video`
 * @augments MRDiv
 */
export class MRVideo extends MRMedia {
    /**
     * @class
     * @description Constructs a base video entity using a UIPlane and other 3D elements as necessary.
     */
    constructor() {
        super();
        this.object3D.name = 'video';
        this.playing = false;
    }

    get mediaWidth() {
        return this.media.videoWidth;
    }

    get mediaHeight() {
        return this.media.videoHeight;
    }

    loadMediaTexture() {
        mrjsUtils.material
            .loadVideoTextureAsync(this.media)
            .then((texture) => {
                this.texture = texture;
                this.object3D.material.map = texture;
                this.playing = true; // since we have videos auto play on silent to start
            })
            .catch((error) => {
                console.error('Error loading texture:', error);
            });
    }

    /**
     * @function
     * @description Callback function of MREntity - handles setting up this video and associated 3D geometry style (from css) once it is connected to run as an entity component.
     */
    connected() {
        this.media = document.createElement('video');
        this.media.setAttribute('crossorigin', 'anonymous');

        super.connected();
    }

    set srcObject(src) {
        this.media.srcObject = src;
        // on loadeddata event, update the objectFitDimensions
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

    //pause
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
