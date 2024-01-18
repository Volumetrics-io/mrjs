import { MRTextEntity } from 'mrjs/core/MRTextEntity';

/**
 * @class MRButton
 * @classdesc 3D representation of a Button mimicking the html version. `mr-button`
 * @augments MRTextEntity
 */
export class MRButton extends MRTextEntity {
    /**
     * @class
     * @description Constructor for the Button entity, does the default.
     */
    constructor() {
        super();
        this.background.castShadow = true;
        this.object3D.name = 'button';
        this.ignoreStencil = true;
    }
}

customElements.get('mr-button') || customElements.define('mr-button', MRButton);
