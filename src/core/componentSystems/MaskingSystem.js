import * as THREE from 'three';

import { MRSystem } from 'mrjs/core/MRSystem';
import { MRDivEntity } from 'mrjs/core/MRDivEntity';
import { MREntity } from 'mrjs/core/MREntity';
import { MRPanel } from 'mrjs/core/entities/MRPanel';
import { MRTextEntity } from 'mrjs/core/MRTextEntity';

import { mrjsUtils } from 'mrjs';

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

        this.maskingStencilMaterial = new THREE.MeshBasicMaterial();
        this.maskingStencilMaterial.stencilWrite = true;
        this.maskingStencilMaterial.stencilFunc = THREE.AlwaysStencilFunc;
        this.maskingStencilMaterial.stencilRef = -1; // our default unset
        this.maskingStencilMaterial.stencilZPass = THREE.ReplaceStencilOp;

        this.childStencilMaterial = new THREE.MeshBasicMaterial();
        this.childStencilMaterial.stencilWrite = true;
        this.childStencilMaterial.stencilFunc = THREE.EqualStencilFunc;
        this.childStencilMaterial.stencilRef = -1; // our default unset

        this.panels = [];
        this.overflow = [];

        this.onPanel = false;
    }

    /**
     * @function
     * @description Getter to checks if we need to run this system's update call. Overridden implementation returns true if there are any items in this
     * systems registry that need to be run AND the default systemUpdateCheck is true
     * (see [MRSystem.needsSystemUpdate](https://docs.mrjs.io/javascript-api/#mrsystem.needssystemupdate) for default).
     * @returns {boolean} true if the system is in a state where this system is needed to update, false otherwise
     */
    get needsSystemUpdate() {
        // based on the update function - leave for when needed.
        return false;
    }

    /**
     * @function
     * @description Since this class overrides the default `get` for the `needsSystemUpdate` call, the `set` pair is needed for javascript to be happy.
     * Relies on the parent's implementation. (see [MRSystem.needsSystemUpdate](https://docs.mrjs.io/javascript-api/#mrsystem.needssystemupdate) for default).
     */
    set needsSystemUpdate(bool) {
        super.needsSystemUpdate = bool;
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
        let masking = false;

        if (!(entity instanceof MRPanel) && entity.compStyle.overflow === 'hidden') {
            console.log('overflow to add');
            this.overflow.push(entity);
            masking = true;
        } else if (entity instanceof MRPanel) {
            console.log('panel to add');
            // Using an array for the panels in case we need them for more manipulations down the line instead
            // of using the system's registry.
            this.panels.push(entity);
            masking = true;
        }

        if (masking) {
            // Need to set stencilRef for the children of this panel to match that of this panel so
            // that when rendering the children they only mask based on the panel's geometry location instead
            // of all panel geometry locations.
            //
            // stencilRef needs to be > 0 as 0 is the webgl default and -1 is our manual default of 'not set yet'.
            // We're basing our stencilRef on the 1+index location (ie length of array at adding) of the panel entity.
            // Even though we're not manually using this stencilRef in the render loop, threejs handles its use
            // internally.
            const stencilRef = this.panels.length + this.overflow.length;

            function funcForEntity(entity) {

                console.log('on entity root');
                console.log(entity);

                if (entity instanceof MRPanel) {
                    this.onPanel = true;
                    console.log('mr-panel');
                    // The panel entity should contain a group object where the first panel child we hit is this panel itself.
                    // We need to mask based off the background mesh of this object.
                } else {
                    this.onPanel = false;
                    console.log('on overflow=hidden');
                    // Is non-panel item that has overflow set to 'hidden'.
                }
                let mesh = entity.background;

                if (this.app.debug) {
                    mesh.material.color.set(0xff00ff); // pink
                }
                mesh.material.stencilWrite = this.maskingStencilMaterial.stencilWrite;
                mesh.material.stencilFunc = this.maskingStencilMaterial.stencilFunc;
                mesh.material.stencilRef = stencilRef;
                mesh.material.stencilZPass = this.maskingStencilMaterial.stencilZPass;

                mesh.material.needsUpdate = true;
            }

            function funcForEntityChildren(child) {
                // Currently this setup will not be able to handle properly if there is a panel within another
                // panel in the html setup. Defaulting that case to be based on whichever panel is the entity
                // passed through the onNewEntity function originally since that case is an edge case that will
                // not be expected. Hence in this 'funcForEntityChildren', we ignore all MRPanel children.

                console.log('on entity child');
                console.log(child);

                function runTheFunction() {
                    let attribObject = {
                        'stencilWrite'    : this.childStencilMaterial.stencilWrite,
                        'stencilFunc'     : this.childStencilMaterial.stencilFunc,
                        'stencilRef'      : stencilRef,
                    };
                    if (this.app.debug) {
                        attribObject['color'] = 0xffff00; // yellow
                    }

                    // Since we're stepping through every child, we only need to touch each mesh's material instead of
                    // updating group objects as a whole. Hence us being able to skip group objects.
                    //
                    // Need to handle text specially since text's mesh is directly in textObj though it is
                    // grouped into the object3D for the entity.
                    if (!child.object3D.isGroup) {
                        mrjsUtils.Material.adjustObjectMaterialProperties(child.object3D, attribObject);
                    } else if (child instanceof MRTextEntity) {
                        mrjsUtils.Material.adjustObjectMaterialProperties(child.textObj, attribObject);
                    }
                }

                if (this.onPanel) {
                    // The children we want to mask by the panel should only be DivEntities (ie UI elements). Other items
                    // will be clipped by the panel instead. Addiitonally, we want to allow for items (such as 3D elements)
                    // to be manually excluded from this masking by default or manual addition.
                    if (child instanceof MRDivEntity && !(child instanceof MRPanel) && !child.ignoreStencil) {
                        runTheFunction.bind(this);
                    }
                } else {
                    runTheFunction.bind(this);
                }
            }

            entity.traverse(funcForEntityChildren.bind(this), true, funcForEntity.bind(this));
        }
    }
}
