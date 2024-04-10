import { getCaretAtPoint, getSelectionRects, Text } from 'troika-three-text';

import * as THREE from 'three';

import { MRTextEntity } from 'mrjs/core/entities/MRTextEntity';

/**
 * @class MRTextInputEntity
 * @classdesc The text element / TODO /
 * @augments MRTextEntity
 */
export class MRTextInputEntity extends MRTextEntity {
    /**
     * @class
     * @description Constructor for the textArea entity component.
     */
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    /**
     * @returns {string} value - the value of the current text input
     */
    get value() {
        return this.hiddenInput.value;
    }

    /**
     *
     */
    set value(val) {
        this.hiddenInput.value = val;
    }

    /**
     *
     */
    createHiddenInputElement() {
        mrjsUtils.error.emptyParentFunction();
    }

    /**
     *
     */
    fillInHiddenInputElementWithUserData() {
        mrjsUtils.error.emptyParentFunction();
    }

    /**
     *
     */
    updateTextDisplay() {
        mrjsUtils.error.emptyParentFunction();
    }

    /**
     * @function
     * @description (async) handles setting up this textarea once it is connected to run as an entity component.
     */
    async connected() {
        await super.connected();

        // Cursor Setup
        this._createCursorObject();
        this.object3D.add(this.cursor);

        // DOM
        this.createHiddenInputElement();
        // this.fillInHiddenInputElementWithUserData(); // TODO - <-- swap to this when trying a live example

        // Make it trigger happy
        this.setupEventListeners();

        // Updates for baseline visual
        this.triggerGeometryStyleUpdate();
        this.triggerTextStyleUpdate();

        // All items should start out as 'not selected'
        this._blur();
    }

    /**
     *
     */
    _createCursorObject() {
        this.cursorWidth = 0.002;
        this.cursorHeight = 0.015;
        const geometry = new THREE.PlaneGeometry(this.cursorWidth, this.cursorHeight);
        const material = new THREE.MeshBasicMaterial({
            color: 0x000000,
            side: THREE.DoubleSide,
        });
        this.cursor = new THREE.Mesh(geometry, material);
        this.cursor.position.z += 0.001;
        this.cursor.visible = false;

        // We store this for the geometry so we can do our geometry vs web origin calculations
        // more easily as well. We update this based on the geometry's own changes.
        //
        // Set as 0,0,0 to start, and updated when the geometry updates in case it changes in 3d space.
        this.cursorStartingPosition = new THREE.Vector3(0, 0, 0);
    }

    /**
     *
     * @param {event} event - the keydown event
     */
    handleKeydown(event) {
        mrjsUtils.error.emptyParentFunction();
    }

    /**
     *
     * @param {event} event - the keydown event
     */
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
     *
     * @param {boolean} isPureFocusEvent - Boolean to allow us to update the cursor position with this function
     * directly. Otherwise, we assume there's other things happening after focus was called as part of the event
     * and that the cursor position will be handled there instead.
     */
    _focus(isPureFocusEvent=false) {
        if (!this.hiddenInput) {
            return;
        }
        this.hiddenInput.focus();

        if (isPureFocusEvent) {
            // Only want to update cursor and selection position if
            // this is a pure focus event; otherwise, we're assuming
            // the other event will position those properly (so that
            // we dont do redundant positioning here and then there as well).
            this.hiddenInput.selectionStart = this.hiddenInput.value.length;
            this.updateCursorPosition();
        }

        this.cursor.visible = true;
    }

    /**
     *
     */
    _blur() {
        if (!this.hiddenInput) {
            return;
        }
        this.hiddenInput.blur();

        this.cursor.visible = false;
    }

    /**
     *
     */
    setupEventListeners() {
        // Since we want the text input children to be able
        // to override the parent function event triggers,
        // separating them into an actual function here
        // and calling them manually instead of doing the pure
        // 'functionname () => {} event type setup'. This manual
        // connection allows us to call super.func() for event
        // functions; otherwise, theyre not accessible nor implemented
        // in the subclasses.

        // Blur events
        this.addEventListener('blur', () => {
            this._blur();
        });

        // Pure Focus Events
        this.addEventListener('focus', () => {
            this._focus(true);
        });
        this.addEventListener('click', () => {
            this._focus(true);
        });
        
        // Focus and Handle Event
        this.addEventListener('touchstart', (event) => {
            this._focus();
            this.handleMouseClick(event);
        });

        // Keyboard events to capture text in the
        // hidden input.
        this.hiddenInput.addEventListener('input', (event) => {
            // Input captures all main text character inputs
            // BUT it does not capture arrow keys, so we handle
            // those specifically by the 'keydown' event.
            // 
            // We handle all the rest by relying on the internal
            // 'hiddenInput's update system so we dont have to 
            // manage as many things directly ourselves.

            this.updateTextDisplay();
            this.updateCursorPosition(false);
        });
        this.hiddenInput.addEventListener('keydown', (event) => {
            // Only using keydown for arrow keys, everything else is
            // handled by the input event - check the comment there
            // for more reasoning.

            if (event.key == "ArrowUp" || event.key == "ArrowDown" || event.key == "ArrowLeft" || event.key == "ArrowRight") {
                this.handleKeydown(event);
            }
        });

        // Separate trigger call just in case.
        this.addEventListener('update-cursor-position', () => {
            this.updateCursorPosition();
        });
    }

