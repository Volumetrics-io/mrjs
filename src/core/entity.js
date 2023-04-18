import * as THREE from 'three';
import { MRElement } from './MRElement.js'

class Entity extends MRElement {

    constructor() {
      super();

      Object.defineProperty(this, "isEnvironment", { value: false, writable: false })

      this.object3D = new THREE.Object3D()
      this.components = []

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
            this.components.push(attr)
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

    componentMutated(mutation) {
        console.log(mutation);

    }

    add(entity){
        this.object3D.add(entity.object3D)
    }

    remove(entity){
        this.object3D.remove(entity.object3D)
    }

}

customElements.define('mr-entity', Entity);