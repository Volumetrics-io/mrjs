import { getCaretAtPoint, getSelectionRects, Text } from 'troika-three-text';

import * as THREE from 'three';

import { MRTextEntity } from 'mrjs/core/entities/MRTextEntity';

/**
 * @class MRTextInputEntity
 * @classdesc Base text inpu entity represented in 3D space. `mr-text-input`
 * @augments MRTextEntity
 */
export class MRTextInputEntity extends MRTextEntity {
    /**
     * @class
     * @description Constructor for the MRTextInputEntity entity component.
     */
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    /**
     * @function
     * @description Gets the value of the text for the current hiddenInput DOM object
     * @returns {string} value - the text value of the current hiddenInput DOM object
     */
    get value() {
        return this.hiddenInput.value;
    }

    /**
     * @function
     * @description Sets the value of the text for the current hiddenInput DOM object
     */
    set value(val) {
        this.hiddenInput.value = val;
    }

    /**
     * @function
     * @description Function to be overwritten by children. Called by connected to make sure
     * the hiddenInput dom element is created as expected.
     */
    createHiddenInputElement() {
        mrjsUtils.error.emptyParentFunction();
    }

    /**
     * @function
     * @description Function to be overwritten by children. Called by connected after
     * createHiddenInputElement to fill it in with the user's given
     * attribute information.
     */
    fillInHiddenInputElementWithUserData() {
        mrjsUtils.error.emptyParentFunction();
    }

    /**
     * @function
     * @description Function to be overwritten by children. Used on event trigger to
     * update the textObj visual based on the hiddenInput DOM element.
     */
    updateTextDisplay() {
        mrjsUtils.error.emptyParentFunction();
    }

    /**
     * @function
     * @description (async) Handles setting up this textarea once it is connected to run as an entity component.
     */
    async connected() {
        await super.connected();

        // Cursor Setup
        this._createCursorObject();
        this.object3D.add(this.cursor);

        // DOM
        this.createHiddenInputElement();
        // this.fillInHiddenInputElementWithUserData(); // TODO - need good list of defaults

        // Make it trigger happy
        this.setupEventListeners();

        // Updates for baseline visual
        this.triggerGeometryStyleUpdate();
        this.triggerTextStyleUpdate();

        // All items should start out as 'not selected'
        // unless noted otherwise.
        if (!this.hiddenInput.getAttribute('autofocus') ?? false) {
            this._blur();
        }

        // Handle any placeholder setup s.t. it can be overwritten easily.
        if (this.hiddenInput.getAttribute('placeholder') ?? false) {
            this.textObj.text = this.hiddenInput.getAttribute('placeholder');
        }

        if (this.hasTextSubsetForVerticalScrolling) {
            this.verticalTextObjStartLineIndex = 0;
            this.verticalTextObjEndLineIndex = 0;
            // this.cursorIsOnScrollLineIndex = 0;
        }
    }

    /**
     * @function
     * @description Internal function used to setup the cursor object and associated variables
     * needed during runtime.
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
     * @function
     * @description Function to be overwritten by children. Called by the keydown event trigger.
     * @param {event} event - the keydown event
     */
    handleKeydown(event) {
        mrjsUtils.error.emptyParentFunction();
    }

