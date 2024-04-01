import * as THREE from 'three';

import { getSelectionRects } from 'troika-three-text';

import { MRTextInputEntity } from 'mrjs/core/entities/MRTextInputEntity';

/**
 * @class MRTextFieldEntity
 * @classdesc The text element that is used to represent normal user-entry text field items one would expect in a web-browser. Limits the one-line. `mr-textfield`
 * @augments MRTextInputEntity
 */
export class MRTextFieldEntity extends MRTextInputEntity {
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
     *
     */
    createHiddenInputElement() {
        this.hiddenInput = document.createElement('input');
        this.hiddenInput.setAttribute('type', 'text');
    }

    /**
     *
     */
    updateTextDisplay() {
        // Determine the maximum number of characters per line based on renderable area (example given)
        const maxCharsPerLine = 50; // This should be dynamically calculated
        
        this.textObj.text = visibleText;

        this.updateCursorPosition();
    }

    /**
     * Handles keydown events for scrolling and cursor navigation.
     * @param event
     */
    handleKeydown(event) {
        const { keyCode } = event;
        const isUp = keyCode === 38; // Arrow up
        const isDown = keyCode === 40; // Arrow down
        const isBackspace = keyCode === 8; // Backspace
        const isDelete = keyCode === 46; // Delete
        const isEnter = keyCode === 13; // Enter

        // Adjust for special keys that alter text
        if (isBackspace || isDelete || isEnter) {
            setTimeout(() => {
                this.updateTextDisplay(); // Ensure text display updates after key press
            }, 0);
        }

        // TODO - anything else?

        // Ensure the cursor position is updated to reflect the current caret position
        setTimeout(() => {
            this.updateCursorPosition();
        }, 0);
    }

    /**
     * @function
     * @description Updates the cursor position based on click and selection location.
     */
    updateCursorPosition() {
        // to be resolved in future implementation.

        // const end = this.hiddenInput.selectionStart > 0 ? this.hiddenInput.selectionStart : 1;
        // const selectBox = getSelectionRects(this.textObj.textRenderInfo, 0, end).pop();
        // if (!selectBox || isNaN(selectBox.left)) {
        //     this.cursor.position.setX(0);
        //     return;
        // } else {
        //     if (this.hiddenInput.selectionStart == 0) {
        //         this.cursor.position.setX(selectBox.left);
        //     } else {
        //         this.cursor.position.setX(selectBox.right);
        //     }
        //     this.cursor.position.setY(selectBox.bottom / 2); //+ this.textObj.fontSize / 2); <--keep here for now, might bring it back
        // }
    };
}

customElements.get('mr-textfield') || customElements.define('mr-textfield', MRTextFieldEntity);
