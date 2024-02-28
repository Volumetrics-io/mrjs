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
    }

    /**
     * @function
     * @description Pauses the video in the shadow root
     */
    pause() {
        this.media.pause();
    }
}

customElements.get('mr-video') || customElements.define('mr-video', MRVideo);
