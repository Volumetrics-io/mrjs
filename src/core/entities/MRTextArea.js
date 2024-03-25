import { getSelectionRects } from 'troika-three-text';

import * as THREE from 'three';

import { MRTextInput } from 'mrjs/core/entities/MRTextInput';

/**
 * @class MRTextArea
 * @classdesc The text element that is used to represent normal paragraph user-entry text field items one would expect in a web-browser. `mr-textarea`
 * @augments MRTextInput
 */
export class MRTextArea extends MRTextInput {
    /**
     * @class
     * @description Constructor for the textArea entity component.
     */
    constructor() {
        super();
    }

    /**
     * @function
     * @description Callback function of MREntity - handles setting up this textarea once it is connected to run as an entity component.
     */
    connected() {
        this.input = document.createElement('textarea');

        super.connected();
    }

    /**
     * @function
     * @description Updates the cursor position based on click and selection location.
     */
    updateCursorPosition = () => {
        const end = this.input.selectionStart > 0 ? this.input.selectionStart : 1;
        const selectBox = getSelectionRects(this.textObj.textRenderInfo, 0, end).pop();
        if (isNaN(selectBox.right)) {
            return;
        }
        this.cursor.position.setX(this.input.selectionStart == 0 ? selectBox.left : selectBox.right);
        this.cursor.position.setY(selectBox.bottom + this.textObj.fontSize / 2);
    };
}

customElements.get('mr-textarea') || customElements.define('mr-textarea', MRTextArea);
