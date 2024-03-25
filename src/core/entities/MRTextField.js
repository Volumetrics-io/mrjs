import * as THREE from 'three';

import { getSelectionRects } from 'troika-three-text';

import { MRTextInput } from 'mrjs/core/entities/MRTextInput';

/**
 * @class MRTextField
 * @classdesc The text element that is used to represent normal user-entry text field items one would expect in a web-browser. Limits the one-line. `mr-textfield`
 * @augments MRTextInput
 */
export class MRTextField extends MRTextInput {
    //  /**
    //  * @returns {number} - the height of the rendering area for the text. Counts as the css height px value representation.
    //  */
    //  get height() {
    //     return Math.abs(this.textObj.textRenderInfo?.blockBounds[1] ?? 1);
    // }

    // /**
    //  * @returns {number} - the height of the rendering area for the text. Counts as the css height px value representation.
    //  */
    // get width() {
    //     return Math.abs(this.textObj.textRenderInfo?.blockBounds[2] ?? 1);
    // }

    /**
     * @class
     * @description Constructor for the textField entity component.
     */
    constructor() {
        super();
        this.wrapper = this.shadowRoot.appendChild(document.createElement('div'));
        this.wrapper.innerHTML = '<slot></slot>';
    }

    /**
     * @function
     * @description Callback function of MREntity - handles setting up this textfield once it is connected to run as an entity component.
     */
    connected() {
        this.input = document.createElement('input');
        this.input.setAttribute('type', 'text');

        super.connected();
    }

    /**
     * @function
     * @description Updates the cursor position based on click and selection location.
     */
    updateCursorPosition = () => {
        const end = this.input.selectionStart > 0 ? this.input.selectionStart : 1;
        const selectBox = getSelectionRects(this.textObj.textRenderInfo, 0, end).pop();
        if (!selectBox || isNaN(selectBox.left)) {
            this.cursor.position.setX(0);
            return;
        } else {
            if (this.input.selectionStart == 0) {
                this.cursor.position.setX(selectBox.left);
            } else {
                this.cursor.position.setX(selectBox.right);
            }
            this.cursor.position.setY(selectBox.bottom / 2); //+ this.textObj.fontSize / 2); <--keep here for now, might bring it back
        }
    };
}

customElements.get('mr-textfield') || customElements.define('mr-textfield', MRTextField);
