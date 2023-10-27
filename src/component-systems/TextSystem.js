import {preloadFont} from 'troika-three-text'
import System from '../core/System'
import { parseAttributeString } from '../utils/parser'

const VIRTUAL_DISPLAY_RESOLUTION = 1080

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
      entity.textObj.sync(() => {
              entity.dispatchEvent( new CustomEvent('child-resized', { bubbles: true }))
        })
    }
  }

  update(deltaTime, frame) {
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

  }

  updateStyle = (entity) => {
    if (!entity.textStyle) {
      this.initStyle(entity)
    }

    entity.textStyle.width = entity.width * entity.parentElement?.offsetWidth - entity.padding.horizontal
    entity.textStyle.maxWidth = entity.textStyle.width
    entity.absoluteWidth = entity.textStyle.maxWidth

    entity.textObj.position.setY(entity.offsetHeight / 2)

    this.setStyle(entity)
  }

  addText = (entity) => {

    let text = entity.textContent.trim()
    entity.textObj.text = text.length > 0 ? text : ' '

    this.updateStyle(entity)
  }

  setStyle = (entity) => {
    let textObj =entity.textObj
    let style = entity.textStyle
    textObj.anchorX = style.horizontal ?? 'center'
    textObj.anchorY = style.vertical ?? 'top'
    textObj.material.color.setStyle(style.color ?? '#000')
    textObj.fontSize = this.parseFontSize(style.size, entity)
    textObj.font = style.font ?? textObj.font
    textObj.textAlign = style.textAlign ?? textObj.textAlign
    textObj.whiteSpace = style.whiteSpace ?? textObj.whiteSpace
    textObj.maxWidth = style.maxWidth
    textObj.clipRect = style.clipRect

    textObj.material.opacity = style.opacity ?? 1

    textObj.position.z = 0.0001
  }

  parseFontSize(val, el) {
    if(!val) { 
      return 0.025
    }
    if (typeof val == 'string') {
      let valuepair = val.split(/(\d+)/).filter(Boolean);
      if(valuepair.length > 1){
        switch(valuepair[1]){
          case 'px':
            return parseFloat(val.split('px')[0]) / VIRTUAL_DISPLAY_RESOLUTION
          case 'pt':
            return parseFloat(val.split('pt')[0]) / VIRTUAL_DISPLAY_RESOLUTION * 1.75
          case 'pc':
            return parseFloat(val.split('pc')[0]) / VIRTUAL_DISPLAY_RESOLUTION * 21
          case 'mm':
            return parseFloat(val.split('mm')[0]) / 1000
          case 'cm':
            return parseFloat(val.split('cm')[0]) / 100
          case 'in':
            return parseFloat(val.split('in')[0]) / 39.3701
          case 'vh':
            return (parseFloat(val.split('vh')[0]) / 100) * this.getVH(el)
          case 'vw':
            return (parseFloat(val.split('vw')[0]) / 100) * this.getVW(el)
          case 'vmin':
            return (parseFloat(val.split('vmin')[0]) / 100) * this.getVMin(el)
          case 'vmax':
            return (parseFloat(val.split('vmax')[0]) / 100) * this.getVMax(el)
          case '%':
            return parseFloat(val) / 100
          default:
            return val

        }
      }
    }
    return val
  }

  getEM(el) {

  }

  getREM(el) {
    
  }

  getVH(el) {
    return el.closest('mr-container').absoluteHeight
  }

  getVW(el) {
    return el.closest('mr-container').absoluteWidth
  }

  getVMax(el) {
    return Math.max(this.getVH(el), this.getVW(el))
  }

  getVMin(el) {
    return Math.min(this.getVH(el), this.getVW(el))
  }

}
