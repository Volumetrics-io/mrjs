import Panel from '../../core/Panel.js'
import HTMLTexture from '../../textures/HTMLTexture.js'
import KeyboardInput from '../../interaction/KeyboardInput.js'

export class TextEditorPanel extends Panel {
  constructor() {
    super()

    this.textAreaDiv = document.createElement('div')
    this.KeyboardInput = new KeyboardInput(this.textAreaDiv)
  }

  connected() {
    document.body.append(this.textAreaDiv)
    const srcTag = this.getAttribute('src')
    this.src = document.querySelector(`#${srcTag}`)
    this.textAreaDiv.textContent = this.src.innerHTML
    this.createTexture()

    this.addEventListener('mousedown', this.onEvent)
    this.addEventListener('mousemove', this.onEvent)
    this.addEventListener('mouseup', this.onEvent)
    this.addEventListener('click', this.onEvent)

    document.addEventListener('keydown', (event) => {
      console.log('keydown')
      event.preventDefault()
      this.KeyboardInput.handleInput(event)
      const cleanedText = this.textAreaDiv.textContent.replace('|', '')
      if (this.src.innerHTML !== cleanedText) {
        this.src.innerHTML = cleanedText
      }
    })
  }

  onEvent = (event) => {
    this.object3D.material.map.dispatchDOMEvent(event)
  }

  createTexture() {
    const width = this.width * 256
    const height = this.height * 256
    const texture = new HTMLTexture(this.textAreaDiv, width, height)

    this.textAreaDiv.setAttribute('contenteditable', true)
    this.textAreaDiv.setAttribute(
      'style',
      `width: ${width}px;
                                    height: ${height}px;
                                    padding: 10px;
                                    display: block;
                                    white-space: pre-wrap;
                                    overflow: scroll;
                                    font-family: monospace;
                                    font-size: 6pt;
                                    color: brown;
									background-color: ${this.color ? this.color : '#090909'}`
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

customElements.get('mr-texteditor') ||
  customElements.define('mr-texteditor', TextEditorPanel)
