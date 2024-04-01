import * as THREE from 'three';

import { MRMediaEntity } from 'mrjs/core/entities/MRMediaEntity';

import { mrjsUtils } from 'mrjs';

/**
 * @class MRVideoEntity
 * @classdesc Base html video represented in 3D space. `mr-video`
 * @augments MRMediaEntity
 */
export class MRVideoEntity extends MRMediaEntity {
    /**
     * @class
     * @description Constructs a base video entity using a UIPlane and other 3D elements as necessary.
     */
    constructor() {
        super();
        this.object3D.name = 'video';
        this.playing = false;
    }

    /**
     * @function
     * @description Calculates the width of the video based on the video tag itself
     * @returns {number} - the resolved width
     */
    get mediaWidth() {
        return this.media.videoWidth;
    }

    /**
     * @function
     * @description Calculates the height of the video based on the video tag itself
     * @returns {number} - the resolved height
     */
    get mediaHeight() {
        return this.media.videoHeight;
    }

    /**
     * @function
     * @description Loads the associated video into 3D based on its html properties.
     */
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

    /**
     * @function
     * @description Sets the srcObject of the video media (since it uses 'srcObject' instead of 'src' like other items).
     * @param {string} src - the string to the new source object we want
     */
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

    /**
     * @function
     * @description Pauses the video in the shadow root
     */
    pause() {
        this.media.pause();
        this.playing = false;
    }
}

customElements.get('mr-video') || customElements.define('mr-video', MRVideoEntity);
