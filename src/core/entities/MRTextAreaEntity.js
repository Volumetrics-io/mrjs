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
     * Overrides the connected method to include setup for handling multiline text.
     */
    async connected() {
        await super.connected()
    }

    /**
     *
     */
    updateTextDisplay() {
        // Determine the maximum number of characters per line based on renderable area (example given)
        const maxCharsPerLine = 50; // This should be dynamically calculated

        const lines = this.hiddenInput.value.split('\n').map((line) => {
            // Truncate or split lines here based on maxCharsPerLine if implementing horizontal scrolling
            return line.substring(0, maxCharsPerLine);
        });

        // Existing logic to determine visibleLines based on scrollOffset and maxVisibleLines
        const visibleLines = lines.slice(this.scrollOffset, this.scrollOffset + this.maxVisibleLines);
        const visibleText = visibleLines.join('\n');

        this.textObj.text = visibleText;
        // console.log('text updated: ', this.textObj.text);

        // Logic to adjust scrollOffset for new input, ensuring the latest text is visible
        if (lines.length > this.maxVisibleLines && this.hiddenInput === document.activeElement) {
            this.scrollOffset = Math.max(0, lines.length - this.maxVisibleLines);
        }

        this.updateCursorPosition();
    }

    /**
     * Handles keydown events for scrolling and cursor navigation.
     * @param {event} event - the keydown event
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
            if (this.scrollOffset < this.hiddenInput.value.split('\n').length - this.maxVisibleLines) {
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

    // We assume the default starting position is the origin: 0,0,0. This actually defaults
    // to the geometry's 0,0,0 origin which is its center and not it's top left as assumed
    // by most web-applications.
    //
    // Storing it so we have something to compare against when calculating cursor start
    // in comparison to geometry origin.
    _cursorDefaultStartingPosition = new THREE.Vector3(0, 0, 0);
    // We store this for the geometry so we can do our geometry vs web origin calculations
    // more easily as well. We update this based on the geometry's own changes.
    //
    // Set as 0,0,0 to start, and updated when the geometry updates.
    _cursorCalculatedStartingPosition = new THREE.Vector3(0, 0, 0);
    // Only needs to be adjusted on style changes.
    // TextCharWidth is specific to a font and text-size in relation to how much
    // actual 3d space a character is expected to take up.
    //
    // This is useful for things like cursor positioning, etc.
    _textCharWidth = 0;

    /**
     *
     */
    updateCursorPosition() {
        // set maxWidth to this.background's width property.
        this.textObj.maxWidth = this.width;
        this.textObj.maxHeight = this.height;
        // calculate the textObj's width for the cursorCalculatedStartingPosition
        if (this._cursorCalculatedStartingPosition.x == 0 && this._cursorCalculatedStartingPosition.y == 0) {
            this._cursorCalculatedStartingPosition.x = (-1.0 * this.textObj.maxWidth) / 2;
            this._cursorCalculatedStartingPosition.y = (1.0 * this.textObj.maxHeight) / 2 - this._cursorHeight / 2;
        }

        // Calculate the cursor position within the hiddenInput
        const cursorIndex = this.hiddenInput.selectionStart;
        const textBeforeCursor = this.hiddenInput.value.substring(0, cursorIndex);
        const lastNewLineIndex = this.hiddenInput.value.lastIndexOf('\n');
        const linesBeforeCursor = textBeforeCursor.split('\n');
        const numberOfLines = linesBeforeCursor.length;
        const currentLineText = linesBeforeCursor[numberOfLines - 1];

        // Adjust for scrollOffset in MRTextAreaEntity
        const visibleLinesStartIndex = Math.max(0, numberOfLines - this.scrollOffset - 1);
        const lines = this.hiddenInput.value.split('\n').slice(this.scrollOffset, this.scrollOffset + this.maxVisibleLines);

        // Below commented needs to finish being fixed
        // console.log('------start: about to calculate updated cursor position');
        // this.textObj.sync(() => {
        //     let end_index = cursorIndex;
        //     let start_index = lastNewLineIndex + 1;
        //     let selectionRects = getSelectionRects(this.textObj.textRenderInfo, start_index, end_index);
        //     console.log('start_index', start_index, 'end_index', end_index, 'the selection rects:', selectionRects);
        // });
        // const cursorXPosition = currentLineText.length * this._textCharWidth + (currentLineText.length - 1) * this.textObj.letterSpacing;
        const cursorXPosition = currentLineText.length * 0.005;
        // console.log('------done')
        const cursorYPosition = -(visibleLinesStartIndex * (this.lineHeight * this._textCharHeight) * this.textObj.fontSize);

        const cursorDebugObj = {
            cursorIndex: cursorIndex,
            textBeforeCursor: textBeforeCursor,
            linesBeforeCursor: linesBeforeCursor,
            numberOfLines: numberOfLines,
            currentLineText: currentLineText,
            visibleLinesStartIndex: visibleLinesStartIndex,
            lines: lines,
            cursorXPosition: cursorXPosition,
            cursorYPosition: cursorYPosition,
        };

        // console.log('troika obj:', this.textObj);
        // this.printCurrentTextDebugInfo();
        // console.log('cursor debug obj:', cursorDebugObj);

        // Update the cursor's 3D position
        if (this.cursor) {
            this.cursor.position.x = this._cursorCalculatedStartingPosition.x + cursorXPosition;
            this.cursor.position.y = this._cursorCalculatedStartingPosition.y + cursorYPosition;
            this.cursor.visible = true;
        }
    }
}

customElements.get('mr-textarea') || customElements.define('mr-textarea', MRTextAreaEntity);
