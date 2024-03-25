import { getSelectionRects } from 'troika-three-text';

import * as THREE from 'three';

import { MRText } from 'mrjs/core/entities/MRText';

/**
 * @class MRTextInput
 * @classdesc The text element / TODO /
 * @augments MRText
 */
export class MRTextInput extends MRText {
    /**
     * @class
     * @description Constructor for the textArea entity component.
     */
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    get value() {
        return this.input.value;
    }

    set value(val) {
        this.input.value = val;
    }

    /**
     * @function
     * @description Callback function of MREntity - handles setting up this textarea once it is connected to run as an entity component.
     */
    connected() {
        this.createCursor();
        this.textObj.add(this.cursor);
    }

    createCursor() {
        const geometry = new THREE.PlaneGeometry(0.0015, 0.02);
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
     * @description Blurs the inputted text value and cursor information
     */
    blur = () => {
        this.input.blur();
        this.cursor.visible = false;
    };

    /**
     * @function
     * @description Focuses the inputted text value and cursor information as if it is selected. Includes showing the cursor item.
     */
    focus = () => {
        this.input.focus();
        this.input.selectionStart = this.input.value.length;
        this.cursor.visible = true;
        if (this.cursor.geometry !== undefined) {
            this.cursor.geometry.dispose();
        }
        this.cursor.geometry = new THREE.PlaneGeometry(0.002, this.textObj.fontSize);
        this.updateCursorPosition();
    };

    /**
     * @function
     * @description Updates the cursor position based on click and selection location.
     */
    updateCursorPosition = () => {
        mrjsUtils.error.emptyParentFunction();
    };
}
