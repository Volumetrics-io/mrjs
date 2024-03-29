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

    get value() {
        return this.hiddenInput.value;
    }

    set value(val) {
        this.hiddenInput.value = val;
    }

    createHiddenInputElement() {
        mrjsUtils.error.emptyParentFunction();
    }

    fillInHiddenInputElementWithUserData() {
        mrjsUtils.error.emptyParentFunction();
    }

    /**
     * @function
     * @description Callback function of MREntity - handles setting up this textarea once it is connected to run as an entity component.
     */
    connected() {
        this._createCursor();
        this.object3D.add(this.cursor);

        this.createHiddenInputElement();

        this.setupEventListeners();

        this.triggerGeometryStyleUpdate();
        this.triggerTextStyleUpdate();
    }

    _createCursor() {
        this._cursorWidth = 0.0015;
        this._cursorHeight = 0.02;
        const geometry = new THREE.PlaneGeometry(this._cursorWidth, this._cursorHeight);
        const material = new THREE.MeshBasicMaterial({
            color: 0x000000,
            side: THREE.DoubleSide,
        });
        this.cursor = new THREE.Mesh(geometry, material);
        this.cursor.position.z += 0.001;
        this.cursor.visible = false;
    }

    /**
     * @function
     * @description Updates the cursor position based on click and selection location.
     */
    updateCursorPosition() {
        mrjsUtils.error.emptyParentFunction();
    };

    handleKeydown(event) {
        mrjsUtils.error.emptyParentFunction();
    }

    updateTextDisplay() {
        mrjsUtils.error.emptyParentFunction();
    }

    _focus() {
        if (! this.hiddenInput) {
            return;
        }
        console.log('this._focus is hit');
        this.hiddenInput.focus();
        console.log('hi2');
        this.hiddenInput.selectionStart = this.hiddenInput.value.length;
        console.log('hi3');
        this.cursor.visible = true;
        console.log('hi4');

        if (this.cursor.geometry !== undefined) {
            this.cursor.geometry.dispose();
        }
        console.log('hi5');
        this.cursor.geometry = new THREE.PlaneGeometry(0.002, this.textObj.fontSize);
        console.log('hi6');
        this.updateCursorPosition();
        console.log('hi7');
    }

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

        this.addEventListener('click', () => {
            this._focus();
        });

        this.addEventListener('blur', () => {
            this.hiddenInput.blur();
            this.cursor.visible = false;
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
            console.log('hi');
            this.handleKeydown(event);
        });
    }
}
