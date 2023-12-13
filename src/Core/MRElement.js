/**
 * @class MRElement
 * @classdesc The first step in MR.js extending an HTMLElement. Used as a base for both `mr-app` and `mr-entity`.
 * @augments HTMLElement
 */
export class MRElement extends HTMLElement {
    /**
     * Constructs the basic information needed to separate an `MRElement` from an `HTMLElement`.
     */
    constructor() {
        super();
        this.environment = null;
        this.observer = null;
    }

    /**
     * Adding an entity as a sub-object of this entity.
     * @param {MREntity} entity - the entity to be added.
     */
    add(entity) {}

    /**
     * Removing an entity as a sub-object of this entity.
     * @param {MREntity} entity - the entity to be removed.
     */
    remove(entity) {}
}
