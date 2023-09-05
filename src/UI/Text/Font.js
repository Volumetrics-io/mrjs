import { parseAttributeString } from '../../utils/parser'
import { MRElement } from '../../core/MRElement'

export class MRFont extends MRElement {
    constructor(){
        super()
        this.src = null
        this.size = 'fit'
        this.targets = []
        
    }

    connectedCallback(){
        this.src = this.getAttribute('src')
        let sizeAttr = this.getAttribute('size') ?? this.size
        this.size = parseFloat(sizeAttr)
        this.targets = this.getAttribute('target')?.split(',').map(val => val.trim()) ?? []
    }
}

customElements.get('mr-font') || customElements.define('mr-font', MRFont)