    /**
     * @param {boolean} fromCursorMove - false by default. Used to determine if we need to run
     * based off a text object update sync or we can directly grab information. This requirement
     * occurs because the sync isnt usable if no text content changed.
     * @param {boolean} fromEnterPress - false by default. Used to determine if the new character added
     * was a newline character to try to augment the cursor position to something the user
     * would recognize since troika places it in a weird spot until the next character is entered.
     * @function
     * @description Updates the cursor position based on click and selection location.
     */
    updateCursorPosition(fromCursorMove=false) {

        // TODO - QUESTION: handle '\n' --> as '/\r?\n/' for crossplatform compat
        // does the browser handle this for us?

        const updateBasedOnSelectionRects = (cursorIndex) => {
            // Setup variables for calculations.
            // XXX - handle cursor position change for visible lines for scrolloffset here in future
            let textBeforeCursor = this.hiddenInput.value.substring(0, cursorIndex);
            let textAfterCursor = this.hiddenInput.value.substring(cursorIndex);
            let allLines = this.hiddenInput.value.split('\n');
            let linesBeforeCursor = textBeforeCursor.split('\n');
            let cursorIsOnLineIndex = linesBeforeCursor.length - 1;

            let cursorXOffsetPosition = 0;
            let cursorYOffsetPosition = 0;

            let rectX = undefined;
            let rectY = undefined;
            let rect = undefined;

            const prevIsNewlineChar = '\n' === textBeforeCursor.charAt(textBeforeCursor.length - 1);
            if (prevIsNewlineChar) {
                // When on newline char, hiddenInput puts selection at end of newline char,
                // not beg of next line. Make sure cursor visual is at beg of next line
                // without moving selection point.
                //
                // Also handle special case where next line doesnt exist yet, fake it with our
                // current line's information.
                const isLastLine = cursorIsOnLineIndex == allLines.length - 1;
                if (isLastLine) {
                    const indexOfBegOfLine = textBeforeCursor.substring(0, textBeforeCursor.length - 1).lastIndexOf('\n') + 1;
                    let selectionRects = getSelectionRects(this.textObj.textRenderInfo, indexOfBegOfLine, cursorIndex);
                    rect = selectionRects[0];
                    rectX = rect.left;
                    rectY = rect.bottom - this.cursorHeight;
                } else {
                    let selectionRects = getSelectionRects(this.textObj.textRenderInfo, textBeforeCursor.length - 1, cursorIndex + 1);
                    rect = selectionRects[selectionRects.length - 1];
                    rectX = rect.left;
                    rectY = rect.bottom;
                }
                
            } else {
                // default
                let selectionRects = getSelectionRects(this.textObj.textRenderInfo, textBeforeCursor.length - 1, cursorIndex);
                let rectIndex = selectionRects.length - 1;
                rect = selectionRects[rectIndex];
                rectX = rect.right;
                rectY = rect.bottom;
            }

            // Check if cursor matches our font size before using values.
            const cursorVisibleHeight = rect.top - rect.bottom;
            if (this.cursor.geometry.height != cursorVisibleHeight) {
                this.cursor.geometry.height = cursorVisibleHeight;
                this.cursor.geometry.needsUpdate = true;
                this.cursorHeight = cursorVisibleHeight;
            }

            // Add the cursor dimension info to the position s.t. it doesnt touch the text itself. We want
            // a little bit of buffer room.
            cursorXOffsetPosition = rectX + this.cursorWidth;
            cursorYOffsetPosition = rectY + this.cursorHeight;

            // Update the cursor's 3D position
            this.cursor.position.x = this.cursorStartingPosition.x + cursorXOffsetPosition;
            this.cursor.position.y = this.cursorStartingPosition.y + cursorYOffsetPosition;
            this.cursor.visible = true;
        };

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
            updateBasedOnSelectionRects(cursorIndex);
        } else {
            this.textObj.sync(() => {
                updateBasedOnSelectionRects(cursorIndex);
            });
        }
    }
}
