import { Environment } from "./Environment.js"
import { Entity } from "./Entity.js"

export class MRSystemElement extends HTMLElement {
    constructor() {
		super()
		this.environment = null
        // Need a way to register and deregister systems per environment
		this.registry = new Set()
    }

	register(entity) {
		this.registry.add(entity)
		this.attached(entity)
	}

	unregister(entity) {
		this.registry.delete(entity)
		this.attached(entity)
	}

    // Called per frame
	update (entity) {
		console.log(`update ${entity}`);
	}

	// called when the component is initialized
	attached (entity) {
		console.log(`attached ${entity}`);
	}

	// called when the component is removed
	detached (entity) {
		console.log(`detached ${entity}`);
	}

	connectedCallback() {
		if (!(this.parentElement instanceof Environment)) { return }

		this.environment = this.parentElement
		this.environment.registerSystem(this)

		console.log(`component: [comp-${this.nodeName.split('-')[1].toLowerCase()}]`);

		let entities = document.querySelectorAll(`[comp-${this.nodeName.split('-')[1].toLowerCase()}]`)
		for(const entity of entities) {
			console.log(entity);
			if (!(entity instanceof Entity)) { return }
			this.register(entity)
		}

		console.log(this.registry);
	}

	disconnectedCallback() {
		console.log('disconnected system');
		this.environment.unregisterSystem(this)
	}
}