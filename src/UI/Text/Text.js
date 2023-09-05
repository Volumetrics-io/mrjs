import { Text } from 'troika-three-text'
import { parseAttributeString } from '../../utils/parser'
import { MRUIEntity } from '../UIEntity'

export class MRText extends MRUIEntity {
    constructor(){
        super()
        this.textObj = new Text()
        this.object3D.add(this.textObj)
        
    }

    connected(){
        let text = this.textContent.trim()
        this.textObj.text = text.length > 0 ? text : ' '
       this.style = parseAttributeString(this.getAttribute('text-style'))
    }

    mutated = (mutation) => {
        if (mutation.type != 'attributes') { return }
        if (mutation.attributeName == 'text-style') {
            this.style = parseAttributeString(this.getAttribute('text-style'))
        }
    }
}

customElements.get('mr-text') || customElements.define('mr-text', MRText)