import { MRTextEntity } from '../MRTextEntity';

/**
 * @class Button
 * @classdesc 3D representation of a Button mimicking the html version. `mr-button`
 * @augments MRDivEntity
 */
export default class Button extends MRTextEntity {
    /**
     * Constructor for the Model entity, does the default.
     */
    constructor() {
        super();
        this.background.castShadow = true
    }

}

customElements.get('mr-button') || customElements.define('mr-button', Button);
