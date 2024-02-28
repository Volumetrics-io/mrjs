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

        // object3D and rest of mrvideo is pre-created in MRMedia
        this.media = document.createElement('video');
        this.object3D.name = 'video'; 
    }

    createElement() {
        this.media = document.createElement('video');
    }

    /**
     * @function
     * @description Callback function of MREntity - handles setting up this video and associated 3D geometry style (from css) once it is connected to run as an entity component.
     */
    connected() {
        super.connected();
        
        // TODO - why do we need the specific
        // loadVideoTextureAsync here but not in the mutated function?
        mrjsUtils.material
            .loadVideoTextureAsync(this.media)
            .then((texture) => {
                this.texture = texture;
                this.object3D.material.map = texture;
            })
            .catch((error) => {
                console.error('Error loading texture:', error);
            });

        this.media.setAttribute('crossorigin', 'anonymous');
    }

    set srcObject(src) {
        this.video.srcObject = src;
        this.video.addEventListener('loadeddata', () => {
            this.computeObjectFitDimensions();
        });
    }

    /**
     * @function
     * @description Plays the video in the shadow root
     */
    play() {
        this.video.play();
    }

    /**
     * @function
     * @description Pauses the video in the shadow root
     */
    pause() {
        this.video.pause();
    }
}

customElements.get('mr-video') || customElements.define('mr-video', MRVideo);
