import * as THREE from 'three';

import { MRElement } from 'MRJS/Core/MRElement';
import { stringToJson, stringToDegVector, stringToVector, jsonToString } from 'MRJS/Utils/String';

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
            return stringToJson(this.dataset[dataName]);
        },

        set: (name, data) => {
            const dataName = `comp${name[0].toUpperCase()}${name.slice(1)}`;
            const component = stringToJson(this.dataset[dataName]);
            for (const key in data) {
                component[key] = data[key];
            }
            this.dataset[dataName] = jsonToString(component);
        },
    };

    /**
     * Constructor for the default Entity Component (MREntity).
     * Sets up the base object3D and useful Mixed Reality information including rendering, touching, and component basics.
     */
    constructor() {
        super();

        Object.defineProperty(this, 'isApp', {
            value: false,
            writable: false,
        });

        this.object3D = new THREE.Group();
        this.object3D.userData.bbox = new THREE.Box3();
        this.object3D.userData.size = new THREE.Vector3();

        this.object3D.receiveShadow = true;
        this.object3D.renderOrder = 3;

        this.scale = 1;

        this.componentMutated = this.componentMutated.bind(this);

        this.touch = false;
        this.grabbed = false;
        this.focus = false;
    }

    /**
     * Calculates the width of the Entity based on the viewPort's shape. If in Mixed Reality, adjusts the value appropriately.
     * @returns {number} - the resolved width
     */
    get width() {
        return (this.compStyle.width.split('px')[0] / window.innerWidth) * global.viewPortWidth;
    }

    /**
     * The actual 3D value of the content's width.
     * @returns {number} - width of the 3D object.
     */
    get contentWidth() {
        this.aabb.setFromObject(this.object3D).getSize(this.size);
        return this.size.x;
    }

    /**
     * Calculates the height of the Entity based on the viewPort's shape. If in Mixed Reality, adjusts the value appropriately.
     * @returns {number} - the resolved height
     */
    get height() {
        const styleHeight = this.compStyle.height.split('px')[0] > 0 ? this.compStyle.height.split('px')[0] : window.innerHeight;
        return (styleHeight / window.innerHeight) * global.viewPortHeight;
    }

    /**
     * The actual 3D value of the content's height.
     * @returns {number} - height of the 3D object.
     */
    get contentHeight() {
        this.aabb.setFromObject(this.object3D).getSize(this.size);
        return this.size.y;
    }

    /**
     * Default base for updating the physics data for the current iteration.
     */
    updatePhysicsData() {}

    onHover(event){
        // console.log(`${event.detail.joint} hover at:`, event.detail.position);
    //     // TODO - should we add anything as default here? or even to warn people if their class is falling back on this one instead?
    //     // TODO - should we delete the above console.log instead?
    };

    onTouch(event){
        // console.log(`${event.detail.joint} touch at:`, event.detail.position);
            //     // TODO - should we add anything as default here? or even to warn people if their class is falling back on this one instead?
    //     // TODO - should we delete the above console.log instead?
    };

    onScroll(event){
        this.parentElement?.onScroll(event);
    };

    /**
     * The connectedCallback function that runs whenever this entity component becomes connected to something else.
     */
    connectedCallback() {
        this.compStyle = window.getComputedStyle(this);

        if (!(this.parentElement instanceof MRElement)) {
            return;
        }
        this.parentElement.add(this);

        this.parent = this.parentElement;

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

        document.addEventListener('DOMContentLoaded', (event) => {
            this.loadAttributes();
        });
        this.loadAttributes();

        this.connected();

        document.addEventListener('engine-started', (event) => {
            this.dispatchEvent(new CustomEvent('new-entity', { bubbles: true }));
        });

        this.addEventListener('touch-start', (event) => {
            this.onTouch(event);
        });
        this.addEventListener('touch', (event) => {
            this.onTouch(event);
        });
        this.addEventListener('touch-end', (event) => {
            this.onTouch(event);
        });
        this.addEventListener('hover-start', (event) => {
            this.onHover(event);
        });
        this.addEventListener('hover-end', (event) => {
            this.onHover(event);
        });

        this.dispatchEvent(new CustomEvent('new-entity', { bubbles: true }));
    }

    /**
     * Loads all attributes of this entity's stored dataset including components, attaching them, and their associated rotations and positions.
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
                        this.object3D.rotation.fromArray(stringToDegVector(this.dataset.rotation));
                        break;
                    case 'position':
                        this.object3D.position.fromArray(stringToVector(this.dataset.position));
                        break;
                }
            }
        }
    }

    /**
     * Callback function of MREntity - does nothing. Is called by the connectedCallback.
     */
    connected() {}

    /**
     * Callback function of MREntity - does nothing. Is called by the disconnectedCallback.
     */
    disconnected() {}

    /**
     * The disconnectedCallback function that runs whenever this entity component becomes disconnected from something else.
     */
    disconnectedCallback() {
        while (this.object3D.parent) {
            this.object3D.removeFromParent();
        }

        if (this.physics) {
            this.env.physicsWorld.removeRigidBody(this.physics.body);
        }

        this.environment = null;
        this.observer.disconnect();

        this.disconnected();
    }

    /**
     * Callback function of MREntity - does nothing. Is called by mutation Callback.
     * @param {object} mutation - the update/change/mutation to be handled.
     */
    mutated(mutation) {}

    /**
     * The mutationCallback function that runs whenever this entity component should be mutated.
     * @param {object} mutationList - the list of update/change/mutation(s) to be handled.
     * @param {object} observer - TODO
     */
    mutationCallback(mutationList, observer) {
        for (const mutation of mutationList) {
            this.mutated(mutation);

            switch (mutation.type) {
                case 'childList':
                    break;
                case 'attributes':
                    if (mutation.attributeName.includes('comp')) {
                        this.componentMutated(mutation);
                    }
                    switch (mutation.attributeName) {
                        case 'data-position':
                            this.object3D.position.fromArray(stringToVector(this.dataset.position));
                            break;
                        case 'data-rotation':
                            this.object3D.rotation.fromArray(stringToDegVector(this.dataset.rotation));
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
     * Helper function for the mutationCallback. Handles actually updating this entity component with all the associated dispatchEvents.
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
                    detail: { oldData: MRJS.jsonToString(mutation.oldValue) },
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
     * Adding an entity as a sub-object of this entity.
     * @param {MREntity} entity - the entity to be added.
     */
    add(entity) {
        entity.object3D.receiveShadow = true;
        entity.object3D.renderOrder = 3;
        this.object3D.add(entity.object3D);
    }

    /**
     * Removing an entity as a sub-object of this entity.
     * @param {MREntity} entity - the entity to be removed.
     */
    remove(entity) {
        this.object3D.remove(entity.object3D);
    }

    /**
     * Runs the passed through function on this object and every child of this object.
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

    /**
     * Sets the position, scale, and rotational values of the stored object3D based on stored attribute information.
     */
    setTransformValues() {
        const position = this.getAttribute('position');
        const scale = this.getAttribute('scale');
        const rotation = this.getAttribute('rotation');

        if (position) {
            this.object3D.position.fromArray(stringToVector(position));
        }

        if (scale) {
            this.object3D.scale.fromArray(stringToVector(scale));
        }

        if (rotation) {
            const euler = new THREE.Euler();
            const array = stringToVector(rotation).map(radToDeg);
            euler.fromArray(array);
            this.object3D.setRotationFromEuler(euler);
        }
    }
}

customElements.get('mr-entity') || customElements.define('mr-entity', MREntity);
