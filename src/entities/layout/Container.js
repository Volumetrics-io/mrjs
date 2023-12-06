import * as THREE from 'three';
import { ClippingGeometry } from '../../datatypes/ClippingGeometry';
import { LayoutEntity } from './LayoutEntity';

/**
 *
 */
export class Container extends LayoutEntity {
    /**
     *
     */
    constructor() {
        super();
        this.currentPosition = new THREE.Vector3();
        this.prevPosition = new THREE.Vector3();
        this.delta = new THREE.Vector3();
        this.scrollMax = 1000;
    }

    /**
     *
     */
    connected() {
        this.clipping = new ClippingGeometry(new THREE.BoxGeometry(this.width, this.height, 0.3));
        window.addEventListener('load', (event) => {
            this.dispatchEvent(new CustomEvent('container-mutated', { bubbles: true }));

            // TODO: fix this, it's a hack until we figure out where to fire off a final "app loaded" event
            setTimeout(() => {
                this.scrollMax = MRJS.computeBoundingSphere(this.shuttle).radius * 2 - this.height;
            }, 1000);
        });

        window.addEventListener('resize', (event) => {
            this.dispatchEvent(new CustomEvent('container-mutated', { bubbles: true }));
            this.scrollMax = MRJS.computeBoundingSphere(this.shuttle).radius * 2 - this.height;
        });

        this.parentElement.addEventListener('surface-placed', (event) => {
            this.scrollMax = MRJS.computeBoundingSphere(this.shuttle).radius * 2 - this.height;
            this.dispatchEvent(new CustomEvent('container-mutated', { bubbles: true }));
        });

        this.parentElement.addEventListener('surface-removed', (event) => {
            this.dispatchEvent(new CustomEvent('container-mutated', { bubbles: true }));
            this.scrollMax = MRJS.computeBoundingSphere(this.shuttle).radius * 2 - this.height;
        });

        this.addEventListener('container-mutated', (event) => {
            this.clipping.geometry.copy(new THREE.BoxGeometry(this.width, this.height, 0.3));
        });

        document.addEventListener('wheel', (event) => {
            this.onScroll(event);
        });
    }

    /**
     *
     * @param entity
     */
    add(entity) {
        this.shuttle.add(entity.object3D);
    }

    /**
     *
     * @param entity
     */
    remove(entity) {
        this.shuttle.remove(entity.object3D);
    }

    onTouch = (event) => {
        if (event.target != this) {
            return;
        }
        if (event.type == 'touch-end') {
            this.prevPosition.set(0, 0, 0);
            return;
        }
        event.stopPropagation();
        const scrollMin = 0;
        this.currentPosition.copy(event.detail.worldPosition);
        this.object3D.worldToLocal(this.currentPosition);
        if (this.prevPosition.y != 0) {
            this.delta.subVectors(this.currentPosition, this.prevPosition);
        }
        this.prevPosition.copy(this.currentPosition);

        const delta = this.shuttle.position.y + this.delta.y * 1.33;

        if (delta > scrollMin && delta < this.scrollMax) {
            this.shuttle.position.y = delta;
        }
    };

    onScroll = (event) => {
        const scrollMin = 0;
        let delta = this.shuttle.position.y + event.deltaY * 0.00001;
        if (delta > scrollMin && delta <= this.scrollMax) {
            this.shuttle.position.y = delta;
        }
    };
}

customElements.get('mr-container') || customElements.define('mr-container', Container);
