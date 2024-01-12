import * as THREE from 'three';

import { MREntity } from 'mrjs/core/MREntity';
import { MRDivEntity } from 'mrjs/core/MRDivEntity';

import { mrjsUtils } from 'mrjs';

import { ClippingGeometry } from 'mrjs/datatypes/ClippingGeometry';

/**
 * @class Panel
 * @classdesc The main panel entity DOM used for webpages and UI elements in 3D space. `mr-panel`
 * @augments MRDivEntity
 */
export class Panel extends MRDivEntity {
    /**
     * @function
     * @description Calculates the height of the Entity. If in Mixed Reality, adjusts the value appropriately.
     * @returns {number} - the resolved height
     */
    get height() {
        if (mrjsUtils.xr.isPresenting) {
            this.windowVerticalScale = this.parentElement.windowVerticalScale ?? global.XRScale;
            return this.windowVerticalScale;
        }
        return global.viewPortHeight;
    }

    /**
     * @class
     * @description Constructor for the main Panel. Sets up all the relevant object3D and window information. Includes information necessary for proper scrolling usage.
     */
    constructor() {
        super();
        this.shuttle = new THREE.Group(); // will shift based on bounding box width
        this.object3D.userData.bbox = new THREE.Box3();
        this.object3D.userData.size = new THREE.Vector3();
        this.object3D.add(this.shuttle);
        this.object3D.name = 'panel';

        this.windowVerticalScale = 1;
        this.windowHorizontalScale = 1;

        this.currentPosition = new THREE.Vector3();
        this.prevPosition = new THREE.Vector3();
        this.deltaVector = new THREE.Vector3();
        this.delta = 0;

        this.momentumTimeout;
    }

    /**
     * @function
     * @description Callback function of MREntity - handles setting up this Panel once it is connected to run as an entity component.
     *              Relevant tasks include setting up clipping and setting up for all necessary dispatchEvent connections including mutations and scrolling.
     */
    connected() {
        this.clipping = new ClippingGeometry(new THREE.BoxGeometry(this.width, this.height, 0.3));
        window.addEventListener('load', (event) => {
            this.dispatchEvent(new CustomEvent('panel-mutated', { bubbles: true }));
        });

        window.addEventListener('resize', (event) => {
            this.dispatchEvent(new CustomEvent('panel-mutated', { bubbles: true }));
        });

        this.addEventListener('anchored', (event) => {
            this.dispatchEvent(new CustomEvent('panel-mutated', { bubbles: true }));
        });

        this.parentElement.addEventListener('anchor-removed', (event) => {
            this.dispatchEvent(new CustomEvent('panel-mutated', { bubbles: true }));
        });

        document.addEventListener('enterXR', (event) => {
            this.dispatchEvent(new CustomEvent('panel-mutated', { bubbles: true }));
        });

        document.addEventListener('exitXR', (event) => {
            this.dispatchEvent(new CustomEvent('panel-mutated', { bubbles: true }));
        });

        this.addEventListener('panel-mutated', (event) => {
            this.clipping.geometry.copy(new THREE.BoxGeometry(this.width, this.height, 0.3));
        });

        document.addEventListener('wheel', (event) => {
            this.onScroll(event);
        });
    }

    /**
     * @function
     * @description Adding an entity as a sub-object of this entity.
     * @param {MREntity} entity - the entity to be added.
     */
    add(entity) {
        this.shuttle.add(entity.object3D);
    }

    /**
     * @function
     * @description Remove an entity as a sub-object of this entity.
     * @param {MREntity} entity - the entity to be removed.
     */
    remove(entity) {
        this.shuttle.remove(entity.object3D);
    }

    /**
     * @function
     * @description Handles what should happen when a touch event is called. Updates items appropriately for scrolling on the panel.
     *              Triggers to use the browser's own scrolling without a need to fake the scrolling itself.
     * @param {object} event - the touch event
     */
    onTouch = (event) => {
        if (!mrjsUtils.xr.isPresenting) {
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

        this.momentumScroll(mrjsUtils.CSS.threeToPx(this.delta), 3000);
    };

    /**
     * @function
     * @description Helper function for the onTouch event function. Handles properly adjusting scroll for some momentum for a more natural feel.
     * @param {number} distance - the distance left to scroll
     * @param {number} duration - the amount of time to do the scroll distance allowing for some movement instead of instant displacement.
     */
    momentumScroll = (distance, duration) => {
        let start = null;
        let remainingDistance = distance;
        clearTimeout(this.momentumTimeout);

        /**
         * Internal function - used to step through the remaining scroll distance iteratively.
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

    /**
     * @function
     * @description Handles what should happen when a scroll event is called. Updates items appropriately for scrolling on the panel.
     * @param {object} event - the scroll event
     */
    onScroll = (event) => {};
}

customElements.get('mr-panel') || customElements.define('mr-panel', Panel);
