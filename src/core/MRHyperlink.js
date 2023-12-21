import { MRTextEntity } from './MRTextEntity';

/**
 * @class A
 * @classdesc 3D representation of an <a> tag mimicking the html version. `mr-button`
 * @augments MRDivEntity
 */
export default class MRHyperlink extends MRTextEntity {

    get height(){
        let result = super.height
        return result > 0.03 ? result : 0.03
    }

    get width(){
        let result = super.width
        return result > 0.03 ? result : 0.03
    }
    /**
     * Constructor for the Model entity, does the default.
     */
    constructor() {
        super();
        this.background.castShadow = true
    }

    connected() {
        super.connected()
        this.link = document.createElement('a');
        this.link.setAttribute('href', this.getAttribute('href'));

        this.addEventListener('touch-start', () => {
            this.classList.add('active')
        })

        this.addEventListener('click', () => {
            this.link.click()
        })
    }

}

customElements.get('mr-a') || customElements.define('mr-a', MRHyperlink);
