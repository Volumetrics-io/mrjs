import { Text } from 'troika-three-text';
import { parseAttributeString } from '../../utils/parser';
import { MRUIEntity } from '../UIEntity';

/**
 *
 */
export class MRText extends MRUIEntity {
    /**
     *
     */
    get height() {
        super.height;
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

        this.needsUpdate = true;

        document.addEventListener('container-mutated', () => {
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

customElements.get('mr-text') || customElements.define('mr-text', MRText);
