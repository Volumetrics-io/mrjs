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

    /**
     * @function
     * @description Callback function of MREntity - handles setting up this textarea once it is connected to run as an entity component.
     */
    connected() {
        this._createCursor();
        this.object3D.add(this.cursor);
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
    updateCursorPosition = () => {
        mrjsUtils.error.emptyParentFunction();
    };
}
