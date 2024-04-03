import { MRTextEntity } from 'mrjs/core/entities/MRTextEntity';

/**
 * @class MRHyperlinkEntity
 * @classdesc 3D representation of a hyperlink. `mr-a`
 * @augments MRTextEntity
 */
export default class MRHyperlinkEntity extends MRTextEntity {
    /**
     * Constructor for the Model entity, does the default.
     */
    constructor() {
        super();
        this.background.castShadow = true;
        this.object3D.name = 'hyperlink';
    }

    /**
     * @function
     * @description Creates the link object if it's not already created and handles the href and
     * target attributes.
     */
    _createLink() {
        if (!this.link) {
            this.link = document.createElement('a');
            this.link.setAttribute('href', this.getAttribute('href') ?? undefined);
            this.link.setAttribute('target', this.getAttribute('target') ?? undefined);
        }
    }

    /**
     * @function
     * @description Grabs the href of the link object
     * @returns {string} the href value
     */
    get href() {
        this._createLink();
        return this.link.getAttribute('href');
    }

    /**
     * @function
     * @description Sets the href of the link object
     * @param {string} src_str - the new href value
     */
    set href(src_str) {
        this._createLink();
        this.link.setAttribute('href', src_str);
    }

    /**
     * @function
     * @description Callback function of MREntity - makes sure the link object is created and sets up event
     * listeners for touchstart and click.
     */
    async connected() {
        super.connected();
        this._createLink();

        this.addEventListener('touchstart', () => {
            this.classList.add('active');
        });

        this.addEventListener('click', () => {
            this.link.click();
        });
    }
}

customElements.get('mr-a') || customElements.define('mr-a', MRHyperlinkEntity);
