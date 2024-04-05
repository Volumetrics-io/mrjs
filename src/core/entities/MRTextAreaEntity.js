import * as THREE from 'three';

import { getCaretAtPoint, getSelectionRects, Text } from 'troika-three-text';

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

        // this.defaults = {
        //     name: 'mr-textarea',
        //     rows: '...',
        //     cols: '...',
        //     placeholder: '',
        //     readonly: '...',
        //     disabled: '...',
        //     maxLength: '...',
        //     wrap: '...',
        //     overflowWrap: 'normal',
        //     whiteSpace: 'normal',
        // };
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
    // fillInHiddenInputElementWithUserData() {
    //     // name: The name associated with the <textarea> for form submission and backend processing.
    //     this.hiddenInput.name = this.getAttribute('name') ?? this.defaults.name;
    //     // rows and cols: These attributes control the size of the <textarea> in terms of the number of text rows and columns visible.
    //     this.hiddenInput.rows = this.getAttribute('rows') ?? this.defaults.rows;
    //     // placeholder: Provides a hint to the user about what they should type into the <textarea>.
    //     this.hiddenInput.placeholder = this.getAttribute('placeholder') ?? this.defaults.placeholder;
    //     // readonly: Makes the <textarea> uneditable, allowing the text to be only read, not modified.
    //     this.hiddenInput.readonly = this.getAttribute('readonly') ?? this.defaults.readonly;
    //     // disabled: Disables the text area so it cannot be interacted with or submitted.
    //     this.hiddenInput.disabled = this.getAttribute('disabled') ?? this.defaults.disabled;
    //     // maxlength: Specifies the maximum number of characters that the user can enter.
    //     this.hiddenInput.maxlength = this.getAttribute('maxlength') ?? this.defaults.maxlength;
    //     // wrap: Controls how text is wrapped in the textarea, with values like soft and hard affecting form submission.
    //     this.hiddenInput.wrap = this.getAttribute('wrap') ?? this.defaults.wrap;
    //     // overflowwrap : Controls how wrap breaks, at whitespace characters or in the middle of words.
    //     this.hiddenInput.overflowWrap = this.getAttribute('overflowWrap') ?? this.defaults.overflowWrap;
    //     // whitespace : Controls if text wraps with the overflowWrap feature or not.
    //     this.hiddenInput.whiteSpace = this.getAttribute('whitespace') ?? this.defaults.whiteSpace;
    // }

    /**
     *
     */
    updateTextDisplay() {
        // XXX - add scrolling logic in here for areas where text is greater than
        // the width/domain the user creates visually

        this.textObj.text = this.hiddenInput.value;
    }

    handleMouseClick(event) {
        // Convert isx position from world position to local:
        // - make sure textObj has updated matrices so we're not calculating info wrong
        // - note: textObj doesnt need sync
        this.textObj.updateMatrixWorld(true);
        const inverseMatrixWorld = new THREE.Matrix4().copy(this.textObj.matrixWorld).invert();
        const localPosition = inverseMatrixWorld * event.worldPosition;

        // update cursor position based on click
        const caret = getCaretAtPoint(this.textObj.textRenderInfo, localPosition.x, localPosition.y);
        this.hiddenInput.selectionStart = caret.charIndex;
        this.updateCursorPosition();
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

        let needsCursorUpdate = true;
        let isNewLine = false;

        // Handle Special Keys, then Up/Down, then Left/Right 
        // as some may trigger the others being required
        // based on assumed implementations for them for the
        // textarea dom element.

        if (isBackspace || isDelete) {
            this.updateTextDisplay(); // Ensure text display updates after key press
            this.hiddenInput.selectionStart--;
        } else if (isEnter) {
            // this.updateTextDisplay(); // Ensure text display updates after key press
            isNewLine = true;
            // this.hiddenInput.selectionStart++;
        }

        // Some shared variables
        const cursorIndex = this.hiddenInput.selectionStart;
        const textBeforeCursor = this.hiddenInput.value.substring(0, cursorIndex);
        const linesInclUpToCursorPosition = textBeforeCursor.split('\n');
        const allLines = this.hiddenInput.value.split('\n');
        const totalNumberOfLines = allLines.length;
        const cursorIsOnLineIndex = linesInclUpToCursorPosition.length - 1;
        // Grab current local cursor index on the line. When looping skipping the
        // last index as that is the line that includes the cursor in it and we only
        // want all lines up to that line, not including it.
        let totalLengthToCursorIndexLine = 0;
        for (let i = 0; i < linesInclUpToCursorPosition.length - 1; ++i) {
            totalLengthToCursorIndexLine += linesInclUpToCursorPosition[i].length;
        }
        const cursorIndexOnCurrentLine = cursorIndex - totalLengthToCursorIndexLine;

        // Need to handle up and down arrow properly otherwise these act as left
        // and right arrows like in textfield.
        if (isUpArrow) {
            // XXX - handle scrolloffset in future.

            // Only want to move up when not already on the top line
            if (cursorIsOnLineIndex != 0) {
                // Determine where cursor should hit index on line above this one: same index or end of line
                const prevLineText = allLines[cursorIsOnLineIndex - 1];
                const maxIndexOptionOfPrevLine = prevLineText.length - 1;
                const cursorIndexOnNewLine = (cursorIndexOnCurrentLine > maxIndexOptionOfPrevLine) ? maxIndexOptionOfPrevLine : cursorIndexOnCurrentLine;
                this.hiddenInput.selectionStart = totalLengthToCursorIndexLine - prevLineText.length + cursorIndexOnNewLine;
            } 
        } else if (isDownArrow) {
            // XXX - handle scrolloffset in future.

            // Only want to move up when not already on the top line
            if (cursorIsOnLineIndex != totalNumberOfLines - 1) {
                const currentLineText = allLines[cursorIsOnLineIndex];
                // Determine where cursor should hit index on line below this one: same index or end of line
                const nextLineText = allLines[cursorIsOnLineIndex + 1]
                const maxIndexOptionOfNextLine = nextLineText.length - 1;
                const cursorIndexOnNewLine = (cursorIndexOnCurrentLine > maxIndexOptionOfNextLine) ? maxIndexOptionOfNextLine : cursorIndexOnCurrentLine;
                this.hiddenInput.selectionStart = totalLengthToCursorIndexLine + currentLineText.length + cursorIndexOnNewLine;
            }
        }

        // Make sure selectionEnd matches the newly updated start position since
        // they start out that way and for consistency until we actually use them
        // for another purpose, we want them to be the same.
        this.hiddenInput.selectionEnd = this.hiddenInput.selectionStart;

        // Ensure the cursor position is updated to reflect the current caret position
        setTimeout(() => {
            if (needsCursorUpdate) {
                this.updateCursorPosition(true, isNewLine);
            }
        }, 0);
    }

    /**
     *
     */
    updateCursorPosition(fromCursorMove=false, isNewLine=false) {

        const updateBasedOnSelectionRects = (cursorIndex, isNewLine) => {
            // Setup variables for calculations.
            // XXX - handle cursor position change for visible lines for scrolloffset here in future
            const textBeforeCursor = this.hiddenInput.value.substring(0, cursorIndex);
            const allLines = this.hiddenInput.value.split('\n');
            const linesBeforeCursor = textBeforeCursor.split('\n');
            const cursorIsOnLineIndex = linesBeforeCursor.length - 1;

            let cursorXOffsetPosition = 0;
            let cursorYOffsetPosition = 0;
            
            if (isNewLine) {
                console.log('in the isNewLine section');
                // Faking the newline cursor position since troika doesnt create it until you type something
                // after the '\n' character sequence, which means the cursor lingers on the current line one
                // keypress too long, which isnt expected.
                //
                // Note that for this case, the cursor indicating position is /not/ matching the selectionRects
                // nor the this.hiddenInputs physical position.
                cursorXOffsetPosition = 0;
                cursorYOffsetPosition = 0 - this.cursorHeight * (cursorIsOnLineIndex + 1);
                console.log('cursorXOffsetPosition: ', cursorXOffsetPosition, 'cursorYOffsetPosition: ', cursorYOffsetPosition);
            } else {
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
                    cursorXOffsetPosition = lastRect.right + this.cursorWidth;
                    cursorYOffsetPosition = lastRect.bottom + this.cursorHeight;
                }
            }

            // Update the cursor's 3D position
            this.cursor.position.x = this.cursorStartingPosition.x + cursorXOffsetPosition;
            this.cursor.position.y = this.cursorStartingPosition.y + cursorYOffsetPosition;
            // if (isNewLine) {
                console.log('this.cursorStartingPosition:', this.cursorStartingPosition);
                console.log('this.cursor.position:', this.cursor.position);
            // }
            this.cursor.visible = true;
        }

        console.log('here in update cursor position');
        // Check if we have any DOM element to work with.
        if (!this.hiddenInput) {
            return;
        }

        // Since no text is selected, this and selectionEnd are just the cursor position.
        // XXX - when we actually allow for seleciton in future, some of the below will need to
        // be thought through again.
        const cursorIndex = this.hiddenInput.selectionStart;
        console.log('found cursor index as:', cursorIndex);
        
        // early escape for empty text
        if (cursorIndex == 0) {
            this.cursor.position.x = this.cursorStartingPosition.x;
            this.cursor.position.y = this.cursorStartingPosition.y;
            this.cursor.visible = true;
            return;
        }

        // Separating textObj sync from the cursor update based on rects
        // since textObj sync resolves when there's actual changes to the
        // object. Otherwise, it'll hang and never hit the update function.
        if (fromCursorMove) {
            updateBasedOnSelectionRects(cursorIndex, isNewLine);
        } else {
            this.textObj.sync(() => {
                updateBasedOnSelectionRects(cursorIndex, isNewLine);
            });
        }
    }
}

customElements.get('mr-textarea') || customElements.define('mr-textarea', MRTextAreaEntity);
