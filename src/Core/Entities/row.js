import * as THREE from 'three';

import { Column } from 'MRJS/Core/Entities/Column';
import { MRLayoutEntity } from 'MRJS/Core/MRLayoutEntity';
import { MREntity } from 'MRJS/Core/MREntity';

/**
 * @class
 * @classdesc TODO
 * @augments MRLayoutEntity
 */
export class Row extends MRLayoutEntity {
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
            if (!(child instanceof Column)) {
                continue;
            }

            this.accumulatedX += this.pxToThree(child.compStyle.marginLeft);
            child.object3D.position.setX(this.accumulatedX + child.width / 2);
            this.accumulatedX += child.width;
            this.accumulatedX += this.pxToThree(child.compStyle.marginRight);
        }
        this.accumulatedX += this.pxToThree(this.compStyle.paddingRight);

        this.shuttle.position.setX(-this.parentElement.width / 2);
    };

    /**
     *
     * @param {MREntity} entity - TODO
     */
    add(entity) {
        this.shuttle.add(entity.object3D);
        this.update();
    }

    /**
     *
     * @param {MREntity} entity - TODO
     */
    remove(entity) {
        this.shuttle.remove(entity.object3D);
        this.update();
    }
}

customElements.get('mr-row') || customElements.define('mr-row', Row);
