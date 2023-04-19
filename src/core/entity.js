import * as THREE from 'three';
import { MRElement } from './MRElement.js'

export class Entity extends MRElement {

    constructor() {
      super();

      Object.defineProperty(this, "isEnvironment", { value: false, writable: false })

      this.object3D = new THREE.Object3D()
      this.components = new Set()

      this.componentMutated = this.componentMutated.bind(this)

    }

    connectedCallback() {
        if (!this.parentElement.tagName.toLowerCase().includes('mr-')) { return }
        this.parentElement.add(this)

        if (this.parentElement.isEnvironment) {
            this.environment = this.parentElement
        } else {
            this.environment = this.parentElement.environment
        }

        this.observer = new MutationObserver(this.mutationCallback)
        this.observer.observe(this, { attributes: true });

        for (const attr of this.attributes) {
            if (!attr.name.includes('comp-')) { continue }
            this.components.add(attr.name)
        }
    }

    disconnectedCallback() {
        if (!this.parentElement.tagName.toLowerCase().includes('mr-')) { return }
        this.parentElement.remove(this)

        this.environment = null
        this.observer.disconnect()
    }

    mutationCallback = (mutationList, observer) => {
        for (const mutation of mutationList) { 
            if (mutation.type === "attributes") { 
                this.componentMutated(mutation.attributeName)
            }
        }
    }

    componentMutated(componentName) {
        let component = this.attributes.getNamedItem(componentName)
        if (!component) {
            this.components.delete(componentName)
            this.dispatchEvent(new CustomEvent(`${componentName}-detached`, { bubbles: true, detail: this }))

        } else if (!this.components.has(componentName)) {
            this.components.add(componentName)
            this.dispatchEvent(new CustomEvent(`${componentName}-attached`, { bubbles: true, detail: this }))
        } else {
            this.dispatchEvent(new CustomEvent(`${componentName}-updated`, { bubbles: true, detail: this }))
        }
    }

    add(entity){
        this.object3D.add(entity.object3D)
    }

    remove(entity){
        this.object3D.remove(entity.object3D)
    }

}

customElements.define('mr-entity', Entity);