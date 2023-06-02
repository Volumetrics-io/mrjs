import * as THREE from 'three';
import { Entity } from '../core/entity.js'

export default class Volume extends Entity {

    constructor(){
        super()

        this.object3D.receiveShadow = true;
        this.object3D.renderOrder = 3
    }

    connected(){
        if(this.parentElement instanceof Surface) {
            this.width = this.parentElement.width
            this.height = this.parentElement.height
            this.depth = this.width
        }
    }
}

customElements.get('mr-volume') || customElements.define('mr-volume', Volume);