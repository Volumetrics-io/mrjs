import * as THREE from 'three';
import { MRUIEntity } from '../../UI/UIEntity';
import Entity from '../../core/entity';

/**
 *
 */
export class LayoutEntity extends Entity {

    get height() {  
        const rect = this.getBoundingClientRect();      

        if (global.inXR) {
            this.windowVerticalScale = this.parentElement.windowVerticalScale;
            return (rect.height / window.innerHeight) * this.windowVerticalScale;
        }
        return (rect.height / window.innerHeight) * global.viewPortHeight;
    }

    /**
     *
     */
    get width() {
        const rect = this.getBoundingClientRect();

        if (global.inXR) {
            this.windowHorizontalScale = this.parentElement.windowHorizontalScale;
            return (rect.width / window.innerWidth) * this.windowHorizontalScale;
        }
        return (rect.width / window.innerWidth) * global.viewPortWidth;
    }

    /**
     *
     */
    constructor() {
        super();
        this.shuttle = new THREE.Group(); // will shift based on bounding box width
        this.object3D.userData.bbox = new THREE.Box3();
        this.object3D.userData.size = new THREE.Vector3();
        this.object3D.add(this.shuttle)

        this.windowVerticalScale = 1;
        this.windowHorizontalScale = 1;

    }
}
