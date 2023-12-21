import { MRTextEntity } from './MRTextEntity';

/**
 * @class A
 * @classdesc 3D representation of a hyperlink. `mr-a`
 * @augments MRDivEntity
 */
export default class MRHyperlink extends MRTextEntity {
    /**
     * Constructor for the Model entity, does the default.
     */
    constructor() {
        super();
        this.background.castShadow = true;
    }

    /**
     *
     */
    connected() {
        super.connected();
        this.link = document.createElement('a');
        this.link.setAttribute('href', this.getAttribute('href'));

        this.addEventListener('touch-start', () => {
            this.classList.add('active');
        });

        this.addEventListener('click', () => {
            this.link.click();
        });
    }
}

customElements.get('mr-a') || customElements.define('mr-a', MRHyperlink);
