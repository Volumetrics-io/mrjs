import { Text } from 'troika-three-text';

import { MRDivEntity } from 'mrjs/core/MRDivEntity';

/**
 * @class MRText
 * @classdesc The text element that is used to represent normal HTML text one would expect in a web browser.
 *            Used specifically on `mr-div` items.
 *            Inherits from MRDivEntity.
 * @augments MRDivEntity
 */
export class MRText extends MRDivEntity {
    /**
     * @class
     * @description Constructor for the MRText object.
     *              Sets up the 3D aspect of the text, including the object, texture, and update check.
     *              Additionally, adds an event listener for the text to auto-augment whenever the panel size changes.
     */
    constructor() {
        super();
        this.textObj = new Text();
        this.object3D.add(this.textObj);
        this.object3D.name = 'textObj';
        this.editable = false;

        this.textObj.receiveShadow = true;

        // This event listener is added so anytime a panel changes (resize, etc), the text changes
        // accordingly
        document.addEventListener('panelupdate', () => {
            this.triggerGeometryStyleUpdate();
            this.triggerTextStyleUpdate();
        });

        document.addEventListener('font-loaded', () => {
            this.triggerGeometryStyleUpdate();
            this.triggerTextStyleUpdate();
        });
    }

    /**
     * @function
     * @description Callback function of MREntity - sets up the textObject of the text item.
     */
    connected() {
        const text = this.textContent.trim();
        this.textObj.text = text.length > 0 ? text : ' ';
        this.triggerGeometryStyleUpdate();
        this.triggerTextStyleUpdate();
    }

    /**
     * @function
     * @description Runs the passed through function on this object and every child of this object.
     * @param {Function} callBack - the function to run recursively.
     */
    traverse(callBack) {
        callBack(this);
        const children = Array.from(this.object3D.children);
        for (const child of children) {
            // if o is an object, traverse it again
            if ((!child) instanceof MREntity) {
                continue;
            }
            child.traverse(callBack);
        }
    }

        /**
     * @function
     * @description Triggers a system run to update text specifically for the entity calling it. Useful when it's not an overall scene event and for cases where 
     * relying on an overall scene or all items to update isnt beneficial.
     * @returns {number} - height of the 3D object.
     */
    triggerTextStyleUpdate() {
        this.dispatchEvent(new CustomEvent('trigger-text-style-update', { detail: this, bubbles: true }));
    }
}

customElements.get('mr-text') || customElements.define('mr-text', MRText);
