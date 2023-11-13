import Entity from "../core/entity";
import { loadModel } from "../utils/loadModel";

export class Model extends Entity {
    constructor() {
        super();
    }

    get height() {
        super.height; // TODO - why is this line here?
        return this.contentHeight;
    }

    connected() {
        this.src = this.getAttribute('src');
        if (! this.src) {
            return;
        }

        let extension = this.src.slice((this.src.lastIndexOf(".") - 1 >>> 0) + 2);
        if (! loadModel.loadModel(this.src, extension, this.object3D)) {
            console.log('ERR: in loading model ' + this.src);
            return;
        } 

        // TODO - recheck this lower part
        this.dispatchEvent(new CustomEvent(`new-entity`, {bubbles: true}));
    }

    onLoad = () => {

    }
}

customElements.get('mr-model') || customElements.define('mr-model', Model);
