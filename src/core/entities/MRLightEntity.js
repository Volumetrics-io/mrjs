import * as THREE from 'three';

import { MREntity } from 'mrjs/core/MREntity';

/**
 * @class MRLightEntity
 * @classdesc Represents lights in 3D space. `mr-light`
 * @augments MREntity
 */
export class MRLightEntity extends MREntity {
    /**
     * @class
     * @description Constructs the base 3D object.
     */
    constructor() {
        super();
        this.object3D = new THREE.PointLight({});
        this.object3D.name = 'pointLight';
    }

    /**
     * @function
     * @description (async) handles setting up this Light once it is connected to run as an entity component.
     */
    async connected() {
        // Check if the 'color' attribute exists and is not null
        const color = this.getAttribute('color');
        if (color) {
            this.object3D.color.set(color);
        }

        // Check if the 'intensity' attribute exists, parse it, and use a default value if it doesn't
        const intensityAttribute = this.getAttribute('intensity');
        this.object3D.intensity = intensityAttribute ? parseFloat(intensityAttribute) : 1;
    }

    /**
     * @function
     * @description (async) Updates the lights color and intensity as requested.
     * @param {object} mutation - the update/change/mutation to be handled.
     */
    mutated = (mutation) => {
        if (mutation.type != 'attributes') {
            return;
        }
        switch (mutation.attributeName) {
            case 'color':
                // TODO - set via css
                mrjsUtils.color.setObject3DColor(this.object3D, this.getAttribute('color'));
                break;

            case 'intensity':
                this.object3D.intensity = this.getAttribute('intensity');
                break;

            default:
                break;
        }
    };
}

customElements.get('mr-light') || customElements.define('mr-light', MRLightEntity);
