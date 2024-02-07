import * as THREE from 'three';

import { MREntity } from 'mrjs/core/MREntity';

import { mrjsUtils } from 'mrjs';

/**
 * @class MRDivEntity
 * @classdesc The MREntity that is used to solely describe UI Elements. Defaults as the html `mr-div` representation. `mr-div`
 * @augments MREntity
 */
export class MRDivEntity extends MREntity {
    /**
     * @class
     * @description Constructor sets up the defaults for the background mesh, scaling, and world relevant elements.
     */
    constructor() {
        super();
        this.worldScale = new THREE.Vector3();
        this.halfExtents = new THREE.Vector3();
        this.physics.type = 'ui';

        const geometry = mrjsUtils.Geometry.UIPlane(1, 1, [0], 18);
        const material = new THREE.MeshStandardMaterial({
            color: 0xfff,
            roughness: 0.7,
            metalness: 0.0,
            side: 2,
        });

        this.background = new THREE.Mesh(geometry, material);
        this.background.receiveShadow = true;
        this.background.renderOrder = 3;
        this.background.visible = false;
        this.background.name = 'background';
        this.object3D.add(this.background);
        this.object3D.name = 'mrDivEntity';

        // allow stenciling when needed by default for UI elements, but also allows
        // overriding when needed.
        this.ignoreStencil = false;
    }

    /**
     * @function
     * @description Calculates the height of the Entity based on the viewing-client's shape. If in Mixed Reality, adjusts the value appropriately.
     * @returns {number} - the resolved height
     */
    get height() {
        const rect = this.getBoundingClientRect();

        if (mrjsUtils.xr.isPresenting) {
            return (rect.height / mrjsUtils.Display.VIRTUAL_DISPLAY_RESOLUTION) * mrjsUtils.app.scale;
        }
        return (rect.height / global.appHeight) * global.viewPortHeight;
    }

    /**
     * @function
     * @description Calculates the width of the Entity based on the viewing-client's shape. If in Mixed Reality, adjusts the value appropriately.
     * @returns {number} - the resolved width
     */
    get width() {
        const rect = this.getBoundingClientRect();

        if (mrjsUtils.xr.isPresenting) {
            return (rect.width / mrjsUtils.Display.VIRTUAL_DISPLAY_RESOLUTION) * mrjsUtils.app.scale;
        }
        return (rect.width / global.appWidth) * global.viewPortWidth;
    }

    /**
     * @function
     * @description Adding an entity as a sub-object of this panel (for example an mr-model, button, etc).
     * @param {MREntity} entity - the entity to be added.
     */
    add(entity) {
        // `this` must have `mr-panel` as its closest parent entity for threejs to handle positioning appropriately.
        let panel = this.closest('mr-panel');
        if (panel && entity instanceof MRDivEntity) {
            panel.add(entity);
        } else {
            this.object3D.add(entity.object3D);
        }

        // slight bump needed to avoid overlapping, glitchy visuals.
        entity.object3D.position.z = this.object3D.position.z + 0.001;
    }

    /**
     * @function
     * @description Removing an entity as a sub-object of this panel (for example an mr-model, button, etc).
     * @param {MREntity} entity - the entity to be removed added.
     */
    remove(entity) {
        // `this` must have `mr-panel` as its closest parent entity for threejs to handle positioning appropriately.
        let panel = this.closest('mr-panel');
        if (panel && entity instanceof MRDivEntity) {
            panel.remove(entity);
        } else {
            this.object3D.remove(entity.object3D);
        }
    }

    /**
     * @function
     * @description Callback function of MREntity - connects the background geometry of this item to an actual UIPlane geometry.
     */
    connected() {
        this.background.geometry = mrjsUtils.Geometry.UIPlane(this.width, this.height, [0], 18);
    }

    // TODO - can we move this to utils/Css.js ? ---- for border radius (which returns percentages instead of pixel values)
    // leave here for now - to be moved after michael change
    /**
     * @function
     * @description Converts the dom string to a 3D numerical value
     * @param {string} val - the dom css information includes items of the form `XXXpx`, `XXX%`, etc
     * @returns {number} - the 3D numerical represenation of the dom css value
     */
    domToThree(val) {
        if (typeof val === 'string') {
            const valuepair = val.split(/(\d+(?:\.\d+)?)/).filter(Boolean);
            if (valuepair.length > 1) {
                switch (valuepair[1]) {
                    case 'px':
                        if (mrjsUtils.xr.isPresenting) {
                            return (val.split('px')[0] / global.appWidth) * mrjsUtils.app.scale;
                        }
                        return (val.split('px')[0] / global.appWidth) * global.viewPortWidth;
                    case '%':
                        if (mrjsUtils.xr.isPresenting) {
                            return (parseFloat(val) / 100) * mrjsUtils.app.scale;
                        }
                        return (parseFloat(val) / 100) * global.viewPortWidth;
                    default:
                        return val;
                }
            }
        }
        return val;
    }

    /**
     *
     */
    updateStyle() {
        super.updateStyle();

        // all div entities needs these steps
        this.setBorder();
        this.setBackground();
    }

    /**
     * @function
     * @description Calculates the border radius of the img based on the img tag in the shadow root
     * @returns {number} - the resolved height
     */
    get borderRadii() {
        return this.compStyle.borderRadius.split(' ').map((r) => this.domToThree(r));
        const borderRadii = this.compStyle.borderRadius.split(' ').map((r) => this.domToThree(r));
    }

    /**
     * @function
     * @description Sets the border of the UI based on compStyle and inputted css elements.
     */
    setBorder() {
        this.background.geometry = mrjsUtils.Geometry.UIPlane(this.width, this.height, this.borderRadii, 18);
    }

    /**
     * @function
     * @description Sets the background based on compStyle and inputted css elements.
     */
    setBackground() {
        const color = this.compStyle.backgroundColor;
        if (color.includes('rgba')) {
            const rgba = color
                .substring(5, color.length - 1)
                .split(',')
                .map((part) => parseFloat(part.trim()));
            this.background.material.color.setStyle(`rgb(${rgba[0]}, ${rgba[1]}, ${rgba[2]})`);
            if (rgba[3] == 0) {
                this.background.visible = false;
            } else {
                this.background.material.transparent = true;
                this.background.material.opacity = rgba[3];
                this.background.visible = true;
            }
        } else {
            this.background.material.color.setStyle(color);
            this.background.visible = true;
        }

        if (this.compStyle.opacity < 1) {
            this.background.material.opacity = this.compStyle.opacity;
        }
        this.background.material.needsUpdate = true;
    }
}

customElements.get('mr-div') || customElements.define('mr-div', MRDivEntity);
