import { Entity } from "../../core/entity";

export class Container extends Entity {
  constructor() {
    super()
  }

  connected(){
    document.addEventListener('DOMContentLoaded', (event) => {
      this.dispatchEvent( new CustomEvent('container-mutated', { bubbles: true }))
    })

    window.addEventListener('resize', (event) => {
      this.dispatchEvent( new CustomEvent('container-mutated', { bubbles: true }))
    })

    this.parentElement.addEventListener('surface-placed', (event) => {
      this.dispatchEvent( new CustomEvent('container-mutated', { bubbles: true }))
    })

    this.parentElement.addEventListener('surface-removed', (event) => {
      this.dispatchEvent( new CustomEvent('container-mutated', { bubbles: true }))
    })
  }
}

customElements.get('mr-container') ||
  customElements.define('mr-container', Container)
