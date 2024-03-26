import * as THREE from 'three';

import { MRTextInputEntity } from 'mrjs/core/entities/MRTextInputEntity';

/**
 * @class MRTextAreaEntity
 * @classdesc The text area element that simulates the behavior of an HTML <textarea> tag,
 *            allowing for multiline text input and display. Inherits from MRTextInputEntity, which
 *            in turn extends MRTextEntity.
 * @augments MRTextInputEntity
 */
export class MRTextAreaEntity extends MRTextInputEntity {
    constructor() {
        super();
        // Define additional properties for handling multiline text and scrolling
        this.lineHeight = 1.2; // Default line height, can be adjusted as needed
        this.scrollOffset = 0; // The vertical scroll position
        this.maxVisibleLines = 10; // Maximum number of lines visible without scrolling
        this.object3D.name = 'textArea'
    }

    /**
     * Overrides the connected method to include setup for handling multiline text.
     */
    connected() {
        const inputElement = document.createElement('textarea');
        inputElement.style.position = 'absolute';
        inputElement.style.left = '-9999px'; // Position off-screen
        inputElement.style.height = '1px';
        inputElement.style.width = '1px';
        inputElement.style.overflow = 'hidden';
        document.body.appendChild(inputElement); // Ensure it's part of the DOM for event capturing
        this.input = inputElement;

        super.connected();

        // name: The name associated with the <textarea> for form submission and backend processing.
        this.input.name = this.getAttribute('name');
        // rows and cols: These attributes control the size of the <textarea> in terms of the number of text rows and columns visible.
        // TODO
        // placeholder: Provides a hint to the user about what they should type into the <textarea>.
        this.input.placeholder = this.getAttribute('placeholder');
        // readonly: Makes the <textarea> uneditable, allowing the text to be only read, not modified.
        // this.input.readOnly = this.getAttribute('readOnly');
        // disabled: Disables the text area so it cannot be interacted with or submitted.
        // this.input.disabled = this.getAttribute('disabled');
        // maxlength: Specifies the maximum number of characters that the user can enter.
        // TODO
        // wrap: Controls how text is wrapped in the textarea, with values like soft and hard affecting form submission.
        // TODO

        console.log('this.input created: ', this.input);

        this.setupEventListeners();

        this.triggerGeometryStyleUpdate();
        this.triggerTextStyleUpdate();
    }

    _focus() {
        if (! this.input) {
            return;
        }
        console.log('this._focus is hit');
        this.input.focus();
        this.input.selectionStart = this.input.value.length;
        this.cursor.visible = true;

        if (this.cursor.geometry !== undefined) {
            this.cursor.geometry.dispose();
        }
        this.cursor.geometry = new THREE.PlaneGeometry(0.002, this.textObj.fontSize);
        this.updateCursorPosition();
    }

    setupEventListeners() {
        // Click event to focus and allow input
        this.addEventListener('click', () => {
            this._focus();
        });

        this.addEventListener('blur', () => {
            this.input.blur();
            this.cursor.visible = false;
        });

        this.addEventListener('focus', () => {
            this._focus();
        });

        this.addEventListener('input', () => {
            this.input.input();
        });

        // Keyboard input event to capture text
        this.input.addEventListener('input', () => {
            this.updateTextDisplay();
        });
    }

    // updateTextDisplay() {
    //     const lines = this.input.value.split('\n');
    //     const visibleLines = lines.slice(this.scrollOffset, this.scrollOffset + this.maxVisibleLines);
    //     const visibleText = visibleLines.join('\n');
        
    //     // Update the 3D text object to display only the currently visible lines of text
    //     this.textObj.text = visibleText;
    //     console.log('text updated: ', this.textObj.text);

    //     this.updateCursorPosition();
    // }

    updateTextDisplay() {
        // Determine the maximum number of characters per line based on renderable area (example given)
        const maxCharsPerLine = 50; // This should be dynamically calculated
        
        const lines = this.input.value.split('\n').map(line => {
            // Truncate or split lines here based on maxCharsPerLine if implementing horizontal scrolling
            return line.substring(0, maxCharsPerLine);
        });
        
        // Existing logic to determine visibleLines based on scrollOffset and maxVisibleLines
        const visibleLines = lines.slice(this.scrollOffset, this.scrollOffset + this.maxVisibleLines);
        const visibleText = visibleLines.join('\n');
        
        this.textObj.text = visibleText;
        console.log('text updated: ', this.textObj.text);

        // Logic to adjust scrollOffset for new input, ensuring the latest text is visible
        if (lines.length > this.maxVisibleLines && this.input === document.activeElement) {
            // Automatically adjust scrollOffset to make new lines visible
            this.scrollOffset = Math.max(0, lines.length - this.maxVisibleLines);
        }

        this.updateCursorPosition();
    }

    /**
     * Handles keydown events for scrolling and cursor navigation.
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

        // Scroll handling for arrow keys
        if (isUp) {
            if (this.scrollOffset > 0) {
                this.scrollOffset--;
                this.updateTextDisplay();
            }
            event.preventDefault(); // Prevent default to avoid moving the caret to the start/end
        } else if (isDown) {
            if (this.scrollOffset < this.input.value.split('\n').length - this.maxVisibleLines) {
                this.scrollOffset++;
                this.updateTextDisplay();
            }
            event.preventDefault(); // Prevent default to avoid moving the caret to the start/end
        }

        // Ensure the cursor position is updated to reflect the current caret position
        setTimeout(() => {
            this.updateCursorPosition();
        }, 0);
    }

    // Additional methods for managing text area specific behavior can be added here,
    // such as text selection, clipboard operations (cut/copy/paste), and more advanced scrolling features.

    updateCursorPosition = () => {
        // Calculate the cursor position within the hiddenInput
        const cursorIndex = this.input.selectionStart;
        const textBeforeCursor = this.input.value.substring(0, cursorIndex);
        const linesBeforeCursor = textBeforeCursor.split('\n');
        const numberOfLines = linesBeforeCursor.length;
        const currentLineText = linesBeforeCursor[numberOfLines - 1];

        // Adjust for scrollOffset in MRTextAreaEntity
        const visibleLinesStartIndex = Math.max(0, numberOfLines - this.scrollOffset - 1);
        const lines = this.input.value.split('\n').slice(this.scrollOffset, this.scrollOffset + this.maxVisibleLines);

        // Assuming we have a method to calculate the width of a string in 3D space
        const cursorXPosition = this.calculateTextWidth(currentLineText);
        const cursorYPosition = -(visibleLinesStartIndex * this.lineHeight * this.textObj.fontSize);

        // Update the cursor's 3D position
        if (this.cursor) {
            console.log('cursorXPosition', cursorXPosition);
            console.log('cursorYPosition', cursorYPosition);
            this.cursor.position.x = cursorXPosition;
            this.cursor.position.y = cursorYPosition;
            this.cursor.visible = true; // Ensure the cursor is visible
        }
    }

    /**
     * Calculates the width of a given string of text. This is a placeholder function
     * and needs to be implemented based on your text rendering method.
     * 
     * @param {string} text The text for which to calculate the width.
     * @return {number} The calculated width of the text.
     */
    calculateTextWidth(text) {
        // This method needs to be implemented based on your text rendering setup.
        // For example, this could involve using the TextMetrics API or a similar
        // approach specific to Troika-Three-Text and Three.js.
        return text.length * 0.005; // Placeholder calculation
    }
}

customElements.get('mr-textarea') || customElements.define('mr-textarea', MRTextAreaEntity);
