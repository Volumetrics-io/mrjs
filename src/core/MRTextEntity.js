import { Text } from 'troika-three-text';

import { MRDivEntity } from 'mrjs/core/MRDivEntity';

/**
 * @class MRTextEntity
 * @classdesc The text element that is used to represent normal HTML text one would expect in a web browser.
 *            Used specifically on `mr-div` items.
 *            Inherits from MRDivEntity.
 * @augments MRDivEntity
 */
export class MRTextEntity extends MRDivEntity {
    /**
     * @class
     * @description Constructor for the MRTextEntity object.
     *              Sets up the 3D aspect of the text, including the object, texture, and update check.
     *              Additionally, adds an event listener for the text to auto-augment whenever the panel size changes.
     */
    constructor() {
        super();
        this.textObj = new Text();
        this.object3D.add(this.textObj);
        this.object3D.name = 'textObj';
        this.editable = false;

        this.textObj.material.receiveShadow = true;

        // This event listener is added so anytime a panel changes (resize, etc), the text changes
        // accordingly
        document.addEventListener('panel-mutated', () => {
            if (!this.alwaysNeedsGeometryUpdate) {
                this.needsGeometryUpdate = true;
            }
            if (!this.alwaysNeedsStyleUpdate) {
                this.needsStyleUpdate = true;
            }
        });

        document.addEventListener('font-loaded', () => {
            if (!this.alwaysNeedsGeometryUpdate) {
                this.needsGeometryUpdate = true;
            }
            if (!this.alwaysNeedsStyleUpdate) {
                this.needsStyleUpdate = true;
            }
        });
    }

    /**
     * @function
     * @description Callback function of MREntity - sets up the textObject of the text item.
     */
    connected() {
        const text = this.textContent.trim();
        this.textObj.text = text.length > 0 ? text : ' ';
        if (!this.alwaysNeedsGeometryUpdate) {
            this.needsGeometryUpdate = true;
        }
        if (!this.alwaysNeedsStyleUpdate) {
            this.needsStyleUpdate = true;
        }
    }

    /**
     * @function
     * @description Runs the passed through function on this object and every child of this object.
     * @param {Function} callBack - the function to run recursively.
     */
    traverse(mainCallback, handleRootSpecially=false, rootCallBack = () => { /* default behavior here */ }) {
        if (handleRootSpecially) {
            rootCallBack(this);
        } else {
            mainCallback(this);
        }

        const children = Array.from(this.object3D.children);
        for (const child of children) {
            if ((!child) instanceof MREntity) {
                continue;
            }
            child.traverse(mainCallback);
        }
    }
}

customElements.get('mr-text') || customElements.define('mr-text', MRTextEntity);
