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

    /**
     * @class
     * @description Constructor for the default Entity Component (MREntity).
     *              Sets up the base object3D and useful Mixed Reality information including rendering, touching, and component basics.
     */
    constructor() {
        super();

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

    /*************************/
    /*** Object Dimensions ***/
    /*************************/

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

    /****************************/
    /*** Updates And Triggers ***/
    /****************************/

    /**
     * @function
     * @description Triggers a system run to update geometry specifically for the entity calling it. Useful when it's not an overall scene event and for cases where
     * relying on an overall scene or all items to update isnt beneficial.
     */
    triggerGeometryStyleUpdate() {
        this.dispatchEvent(new CustomEvent('trigger-geometry-style-update', { detail: this, bubbles: true }));
    }

    /**
     * @function
     * @description Triggers a system run to update material specifically for the entity calling it. Useful when it's not an overall scene event and for cases where
     * relying on an overall scene or all items to update isnt beneficial.
     */
    triggerMaterialStyleUpdate() {
        this.dispatchEvent(new CustomEvent('trigger-material-style-update', { detail: this, bubbles: true }));
    }

    /**
     * @function
     * @description Directly in MRjs, this function is empty. It is called directly in the
     * MaterialStyleSystem. This allows outside users to add their own additional functionality
     * for the entities. These are run after the MaterialStyleSystem does its own update on the entity.
     */
    updateMaterialStyle() {}

    /**
     * @function
     * @description Directly in MRjs, this function is empty. It is called directly in the
     * GeometryStyleSystem. This allows outside users to add their own additional functionality
     * for the entities. These are run after the GeometryStyleSystem does its own update on the entity.
     */
    updateGeometryStyle() {}

    /*****************************/
    /*** On Interaction Events ***/
    /*****************************/

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

    /********************************/
    /*** Handling data-attributes ***/
    /********************************/

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

    position = {
        get: () => {
            return this.dataset.position;
        },

        set: (arr) => {
            if (arr.length != 3) {
                mrjsUtils.error.err('position must be set with an array of all three elements [x, y, z]');
            }
            let vec = mrjsUtils.string.stringToVector(this.dataset.position ?? '0 0 0');
            vec[0] = arr[0];
            vec[1] = arr[1];
            vec[2] = arr[2];
            this.dataset.position = mrjsUtils.string.vectorToString(vec);
        },

        x: () => {
            return this.dataset.position.split(' ')[0];
        },

        setX: (val) => {
            let vec = mrjsUtils.string.stringToVector(this.dataset.position);
            vec[0] = val;
            this.dataset.position = mrjsUtils.string.vectorToString(vec);
        },

        y: () => {
            return this.dataset.position.split(' ')[1];
        },

        setY: (val) => {
            let vec = mrjsUtils.string.stringToVector(this.dataset.position);
            vec[1] = val;
            this.dataset.position = mrjsUtils.string.vectorToString(vec);
        },

        z: () => {
            return this.dataset.position.split(' ')[2];
        },

        setZ: (val) => {
            let vec = mrjsUtils.string.stringToVector(this.dataset.position);
            vec[2] = val;
            this.dataset.position = mrjsUtils.string.vectorToString(vec);
        },
    };

    rotation = {
        get: () => {
            return this.dataset.rotation;
        },

        set: (arr) => {
            if (arr.length != 3) {
                mrjsUtils.error.err('rotation must be set with an array of all three elements [x, y, z]');
            }
            let vec = mrjsUtils.string.stringToVector(this.dataset.rotation ?? '0 0 0');
            vec[0] = arr[0];
            vec[1] = arr[1];
            vec[2] = arr[2];
            this.dataset.rotation = mrjsUtils.string.vectorToString(vec);
        },

        x: () => {
            return this.dataset.rotation.split(' ')[0];
        },

        x: (val) => {
            let vec = mrjsUtils.string.stringToVector(this.dataset.rotation);
            vec[0] = val;
            this.dataset.rotation = mrjsUtils.string.vectorToString(vec);
        },

        y: () => {
            return this.dataset.rotation.split(' ')[1];
        },

        y: (val) => {
            let vec = mrjsUtils.string.stringToVector(this.dataset.rotation);
            vec[1] = val;
            this.dataset.rotation = mrjsUtils.string.vectorToString(vec);
        },

        z: () => {
            return this.dataset.rotation.split(' ')[2];
        },

        z: (val) => {
            let vec = mrjsUtils.string.stringToVector(this.dataset.rotation);
            vec[2] = val;
            this.dataset.rotation = mrjsUtils.string.vectorToString(vec);
        },
    };

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

    /************************************/
    /*** Handling Entity Interactions ***/
    /************************************/

    /**
     * @function
     * @description Callback function of MREntity - does nothing. Is called by the connectedCallback.
     */
    async connected() {}

    /**
     * @function
     * @description The connectedCallback function that runs whenever this entity component becomes connected to something else.
     */
    async connectedCallback() {
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

        /** Handle events specific to this entity */
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

        // TODO: find alternative solution. This breaks with the switch to asychronous entity initialization
        // const intersectionObserver = new IntersectionObserver((entries) => {
        //     for (const entry of entries) {
        //         this._boundingClientRect = entry.boundingClientRect;
        //     }
        //     // Refresh the rect info to keep it up-to-date as much as possible.
        //     // It seems that the callback is always called once soon after observe() is called,
        //     // regardless of the intersection state of the entity.
        //     // TODO: Confirm whether this behavior is intended. If it is not, there may be future
        //     //       behavior changes or it may not work as intended on certain platforms.
        //     intersectionObserver.disconnect();
        //     intersectionObserver.observe(this);
        // });
        // intersectionObserver.observe(this);

        if (mrjsUtils.physics.initialized) {
            await this.connected();
            this.dispatchEvent(new CustomEvent('new-entity', { bubbles: true }));
            this.loadAttributes();
        } else {
            document.addEventListener('engine-started', async (event) => {
                await this.connected();
                this.loadAttributes();
                this.dispatchEvent(new CustomEvent('new-entity', { bubbles: true }));
            });
        }
    }

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
            // if child is an entity, traverse it again
            if (child instanceof MREntity) {
                child.traverse(callBack);
            }
        }
    }

    /**
     * @function
     * @description Runs the passed through function on the objects associated with this Entity
     * @param {Function} callBack - the function to run recursively.
     */
    traverseObjects(callBack) {
        const traverse = (object) => {
            callBack(object);
            for (const child of object.children) {
                if (!child.userData.isEntityObject3DRoot) {
                    traverse(child);
                }
            }
        };
        traverse(this.object3D);
    }
}

customElements.get('mr-entity') || customElements.define('mr-entity', MREntity);
