import { MRInput } from '../UI/MRInput';
import { System } from '../core/System'

export class TextInputSystem extends System {
  constructor() {
    super()
    this.focus = null
    document.addEventListener('keydown', this.captureText, true,);

    const entities = this.app.querySelectorAll('*')

    for (const entity of entities) {
      console.log(entity);
      if (entity instanceof MRInput) {
        this.registry.add(entity)
      }
    }
  }

  update(deltaTime){
    for (const entity of this.registry) {
      if (entity.focused && this.focus != entity) {
        if(this.focus) { this.focus.focused = false }
        this.focus = entity
      } else if(!this.focus.focused) {
        this.focus = null
      }
    }
  }

  

  captureText = (event) => {
    console.log(event);

    if (this.focus == null) { return }
    event.stopPropagation()


    let key = event.key;

    console.log(key);

    switch (key) {
        case 'Meta':
          this.meta ^= true
          break
  
        case 'Control':
          break
        case 'Alt':
          break
  
        case 'Shift':
          break
  
        case 'Enter':
          this.spliceSplit(this.currentIndex, 0, '\n')
          this.currentIndex += 1
          break
  
        case 'Backspace':
          if (this.currentIndex == 0) {
            return
          }
          this.spliceSplit(this.currentIndex - 1, 1, '')
          this.currentIndex -= 1
          break
  
        case 'Tab':
          this.focus.textContent += '\t'
          break
  
        case 'ArrowLeft':
          if (this.currentIndex == 0) {
            return
          }
          this.setCursorPosition(this.currentIndex, this.currentIndex - 1)
          break
  
        case 'ArrowRight':
          if (this.currentIndex == this.focus.textContent.length) {
            return
          }
          this.setCursorPosition(this.currentIndex, this.currentIndex + 1)
          break
        case 'ArrowUp':
          if (this.currentIndex == 0) {
            return
          }
  
          const oneLineBack = this.focus.textContent.lastIndexOf(
            '\n',
            this.currentIndex - 1
          )
          const twoLinesBack = this.focus.textContent.lastIndexOf(
            '\n',
            this.oneLineBack - 1
          )
          let newUpIndex = this.currentIndex - oneLineBack + twoLinesBack
  
          newUpIndex = newUpIndex < oneLineBack ? newUpIndex : oneLineBack
  
          this.setCursorPosition(this.currentIndex, newUpIndex)
          break
        case 'ArrowDown':
          if (this.currentIndex == this.focus.textContent.length) {
            return
          }
          const prevLine = this.focus.textContent.lastIndexOf(
            '\n',
            this.currentIndex - 1
          )
          const nextLine = this.focus.textContent.indexOf(
            '\n',
            this.currentIndex + 1
          )
          const lineAfter = this.focus.textContent.indexOf('\n', nextLine + 1)
          let newDownIndex = this.currentIndex - prevLine + nextLine
  
          newDownIndex = newDownIndex < lineAfter ? newDownIndex : lineAfter
          newDownIndex =
            newDownIndex < this.focus.textContent.length - 1
              ? newDownIndex
              : this.focus.textContent.length - 1
          newDownIndex =
            newDownIndex > 0 ? newDownIndex : this.focus.textContent.length - 1
  
          this.setCursorPosition(this.currentIndex, newDownIndex)
          break
        default:
          this.spliceSplit(this.currentIndex, 0, key)
          this.currentIndex += 1
  
          break
      }
  }

  setCursorPosition(oldIndex, newIndex) {
    if (oldIndex == newIndex) {
      return
    }
    if (newIndex < 0) {
      return
    }
    this.spliceSplit(oldIndex, 1, '')
    this.spliceSplit(newIndex, 0, '|')
    this.currentIndex = newIndex
  }

  spliceSplit(index, count, add) {
    const ar = this.focus.textContent.split('')
    ar.splice(index, count, add)
    this.focus.textContent = ar.join('')
  }

}