import * as THREE from 'three';

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
        this.lineHeight = 1.2; // Default line height, can be adjusted as needed
        this.object3D.name = 'textField';

        // this.wrapper = this.shadowRoot.appendChild(document.createElement('div'));
        // this.wrapper.innerHTML = '<slot></slot>';
    }

    /**
     * @function
     * @description Called by connected to make sure the hiddenInput dom element is created as expected.
     */
    createHiddenInputElement() {
        // setup
        const inputElement = document.createElement('input');
        inputElement.setAttribute('type', 'text');

        // style
        inputElement.style.position = 'absolute';
        inputElement.style.height = '1px';
        inputElement.style.width = '1px';
        inputElement.style.overflow = 'hidden';

        // Ensure it's part of the DOM for event capturing
        this.shadowRoot.appendChild(inputElement);
        this.hiddenInput = inputElement;
    }

    /**
     * @function
     * @description Called by connected after createHiddenInputElement to fill
     * it in with the user's given attribute information.
     */
    fillInHiddenInputElementWithUserData() {
        // name: The name associated with the <textfield> for form submission and backend processing.
        this.hiddenInput.setAttribute('name', this.getAttribute('name') ?? undefined);
        // value: Sets the initial value of the input field.
        this.hiddenInput.setAttribute('value', this.getAttribute('value') ?? undefined);
        // placeholder: Specifies a short hint that describes the expected value of the input field.
        this.hiddenInput.setAttribute('placeholder', this.getAttribute('placeholder') ?? '');
        // maxlength: Sets the maximum number of characters that can be entered into the input field.
        this.hiddenInput.setAttribute('maxlength', this.getAttribute('maxlength') ?? undefined);
        // size: Defines the width of the input field in characters.
        this.hiddenInput.setAttribute('size', this.getAttribute('size') ?? 10);
        // autofocus: If present, specifies that the input field should automatically get focus when the page loads.
        this.hiddenInput.setAttribute('autofocus', this.getAttribute('autofocus') ?? false);
        // readonly: If present, specifies that the input field is read-only and cannot be edited by the user.
        this.hiddenInput.setAttribute('readonly', this.getAttribute('readonly') ?? false);
        // disabled: If present, disables the input field so that it cannot be interacted with or submitted.
        this.hiddenInput.setAttribute('disabled', this.getAttribute('disabled') ?? false);
        // required: If present, specifies that the input field must be filled out before submitting the form.
        this.hiddenInput.setAttribute('required', this.getAttribute('required') ?? false);
        // autocomplete: Enables or disables autocomplete suggestions for the input field. Values can be "on" or "off".
        this.hiddenInput.setAttribute('autocomplete', this.getAttribute('autocomplete') ?? undefined);
        // pattern: Specifies a regular expression that the input's value must match in order for the form to be submitted.
        this.hiddenInput.setAttribute('pattern', this.getAttribute('pattern') ?? undefined);
        // title: Provides a tooltip or advisory information about the input field when hovered over.
        this.hiddenInput.setAttribute('title', this.getAttribute('title') ?? undefined);
        // id: Specifies a unique ID for the input field, which can be used for targeting with CSS or JavaScript.
        this.hiddenInput.setAttribute('id', this.getAttribute('id') ?? undefined);
    }

    get hasTextSubsetForVerticalScrolling() {
        return false;
    }

    // todo - better name
    get hasTextSubsetForHorizontalScrolling() {
        // todo - handle wrapping etc lol
        mrjsUtils.error.emptyParentFunction();
    }

    /**
     * @function
     * @description Used on event trigger to update the textObj visual based on
     * the hiddenInput DOM element.
     */
    updateTextDisplay(fromCursorMove = false) {
        // This wont need any extra logic for scrolling in future.
        this.textObj.text = this.hiddenInput.value;
    }

    /**
     * @function
     * @description Handles keydown events for scrolling and cursor navigation. Note
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
        this.updateCursorPosition(true);
    }
}

customElements.get('mr-textfield') || customElements.define('mr-textfield', MRTextFieldEntity);
