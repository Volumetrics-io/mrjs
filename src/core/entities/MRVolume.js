import { MREntity } from "../MREntity";

export class MRVolume extends MREntity {
    constructor() {
        super()

        

        }

        connected(){
            this.clipping = new MRClippingGeometry(new THREE.BoxGeometry(1, 1, 1));
        console.log('here');
        this.ignoreStencil = true

        this.addEventListener('anchored', () => {
            if (this.plane) {
                let height = this.plane.dimensions.x <= this.plane.dimensions.z ? this.plane.dimensions.x : this.plane.dimensions.z
                this.clipping.geometry.copy(new THREE.BoxGeometry(this.plane.dimensions.x, height, this.plane.dimensions.z));
            }
        })
            
        }
    }

customElements.get('mr-volume') || customElements.define('mr-volume', MRVolume);
