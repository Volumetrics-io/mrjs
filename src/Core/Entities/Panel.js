import { MREntity } from 'MRJS/Core/MREntity';
import { MRUIEntity } from 'MRJS/Core/MRUIEntity';
import { Surface } from 'MRJS/Core/Entity/Surface';

import { ClippingGeometry } from 'MRJS/Datatypes/ClippingGeometry';

/**
 *
 */
export class Panel extends MRUIEntity {
    /**
     * @returns {number} - TODO
     */
    get height() {
        const rect = this.getBoundingClientRect();

        if (global.inXR) {
            this.windowVerticalScale = this.parentElement.windowVerticalScale ?? global.XRScale;
            return this.windowVerticalScale;
        }
        return global.viewPortHeight;
    }

    /**
     *
     */
    constructor() {
        super();
        this.shuttle = new THREE.Group(); // will shift based on bounding box width
        this.object3D.userData.bbox = new THREE.Box3();
        this.object3D.userData.size = new THREE.Vector3();
        this.object3D.add(this.shuttle);

        this.windowVerticalScale = 1;
        this.windowHorizontalScale = 1;

        this.currentPosition = new THREE.Vector3();
        this.prevPosition = new THREE.Vector3();
        this.deltaVector = new THREE.Vector3();
        this.delta = 0;

        this.momentumTimeout;
    }

    /**
     *
     */
    connected() {
        this.clipping = new ClippingGeometry(new THREE.BoxGeometry(this.width, this.height, 0.3));
        window.addEventListener('load', (event) => {
            this.dispatchEvent(new CustomEvent('panel-mutated', { bubbles: true }));
        });

        window.addEventListener('resize', (event) => {
            this.dispatchEvent(new CustomEvent('panel-mutated', { bubbles: true }));
        });

        this.parentElement.addEventListener('surface-placed', (event) => {
            this.dispatchEvent(new CustomEvent('panel-mutated', { bubbles: true }));
        });

        this.parentElement.addEventListener('surface-removed', (event) => {
            this.dispatchEvent(new CustomEvent('panel-mutated', { bubbles: true }));
        });

        document.addEventListener('enterXR', (event) => {
            this.dispatchEvent(new CustomEvent('panel-mutated', { bubbles: true }));
            if (!(this.parentElement instanceof Surface)) {
                this.object3D.position.setZ(-0.4);
            }
        });

        document.addEventListener('exitXR', (event) => {
            console.log('exit');
            this.dispatchEvent(new CustomEvent('panel-mutated', { bubbles: true }));
            if (!(this.parentElement instanceof Surface)) {
                this.object3D.position.setZ(0);
            }
        });

        this.addEventListener('panel-mutated', (event) => {
            this.clipping.geometry.copy(new THREE.BoxGeometry(this.width, this.height, 0.3));
        });

        document.addEventListener('wheel', (event) => {
            this.onScroll(event);
        });
    }

    /**
     *
     * @param {MREntity} entity - TODO
     */
    add(entity) {
        this.shuttle.add(entity.object3D);
    }

    /**
     *
     * @param {MREntity} entity - TODO
     */
    remove(entity) {
        this.shuttle.remove(entity.object3D);
    }

    onTouch = (event) => {
        if (!global.inXR) {
            return;
        }
        if (event.type == 'touch-end') {
            this.prevPosition.set(0, 0, 0);
            return;
        }
        event.stopPropagation();
        this.currentPosition.copy(event.detail.worldPosition);
        if (this.prevPosition.y != 0) {
            this.deltaVector.subVectors(this.currentPosition, this.prevPosition);
        }
        this.prevPosition.copy(this.currentPosition);

        this.delta = this.deltaVector.y * 7;

        if (this.delta == 0) {
            return;
        }

        this.momentumScroll(MRJS.threeToPx(this.delta), 3000);
    };

    momentumScroll = (distance, duration) => {
        let start = null;
        let remainingDistance = distance;
        clearTimeout(this.momentumTimeout);

        /**
         *
         */
        function step() {
            if (start === null) {
                start = new Date().getTime();
            }

            const currentTime = new Date().getTime();
            const timeElapsed = currentTime - start;
            const progress = Math.min(timeElapsed / duration, 1);
            const easing = 1 - Math.pow(1 - progress, 3); // cubic easing out

            const scrollDistance = remainingDistance * easing;
            window.scrollBy(0, scrollDistance);

            remainingDistance -= scrollDistance;

            if (timeElapsed < duration) {
                this.momentumTimeout = setTimeout(step, 10); // 10ms for the next step
            }
        }

        this.momentumTimeout = setTimeout(step, 10); // 10ms for the next step
    };

    onScroll = (event) => {};
}

customElements.get('mr-panel') || customElements.define('mr-panel', Panel);
