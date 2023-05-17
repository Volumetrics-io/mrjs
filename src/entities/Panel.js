import * as THREE from 'three';
import { Entity } from '../core/entity.js'
import { UIPlane } from '../geometry/UIPlane.js';

export default class Panel extends Entity {
    static get observedAttributes() { return [ 'width', 'height', 'corner-radius', 'smoothness', 'color']; }

    constructor(){
        super()

        this.fitToParent = false
        this.width = 1
        this.height = 1
        this.radius = 0.05
        this.smoothness = 18

        this.geometry = UIPlane(1, 1, 0.2, 18)
        this.material = new THREE.MeshStandardMaterial( {
            color: 0xecf0f1,
            roughness: 0.7,
            metalness: 0.0,
            side: 2
        } );

        this.object3D = new THREE.Mesh( this.geometry, this.material );
        this.object3D.receiveShadow = true;
        this.object3D.renderOrder = 3
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'width':
                this.width = newValue
                break;
            case 'height':
                this.height = newValue
                break;
            case 'corner-radius':
                this.radius = newValue
                break;
            case 'smoothness':
                this.smoothness = newValue
                break;
            case 'color':
                this.object3D.material.color.setStyle(newValue)
                break;
            default:
                break;
        }

        this.object3D.geometry = UIPlane(this.width, this.height, this.radius, this.smoothness)
    }
}

customElements.get('mr-panel') || customElements.define('mr-panel', Panel);