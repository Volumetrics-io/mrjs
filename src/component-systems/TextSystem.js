import {preloadFont} from 'troika-three-text'
import System from '../core/System'
import { parseAttributeString } from '../utils/parser'

export class TextSystem extends System {
  constructor() {
    super()

    this.styles = {}
    const fonts = this.app.querySelectorAll('mr-font')

    if (fonts.length > 0) {
      for (const font of fonts){
        preloadFont(
          {
            font: font.src 
          },
          () => {
            let targets = this.app.querySelectorAll(font.targets)
            for (const target of targets) {
              target.textStyle = {
                font: font.src,
                size: font.size
              }
              this.updateStyle(target)
            }
          }
        )
      }
    }

    

    const entities = this.app.querySelectorAll('mr-text, mr-textfield, mr-texteditor')
    for (const entity of entities) {
      this.registry.add(entity)
      this.addText(entity)
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

  initStyle(entity){
    let style = {}
    style = this.styles[entity.tagName]

    for(const elClass of entity.classList){
      style = this.styles[entity.elClass] ?? style
    }

    style = this.styles[entity.id] ?? style
    style = parseAttributeString(entity.getAttribute('text-style')) ?? style
    entity.textStyle = style ?? {}

    this.updateStyle(entity)

  }

  updateStyle = (entity) => {
    if (!entity.textStyle) {
      this.initStyle(entity)
    }

    
    entity.textStyle.width = entity.absoluteWidth
    entity.textStyle.maxWidth = entity.absoluteWidth

    let height = entity.absoluteHeight
    entity.textObj.position.setY(height / 2)

    entity.textStyle.clipRect = [-entity.textStyle.maxWidth / 2, -height, entity.textStyle.maxWidth / 2, 0]
    this.setStyle(entity.textObj, entity.textStyle)
    entity.textObj.sync()
  }

  addText = (entity) => {

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
