import { MRInput } from "./MRInput";

export class TextField extends MRInput {
    constructor(){
        super()
    }
}

customElements.get('mr-textfield') || customElements.define('mr-textfield', TextField)