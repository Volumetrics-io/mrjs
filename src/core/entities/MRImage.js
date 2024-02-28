import * as THREE from 'three';

import { MRMedia } from 'mrjs/core/MRMedia';

import { mrjsUtils } from 'mrjs';

/**
 * @class MRImage
 * @classdesc Base html image represented in 3D space. `mr-image`
 * @augments MRMedia
 */
export class MRImage extends MRMedia {
    /**
     * @class
     * @description Constructs a base image entity using a UIPlane and other 3D elements as necessary.
     */
    constructor() {
        super();

        // object3D and rest of mrvideo is pre-created in MRMedia
        this.media = document.createElement('img');
        this.object3D.name = 'image';
    }

    createElement() {
        this.media = document.createElement('img');
    }

    /**
     * @function
     * @description Callback function of MREntity - handles setting up this Image and associated 3D geometry style (from css) once it is connected to run as an entity component.
     */
    connected() {
        super.connected();

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

customElements.get('mr-img') || customElements.define('mr-img', MRImage);
