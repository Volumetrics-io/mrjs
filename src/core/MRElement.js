/**
 * @class MRElement
 * @classdesc The first step in MR.js extending an HTMLElement. Used as a base for both `mr-app` and `mr-entity`.
 * @extends HTMLElement
 */
export class MRElement extends HTMLElement {
    /**
     * @constructor
     * @description Constructs the basic information needed to separate an `MRElement` from an `HTMLElement`.
     */
    constructor() {
        super();
        this.environment = null;
        this.observer = null;
    }

    /**
     * @method
     * @description Adding an entity as a sub-object of this entity.
     * @param {object} entity - the entity to be added.
     */
    add(entity) {}

    /**
     * @method
     * @description Removing an entity as a sub-object of this entity.
     * @param {object} entity - the entity to be removed.
     */
    remove(entity) {}
}
