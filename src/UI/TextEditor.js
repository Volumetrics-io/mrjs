import { MRInput } from "./MRInput";

export class TextEditor extends MRInput {
    constructor(){
        super()
        this.src
        this.srcElement
        this.newSrc = false
    }

    connected() {
        document.addEventListener('DOMContentLoaded', (event) => {
            this.updateSrc()
        })
    }

    mutated = (mutation) => {
        if (mutation.type != 'attributes') { return }
        if (mutation.attributeName == 'src') {
            this.updateSrc()
        }
    }

    updateSrc = () => {
        this.src = this.getAttribute('src')
        this.srcElement = document.getElementById(this.src)
        this.newSrc = true
    }
}

customElements.get('mr-texteditor') || customElements.define('mr-texteditor', TextEditor)