import * as THREE from 'three';

import { MRElement } from 'mrjs/core/MRElement';

import { mrjsUtils } from 'mrjs';

const MOUSE_EVENTS = ['click', 'mouseenter', 'mouseleave', 'mousedown', 'mouseup', 'mouseover', 'mouseout', 'mousemove'];

/**
 * @class MREntity
 * @classdesc The default representation of an MRElement to be expanded upon by actual details ECS Entity items. `mr-entity`
 * @augments MRElement
 */
export class MREntity extends MRElement {
    aabb = new THREE.Box3();

    size = new THREE.Vector3();

    layer = 0;

    physics = {
        type: 'none',
    };

    components = {
        get: (name) => {
            const dataName = `comp${name[0].toUpperCase()}${name.slice(1)}`;
            return mrjsUtils.string.stringToJson(this.dataset[dataName]);
        },

        set: (name, data) => {
            const dataName = `comp${name[0].toUpperCase()}${name.slice(1)}`;
            const component = mrjsUtils.string.stringToJson(this.dataset[dataName]) ?? {};
            for (const key in data) {
                component[key] = data[key];
            }
            this.dataset[dataName] = mrjsUtils.string.jsonToString(component);
        },
    };

    /**
     * @class
     * @description Constructor for the default Entity Component (MREntity).
     *              Sets up the base object3D and useful Mixed Reality information including rendering, touching, and component basics.
     */
    constructor() {
        super();

        Object.defineProperty(this, 'isApp', {
            value: false,
            writable: false,
        });

        this.object3D = new THREE.Group();
        this.object3D.userData.isEntityObject3DRoot = true;
        this.object3D.userData.bbox = new THREE.Box3();
        this.object3D.userData.size = new THREE.Vector3();

        this.object3D.receiveShadow = true;
        this.object3D.castShadow = true;
        this.object3D.renderOrder = 3;
        this.object3D.name = 'entity';

        this.scale = 1;

        this.componentMutated = this.componentMutated.bind(this);

        this.touch = false;
        this.grabbed = false;
        this.focus = false;

        this.ignoreStencil = true;
    }

    /**
     * @function
     * @description Calculates the width of the Entity based on the viewPort's shape. If in Mixed Reality, adjusts the value appropriately.
     * @returns {number} - the resolved width
     */
    get width() {
        return (this.compStyle.width.split('px')[0] / global.appWidth) * global.viewPortWidth;
    }

    /**
     * @function
     * @description The actual 3D value of the content's width.
     * @returns {number} - width of the 3D object.
     */
    get contentWidth() {
        this.aabb.setFromObject(this.object3D).getSize(this.size);
        return this.size.x;
    }

    /**
     * @function
     * @description Calculates the height of the Entity based on the viewPort's shape. If in Mixed Reality, adjusts the value appropriately.
     * @returns {number} - the resolved height
     */
    get height() {
        return (this.compStyle.height.split('px')[0] / global.appHeight) * global.viewPortHeight;
    }

    /**
     * @function
     * @description The actual 3D value of the content's height.
     * @returns {number} - height of the 3D object.
     */
    get contentHeight() {
        this.aabb.setFromObject(this.object3D).getSize(this.size);
        return this.size.y;
    }

    /**
     * @function
     * @description Triggers a system run to update geometry specifically for the entity calling it. Useful when it's not an overall scene event and for cases where 
     * relying on an overall scene or all items to update isnt beneficial.
     * @returns {number} - height of the 3D object.
     */
    triggerGeometryStyleUpdate() {
        this.dispatchEvent(new CustomEvent('trigger-geometry-style-update', { detail: this, bubbles: true }));
    }

    /**
     * @function
     * @description Triggers a system run to update material specifically for the entity calling it. Useful when it's not an overall scene event and for cases where 
     * relying on an overall scene or all items to update isnt beneficial.
     * @returns {number} - height of the 3D object.
     */
    triggerMaterialStyleUpdate() {
        this.dispatchEvent(new CustomEvent('trigger-material-style-update', { detail: this, bubbles: true }));
    }

