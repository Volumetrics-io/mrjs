import * as THREE from 'three'
import { MRSystemElement } from '../core/MRSystemElement.js'

class TestSystem extends MRSystemElement {
  constructor() {
    super()
  }

  update(entity) {
    console.log(`message: ${entity.getAttribute(this.componentName)}`)
  }
}

customElements.get('mr-test-system') ||
  customElements.define('mr-test-system', TestSystem)
