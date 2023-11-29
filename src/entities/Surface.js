import * as THREE from 'three';
import Entity from '../core/entity.js';
import { UIPlane } from '../geometry/UIPlane.js';

/**
 *
 */
export class Surface extends Entity {
    /**
     *
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
     *
     */
    connected() {
        this.windowVerticalScale = this.height / 3;
        this.windowHorizontalScale = this.width / 3;

        this.placed = false;

        // TODO - can combine viz and stencil or nah?

        // TODO - is it okay to switch this to let instead of this?
        // i dont see it being used anywhere else and safer for uppdating
        let vizMaterial = new THREE.MeshStandardMaterial({
            color: 0x3498db,
            roughness: 0.0,
            metalness: 0.7,
            transparent: true,
            opacity: 0.7,
            side: 2,
        });
        objectMaterial.stencilWrite = true;
        objectMaterial.stencilRef = 1;
        objectMaterial.stencilFunc = THREE.EqualStencilFunc;
        objectMaterial.stencilFail = THREE.KeepStencilOp;
        objectMaterial.stencilZFail = THREE.KeepStencilOp;
        objectMaterial.stencilZPass = THREE.KeepStencilOp;

        let maskMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        maskMaterial.stencilWrite = true;
        maskMaterial.stencilRef = 1;
        maskMaterial.stencilFunc = THREE.AlwaysStencilFunc;
        maskMaterial.stencilFail = THREE.ReplaceStencilOp;
        maskMaterial.stencilZFail = THREE.ReplaceStencilOp;
        maskMaterial.stencilZPass = THREE.ReplaceStencilOp;

        this.geometry = UIPlane(this.windowHorizontalScale, this.windowVerticalScale, [0.01], 18);

        this.viz = new THREE.Mesh(this.geometry, this.material);
        this.mask = new THREE.Mesh(this.geometry, maskMaterial);

        // TODO - what is happening in the below - does stencil/mask need to be included?
        // are these just included debug items with vis?
        this.translation.add(this.group);
        if (this.viz.parent == null) {
            this.translation.add(this.viz);
            this.translation.add(this.mask);
        }
        this.group.visible = true;
        this.viz.visible = false;
        this.mask.visible = false; // TODO - check on this.
    }

    /**
     *
     * @param entity
     */
    add(entity) {
        this.group.add(entity.object3D);
    }

    /**
     *
     * @param entity
     */
    remove(entity) {
        this.group.remove(entity.object3D);
    }

    /**
     *
     * @param mutation
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
     *
     */
    place() {
        this.viz.removeFromParent();
        this.mask.removeFromParent();

        this.group.visible = true;
        this.placed = true;

        this.dispatchEvent(new CustomEvent('surface-placed', { bubbles: true }));
    }

    /**
     *
     */
    replace() {
        console.log('replace');
        this.object3D.position.copy(this.anchorPosition);
        this.object3D.quaternion.copy(this.anchorQuaternion);

        this.placed = true;
        this.dispatchEvent(new CustomEvent('surface-placed', { bubbles: true }));
    }

    /**
     *
     */
    remove() {
        console.log('remove');
        this.placed = false;
        this.object3D.position.set(0, 0, 0);
        this.object3D.quaternion.set(0, 0, 0, 1);
        this.dispatchEvent(new CustomEvent('surface-removed', { bubbles: true }));
    }
}

customElements.get('mr-surface') || customElements.define('mr-surface', Surface);