    /**
     * @function
     * @description Inside the engine's ECS these arent filled in, theyre directly in the system themselves - but they can be added to by others when they create new entities.
     * These are run after the MaterialStyleSystem does its own update on the entity.
     */
    updateMaterialStyle() {}

    /**
     * @function
     * @description Inside the engine's ECS these arent filled in, theyre directly in the system themselves - but they can be added to by others when they create new entities.
     * These are run after the GeometryStyleSystem does its own update on the entity.
     */
    updateGeometryStyle() {}

    /**
     * @function
     * @description Handles the hover event
     * @param {object} event - the hover event
     */
    onHover = (event) => {};

    /**
     * @function
     * @description Handles the touch event
     * @param {object} event - the touch event
     */
    onTouch = (event) => {};

    /**
     * @function
     * @description Handles the scroll event
     * @param {object} event - the scroll event
     */
    onScroll = (event) => {
        this.parentElement?.onScroll(event);
    };

    /**
     * @function
     * @description The connectedCallback function that runs whenever this entity component becomes connected to something else.
     */
    connectedCallback() {
        this.compStyle = window.getComputedStyle(this);

        if (!(this.parentElement instanceof MRElement)) {
            return;
        }
        this.parentElement.add(this);

        if (this.parentElement.user) {
            this.user = this.parentElement.user;
        }
        if (this.parentElement.env) {
            this.env = this.parentElement.env;
        }

        this.object3D.userData.element = this;

        this.object3D.userData.bbox = new THREE.Box3();
        this.object3D.userData.size = new THREE.Vector3();

        this.object3D.userData.bbox.setFromObject(this.object3D);

        this.object3D.userData.bbox.getSize(this.object3D.userData.size);

        this.mutationCallback = this.mutationCallback.bind(this);
        this.observer = new MutationObserver(this.mutationCallback);
        this.observer.observe(this, { attributes: true, childList: true, attributeOldValue: true });

        /** Handle scene Global level events **/

        document.addEventListener('DOMContentLoaded', (event) => {
            this.loadAttributes();
        });
        this.loadAttributes();

        document.addEventListener('engine-started', (event) => {
            this.dispatchEvent(new CustomEvent('new-entity', { bubbles: true }));
        });

        /** Handle events specific to this entity **/
        // note: these will need the trigger for Material or Geometry if applicable

        MOUSE_EVENTS.forEach((eventType) => {
            this.addEventListener(eventType, (event) => {
                this.triggerGeometryStyleUpdate();
                this.triggerMaterialStyleUpdate();
            });
        });

        this.addEventListener('touchstart', (event) => {
            this.triggerGeometryStyleUpdate();
            this.triggerMaterialStyleUpdate();
            this.onTouch(event);
        });
        this.addEventListener('touchmove', (event) => {
            this.triggerGeometryStyleUpdate();
            this.triggerMaterialStyleUpdate();
            this.onTouch(event);
        });
        this.addEventListener('touchend', (event) => {
            this.triggerGeometryStyleUpdate();
            this.triggerMaterialStyleUpdate();
            this.onTouch(event);
        });
        this.addEventListener('hoverstart', (event) => {
            this.triggerGeometryStyleUpdate();
            this.triggerMaterialStyleUpdate();
            this.onHover(event);
        });
        this.addEventListener('hoverend', (event) => {
            this.triggerGeometryStyleUpdate();
            this.triggerMaterialStyleUpdate();
            this.onHover(event);
        });

        this.addEventListener('child-updated', (event) => {
            this.triggerGeometryStyleUpdate();
            this.triggerMaterialStyleUpdate();
        });

        this.dispatchEvent(new CustomEvent('new-entity', { bubbles: true }));
        this.connected();
    }

    /**
     * @function
     * @description Loads all attributes of this entity's stored dataset including components, attaching them, and their associated rotations and positions.
     */
    loadAttributes() {
        for (const attr in this.dataset) {
            if (attr.includes('comp')) {
                const compName = attr.split('comp')[1].toLocaleLowerCase();
                this.dispatchEvent(
                    new CustomEvent(`${attr}-attached`, {
                        bubbles: true,
                        detail: { entity: this },
                    })
                );
            } else {
                switch (attr) {
                    case 'rotation':
                        this.object3D.rotation.fromArray(mrjsUtils.string.stringToDegVector(this.dataset.rotation));
                        break;
                    case 'position':
                        this.object3D.position.fromArray(mrjsUtils.string.stringToVector(this.dataset.position));
                        break;
                }
            }
        }
    }

