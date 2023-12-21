import * as THREE from 'three';

import { MREntity } from 'mrjs/core/MREntity';

/**
 * @class Light
 * @classdesc Represents lights in 3D space. `mr-light`
 * @augments MREntity
 */
export class Light extends MREntity {
    /**
     * @class
     * @description Constructs the base 3D object.
     */
    constructor() {
        super();
        this.object3D = new THREE.PointLight({});
    }

    /**
     * @function
     * @description Callback function of MREntity - handles setting up this Light once it is connected to run as an entity component.
     */
    connected() {
        const color = this.getAttribute('color');
        this.object3D.color.setStyle(color);

        this.object3D.intensity = parseFloat(this.getAttribute('intensity')) ?? 1;
    }

    /**
     * @function
     * @description Callback function of MREntity - Updates the lights color and intensity as requested.
     * @param {object} mutation - the update/change/mutation to be handled.
     */
    mutated = (mutation) => {
        if (mutation.type != 'attributes') {
            return;
        }
        switch (mutation.attributeName) {
            case 'color':
                // TODO - set via css
                const color = this.getAttribute('color');
                this.object3D.color.setStyle(color);
                break;

            case 'intensity':
                this.object3D.intensity = this.getAttribute('intensity');
                break;

            default:
                break;
        }
    };
}

customElements.get('mr-light') || customElements.define('mr-light', Light);
