import { MRText } from './Text'

/**
 *
 */
export class TextField extends MRText {
    /**
     *
     */
    constructor() {
        super()
        this.focused = false
    }
}

customElements.get('mr-textfield') || customElements.define('mr-textfield', TextField)
