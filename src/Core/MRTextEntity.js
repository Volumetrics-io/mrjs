import { Text } from 'troika-three-text';

import { MRUIEntity } from 'MRJS/Core/MRUIEntity';

/**
 * @class
 * @classdesc TODO
 * @augments MRUIEntity
 */
export class MRTextEntity extends MRUIEntity {
    /**
     * @returns {number} - TODO
     */
    get height() {
        return Math.abs(this.textObj.textRenderInfo?.blockBounds[1] ?? 1);
    }

    /**
     *
     */
    constructor() {
        super();
        this.textObj = new Text();
        this.object3D.add(this.textObj);
        this.editable = false;

        this.textObj.material.receiveShadow = true;

        this.needsUpdate = true;

        document.addEventListener('panel-mutated', () => {
            this.needsUpdate = true;
        });
    }

    /**
     *
     */
    connected() {
        const text = this.textContent.trim();
        this.textObj.text = text.length > 0 ? text : ' ';
    }
}

customElements.get('mr-text') || customElements.define('mr-text', MRTextEntity);
