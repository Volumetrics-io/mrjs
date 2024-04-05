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
        // This wont need any extra logic for scrolling in future.
        this.textObj.text = this.hiddenInput.value;
    }

    /**
     * Handles keydown events for scrolling and cursor navigation. Note
     * that this is different than an input event which for our purposes,
     * handles the non-navigation key-presses.
     * @param {event} event - the keydown event
     */
    handleKeydown(event) {
        const { keyCode } = event;
        let isLeftArrow = keyCode === 37;
        const isUpArrow = keyCode === 38;
        let isRightArrow = keyCode === 39;
        const isDownArrow = keyCode === 40;
        const isBackspace = keyCode === 8;
        const isDelete = keyCode === 46;
        const isEnter = keyCode === 13;

        if (!(isLeftArrow || isUpArrow || isRightArrow || isDownArrow || isBackspace || isDelete || isEnter)) {
            // not special event, then handle as normal input
            this.updateTextDisplay();
        }

        // LeftArrow, RightArrow are inherently handled by the textField with Up and Down already
        // defaulting to left and right as expected, so not a lot of extra logic is needed here.

        // Handle special characters
        if (isBackspace || isDelete) {
            this.updateTextDisplay(); // Ensure text display updates after key press
            this.hiddenInput.selectionStart--;
        }

        // Make sure selectionEnd matches the newly updated start position since
        // they start out that way and for consistency until we actually use them
        // for another purpose, we want them to be the same.
        this.hiddenInput.selectionEnd = this.hiddenInput.selectionStart;

        // Ensure the cursor position is updated to reflect the current caret position
        setTimeout(() => {
            this.updateCursorPosition(true, false);
        }, 0);
    }
}

customElements.get('mr-textfield') || customElements.define('mr-textfield', MRTextFieldEntity);
