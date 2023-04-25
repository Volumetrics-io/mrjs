import { Environment } from "./environment.js"
import { Entity } from "./entity.js"

export class MRSystemElement extends HTMLElement {
    constructor() {
		super()
		this.environment = null
        // Need a way to register and deregister systems per environment
		this.registry = new Set()

		this.componentName = `comp-${this.nodeName.split('-')[1].toLowerCase()}`

		this.onAttach = this.onAttach.bind(this)
		this.onUpdate = this.onUpdate.bind(this)
		this.onDetatch = this.onDetatch.bind(this)
    }

    // Called per frame
	update (entity) {
		console.log(`update ${entity}`);
	}

	// called when the component is initialized
	attachedComponent (entity) {
		console.log(`attached ${this.componentName} ${entity.getAttribute(this.componentName)}`);
	}

	updatedComponent (entity) {
		console.log(`updated ${this.componentName} ${entity.getAttribute(this.componentName)}`);
	}

	// called when the component is removed
	detachedComponent (entity) {
		console.log(`detached ${this.componentName}`);
	}

	onAttach(event) {
		this.registry.add(event.detail)
		this.attachedComponent(event.detail)
	}

	onUpdate(event) {
		this.updatedComponent(event.detail)
	}

	onDetatch(event) {
		this.registry.delete(event.detail)
		this.detachedComponent(event.detail)
	}

	connectedCallback() {
		if (!(this.parentElement instanceof Environment)) { return }

		this.environment = this.parentElement
		this.environment.registerSystem(this)

		this.environment.addEventListener(`${this.componentName}-attached`, this.onAttach)
		this.environment.addEventListener(`${this.componentName}-updated`, this.onUpdate)
		this.environment.addEventListener(`${this.componentName}-detached`, this.onDetatch)

		let entities = document.querySelectorAll(`[${this.componentName}]`)
		for(const entity of entities) {
			if (!(entity instanceof Entity)) { return }
			this.registry.add(entity)
		}
	}

	disconnectedCallback() {
		console.log('disconnected system');
		this.environment.unregisterSystem(this)

		this.environment.removeEventListener(`${this.componentName}-attached`)
		this.environment.removeEventListener(`${this.componentName}-updated`)
		this.environment.removeEventListener(`${this.componentName}-detached`)
	}
}