import { MRInput } from "./MRInput";

export class TextEditor extends MRInput {
    constructor(){
        super()
    }
}

customElements.get('mr-texteditor') || customElements.define('mr-texteditor', TextEditor)