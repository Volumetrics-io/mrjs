import * as THREE from 'three';
import MREntity from '../core/mrEntity';

/**
 *
 */
export default class Light extends MREntity {
    /**
     *
     */
    constructor() {
        super();
        this.object3D = new THREE.PointLight({});
    }

    /**
     *
     */
    connected() {
        const color = this.getAttribute('color');
        this.object3D.color.setStyle(color);

        this.object3D.intensity = parseFloat(this.getAttribute('intensity')) ?? 1;
    }

    mutated = (mutation) => {
        if (mutation.type != 'attributes') {
            return;
        }
        switch (mutation.attributeName) {
            case 'color':
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
