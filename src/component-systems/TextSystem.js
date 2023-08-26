import { Text } from 'troika-three-text'
import System from '../core/System'
import { parseAttributeString } from '../utils/parser'
import { MRInput } from '../UI/MRInput'

export class TextSystem extends System {
  constructor() {
    super()
    this.app.addEventListener('has-text', event => {
      const { entity } = event.detail
      this.registry.add(entity)
      this.addText(entity)
    })

    const entities = this.app.querySelectorAll('*')

    for (const entity of entities) {
      if (entity instanceof MRInput) {
        this.registry.add(entity)
        this.addText(entity)
      }
    }
  }

  update(deltaTime) {
    for( const entity of this.registry) {
      let text = entity.textContent.trim()
      if (entity.textObj.text != text) {
        entity.textObj.text = text.length > 0 ? text : ' '
        entity.textObj.sync()
      }

      this.updateStyle(entity)
    }
  }

  updateStyle = (entity) => {
    const style = parseAttributeString(entity.getAttribute('text-style')) ?? {}

    let width = entity.width == 'auto' ? 1 : entity.width
    width = width ?? 1
    let height = entity.height == 'auto' ? 1 : entity.height
    height = height ?? 1

    style.width = width
    style.maxWidth = style.maxWidth ?? width ?? 1
    const radius = entity.radius ?? 0
    style.maxWidth -= radius * 2

    height -= radius
    entity.textObj.position.setY(height / 2)

    style.clipRect = [-style.maxWidth / 2, -height, style.maxWidth / 2, 0]
    this.setStyle(entity.textObj, style)
    entity.textObj.sync()
  }

  addText = (entity) => {
    if (!entity.textObj) { 
      entity.textObj = new Text()
      entity.object3D.add(entity.textObj)
    }

    let text = entity.textContent.trim()
    entity.textObj.text = text.length > 0 ? text : ' '

    this.updateStyle(entity)
  }

  setStyle = (textObj, style) => {
    textObj.anchorX = style.horizontal ?? 'center'
    textObj.anchorY = style.vertical ?? 'top'
    textObj.material.color.setStyle(style.color ?? '#000')
    if (style.size == 'fit') {
      textObj.fontSize = style.width * 0.025
    } else {
      textObj.fontSize = style.size ?? 0.025
    }
    textObj.font = style.font ?? textObj.font
    textObj.textAlign = style.textAlign ?? textObj.textAlign
    textObj.whiteSpace = style.whiteSpace ?? textObj.whiteSpace
    textObj.maxWidth = style.maxWidth
    textObj.clipRect = style.clipRect

    textObj.material.opacity = style.opacity ?? 1

    textObj.position.z = 0.0001
  }
}
