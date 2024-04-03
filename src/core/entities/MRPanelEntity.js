import * as THREE from 'three';

import { MREntity } from 'mrjs/core/MREntity';
import { MRDivEntity } from 'mrjs/core/entities/MRDivEntity';

import { MRClippingGeometry } from 'mrjs/dataTypes/MRClippingGeometry';

import { mrjsUtils } from 'mrjs';

/**
 * @class MRPanelEntity
 * @classdesc The main panel entity DOM used for webpages and UI elements in 3D space. `mr-panel`
 * @augments MRDivEntity
 */
export class MRPanelEntity extends MRDivEntity {
    /**
     * @class
     * @description Constructor for the main Panel. Sets up all the relevant object3D and window information. Includes information necessary for proper scrolling usage.
     */
    constructor() {
        super();
        this.panel = new THREE.Group(); // will shift based on bounding box width
        this.object3D.userData.bbox = new THREE.Box3();
        this.object3D.userData.size = new THREE.Vector3();
        this.object3D.add(this.panel);
        this.panel.add(this.background);
        this.object3D.name = 'panel';
        this.ignoreStencil = true;

        this.currentPosition = new THREE.Vector3();
        this.prevPosition = new THREE.Vector3();
        this.deltaVector = new THREE.Vector3();
        this.delta = 0;

        this.momentumTimeout;
    }

    /**
     * @function
     * @description Gets the height of the current panel in 2D or 3D space (depending on the xr user state)
     * @returns {number} height - the calcualted height value
     */
    get height() {
        let result = this.getBoundingClientRect().height;

        if (mrjsUtils.xr.isPresenting) {
            result = (result / window.screen.height) * mrjsUtils.display.VIRTUAL_DISPLAY_RESOLUTION;
        }
        return (result / global.appHeight) * global.viewPortHeight;
    }

    /**
     * @function
     * @description Callback function of MREntity - handles setting up this Panel once it is connected to run as an entity component.
     *              Relevant tasks include setting up clipping and setting up for all necessary dispatchEvent connections including mutations and scrolling.
     */
    async connected() {
        await super.connected()
        this.clipping = new MRClippingGeometry(new THREE.BoxGeometry(this.width, this.height, 1));
        window.addEventListener('load', (event) => {
            this.dispatchEvent(new CustomEvent('panelupdate', { bubbles: true }));
        });

        window.addEventListener('resize', (event) => {
            this.dispatchEvent(new CustomEvent('panelupdate', { bubbles: true }));
        });

        this.addEventListener('anchored', (event) => {
            this.dispatchEvent(new CustomEvent('panelupdate', { bubbles: true }));
        });

        this.parentElement.addEventListener('anchorremoved', (event) => {
            this.dispatchEvent(new CustomEvent('panelupdate', { bubbles: true }));
        });

        document.addEventListener('enterxr', (event) => {
            this.dispatchEvent(new CustomEvent('panelupdate', { bubbles: true }));
        });

        document.addEventListener('exitxr', (event) => {
            this.dispatchEvent(new CustomEvent('panelupdate', { bubbles: true }));
        });

        this.addEventListener('panelupdate', (event) => {
            this.clipping.geometry.copy(new THREE.BoxGeometry(this.width, this.height, 1));
        });

        this.addEventListener('mouseover', () => {
            this.focus = true;
        });

        this.addEventListener('mouseleave', () => {
            this.focus = false;
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
        this.panel.add(entity.object3D);
    }

    /**
     * @function
     * @description Remove an entity as a sub-object of this entity.
     * @param {MREntity} entity - the entity to be removed.
     */
    remove(entity) {
        this.panel.remove(entity.object3D);
    }

    /**
     * @function
     * @description Handles what should happen when a touch event is called. Updates items appropriately for scrolling on the panel.
     *              Triggers to use the browser's own scrolling without a need to fake the scrolling itself.
     * @param {object} event - the touch event
     */
    onTouch = (event) => {
        if (event.type == 'touchend') {
            this.prevPosition.set(0, 0, 0);
            return;
        }
        this.currentPosition.copy(event.detail.worldPosition);
        if (this.prevPosition.y != 0) {
            this.deltaVector.subVectors(this.currentPosition, this.prevPosition);
        }
        this.prevPosition.copy(this.currentPosition);

        this.delta = this.deltaVector.y;

        if (this.delta == 0) {
            return;
        }

        let app = this.closest('mr-app');

        if (app.compStyle.overflow == 'scroll') {
            app.scrollTop += mrjsUtils.css.threeToPx(this.delta);
        } else {
            this.scrollBy(0, mrjsUtils.css.threeToPx(this.delta));
        }
    };

    /**
     * @function
     * @description Handles what should happen when a scroll event is called. Updates items appropriately for scrolling on the panel.
     * @param {object} event - the scroll event
     */
    onScroll = (event) => {
        if (!this.focus) {
            return;
        }
        this.scrollTop += event.deltaY;
    };
}

customElements.get('mr-panel') || customElements.define('mr-panel', MRPanelEntity);
