import { Text } from 'troika-three-text';

import { MRDivEntity } from 'mrjs/core/MRDivEntity';

/**
 * @class MRTextEntity
 * @classdesc The text element that is used to represent normal html text one would expect in a web-browser. Used specifically on `mr-div` items. `mr-text`
 * @augments MRDivEntity
 */
export class MRTextEntity extends MRDivEntity {
    /**
     * @returns {number} - the height of the rendering area for the text. Counts as the css height px value representation.
     */
    get height() {
        return Math.abs(this.textObj.textRenderInfo?.blockBounds[1] ?? 1);
    }

    /**
     * Constructor for the MRTextEntity object.
     * Sets up the 3D aspect of the text including the object, texture, and update check.
     * Additionally adds an event listener for the text to auto augment whenever the panel size changes.
     */
    constructor() {
        super();
        this.textObj = new Text();
        this.object3D.add(this.textObj);
        this.editable = false;

        this.textObj.material.receiveShadow = true;

        this.needsUpdate = true;

        document.addEventListener('panel-mutated', () => {
            this.needsUpdate = true;
        });
    }

    /**
     * Callback function of MREntity - sets up the textObject of the text item.
     */
    connected() {
        const text = this.textContent.trim();
        this.textObj.text = text.length > 0 ? text : ' ';
    }
}

customElements.get('mr-text') || customElements.define('mr-text', MRTextEntity);
