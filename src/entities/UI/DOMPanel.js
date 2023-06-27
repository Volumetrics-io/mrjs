import Panel from '../../core/Panel.js'
import HTMLTexture from '../../textures/HTMLTexture.js'

class DOMPanel extends Panel {
  constructor() {
    super()

    this.html = document.createElement('div')
  }

  connected() {
    this.createTexture()
  }

  createTexture() {
    if (!this.html) {
      return
    }
    const width = this.width * 256
    const height = this.height * 256
    const texture = new HTMLTexture(this, width, height)

    this.setAttribute(
      'style',
      `width: ${width}px;
                                    height: ${height}px;
                                    padding: 10px;
                                    display: flex;
                                    align-items: stretch;
									background-color: ${this.color ? this.color : '#fff'}`
    )

    if (this.object3D.material) {
      this.object3D.material.map = texture
    } else {
      this.object3D.material = new MeshBasicMaterial({
        map: texture,
        toneMapped: false,
        transparent: true,
      })
    }
  }
}

customElements.get('mr-dom-panel') ||
  customElements.define('mr-dom-panel', DOMPanel)
