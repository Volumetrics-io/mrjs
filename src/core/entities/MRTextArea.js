import { getSelectionRects } from 'troika-three-text';

import * as THREE from 'three';

import { MRTextInput } from 'mrjs/core/entities/MRTextInput';

// /**
    //  * @class
    //  * @description Constructor for the textArea entity component.
    //  */
    // constructor() {
    //     super();
    // }

    // /**
    //  * @function
    //  * @description Callback function of MREntity - handles setting up this textarea once it is connected to run as an entity component.
    //  */
    // connected() {
    //     this.input = document.createElement('textarea');

    //     super.connected();
    // }

    // /**
    //  * @function
    //  * @description Updates the cursor position based on click and selection location.
    //  */
    // updateCursorPosition = () => {
    //     const end = this.input.selectionStart > 0 ? this.input.selectionStart : 1;
    //     const selectBox = getSelectionRects(this.textObj.textRenderInfo, 0, end).pop();
    //     if (isNaN(selectBox.right)) {
    //         return;
    //     }
    //     this.cursor.position.setX(this.input.selectionStart == 0 ? selectBox.left : selectBox.right);
    //     this.cursor.position.setY(selectBox.bottom + this.textObj.fontSize / 2);
    // };

/**
 * @class MRTextArea
 * @classdesc The text element that is used to represent normal paragraph user-entry text field items one would expect in a web-browser. `mr-textarea`
 * @augments MRTextInput
 */
// import * as THREE from 'three';
// import { MRTe/xtInput } from './MRTextInput'; // Adjust the import path as necessary

// export class MRTextArea extends MRTextInput {
//     constructor() {
//         super();
//         this.cursorVisible = false;
//         this.totalLines = [];
//         this.visibleLineCount = 5; // Number of lines visible at any time
//         this.scrollIndex = 0; // Index of the top visible line in `totalLines`
//         this.setupInput();
//         this.createCursorMesh();
//     }

//     setupInput() {
//         super.setupInput(); // Call setupInput from MRTextInput if it exists
//         // Make sure to override or extend functionalities specifically for MRTextArea
//         this.input.addEventListener('input', () => {
//             this.textObj.text = this.input.value; // Sync the 3D text object with the textarea value
//             this.totalLines = this.input.value.split('\n');
//             this.updateVisibleText(); // Update the 3D text to reflect only the visible lines
//             this.updateCursorPosition(); // Ensure the cursor position updates with text input
//         });

//         this.input.style.opacity = '0'; // Ensure the textarea is invisible but functional
//         this.input.style.position = 'fixed'; // Use fixed to prevent layout shifts
//         this.input.style.top = '0';
//         this.input.style.left = '-9999px'; // Move off-screen
//         document.body.appendChild(this.input); // Add to the document body to capture input
//     }

//     createCursorMesh() {
//         const cursorGeometry = new THREE.PlaneGeometry(0.005, 0.2); // Create a thin, vertical plane for the cursor
//         const cursorMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff }); // Make the cursor white for visibility
//         this.cursorMesh = new THREE.Mesh(cursorGeometry, cursorMaterial);
//         this.cursorMesh.visible = false; // Start with the cursor invisible
//         this.textObj.add(this.cursorMesh); // Add the cursor mesh to the text object in 3D space
//     }

//     updateCursorVisibility(visible) {
//         this.cursorVisible = visible;
//         this.cursorMesh.visible = visible;
//         this.blinkCursor(); // Start or stop the cursor blinking
//     }

//     blinkCursor() {
//         if (!this.cursorVisible) return; // If the cursor shouldn't be visible, exit
//         this.cursorMesh.visible = !this.cursorMesh.visible; // Toggle visibility for blinking effect
//         setTimeout(() => this.blinkCursor(), 530); // Continue blinking at a regular interval
//     }

//     updateCursorPosition() {
//         // Assuming a fixed character width and line height for simplicity. Adjust as necessary.
//         const charWidth = 0.008; // Character width in your 3D space units
//         const lineHeight = 0.02; // Line height in your 3D space units
//         const lines = this.input.value.substring(0, this.input.selectionStart).split('\n');
//         const numLines = lines.length;
//         const lastLineLength = lines[lines.length - 1].length;