    /**
     * @function
     * @description Callback function of MREntity - does nothing. Is called by the connectedCallback.
     */
    connected() {}

    /**
     * @function
     * @description Callback function of MREntity - does nothing. Is called by the disconnectedCallback.
     */
    disconnected() {}

    /**
     * @function
     * @description The disconnectedCallback function that runs whenever this entity component becomes disconnected from something else.
     */
    disconnectedCallback() {
        while (this.object3D.parent) {
            this.object3D.removeFromParent();
        }

        if (this.physics) {
            mrjsUtils.physics.world.removeRigidBody(this.physics.body);
        }

        this.environment = null;
        this.observer.disconnect();

        this.disconnected();
    }

    /**
     * @function
     * @description Callback function of MREntity - does nothing. Is called by mutation Callback.
     * @param {object} mutation - the update/change/mutation to be handled.
     */
    mutated(mutation) {}

    /**
     * @function
     * @description The mutationCallback function that runs whenever this entity component should be mutated.
     * @param {object} mutationList - the list of update/change/mutation(s) to be handled.
     * @param {object} observer - w3 standard object that watches for changes on the HTMLElement
     */
    mutationCallback(mutationList, observer) {
        for (const mutation of mutationList) {
            this.mutated(mutation);

            switch (mutation.type) {
                case 'childList':
                    this.triggerGeometryStyleUpdate();
                    this.triggerMaterialStyleUpdate();
                    break;
                case 'attributes':
                    if (mutation.attributeName.includes('comp')) {
                        this.componentMutated(mutation);
                    }
                    switch (mutation.attributeName) {
                        case 'data-position':
                            this.object3D.position.fromArray(mrjsUtils.string.stringToVector(this.dataset.position));
                            break;
                        case 'data-rotation':
                            this.object3D.rotation.fromArray(mrjsUtils.string.stringToDegVector(this.dataset.rotation));
                            break;

                        default:
                            break;
                    }
                    break;

                default:
                    break;
            }
        }
    }

    /**
     * @function
     * @description Helper function for the mutationCallback. Handles actually updating this entity component with all the associated dispatchEvents.
     * @param {object} mutation - the update/change/mutation to be handled.
     */
    componentMutated(mutation) {
        const compName = mutation.attributeName.split('comp-')[1];
        const dataName = `comp${compName[0].toUpperCase()}${compName.slice(1)}`;
        if (!this.dataset[dataName]) {
            this.dispatchEvent(new CustomEvent(`${dataName}-detached`, { bubbles: true }));
        } else if (mutation.oldValue) {
            this.dispatchEvent(
                new CustomEvent(`${dataName}-updated`, {
                    bubbles: true,
                    detail: { oldData: mrjsUtils.string.jsonToString(mutation.oldValue) },
                })
            );
        } else {
            this.dispatchEvent(
                new CustomEvent(`${dataName}-attached`, {
                    bubbles: true,
                })
            );
        }
    }

    /**
     * @function
     * @description Adding an entity as a sub-object of this entity.
     * @param {MREntity} entity - the entity to be added.
     */
    add(entity) {
        entity.object3D.receiveShadow = true;
        entity.object3D.renderOrder = 3;
        this.object3D.add(entity.object3D);
    }

    /**
     * @function
     * @description Removing an entity as a sub-object of this entity.
     * @param {MREntity} entity - the entity to be removed.
     */
    remove(entity) {
        this.object3D.remove(entity.object3D);
    }

    /**
     * @function
     * @description Runs the passed through function on this object and every child of this object.
     * @param {Function} callBack - the function to run recursively.
     */
    traverse(callBack) {
        callBack(this);
        const children = Array.from(this.children);
        for (const child of children) {
            // if o is an object, traverse it again
            if ((!child) instanceof MREntity) {
                continue;
            }
            child.traverse(callBack);
        }
    }
}

customElements.get('mr-entity') || customElements.define('mr-entity', MREntity);
