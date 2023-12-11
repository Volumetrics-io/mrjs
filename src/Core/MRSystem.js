import { MREntity } from 'MRJS/Core/MREntity';

/**
 * @class
 * @classdesc TODO
 */
export class MRSystem {
    frameRate = null;

    delta = 0;

    /**
     *
     * @param {boolean} useComponents - TODO
     * @param {number} frameRate - TODO
     */
    constructor(useComponents = true, frameRate = null) {
        this.app = document.querySelector('mr-app');

        if (!this.app) {
            return;
        }

        this.frameRate = frameRate;
        // Need a way to register and deregister systems per environment
        this.registry = new Set();

        this.systemName = this.constructor.name.split('System')[0];
        this.componentName = `comp${this.systemName}`;

        this.app.registerSystem(this);

        if (useComponents) {
            document.addEventListener(`${this.componentName}-attached`, this.onAttach);
            document.addEventListener(`${this.componentName}-updated`, this.onUpdate);
            document.addEventListener(`${this.componentName}-detached`, this.onDetatch);
        }

        this.app.addEventListener('new-entity', (event) => {
            if (this.registry.has(event.target)) {
                return;
            }
            this.onNewEntity(event.target);
        });

        const entities = document.querySelectorAll(`[${this.componentName}]`);
        for (const entity of entities) {
            if (!(entity instanceof MREntity)) {
                return;
            }
            this.registry.add(entity);
        }
    }

    /**
     *
     * @param {number} deltaTime - TODO
     * @param {object} frame - TODO
     */
    __update(deltaTime, frame) {
        if (this.frameRate) {
            this.delta += deltaTime;
            if (this.delta < this.frameRate) {
                return;
            }
        }
        this.update(deltaTime, frame);
        this.delta = 0;
    }

    // Called per frame
    /**
     *
     * @param {number} deltaTime - TODO
     * @param {object} frame - TODO
     */
    update(deltaTime, frame) {}

    // called when a new entity is added to the scene
    /**
     *
     * @param {MREntity} entity - TODO
     */
    onNewEntity(entity) {}

    // called when the component is initialized
    /**
     *
     * @param {MREntity} entity - TODO
     */
    attachedComponent(entity) {
        //console.log(`attached ${this.componentName} ${entity.dataset[this.componentName]}`);
    }

    /**
     *
     * @param {MREntity} entity - TODO
     * @param {object} oldData - TODO
     */
    updatedComponent(entity, oldData) {
        //console.log(`updated ${this.componentName} ${entity.dataset[this.componentName]}`);
    }

    // called when the component is removed
    /**
     *
     * @param {MREntity} entity - TODO
     */
    detachedComponent(entity) {
        console.log(`detached ${this.componentName}`);
    }

    onAttach = (event) => {
        this.registry.add(event.target);
        this.attachedComponent(event.target);
    };

    onUpdate = (event) => {
        this.updatedComponent(event.target, event.detail.oldData);
    };

    onDetatch = (event) => {
        this.registry.delete(event.target);
        this.detachedComponent(event.target);
    };
}