//         // Update the cursor's position based on the current text and cursor location within the input
//         this.cursorMesh.position.x = lastLineLength * charWidth;
//         this.cursorMesh.position.y = -(numLines - 1) * lineHeight;
//         this.cursorMesh.visible = true; // Make sure the cursor is visible when moving
//     }

//     updateVisibleText() {
//         // Determine which lines of text are visible based on the current scroll position
//         const visibleLines = this.totalLines.slice(this.scrollIndex, this.scrollIndex + this.visibleLineCount);
//         this.displayText(visibleLines.join('\n')); // Display only the visible lines in the 3D text object
//     }

//     displayText(text) {
//         // This method actually updates the 3D text object with the given text
//         this.textObj.text = text;
//         // If using Troika Text and the text updates don't reflect immediately, you may need to call `sync()` on the text object
//     }

//     // Ensure the connected, focus, and blur methods are implemented correctly
//     // You might need to override them from MRTextInput or add additional functionalities as needed

//     // Additional methods for handling scrolling, focusing, etc., can be implemented here
// }

/**
 * @class MRTextArea
 * @classdesc The text area element that simulates the behavior of an HTML <textarea> tag,
 *            allowing for multiline text input and display. Inherits from MRTextInput, which
 *            in turn extends MRText.
 * @augments MRTextInput
 */
export class MRTextArea extends MRTextInput {
    constructor() {
        super();
        // Define additional properties for handling multiline text and scrolling
        this.lineHeight = 1.2; // Default line height, can be adjusted as needed
        this.scrollOffset = 0; // The vertical scroll position
        this.maxVisibleLines = 10; // Maximum number of lines visible without scrolling
        this.createHiddenInput();
        this.object3D.name = 'textArea'
    }

    /**
     * Overrides the connected method to include setup for handling multiline text.
     */
    connected() {
        super.connected();

        this.setupEventListeners();
    }

    createHiddenInput() {
        const inputElement = document.createElement('textarea');
        inputElement.style.position = 'absolute';
        inputElement.style.opacity = '0';
        inputElement.style.pointerEvents = 'none';
        inputElement.style.height = '0';
        inputElement.style.overflow = 'hidden';
        document.body.appendChild(inputElement);
        this.input = inputElement;
    }

    setupEventListeners() {
        // Click event to focus and allow input
        this.addEventListener('click', () => {
            super.focus();
            this.triggerTextStyleUpdate(this);
        });

        // Keyboard input event to capture text
        this.input.addEventListener('input', () => {
            console.log('hitting this');
            this.updateTextDisplay();
            // this.triggerTextStyleUpdate(this);
        });

        // Handle focus and blur for visual indicators
        this.input.addEventListener('focus', () => {
            super.focus();
            this.triggerTextStyleUpdate(this);
        });

        this.input.addEventListener('blur', () => {
            super.blur();
            this.triggerTextStyleUpdate(this);
        });

        // Scroll and keydown for additional controls
        this.input.addEventListener('keydown', (event) => {
            this.handleKeydown(event);
            this.triggerTextStyleUpdate(this);
        });
    }

    updateTextDisplay() {
        const lines = this.input.value.split('\n');
        const visibleLines = lines.slice(this.scrollOffset, this.scrollOffset + this.maxVisibleLines);
        const visibleText = visibleLines.join('\n');
        
        // Update the 3D text object to display only the currently visible lines of text
        console.log('old text: ', this.textObj.text);
        console.log('new text: ', visibleText);
        this.textObj.text = visibleText;
        console.log('text updated: ', this.textObj.text);
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

        // Adjust for scrollOffset in MRTextArea
        const visibleLinesStartIndex = Math.max(0, numberOfLines - this.scrollOffset - 1);
        const lines = this.input.value.split('\n').slice(this.scrollOffset, this.scrollOffset + this.maxVisibleLines);

        // Assuming we have a method to calculate the width of a string in 3D space
        const cursorXPosition = this.calculateTextWidth(currentLineText);
        const cursorYPosition = -(visibleLinesStartIndex * this.lineHeight * this.textObj.fontSize);

        // Update the cursor's 3D position
        if (this.cursor) {
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

customElements.get('mr-textarea') || customElements.define('mr-textarea', MRTextArea);
