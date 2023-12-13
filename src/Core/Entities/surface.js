import * as THREE from 'three';

import { MREntity } from 'MRJS/Core/MREntity';
import { UIPlane } from 'MRJS/Utils/Geometry';

/**
 * @class Surface
 * @classdesc ...TODO... how is this different than Panel in terms of use? i understand panel has more too it, but is this just a sprite? `mr-surface`
 * @augments MREntity
 */
export class Surface extends MREntity {

    /**
     * @returns {number} - the height of the current viewport
     */
    get height() {
        return global.viewPortHeight;
    }

    /**
     * @returns {number} - the width of the current viewport
     */
    get width() {
        return global.viewPortWidth;
    }

    /**
     * Constructor 
     */
    constructor() {
        super();

        this.anchored = false;
        this.anchorPosition = new THREE.Vector3();
        this.anchorQuaternion = new THREE.Quaternion();

        this.rotationPlane = new THREE.Group();
        this.translation = new THREE.Group();
        this.group = new THREE.Group();
        this.orientation = 'any';

        this.object3D.add(this.rotationPlane);
        this.rotationPlane.add(this.translation);

        this.rotationPlane.receiveShadow = true;
        this.rotationPlane.renderOrder = 3;

        this.translation.receiveShadow = true;
        this.translation.renderOrder = 3;
    }

    /**
     * Callback function of MREntity - handles setting up this Surface once it is connected to run as an entity component.
     */
    connected() {
        this.windowVerticalScale = this.height;
        this.windowHorizontalScale = this.width;

        this.placed = false;
        this.floating = true;

        this.material = new THREE.MeshStandardMaterial({
            color: 0x3498db,
            roughness: 0.0,
            metalness: 0.7,
            transparent: true,
            opacity: 0.7,
            side: 2,
        });

        this.geometry = UIPlane(this.windowHorizontalScale * global.XRScale, this.windowVerticalScale * global.XRScale, [0.01], 18);

        this.viz = new THREE.Mesh(this.geometry, this.material);

        this.translation.add(this.group);
        if (this.viz.parent == null) {
            this.translation.add(this.viz);
        }
        this.group.visible = true;
        this.viz.visible = false;
    }

    /**
     * Adding an entity as a sub-object of this entity.
     * @param {MREntity} entity - the entity to be added.
     */
    add(entity) {
        this.group.add(entity.object3D);
    }

    /**
     * Removing an entity as a sub-object of this entity.
     * @param {MREntity} entity - the entity to be removed.
     */
    remove(entity) {
        this.group.remove(entity.object3D);
    }

    /**
     * Callback function of MREntity - updates based on the changed attribute: orientation
     * @param {object} mutation - the update/change/mutation to be handled.
     */
    mutated(mutation) {
        if (mutation.type != 'attributes') {
            switch (mutation.attributeName) {
                case 'orientation':
                    this.getAttribute('orientation');
                default:
                    break;
            }
        }
    }

    /**
     * Puts the surface into the scene and dispatches an event to confirm placement.
     */
    place() {
        this.viz.removeFromParent();
        this.group.visible = true;
        this.placed = true;

        this.dispatchEvent(new CustomEvent('surface-placed', { bubbles: true }));
    }

    /**
     * Replaces /...? TODO
     */
    replace() {
        this.object3D.position.copy(this.anchorPosition);
        this.object3D.quaternion.copy(this.anchorQuaternion);

        // the z-axis and y-axis are flipped for webXR anchors
        // so when a surface is anchored to a wall/table we
        // need to apply a rotation so the plane is oriented correctly
        if (!this.floating) {
            this.rotationPlane.rotation.x = (3 * Math.PI) / 2;
        }

        this.placed = true;
        this.dispatchEvent(new CustomEvent('surface-placed', { bubbles: true }));
    }

    /**
     * Handles when a surface should detach from /...? TODO
     */
    detatch() {
        this.placed = false;
        this.object3D.position.set(0, 0, 0);
        this.object3D.quaternion.set(0, 0, 0, 1);
        this.rotationPlane.rotation.x = 0;
        this.dispatchEvent(new CustomEvent('surface-removed', { bubbles: true }));
    }
}

customElements.get('mr-surface') || customElements.define('mr-surface', Surface);
