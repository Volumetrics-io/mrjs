import * as THREE from 'three';

import { MRMediaEntity } from 'mrjs/core/entities/MRMediaEntity';

import { mrjsUtils } from 'mrjs';

/**
 * @class MRImageEntity
 * @classdesc Base html image represented in 3D space. `mr-image`
 * @augments MRMediaEntity
 */
export class MRImageEntity extends MRMediaEntity {
    /**
     * @class
     * @description Constructs a base image entity using a UIPlane and other 3D elements as necessary.
     */
    constructor() {
        super();

        // object3D and rest of mrvideo is pre-created in MRMediaEntity
        this.object3D.name = 'image';
    }

    /**
     * @function
     * @description Gets the width of the internal media object
     * @returns {number} width - the value of the width
     */
    get mediaWidth() {
        return this.media.width;
    }

    /**
     * @function
     * @description Gets the height of the internal media object
     * @returns {number} height - the value of the height
     */
    get mediaHeight() {
        return this.media.height;
    }

    /**
     * @function
     * @description (async) handles setting up this Image and associated 3D geometry style (from css) once it is connected to run as an entity component.
     */
    async connected() {
        this.media = document.createElement('img');
        await super.connected();
    }

    /**
     * @function
     * @description Loads the Media texture of the setup this.media object based on its html source info.
     */
    loadMediaTexture() {
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

    /**
     * @function
     * @description Callback function of MREntity - Updates the image's cover,fill,etc based on the mutation request.
     * @param {object} mutation - the update/change/mutation to be handled.
     */
    mutated(mutation) {
        // Mutations are only understood by their actual type. Any mutation
        // passed through MRMediaEntity directly is undefined since it is not
        // a direct element for users. So we do the if-check here and then
        // follow the same as the parent's functionality.
        if (mutation.type == 'attributes' && mutation.attributeName == 'src') {
            super.mutated();
        }
    }
}

customElements.get('mr-img') || customElements.define('mr-img', MRImageEntity);
