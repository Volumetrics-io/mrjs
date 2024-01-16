import { Text } from 'troika-three-text';

import { MRDivEntity } from 'mrjs/core/MRDivEntity';

/**
 * @class MRTextEntity
 * @classdesc The text element that is used to represent normal HTML text one would expect in a web browser.
 *            Used specifically on `mr-div` items.
 *            Inherits from MRDivEntity.
 * @augments MRDivEntity
 */
export class MRTextEntity extends MRDivEntity {
    /**
     * @class
     * @description Constructor for the MRTextEntity object.
     *              Sets up the 3D aspect of the text, including the object, texture, and update check.
     *              Additionally, adds an event listener for the text to auto-augment whenever the panel size changes.
     */
    constructor() {
        super();
        this.textObj = new Text();
        this.object3D.add(this.textObj);
        this.object3D.name = 'textObj';
        this.editable = false;

        this.textObj.material.receiveShadow = true;

        // This event listener is added so anytime a panel changes (resize, etc), the text changes
        // accordingly // TODO -- look back to see where/how this is called
        this.needsUpdate = true;
        document.addEventListener('panel-mutated', () => {
            this.needsUpdate = true;
        });
        // is the above supposed to be this.needsStyleUpdate? or is it a needsUpdate function for the object itself?
    }

    /**
     * @function
     * @description Checks if we need to run the `updateStyle` function run by the `Style` system for this iteration.
     * Default implementation returns true. Allows subclasses to override with their own implementation.
     * @param {number} deltaTime - given timestep to be used for any feature changes
     * @param {object} frame - given frame information to be used for any feature changes
     * @returns {boolean} true if the system is in a state where an update is needed to be run this render call, false otherwise
     */
    needsStyleUpdate(deltaTime, frame) {
        // TODO - check this in relation to text entity's this.needsUpdate for panel-mutated
        return false;
    }

    /**
     * @description Represents the height of the rendering area for the text, counting as the CSS height in pixels.
     * @returns {number} the resolved height
     */
    get height() {
        return Math.abs(this.textObj.textRenderInfo?.blockBounds[1] ?? 1);
    }

    /**
     * @function
     * @description Callback function of MREntity - sets up the textObject of the text item.
     */
    connected() {
        const text = this.textContent.trim();
        this.textObj.text = text.length > 0 ? text : ' ';
    }
}

customElements.get('mr-text') || customElements.define('mr-text', MRTextEntity);
