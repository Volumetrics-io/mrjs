class Container extends Entity {
  constructor() {
    super()
  }
}

customElements.get('mr-container') ||
  customElements.define('mr-container', Container)