    /**
     * @function
     * @description Called by the mouse click event trigger. Handles determining the
     * caret position based on the 3D textObj to hiddenInput DOM position conversion.
     * @param {event} event - the mouseclick event
     */
    handleMouseClick(event) {
        console.log(event);
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
     * @function
     * @description Called by the focus event trigger and in other 'focus' situations. We use the
     * private version of this function signature to not hit the intersection of the actual 'focus()'
     * event naming that we have connected. See 'setupEventListeners()' description for more info.
     * @param {boolean} isPureFocusEvent - Boolean to allow us to update the cursor position with this function
     * directly. Otherwise, we assume there's other things happening after focus was called as part of the event
     * and that the cursor position will be handled there instead.
     */
    _focus(isPureFocusEvent = false) {
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
     * @function
     * @description Called by the blur event trigger and in other 'blur' situations. We use the
     * private version of this function signature to not hit the intersection of the actual 'blur()'
     * event naming that we have connected. See 'setupEventListeners()' description for more info.
     */
    _blur() {
        if (!this.hiddenInput) {
            return;
        }
        this.hiddenInput.blur();

        this.cursor.visible = false;
    }

    // todo - better name
    get hasTextSubsetForVerticalScrolling() {
        mrjsUtils.error.emptyParentFunction();
    }

    // todo - better name
    get hasTextSubsetForHorizontalScrolling() {
        // todo - handle wrapping etc lol
        mrjsUtils.error.emptyParentFunction();
    }

    /**
     * @function
     * @description Getter for a commonly needed attribute: 'disabled' for whether this input is still being updated.
     * @returns {boolean} true if disabled, false otherwise
     */
    get inputIsDisabled() {
        return this.hiddenInput.getAttribute('disabled') ?? false;
    }

    /**
     * @function
     * @description Getter for a commonly needed attribute: 'readonly' for whether this input's text can still be changed.
     * @returns {boolean} true if readonly, false otherwise
     */
    get inputIsReadOnly() {
        return this.hiddenInput.getAttribute('readonly') ?? false;
    }

    /**
     * @function
     * @description Connecting the event listeners to the actual functions that handle them. Includes
     * additional calls where necessary.
     *
     * Since we want the text input children to be able
     * to override the parent function event triggers,
     * separating them into an actual function here
     * and calling them manually instead of doing the pure
     * 'functionname () => {} event type setup'. This manual
     * connection allows us to call super.func() for event
     * functions; otherwise, theyre not accessible nor implemented
     * in the subclasses.
     */
    setupEventListeners() {
        // Blur events
        this.addEventListener('blur', () => {
            this._blur();
        });

        // Pure Focus Events
        this.addEventListener('focus', () => {
            if (this.inputIsDisabled || this.inputIsReadOnly) {
                return;
            }
            this._focus(true);
        });
        this.addEventListener('click', () => {
            if (this.inputIsDisabled || this.inputIsReadOnly) {
                return;
            }
            this._focus(true);
        });

        // Focus and Handle Event
        this.addEventListener('touchstart', (event) => {
            if (this.inputIsDisabled || this.inputIsReadOnly) {
                return;
            }
            this._focus();
            this.handleMouseClick(event);
        });

        // Keyboard events to capture text in the
        // hidden input.
        this.hiddenInput.addEventListener('input', (event) => {
            if (this.inputIsDisabled || this.inputIsReadOnly) {
                return;
            }

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
            if (this.inputIsDisabled || this.inputIsReadOnly) {
                return;
            }

            // Only using keydown for arrow keys, everything else is
            // handled by the input event - check the comment there
            // for more reasoning.

            if (event.key == 'ArrowUp' || event.key == 'ArrowDown' || event.key == 'ArrowLeft' || event.key == 'ArrowRight') {
                this.handleKeydown(event);
            }
        });

        // Separate trigger call just in case.
        this.addEventListener('update-cursor-position', () => {
            if (this.inputIsDisabled || this.inputIsReadOnly) {
                return;
            }

            this.updateCursorPosition();
        });
    }

    /**
     * @function
     * @description Updates the cursor position based on click and selection location.
     * @param {boolean} fromCursorMove - false by default. Used to determine if we need to run
     * based off a text object update sync or we can directly grab information. This requirement
     * occurs because the sync isnt usable if no text content changed.
     * 
     * Note: this function does not change anything about the this.hiddenInput.selectionStart nor
     * this.hiddenInput.selectionEnd. Those values should be changed prior to this function being
     * called.
     */
    updateCursorPosition(fromCursorMove = false) {
        // TODO - QUESTION: handle '\n' --> as '/\r?\n/' for crossplatform compat
        // does the browser handle this for us?

        const updateBasedOnSelectionRects = (cursorIndex) => {
            // XXX - handle cursor position change for visible lines for scrolloffset here in future

            // Setup variables for calculations.
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

            // create specific variables for textObj lines subset given vertical scrolling
            let cursorIsOnTextObjLineIndex = cursorIsOnLineIndex - this.verticalTextObjStartLineIndex;

            const prevIsNewlineChar = '\n' === textBeforeCursor.charAt(textBeforeCursor.length - 1);
            if (prevIsNewlineChar) {
                // When on newline char, hiddenInput puts selection at end of newline char,
                // not beg of next line. Make sure cursor visual is at beg of next line
                // without moving selection point.
                //
                // Also handle special case where next line doesnt exist yet, fake it with our
                // current line's information.
                
                // note: doing it this way to not have to sum up all the lines of text before this one.
                const isLastLine = cursorIsOnLineIndex == allLines.length - 1;
                const indexOfBegOfLine = textBeforeCursor.substring(0, textBeforeCursor.length - 1).lastIndexOf('\n') + 1;
                let usingIndex = isLastLine ? indexOfBegOfLine : cursorIndex;
                let selectionRects = getSelectionRects(this.textObj.textRenderInfo, usingIndex, usingIndex + 1);
                // rect information for use in cursor positioning
                rect = selectionRects[0];
                rectX = rect.left;
                rectY = rect.bottom - (isLastLine ? this.cursorHeight : 0);
            } else {
                // default
                let selectionRects = getSelectionRects(this.textObj.textRenderInfo, cursorIndex - 1, cursorIndex);
                // rect information for use in cursor positioning
                rect = selectionRects[0];
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
