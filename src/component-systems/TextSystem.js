import {preloadFont} from 'troika-three-text'
import System from '../core/System'


export class TextSystem extends System {
  constructor() {
    super(false, 1 / 30)

    this.preloadedFonts = {}

    this.styles = {}
    const styleSheets = Array.from(document.styleSheets);

    styleSheets.forEach(styleSheet => {
      const cssRules = Array.from(styleSheet.cssRules)
      // all the font-faces rules
      const rulesFontFace = cssRules.filter(rule => rule.cssText.startsWith('@font-face'));

      rulesFontFace.forEach(fontFace => {
          let fontData = this.parseFontFace(fontFace.cssText)

          preloadFont(
            {
              font: fontData.src
            },
            () => {
              this.preloadedFonts[fontFace.style.fontFamily] = fontData.src
            }
          )

      });
    });

    

    const entities = this.app.querySelectorAll('mr-text, mr-textfield, mr-texteditor')
    for (const entity of entities) {
      this.registry.add(entity)
      this.addText(entity)
      entity.textObj.sync(() => {
              entity.textObj.position.setY(entity.height / 2)
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

      if (entity.needsUpdate) {
        this.updateStyle(entity)
        entity.needsUpdate = false
        entity.textObj.sync(() => {
              entity.textObj.position.setY(entity.height / 2)
        })
      }

    }
  }

  updateStyle = (entity) => {

    let textObj = entity.textObj

    textObj.font = this.preloadedFonts[entity.compStyle.fontFamily] ?? textObj.font
    textObj.fontSize = this.parseFontSize(entity.compStyle.fontSize, entity)
    textObj.fontWeight = this.parseFontWeight(entity.compStyle.fontWeight)
    textObj.fontStyle = entity.compStyle.fontStyle

    textObj.anchorX = 'center'
    textObj.anchorY = this.getVerticalAlign(entity.compStyle.verticalAlign, entity)

    textObj.textAlign = this.setTextAlign(entity.compStyle.textAlign)
    textObj.lineHeight = this.getLineHeight(entity.compStyle.lineHeight, entity)

    textObj.material.opacity = entity.compStyle.opacity ?? 1

    this.setColor(textObj, entity.compStyle.color)

    
    textObj.whiteSpace = entity.compStyle.whiteSpace ?? textObj.whiteSpace
    textObj.maxWidth = entity.width

    textObj.position.z = 0.0001

  }

  addText = (entity) => {

    let text = entity.textContent.trim()
    entity.textObj.text = text.length > 0 ? text : ' '

    this.updateStyle(entity)
  }

  parseFontWeight(weight) {
    if(weight >= 500) {
      return "bold"
    }

    return "normal"
  }

  getVerticalAlign(verticalAlign, entity) {
    let result = this.parseFontSize(verticalAlign, entity)

    if(typeof result == 'number') {
      result = result / this.parseFontSize(entity.compStyle.fontSize, entity)
    }

    switch (result) {
      case 'baseline':
      case 'sub':
      case 'super':
        return 0
      case 'text-top':
        return 'top-cap'
      case 'text-bottom':
        return 'bottom'
      default:
        return result
    }
  }

  getLineHeight(lineHeight, entity) {
    let result = this.parseFontSize(lineHeight, entity)

    if(typeof result == 'number') {
      result = result / this.parseFontSize(entity.compStyle.fontSize, entity)
    }

    return result
  }

  setTextAlign(textAlign) {
    switch (textAlign) {
      case 'start':
      case 'left':
        return 'left'
      case 'end':
      case 'right':
        return 'right'
      default:
        return textAlign
    }
  }

  setColor(textObj, color) {
    if (color.includes('rgba')) {
      let rgba = color.substring(5, color.length - 1).split(',').map(part => parseFloat(part.trim()));
      textObj.material.color.setStyle(`rgb(${rgba[0]}, ${rgba[1]}, ${rgba[2]})`)

      textObj.material.opacity = rgba[3]

    } else {
      textObj.material.color.setStyle(color ?? '#000')

    }
  }

  parseFontSize(val, el) {
    if(!val) { 
      return 0.025
    }
    if (typeof val == 'string') {
      let valuepair = val.split(/(\d+(?:\.\d+)?)/).filter(Boolean);
      if(valuepair.length > 1){
        switch(valuepair[1]){
          case 'px':
            return parseFloat(val.split('px')[0]) / MRJS.VIRTUAL_DISPLAY_RESOLUTION
          case 'pt':
            return parseFloat(val.split('pt')[0]) / MRJS.VIRTUAL_DISPLAY_RESOLUTION * 1.75
          case 'pc':
            return parseFloat(val.split('pc')[0]) / MRJS.VIRTUAL_DISPLAY_RESOLUTION * 21
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

  parseFontFace(cssString) {
    const obj = {};
    const match = cssString.match(/@font-face\s*{\s*([^}]*)\s*}/);
  
    if (match) {
      const fontFaceAttributes = match[1];
      const attributes = fontFaceAttributes.split(';');
      
      attributes.forEach(attribute => {
        const [key, value] = attribute.split(':').map(item => item.trim());
        if (key === 'src') {
          const urlMatch = value.match(/url\("([^"]+)"\)/);
          if (urlMatch) {
            obj[key] = urlMatch[1];
          }
        } else {
          obj[key] = value;
        }
      });
    }
  
    return obj;
  }

}
