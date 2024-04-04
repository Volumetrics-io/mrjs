import { getSelectionRects } from 'troika-three-text';

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

    updateSelectionPosition() {
        mrjsUtils.error.emptyParentFunction();
    }

    /**
     * @function
     * @description Updates the cursor position based on click and selection location.
     */
    updateCursorPosition() {
        mrjsUtils.error.emptyParentFunction();
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
        mrjsUtils.error.emptyParentFunction();
    }

    /**
     *
     */
    updateTextDisplay() {
        mrjsUtils.error.emptyParentFunction();
    }

    /**
     *
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

    _blur() {
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
        // and calling them manually. This allows us to call
        // super.func() for event functions; otherwise, theyre
        // not accessible.
        //
        // TODO - is this a reasonable approach? is javascript
        // really this clunky?
       
        // Blur events
        this.addEventListener('blur', () => {
           this._blur(); 
        });

        // Focus Events
        this.addEventListener('focus', () => {
            // pure focus event
            this._focus(true);
        });
        this.addEventListener('click', (event) => {
            console.log('CLICK EVENT HAPPENED')
            console.log(event);
            this._focus();
            this.handleMouseClick(event);
        });

        // Keyboard input event to capture text in the 
        // hidden input.
        this.addEventListener('input', () => {
            // This function calls the this.hiddenInput.addEventListener('input');
            // We just want to make sure the two are linked (textObj --> hiddenInput).
            this.hiddenInput.input();
        });
        this.hiddenInput.addEventListener('input', () => {
            this.updateTextDisplay();
        });
        this.hiddenInput.addEventListener('keydown', (event) => {
            console.log('keydown event was triggered');
            this.handleKeydown(event);
        });

        // Separate trigger call just in case.
        this.addEventListener('update-cursor-position', () => {
            this.updateCursorPosition();
        });
    }
}
