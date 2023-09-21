import { Entity } from "../../core/entity";

export class Container extends Entity {
  constructor() {
    super()
    this.width = 'auto'
    this.height = 'auto'

  }

  connected(){
    document.addEventListener('DOMContentLoaded', (event) => {
      this.dispatchEvent( new CustomEvent('container-mutated', { bubbles: true }))
    })

    window.addEventListener('resize', (event) => {
      this.dispatchEvent( new CustomEvent('container-mutated', { bubbles: true }))
    })
  }
}

customElements.get('mr-container') ||
  customElements.define('mr-container', Container)
