import * as THREE from 'three';
import Entity from '../core/entity.js';
import { Surface } from './Surface.js';

/**
 *
 */
export default class Volume extends Entity {
    /**
     *
     */
    constructor() {
        super();

        this.width = 1;
        this.depth = 1;
        this.height = this.width;
        this.object3D.receiveShadow = true;
        this.object3D.renderOrder = 3;
    }

    // FIXME: doesn't actually respond to switch in surface orientation.
    /**
     *
     */
    connected() {
        if (this.parentElement instanceof Surface) {
            this.parentElement.addEventListener('surface-placed', (event) => {
                this.width = this.parentElement.width;
                this.depth = this.parentElement.height;
                this.height = this.parentElement.height;
                const orientation = this.parentElement.getAttribute('orientation');
                if (orientation == 'horizontal') {
                    this.object3D.position.setZ(this.depth / 2);
                    this.object3D.rotation.x = Math.PI / 2;
                } else {
                    this.object3D.rotation.x = 0;
                }
                this.arrangeChildren();
            });

            this.parentElement.addEventListener('surface-removed', (event) => {
                this.object3D.position.setZ(0);
                this.object3D.rotation.x = 0;
            });
        }
    }

    /**
     *
     * @param entity
     */
    add(entity) {
        this.object3D.add(entity.object3D);
        const wall = entity.getAttribute('snap-to');
        if (wall) {
            this.snapChildToWall(wall, entity.object3D.position);
        }
    }

    /**
     *
     */
    arrangeChildren() {
        const children = [...this.children];
        children.forEach((child) => {
            const wall = child.getAttribute('snap-to');
            if (wall) {
                this.snapChildToWall(wall, child.object3D.position);
            }
        });
    }

    /**
     *
     * @param key
     * @param vector
     */
    snapChildToWall(key, vector) {
        switch (key) {
            // bottom
            case 'bottom':
                vector.setY(-this.height / 2);
                break;
            // left
            case 'left':
                vector.setX(-this.width / 2);
                break;
            // back
            case 'back':
                vector.setZ(-this.depth / 2);
                break;
            // right
            case 'right':
                vector.setX(this.width / 2);
                break;
            // front
            case 'front':
                vector.setZ(this.depth / 2);
                break;
            // top
            case 'top':
                vector.setY(this.height / 2);
                break;
            // default to floor
            default:
                vector.setY(-this.height / 2);
                break;
        }
    }
}

customElements.get('mr-volume') || customElements.define('mr-volume', Volume);
