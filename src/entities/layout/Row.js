import * as THREE from 'three';
import { Column } from './Column';
import { LayoutEntity } from './LayoutEntity';

/**
 *
 */
export class Row extends LayoutEntity {

    maxChildHeight = 0

    get height() {
        return this.maxChildHeight > 0 ? this.maxChildHeight : super.height
    }
    /**
     *
     */
    constructor() {
        super();
        this.accumulatedX = 0;

        document.addEventListener('container-mutated', (event) => {
            if (event.target != this.closest('mr-container')) {
                return;
            }
            this.update();
        });

        this.currentPosition = new THREE.Vector3();
        this.prevPosition = new THREE.Vector3();
        this.delta = new THREE.Vector3();
    }

    update = () => {
        const children = Array.from(this.children);
        this.accumulatedX = this.pxToThree(this.compStyle.paddingLeft);
        for (const index in children) {
            const child = children[index];

            this.accumulatedX += this.pxToThree(child.compStyle.marginLeft);
            child.object3D.position.setX(this.accumulatedX + child.width / 2);
            this.accumulatedX += child.width;
            this.accumulatedX += this.pxToThree(child.compStyle.marginRight);

            this.maxChildHeight = child.height > this.maxChildHeight ? child.height : this.maxChildHeight
        }
        this.accumulatedX += this.pxToThree(this.compStyle.paddingRight);

        this.shuttle.position.setX(-this.parentElement.width / 2);
    };

    /**
     *
     * @param entity
     */
    add(entity) {
        this.shuttle.add(entity.object3D);
        this.update();
    }

    /**
     *
     * @param entity
     */
    remove(entity) {
        this.shuttle.remove(entity.object3D);
        this.update();
    }
}

customElements.get('mr-row') || customElements.define('mr-row', Row);
