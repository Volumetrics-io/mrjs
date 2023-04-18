import * as THREE from 'three';

class Entity extends HTMLElement {

    constructor() {
      super();

      this.entity = new THREE.Group()
      this.components = []

    }

    connectedCallback() {
        if (!this.parentElement.tagName.toLowerCase().includes('mr-')) { return }
        this.parentElement.add(this.entity)
    }

    add(entity){
        this.entity.add(entity)
    }

}

customElements.define('mr-entity', Entity);