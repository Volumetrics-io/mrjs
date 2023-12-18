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
     * Calculates the height of the Entity based on the viewing-client's shape. If in Mixed Reality, adjusts the value appropriately.
     * @returns {number} - the resolved height
     */
    get height() {
        const rect = this.getBoundingClientRect();

        if (global.inXR) {
            this.windowVerticalScale = this.parentElement.windowVerticalScale ?? 1 / 2;
            return (rect.height / window.innerHeight) * this.windowVerticalScale;
        }
        return (rect.height / window.innerHeight) * global.viewPortHeight;
    }

    /**
     * Calculates the width of the Entity based on the viewing-client's shape. If in Mixed Reality, adjusts the value appropriately.
     * @returns {number} - the resolved width
     */
    get width() {
        const rect = this.getBoundingClientRect();

        if (global.inXR) {
            this.windowHorizontalScale = this.parentElement.windowHorizontalScale ?? 1 / 2;
            return (rect.width / window.innerWidth) * this.windowHorizontalScale;
        }
        return (rect.width / window.innerWidth) * global.viewPortWidth;
    }

    /**
     * Constructor sets up the defaults for the background mesh, scaling, and world relevant elements.
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
        this.object3D.add(this.background);

        this.windowVerticalScale = 1;
        this.windowHorizontalScale = 1;
    }

    /**
     * Adding an entity as a sub-object of this panel (for example an mr-model, button, etc).
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
        // I'm sure there's a better solution lol.
        entity.object3D.position.z += 0.01;
    }

    /**
     * Removing an entity as a sub-object of this panel (for example an mr-model, button, etc).
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
     * Callback function of MREntity - connects the background geometry of this item to an actual UIPlane geometry.
     */
    connected() {
        this.background.geometry = mrjsUtils.Geometry.UIPlane(this.width, this.height, [0], 18);
    }

    /**
     * Updates the physics data for the current iteration. Calculates this.physics based on current stored object3D information.
     */
    updatePhysicsData() {
        this.physics.halfExtents = new THREE.Vector3();
        this.object3D.userData.bbox.setFromCenterAndSize(this.object3D.position, new THREE.Vector3(this.width, this.height, 0.002));

        this.worldScale.setFromMatrixScale(this.object3D.matrixWorld);
        this.object3D.userData.bbox.getSize(this.object3D.userData.size);
        this.object3D.userData.size.multiply(this.worldScale);

        this.physics.halfExtents.copy(this.object3D.userData.size);
        this.physics.halfExtents.divideScalar(2);
    }

    // TODO - can we move this to utils/Css.js ? ---- for border radius (which returns percentages instead of pixel values)
    // leave here for now - to be moved after michael change
    /**
     * Converts the dom string to a 3D numerical value
     * @param {string} val - the dom css information includes items of the form `XXXpx`, `XXX%`, etc
     * @returns {number} - the 3D numerical represenation of the dom css value
     */
    domToThree(val) {
        if (typeof val === 'string') {
            const valuepair = val.split(/(\d+(?:\.\d+)?)/).filter(Boolean);
            if (valuepair.length > 1) {
                switch (valuepair[1]) {
                    case 'px':
                        if (global.inXR) {
                            return (val.split('px')[0] / window.innerWidth) * this.windowHorizontalScale;
                        }
                        return (val.split('px')[0] / window.innerWidth) * global.viewPortWidth;
                    case '%':
                        if (global.inXR) {
                            return (parseFloat(val) / 100) * this.windowHorizontalScale;
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
     * Updates the style for the UIPlane's border and background based on compStyle and inputted css elements.
     */
    updateStyle() {
        // background
        this.setBorder();
        this.setBackground();
    }

    /**
     * Sets the border of the UI based on compStyle and inputted css elements.
     */
    setBorder() {
        const borderRadii = this.compStyle.borderRadius.split(' ').map((r) => this.domToThree(r));
        this.background.geometry = mrjsUtils.Geometry.UIPlane(this.width, this.height, borderRadii, 18);
    }

    /**
     * Sets the background based on compStyle and inputted css elements.
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
    }
}

customElements.get('mr-div') || customElements.define('mr-div', MRDivEntity);
