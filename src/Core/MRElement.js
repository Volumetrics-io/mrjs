/**
 * @class
 * @classdesc The first step in MR.js extending an HTMLElement. Used as a base for both `mr-app` and `mr-entity`.
 * @augments HTMLElement
 */
export class MRElement extends HTMLElement {
    /**
     *
     */
    constructor() {
        super();
        this.environment = null;
        this.observer = null;
    }

    /**
     *
     * @param {object} entity - TODO
     */
    add(entity) {}

    /**
     *
     * @param {object} entity - TODO
     */
    remove(entity) {}
}
