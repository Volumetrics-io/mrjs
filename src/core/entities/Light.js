import * as THREE from 'three';

import { MREntity } from 'mrjs/core/MREntity';

/**
 * @class Light
 * @classdesc Represents lights in 3D space. `mr-light`
 * @extends MREntity
 */
export class Light extends MREntity {
    /**
     * @constructor
     * @description Constructs the base 3D object.
     */
    constructor() {
        super();
        this.object3D = new THREE.PointLight({});
    }

    /**
     * @method
     * @description Callback function of MREntity - handles setting up this Light once it is connected to run as an entity component.
     */
    connected() {
        const color = this.getAttribute('color');
        this.object3D.color.setStyle(color);

        this.object3D.intensity = parseFloat(this.getAttribute('intensity')) ?? 1;
    }

    /**
     * @method
     * @description Callback function of MREntity - Updates the lights color and intensity as requested.
     * @param {object} mutation - the update/change/mutation to be handled.
     */
    mutatedImpl(mutation) {
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
    }
    /**
     * @event
     */
    mutated = (mutation) => {
        return this.mutatedImpl(mutation);
    };
}

customElements.get('mr-light') || customElements.define('mr-light', Light);
