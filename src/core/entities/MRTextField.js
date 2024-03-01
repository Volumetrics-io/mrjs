import * as THREE from 'three';

import { getSelectionRects } from 'troika-three-text';

import { MRTextEntity } from 'mrjs/core/MRTextEntity';

/**
 * @class MRTextField
 * @classdesc The text element that is used to represent normal user-entry text field items one would expect in a web-browser. Limits the one-line. `mr-textfield`
 * @augments MRTextEntity
 */
export class MRTextField extends MRTextEntity {
    //  /**
    //  * @returns {number} - the height of the rendering area for the text. Counts as the css height px value representation.
    //  */
    //  get height() {
    //     return Math.abs(this.textObj.textRenderInfo?.blockBounds[1] ?? 1);
    // }

    // /**
    //  * @returns {number} - the height of the rendering area for the text. Counts as the css height px value representation.
    //  */
    // get width() {
    //     return Math.abs(this.textObj.textRenderInfo?.blockBounds[2] ?? 1);
    // }

    /**
     * @class
     * @description Constructor for the textField entity component.
     */
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.wrapper = this.shadowRoot.appendChild(document.createElement('div'));
        this.wrapper.innerHTML = '<slot></slot>';
    }

    get value() {
        return this.input.value;
    }

    set value(val) {
        this.input.value = val;
    }

    /**
     * @function
     * @description Callback function of MREntity - handles setting up this textfield once it is connected to run as an entity component.
     */
    connected() {
        this.input = document.createElement('input');
        this.input.setAttribute('type', 'text');

        const geometry = new THREE.PlaneGeometry(0.0015, 0.02);
        const material = new THREE.MeshBasicMaterial({
            color: 0x000000,
            side: THREE.DoubleSide,
        });

        this.cursor = new THREE.Mesh(geometry, material);

        this.textObj.add(this.cursor);
        this.cursor.position.z += 0.001;
        this.cursor.visible = false;

        document.addEventListener('DOMContentLoaded', (event) => {
            this.input.setAttribute('value', this.textContent.replace(/(\n)\s+/g, '$1').trim());
        });

        this.input.style.opacity = 0; // Make it invisible
        this.input.style.position = 'absolute'; // Avoid affecting layout
        this.shadowRoot.appendChild(this.input);

        this.addEventListener('click', (event) => {
            this.focusInput();
        });

        this.addEventListener('keydown', (event) => {
            this.needsStyleUpdate = true;
        });
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
    focusInput = () => {
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
        const end = this.input.selectionStart > 0 ? this.input.selectionStart : 1;
        const selectBox = getSelectionRects(this.textObj.textRenderInfo, 0, end).pop();
        if (!selectBox || isNaN(selectBox.left)) {
            this.cursor.position.setX(0);
            return;
        } else {
            if (this.input.selectionStart == 0) {
                this.cursor.position.setX(selectBox.left);
            } else {
                this.cursor.position.setX(selectBox.right);
            }
            this.cursor.position.setY(selectBox.bottom / 2); //+ this.textObj.fontSize / 2); <--keep here for now, might bring it back
        }
    };
}

customElements.get('mr-textfield') || customElements.define('mr-textfield', MRTextField);
