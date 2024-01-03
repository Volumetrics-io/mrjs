import * as THREE from 'three';

import { MRSystem } from 'mrjs/core/MRSystem';
import { MRDivEntity } from 'mrjs/core/MRDivEntity';
import { MREntity } from 'mrjs/core/MREntity';
import { Panel } from 'mrjs/core/entities/Panel';

/**
 * @class MaskingSystem
 * @classdesc Handles specific needs for setting up the masking for all necessary items.
 * @augments MRSystem
 */
export class MaskingSystem extends MRSystem {
    /**
     * @class
     * @description MaskingSystem's default constructor.
     */
    constructor() {
        super(false);

        // Configure materials

        this.panelStencilMaterial = new THREE.MeshBasicMaterial();
        this.panelStencilMaterial.stencilWrite = true;
        this.panelStencilMaterial.stencilFunc = THREE.AlwaysStencilFunc;
        this.panelStencilMaterial.stencilRef = 1;
        this.panelStencilMaterial.stencilZPass = THREE.ReplaceStencilOp;

        this.objectStencilMaterial = new THREE.MeshBasicMaterial();
        this.objectStencilMaterial.stencilWrite = true;
        this.objectStencilMaterial.stencilFunc = THREE.EqualStencilFunc;
        this.objectStencilMaterial.stencilRef = 1;

        // this.activeRefNumbers = new Set();
        // this.panels = new Set(); // needed for rendering, we dont need one for the entities though since theyre added to the registry already.
        this.panelsToEntities = new Map();
        this.panels = [];
    }

    /**
     * @function
     * @description ...
     * @param {number} deltaTime - given timestep to be used for any feature changes
     * @param {object} frame - given frame information to be used for any feature changes
     */
    update(deltaTime, frame) {
       // leave for when needed.
    }

    /**
     * @function
     * @description Called when a new entity is added to the scene. Handles masking elements to their panel.
     * @param {MREntity} entity - the entity being added.
     */
    onNewEntity(entity) {
         if (entity instanceof Panel) {
            this.panels.push(entity);
            let children = [];
            let panel = null;
            entity.traverse((child) => {
                // TODO - the below logic for the children array is slightly off - fix if needed
                // but might not need the children array anymore
                console.log(child);
                console.log(child.object3D);
                console.log(child.object3D.material);

                if (child instanceof MRDivEntity && !(child instanceof Panel) && !child.ignoreStencil) {
                    if (!child.object3D.isGroup) {
                        child.object3D.material.color.set(0xffff00); // yellow
                        child.object3D.material.stencilWrite = this.objectStencilMaterial.stencilWrite;
                        child.object3D.material.stencilFunc = this.objectStencilMaterial.stencilFunc;
                        child.object3D.material.stencilRef = this.objectStencilMaterial.stencilRef;

                        child.object3D.material.needsUpdate = true;
                        console.log('updated child mesh material');
                    }
                } else if (child instanceof Panel) {
                    if (child.object3D.isGroup) {
                        // grab background

                        let mesh = child.background;
                        mesh.material.color.set(0xff00ff); // pink
                        mesh.material.stencilWrite = this.panelStencilMaterial.stencilWrite;
                        mesh.material.stencilFunc = this.panelStencilMaterial.stencilFunc;
                        mesh.material.stencilRef = this.panelStencilMaterial.stencilRef;
                        mesh.material.stencilZPass = this.panelStencilMaterial.stencilZPass;

                        mesh.material.needsUpdate = true;

                        console.log('updated panel material');
                    }
                } else if (child.object3D.isGroup) {
                    console.log('skipping child group:');
                    console.log(child);
                    console.log(child.object3D);
                } else {
                    console.log('on new child to add, ignored:');
                    console.log(child);
                }
            });
            this.panelsToEntities.set(panel, children);
            console.log('traversing panel for children');
        }
    }
}
