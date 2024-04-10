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

        // We dont need to do anything fancy to differentiate up/down versus left/right
        // arrow keys, we just need to make sure theyre handled properly, so we
        // update the selction points and the cursor position here.

        // Make sure selectionEnd matches the newly updated start position since
        // they start out that way and for consistency until we actually use them
        // for another purpose, we want them to be the same.
        this.hiddenInput.selectionEnd = this.hiddenInput.selectionStart;

        // Ensure the cursor position is updated to reflect the current caret position
        setTimeout(() => {
            this.updateCursorPosition(true);
        }, 0);
    }
}

customElements.get('mr-textfield') || customElements.define('mr-textfield', MRTextFieldEntity);
