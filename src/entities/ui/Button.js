import { MRUIEntity } from './UIEntity.js';

/**
 *
 */
export default class Button extends MRUIEntity {
    /**
     *
     */
    constructor() {
        super();
    }

    onHover = (event) => {
        switch (event.type) {
            case 'hover-start':
                this.object3D.scale.addScalar(0.1);
                this.object3D.position.z += 0.001;

                break;

            case 'hover-end':
                this.object3D.scale.subScalar(0.1);
                this.object3D.position.z -= 0.001;

                break;

            default:
                break;
        }
    };
}

customElements.get('mr-button') || customElements.define('mr-button', Button);
