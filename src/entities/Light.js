import { Entity } from "../core/entity";

export default class Light extends Entity {

    constructor(){
        super()
        this.object3D = new THREE.PointLight({});

        this.object3D.shadow.camera.top = 2
        this.object3D.shadow.camera.bottom = -2
        this.object3D.shadow.camera.right = 2
        this.object3D.shadow.camera.left = -2
        this.object3D.shadow.mapSize.set(4096, 4096)

    }

    connected(){
        let color = this.getAttribute('color')
        this.object3D.color.setStyle(color)

        this.object3D.intensity = parseFloat(this.getAttribute('intensity')) ?? 1
    }

    mutated = (mutation) => {
        if (mutation.type != 'attributes') { return }
        switch (mutation.attributeName) {
            case 'color':
                let color = this.getAttribute('color')
                this.object3D.color.setStyle(color)
                break;

            case 'intensity':
                this.object3D.intensity = this.getAttribute('intensity')
                break;
        
            default:
                break;
        }
    }
}

customElements.get('mr-light') || customElements.define('mr-light', Light)