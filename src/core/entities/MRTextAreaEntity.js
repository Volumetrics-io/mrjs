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
    /**
     * @class
     * @description Constructor for the MRTextInputEntity entity component.
     */
    constructor() {
        super();
        this.lineHeight = 1.2; // Default line height, can be adjusted as needed
        this.object3D.name = 'textArea';
    }

    /**
     * @function
     * @description Called by connected to make sure the hiddenInput dom element is created as expected.
     */
    createHiddenInputElement() {
        // setup
        const inputElement = document.createElement('textarea');

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
        // name: The name associated with the <textarea> for form submission and backend processing.
        this.hiddenInput.setAttribute('name', this.getAttribute('name') ?? undefined);
        // rows and cols: These attributes control the size of the <textarea> in terms of the number of text rows and columns visible.
        this.hiddenInput.setAttribute('rows', this.getAttribute('rows') ?? undefined);
        this.hiddenInput.setAttribute('cols', this.getAttribute('cols') ?? undefined);
        // placeholder: Provides a hint to the user about what they should type into the <textarea>.
        this.hiddenInput.setAttribute('placeholder', this.getAttribute('placeholder') ?? '');
        // readonly: Makes the <textarea> uneditable, allowing the text to be only read, not modified.
        this.hiddenInput.setAttribute('readonly', this.getAttribute('readonly') ?? false);
        // disabled: Disables the text area so it cannot be interacted with or submitted.
        this.hiddenInput.setAttribute('disabled', this.getAttribute('disabled') ?? false);
        // maxlength: Specifies the maximum number of characters that the user can enter.
        this.hiddenInput.setAttribute('maxlength', this.getAttribute('maxlength') ?? undefined);
        // wrap: Controls how text is wrapped in the textarea, with values like soft and hard affecting form submission.
        this.hiddenInput.setAttribute('wrap', this.getAttribute('wrap') ?? undefined);
        // overflowwrap : Controls how wrap breaks, at whitespace characters or in the middle of words.
        this.hiddenInput.setAttribute('overflowWrap', this.getAttribute('overflowWrap') ?? undefined);
        // whitespace : Controls if text wraps with the overflowWrap feature or not.
        this.hiddenInput.setAttribute('whitespace', this.getAttribute('whitespace') ?? undefined);
    }

    get hasTextSubsetForVerticalScrolling() {
        return true;
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
    updateTextDisplay(fromCursorMove=false) {
        // XXX - add scrolling logic in here for areas where text is greater than
        // the width/domain the user creates visually

        // check if a new line was added/removed - if so, handle offset
        // note: movement of the vertical indices should be handled by 
        const allLines = this.hiddenInput.value.split('\n');
        const cursorIndex = this.hiddenInput.selectionStart;
        let textBeforeCursor = this.hiddenInput.value.substring(0, cursorIndex);
        let linesBeforeCursor = textBeforeCursor.split('\n');
        let cursorIsOnLineIndex = linesBeforeCursor.length;
        console.log('UPDATING TEXT DISPLAY, FROMCURSORMOVE:', fromCursorMove ? "TRUE" : "FALSE", "IF FALSE - handles scrolling");
        if (!fromCursorMove) {
            console.log('handling cursor move based on key input!!!! for textobj update');
            // handle update for edges where key pressing adds to it
            const maxHiddenInputLineIndex = allLines.length - 1;
            if (maxHiddenInputLineIndex < 0) {
                // nothing
                this.verticalTextObjStartLineIndex = 0;
                this.verticalTextObjEndLineIndex = 0;
            } else if (cursorIsOnLineIndex < this.verticalTextObjStartLineIndex) {
                // deletion, scroll up
                console.log('SOMETHING WAS DELETED');
                --this.verticalTextObjEndLineIndex;
                --this.verticalTextObjStartLineIndex;
            } else if (cursorIsOnLineIndex > this.verticalTextObjEndLineIndex) {
                // adding, scroll down
                console.log('SOMETHING WAS ADDED');
                ++this.verticalTextObjEndLineIndex;
                ++this.verticalTextObjStartLineIndex;
            }
        }

        let text = "";
        for (let lineIdx = this.verticalTextObjStartLineIndex; lineIdx <= this.verticalTextObjEndLineIndex && lineIdx < allLines.length; ++lineIdx) {
            text += allLines[lineIdx] ?? "";
            if (lineIdx != allLines.length - 1) {
                text += '\n';
            }
        }

        console.log('new text was:', text);

        this.textObj.text = text;
    }

    /**
     * @function
     * @description Called by the keydown event trigger. Handles the arrow key movements.
     * @param {event} event - the keydown event
     */
    handleKeydown(event) {
        const { keyCode } = event;
        const isLeftArrow = keyCode === 37;
        const isUpArrow = keyCode === 38;
        const isRightArrow = keyCode === 39;
        const isDownArrow = keyCode === 40;

        // We need to handle the up/down arrows in a special way here; otherwise,
        // they'll default to the left/right implementation.
        //
        // And in all cases, we need to update the selction points and the cursor
        // position here.

        // Note: movement should be based on TextObj primarily, while using hiddenInput
        // for full boundary checking.

        // Some shared variables
        const cursorIndex = this.hiddenInput.selectionStart;
        const textBeforeCursor = this.hiddenInput.value.substring(0, cursorIndex);
        const allLines = this.hiddenInput.value.split('\n');
        const cursorIsOnLineIndex = textBeforeCursor.split('\n').length - 1;
        // Grab current local cursor index on the line. When looping skipping the
        // last index as that is the line that includes the cursor in it and we only
        // want all lines up to that line, not including it.
        let totalLengthToCursorIndexLine = this._totalLengthUpToLineIndex(cursorIsOnLineIndex, allLines);
        const cursorIndexOnCurrentLine = cursorIndex - totalLengthToCursorIndexLine;

        // create specific variables for textObj lines subset given vertical scrolling
        console.log('---------------------- in HANDLEKEYDOWN:');
        let prevCursorIsOnTextObjLineIndex = cursorIsOnLineIndex - this.verticalTextObjStartLineIndex;
        console.log('cursor line index to change:', cursorIsOnLineIndex);
        console.log('textobj line index to change: ' , prevCursorIsOnTextObjLineIndex);
        console.log('vertical line idx to change - START:', this.verticalTextObjStartLineIndex, 'END:', this.verticalTextObjEndLineIndex);

        // Need to handle UP and DOWN arrow properly otherwise these act as LEFT
        // and RIGHT arrows like in textfield.
        if (isUpArrow) {
            console.log('IS UP ARROW');
            // Only want to move up when not already on the hiddenInput top line
            // and if on the textObj top line, need to scroll the textobj as well
            if (cursorIsOnLineIndex != 0) {
                if (prevCursorIsOnTextObjLineIndex == 0) {
                    // theyre the same so cursor will move the visual display, scroll for the up arrow
                    --this.verticalTextObjStartLineIndex;
                    --this.verticalTextObjEndLineIndex;
                    this.updateTextDisplay(true);
                }
                // Determine where cursor should hit index on line above this one: same index or end of line
                const prevLineText = allLines[cursorIsOnLineIndex - 1];
                const maxIndexOptionOfPrevLine = prevLineText.length - 1;
                const cursorIndexOnNewLine = cursorIndexOnCurrentLine > maxIndexOptionOfPrevLine ? maxIndexOptionOfPrevLine : cursorIndexOnCurrentLine;
                this.hiddenInput.selectionStart = totalLengthToCursorIndexLine - prevLineText.length + cursorIndexOnNewLine;
                
                console.log('----UPARROW---');
                console.log('HIDDEN INPUT SELECTIONSTART INDEX:', cursorIsOnLineIndex-1);
                console.log('TEXTOBJ VISIBLE STARTLINEINDEX:', this.verticalTextObjStartLineIndex);
            }
        } else if (isDownArrow) {
            console.log('IS DOWN ARROW');
            // Only want to move up when not already on the top line
            if (cursorIsOnLineIndex != allLines.length - 1) {
                if (cursorIsOnLineIndex == this.verticalTextObjEndLineIndex) {
                    // theyre the same so cursor will move the visual display, scroll for the down arrow
                    ++this.verticalTextObjStartLineIndex;
                    ++this.verticalTextObjEndLineIndex;
                    this.updateTextDisplay(true);
                }
                const currentLineText = allLines[cursorIsOnLineIndex];
                // Determine where cursor should hit index on line below this one: same index or end of line
                const nextLineText = allLines[cursorIsOnLineIndex + 1];
                const maxIndexOptionOfNextLine = nextLineText.length - 1;
                const cursorIndexOnNewLine = cursorIndexOnCurrentLine > maxIndexOptionOfNextLine ? maxIndexOptionOfNextLine : cursorIndexOnCurrentLine;
                this.hiddenInput.selectionStart = totalLengthToCursorIndexLine + currentLineText.length + cursorIndexOnNewLine;
                console.log('----DOWNARROW---');
                console.log('HIDDEN INPUT SELECTIONSTART INDEX:', cursorIsOnLineIndex+1);
                console.log('TEXTOBJ VISIBLE STARTLINEINDEX:', this.verticalTextObjStartLineIndex);
            }
        }

        // Make sure selectionEnd matches the newly updated start position since
        // they start out that way and for consistency until we actually use them
        // for another purpose, we want them to be the same.
        this.hiddenInput.selectionEnd = this.hiddenInput.selectionStart;

        // Ensure the cursor position is updated to reflect the current caret position
        // This is actually needed otherwise the cursor event's are off by a count (ie
        // press left 2x, the right 1x and the first press and third press wont function
        // as the user expects and it'll still be waiting for a 4th press. That is -
        // it'll go: 1)nothing 2)left 3)left 4)right
        // instead of expected: 1)left 2) left 3) right
        setTimeout(() => {
            this.updateCursorPosition(true);
        }, 0);
    }
}

customElements.get('mr-textarea') || customElements.define('mr-textarea', MRTextAreaEntity);
