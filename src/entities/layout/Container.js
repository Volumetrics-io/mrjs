class Container extends Entity {
  constructor() {
    super()
  }

  connected() {}
}

customElements.get('mr-container') ||
  customElements.define('mr-container', Container)
