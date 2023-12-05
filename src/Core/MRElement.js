// TODO - is this class really needed?

/**
 * The first step in MR.js extending an HTMLElement. Used as a base for both `mr-app` and `mr-entity`.
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
     * @param entity
     */
    add(entity) {}

    /**
     *
     * @param entity
     */
    remove(entity) {}
}
