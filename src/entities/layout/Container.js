import { Entity } from "../../core/entity";

export class Container extends Entity {
  constructor() {
    super()
    this.width = 1
    this.height = 1

  }

  connected(){
    document.addEventListener('DOMContentLoaded', (event) => {
      this.dispatchEvent( new CustomEvent('container-mutated', { bubbles: true }))
      })
      setTimeout(() => {
        this.dispatchEvent( new CustomEvent('container-mutated', { bubbles: true }))
      }, 0);
  }
}

customElements.get('mr-container') ||
  customElements.define('mr-container', Container)
