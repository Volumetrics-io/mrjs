import * as THREE from 'three';
import { Entity } from '../core/entity.js'
import { Surface } from '../entities/Surface.js'

export default class Volume extends Entity {

    constructor(){
        super()

        this.width = 1
        this.depth = 1
        this.height = this.width
        this.object3D.receiveShadow = true;
        this.object3D.renderOrder = 3
    }

    connected(){
        if(this.parentElement instanceof Surface) {
            this.width = this.parentElement.width
            this.depth = this.parentElement.height
            this.height = this.width
            this.object3D.position.setY(this.depth / 2)
        }
    }

    add(entity){
        this.object3D.add(entity.object3D)
        let wall = entity.getAttribute('snap-to')
        if (wall) {
            this.snapChildToWall(wall, entity.object3D.position)
            console.log(entity.object3D.position);
        }
    }

    snapChildToWall(key, vector){
        switch (key) {
            // bottom
            case 'bottom':
                vector.setY(-this.height / 2)
                break; 
            // left        
            case 'left':
                vector.setX(-this.width / 2)
                break;
            // back
            case 'back':
                vector.setZ(this.depth / 2)
                break;
            // right
            case 'right':
                vector.setX(this.width / 2)
                break;
            // front
            case 'front':
                vector.setZ(-this.depth / 2)
                break;
            // top
            case 'top':
                vector.setY(this.height / 2)
                break;
            // default to floor
            default:
                vector.setY(-this.height / 2)
                break;
        }
    }
}

customElements.get('mr-volume') || customElements.define('mr-volume', Volume);