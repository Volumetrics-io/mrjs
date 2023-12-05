import { getSelectionRects } from 'troika-three-text';
import { Text } from './Text';

/**
 *
 */
export class TextArea extends Text {
    /**
     *
     */
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    /**
     *
     */
    connected() {
        this.input = document.createElement('textarea');

        const geometry = new THREE.PlaneGeometry(0.0015, 0.02);
        const material = new THREE.MeshBasicMaterial({
            color: 0x000000,
            side: 2,
        });

        this.cursor = new THREE.Mesh(geometry, material);

        this.textObj.add(this.cursor);
        this.cursor.position.z += 0.001;
        this.cursor.visible = false;

        document.addEventListener('DOMContentLoaded', (event) => {
            this.input.textContent = this.textContent.replace(/(\n)\s+/g, '$1').trim();
        });

        this.input.style.opacity = 0; // Make it invisible
        this.input.style.position = 'absolute'; // Avoid affecting layout
        this.shadowRoot.appendChild(this.input);

        this.addEventListener('click', (event) => {
            this.focus();
        });
    }

    blur = () => {
        this.input.blur();
        this.cursor.visible = false;
    };

    focus = () => {
        this.input.focus();
        this.input.selectionStart = this.input.value.length;
        this.cursor.visible = true;
        this.cursor.geometry = new THREE.PlaneGeometry(0.002, this.textObj.fontSize);
        this.updateCursorPosition();
    };

    updateCursorPosition = () => {
        const end = this.input.selectionStart > 0 ? this.input.selectionStart : 1;
        const selectBox = getSelectionRects(this.textObj.textRenderInfo, 0, end).pop();
        if (isNaN(selectBox.right)) {
            return;
        }
        if (this.input.selectionStart == 0) {
            this.cursor.position.setX(selectBox.left);
        } else {
            this.cursor.position.setX(selectBox.right);
        }
        this.cursor.position.setY(selectBox.bottom + this.textObj.fontSize / 2);
    };
}

customElements.get('mr-textarea') || customElements.define('mr-textarea', TextArea);
