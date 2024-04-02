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
     * @description Callback function of MREntity - handles setting up this textarea once it is connected to run as an entity component.
     */
    connected() {
        // Cursor Setup
        this._createCursorObject();
        this.object3D.add(this.cursor);

        // DOM
        this.createHiddenInputElement();

        // make it trigger happy
        this.setupEventListeners();

        // Updates for baseline visual
        this.triggerGeometryStyleUpdate();
        this.triggerTextStyleUpdate();
        
        // all items should start out as 'not selected'
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
     */
    updateTextDisplay() {
        mrjsUtils.error.emptyParentFunction();
    }

    /**
     *
     */
    _focus(event) {
        if (!this.hiddenInput) {
            return;
        }
        this.hiddenInput.focus();

        if (event) {
            // An actual mouse selection event triggered this, so we need
            // to position the cursor based on the selection location in
            // the geometry of text.
            this.hiddenInput.selectionStart = this.updateSelectionPosition(event);
        } else {
            // A pure focus call triggered this, so we default the selection
            // location to be the current length of text.
            this.hiddenInput.selectionStart = this.hiddenInput.value.length;
        }
        

        this.updateCursorPosition();
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

        this.addEventListener('click', (event) => {
            this._focus(event);
        });

        this.addEventListener('blur', () => {
           this._blur(); 
        });

        this.addEventListener('focus', () => {
            this._focus();
        });

        this.addEventListener('input', () => {
            this.hiddenInput.input();
        });

        // Keyboard input event to capture text
        this.hiddenInput.addEventListener('input', () => {
            this.updateTextDisplay();
        });
        this.addEventListener('update-cursor-position', () => {
            this.updateCursorPosition();
        });
        this.addEventListener('keydown', (event) => {
            this.handleKeydown(event);
        });
    }
}
