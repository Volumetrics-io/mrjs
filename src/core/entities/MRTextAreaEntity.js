import * as THREE from 'three';

import { getSelectionRects, Text } from 'troika-three-text';

import { MRTextInputEntity } from 'mrjs/core/entities/MRTextInputEntity';

/**
 * @class MRTextAreaEntity
 * @classdesc The text area element that simulates the behavior of an HTML <textarea> tag,
 *            allowing for multiline text input and display. Inherits from MRTextInputEntity, which
 *            in turn extends MRTextEntity.
 * @augments MRTextInputEntity
 */
export class MRTextAreaEntity extends MRTextInputEntity {
    /**
     * @class
     */
    constructor() {
        super();
        // Define additional properties for handling multiline text and scrolling
        this.lineHeight = 1.2; // Default line height, can be adjusted as needed
        this.scrollOffset = 0; // The vertical scroll position
        this.maxVisibleLines = 10; // Maximum number of lines visible without scrolling
        this.object3D.name = 'textArea';

        this.defaults = {
            name: 'mr-textarea',
            rows: '...',
            cols: '...',
            placeholder: '',
            readonly: '...',
            disabled: '...',
            maxLength: '...',
            wrap: '...',
            overflowWrap: 'normal',
            whiteSpace: 'normal',
        };
    }

    /**
     *
     */
    createHiddenInputElement() {
        const inputElement = document.createElement('textarea');
        inputElement.style.position = 'absolute';
        inputElement.style.left = '-9999px'; // Position off-screen
        inputElement.style.height = '1px';
        inputElement.style.width = '1px';
        inputElement.style.overflow = 'hidden';
        document.body.appendChild(inputElement); // Ensure it's part of the DOM for event capturing
        this.hiddenInput = inputElement;
    }

    /**
     *
     */
    fillInHiddenInputElementWithUserData() {
        // name: The name associated with the <textarea> for form submission and backend processing.
        this.hiddenInput.name = this.getAttribute('name') ?? this.defaults.name;
        // rows and cols: These attributes control the size of the <textarea> in terms of the number of text rows and columns visible.
        this.hiddenInput.rows = this.getAttribute('rows') ?? this.defaults.rows;
        // placeholder: Provides a hint to the user about what they should type into the <textarea>.
        this.hiddenInput.placeholder = this.getAttribute('placeholder') ?? this.defaults.placeholder;
        // readonly: Makes the <textarea> uneditable, allowing the text to be only read, not modified.
        this.hiddenInput.readonly = this.getAttribute('readonly') ?? this.defaults.readonly;
        // disabled: Disables the text area so it cannot be interacted with or submitted.
        this.hiddenInput.disabled = this.getAttribute('disabled') ?? this.defaults.disabled;
        // maxlength: Specifies the maximum number of characters that the user can enter.
        this.hiddenInput.maxlength = this.getAttribute('maxlength') ?? this.defaults.maxlength;
        // wrap: Controls how text is wrapped in the textarea, with values like soft and hard affecting form submission.
        this.hiddenInput.wrap = this.getAttribute('wrap') ?? this.defaults.wrap;
        // overflowwrap : Controls how wrap breaks, at whitespace characters or in the middle of words.
        this.textObj.overflowWrap = this.getAttribute('overflowWrap') ?? this.defaults.overflowWrap;
        // whitespace : Controls if text wraps with the overflowWrap feature or not.
        this.textObj.whiteSpace = this.getAttribute('whitespace') ?? this.defaults.whiteSpace;
    }

    /**
     *
     */
    updateTextDisplay() {
        // XXX - add scrolling logic in here for areas where text is greater than
        // the width/domain the user creates visually

        this.textObj.text = this.hiddenInput.value;

        this.updateCursorPosition();
    }

    /**
     * Handles keydown events for scrolling and cursor navigation.
     * @param {event} event - the keydown event
     */
    handleKeydown(event) {
        const { keyCode } = event;
        const isUpArrow = keyCode === 38;
        const isDownArrow = keyCode === 40;
        const isBackspace = keyCode === 8;
        const isDelete = keyCode === 46;
        const isEnter = keyCode === 13;

        // Adjust for special keys that alter text
        if (isBackspace || isDelete || isEnter) {
            setTimeout(() => {
                // Ensure text display updates after key press
                this.updateTextDisplay();
            }, 0);
        }

        // Scroll handling for arrow keys
        if (isUp) {
            // XXX - handle scrolloffset in future.
            // XXX - includes adding event.preventDefault to avoid moving the caret to the start/end
            this.updateTextDisplay();
            event.preventDefault(); 
        } else if (isDown) {
            // XXX - handle scrolloffset in future
            // XXX - includes adding event.preventDefault to avoid moving the caret to the start/end
            this.updateTextDisplay();
        }

        // Ensure the cursor position is updated to reflect the current caret position
        setTimeout(() => {
            this.updateCursorPosition();
        }, 0);
    }

    /**
     * 
     */
    updateSelectionPosition(event) {
        console.log('trigger event on focus for loc:', event);
        console.log('event pos in 2d space:', event.clientX, event.clientY);
        this.textObj.sync(() => {
            // getCaretAtPoint(this.textObj.textRenderInfo, x, y);
        });
    }

    /**
     *
     */
    updateCursorPosition() {
        // Check if we have any DOM element to work with.
        if (!this.hiddenInput) {
            return;
        }

        // Since no text is selected, this and selectionEnd are just the cursor position.
        // XXX - when we actually allow for seleciton in future, some of the below will need to
        // be thought through again.
        const cursorIndex = this.hiddenInput.selectionStart;
        
        // early escape for empty text
        if (cursorIndex == 0) {
            this.cursor.position.x = this.cursorStartingPosition.x;
            this.cursor.position.y = this.cursorStartingPosition.y;
            this.cursor.visible = true;
            return;
        }

        // Setup variables for calculations.
        const textBeforeCursor = this.hiddenInput.value.substring(0, cursorIndex);
        const lastNewLineIndex = this.hiddenInput.value.lastIndexOf('\n');
        const linesBeforeCursor = textBeforeCursor.split('\n');
        const numberOfLines = linesBeforeCursor.length;
        const currentLineText = linesBeforeCursor[numberOfLines - 1];

        // XXX handle visible lines for scrolloffset here in future

        this.textObj.sync(() => {
            // Assuming getSelectionRects is properly imported and used here
            let selectionRects = getSelectionRects(this.textObj.textRenderInfo, textBeforeCursor.length - 1, cursorIndex);
            if (selectionRects.length > 0) {
                let lastRect = selectionRects[selectionRects.length - 1];

                // Check if cursor matches our font size before using values.
                const cursorVisibleHeight = lastRect.top - lastRect.bottom;
                if (this.cursor.geometry.height != cursorVisibleHeight) {
                    this.cursor.geometry.height = cursorVisibleHeight;
                    this.cursor.geometry.needsUpdate = true;
                    this.cursorHeight = cursorVisibleHeight;
                }

                // Add the cursor dimension info to the position s.t. it doesnt touch the text itself. We want
                // a little bit of buffer room.
                const cursorXPosition = lastRect.right + this.cursorWidth;
                const cursorYPosition = lastRect.bottom + this.cursorHeight;

                // Update the cursor's 3D position
                this.cursor.position.x = this.cursorStartingPosition.x + cursorXPosition;
                this.cursor.position.y = this.cursorStartingPosition.y + cursorYPosition;
                this.cursor.visible = true;
            }
        });
    }
}

customElements.get('mr-textarea') || customElements.define('mr-textarea', MRTextAreaEntity);
