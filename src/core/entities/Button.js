import { MRTextEntity } from '../MRTextEntity';

/**
 * @class Button
 * @classdesc 3D representation of a Button mimicking the html version. `mr-button`
 * @augments MRTextEntity
 */
export default class Button extends MRTextEntity {
    /**
     * @class
     * @description Constructor for the Button entity, does the default.
     */
    constructor() {
        super();
        this.background.castShadow = true;
    }
}

customElements.get('mr-button') || customElements.define('mr-button', Button);
