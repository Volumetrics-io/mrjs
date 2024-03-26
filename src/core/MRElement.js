/**
 * @class MRElement
 * @classdesc The first step in MRjs extending an HTMLElement. Used as a base for both `mr-app` and `mr-entity`.
 * @augments HTMLElement
 */
export class MRElement extends HTMLElement {
    /**
     * @class
     * @description Constructs the basic information needed to separate an `MRElement` from an `HTMLElement`.
     */
    constructor() {
        super();
        this.environment = null;
        this.observer = null;

        // Hack for the performance.
        // Element.getBoundingClientRect() is called from many places
        // mainly to sync the layout between DOM elements and 3D scene.
        // But .getBoundingClientRect() is slow because it may invoke reflow.
        // To avoid reflow in sync we use a hack with IntersectionObserver
        // that gives .boundingClientRect in callback function.
        //
        // There are some concerns in this approach.
        // 1. It might be costly to apply this technique to all MREntities.
        //    Optimization might be necessary to apply it only to MREntities where
        //    .getBoundingClientRect() is frequently executed.
        // 2. Since boundingClientRect is updated asynchronously, the latest values
        //    may be set a few frames late. It is necessary to confirm whether this
        //    is acceptable for the user experience and various systems. One possible
        //    workaround, which is not perfect but simple, would be to add a new method
        //    that is more efficient but may not return the latest value, in addition to
        //    the regular .getBoundingClientRect() method. The caller can then choose
        //    which method to use depending on the purpose.
        // 3. Asynchronous updates can make testing, problem investigation, and debugging
        //    more difficult. For example, if a bug occurs only when updates are delayed by
        //    greater than a certain number of frames, it may be difficult to reproduce the
        //    issue and making problem investigation very challenging. (If IntersectionObserver
        //    specification guarantees that the callback would always be called during the next
        //    idle time after .observe() is executed, the problem would be less significant.)
        this._boundingClientRect = null;
        const intersectionObserver = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                this._boundingClientRect = entry.boundingClientRect;
            }
            // Refresh the rect info to keep it up-to-date as much as possible.
            // It seems that the callback is always called once soon after observe() is called,
            // regardless of the intersection state of the entity.
            // TODO: Confirm whether this behavior is intended. If it is not, there may be future
            //       behavior changes or it may not work as intended on certain platforms.
            intersectionObserver.disconnect();
            intersectionObserver.observe(this);
        });
        intersectionObserver.observe(this);
    }

    /**
     * @function
     * @description Adding an entity as a sub-object of this entity.
     * @param {object} entity - the entity to be added.
     */
    add(entity) {}

    /**
     * @function
     * @description Removing an entity as a sub-object of this entity.
     * @param {object} entity - the entity to be removed.
     */
    remove(entity) {}

    /**
     * @function
     * @description Overrides getBoundingClientRect() to avoid reflow in sync as optimization
     */
    getBoundingClientRect() {
        // This is a fallback in case if .getBoundingClientRect() is called before
        // ._boundingClientRect is initialized.
        if (this._boundingClientRect === null) {
            this._boundingClientRect = super.getBoundingClientRect();
        }
        // Assuming the values in the return value object are not overridden in the callers.
        // If it happens, it affects to all the callers until ._boundingClientRect is refreshed.
        return this._boundingClientRect;
    }
}
