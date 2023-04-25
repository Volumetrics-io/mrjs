import * as THREE from 'three';
import { Entity } from '../core/entity.js'
import { UIPlane } from '../geometry/UIPlane.js';

class Panel extends Entity {
    static get observedAttributes() { return ['width', 'height', 'depth', 'color']; }

    constructor(){
        super()

        // this.object3D.geometry = UIPlane(1, 1, 0.2, 18)
        this.geometry = UIPlane(1, 1, 0.2, 18)
        this.material = new THREE.MeshStandardMaterial( {
            color: Math.random() * 0xffffff,
            roughness: 0.7,
            metalness: 0.0,
            side: 2
        } );

        this.object3D = new THREE.Mesh( this.geometry, this.material );
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'width':
                this.object3D.scale.setX(newValue)
                break;
            case 'height':
                this.object3D.scale.setY(newValue)
                break;
            default:
                break;
        }
    }
}

customElements.get('mr-panel') || customElements.define('mr-panel', Panel);