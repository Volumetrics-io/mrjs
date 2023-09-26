import Panel from "../Panel";

export class MRImage extends Panel {
    constructor(){
        super()
    }

    connected() {
        this.object3D.material.map = new THREE.TextureLoader().load(this.getAttribute('src'))
    }

    mutated(mutation) {
        super.mutated()
        if(mutation.type != 'attributes' && mutation.attributeName == 'src') {
            this.object3D.material.map = new THREE.TextureLoader().load(this.getAttribute('src'))
        }
    }

}

customElements.get('mr-image') || customElements.define('mr-image', MRImage)
