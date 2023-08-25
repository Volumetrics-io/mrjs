import { MRInput } from '../UI/MRInput';
import System from '../core/System'

export class TextInputSystem extends System {
  constructor() {
    super()
    this.focus = null
    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('keyup', this.onKeyUp);

    const entities = this.app.querySelectorAll('*')

    this.counter = 0

    this.syncPeriod = 5

    for (const entity of entities) {
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

      // THIS IS THE WRONG WAY TO DO THIS, we need to resolve differences some how (no-code edits and code edits)
      this.counter += deltaTime
      if(this.focus?.newSrc || this.counter >= this.syncPeriod) {
        this.syncText()
        this.focus.newSrc = false
        this.counter = 0
      }

    }
  }


  syncText() {
    if (this.edited) { return }
    if (this.focus.srcElement) {
      this.focus.textContent = this.focus.srcElement.innerHTML 
    }

    // TODO: load from file
    
  }

  saveUpdate(){
    if(this.focus) {
      console.log('saved');
      this.spliceSplit(this.currentIndex, 1, '')
      this.focus.srcElement.innerHTML = this.focus.textContent
      this.spliceSplit(this.currentIndex, 0, '|')
      this.counter = 0
      this.edited = false
    }
  }

  // NOT USED YET
  updateSourceText(src, text) {

    // TODO: update file
  }

  handleMetaKeys = (key) => {
    switch (key) {
      case 's':
        console.log('saving');
        this.saveUpdate()
        break;
    
      default:
        break;
    }
  }

  onKeyUp = (event) => {
    let key = event.key;
    switch (key) {
      case 'Control':
        this.meta = false
        break

      default:
        break
    }
  }
  

  onKeyDown = (event) => {
    this.counter = 0
    this.edited = true

    if (this.focus == null) { return }
    event.stopPropagation()


    let key = event.key;

    if (this.meta) {
      this.handleMetaKeys(key)
      return
    }

    console.log(key);

    switch (true) {
        case key == 'Control':
          this.meta = true
          break
        case key == 'Enter':
          this.spliceSplit(this.currentIndex, 0, '\n')
          this.currentIndex += 1
          break
  
        case key == 'Backspace':
          if (this.currentIndex == 0) {
            return
          }
          this.spliceSplit(this.currentIndex - 1, 1, '')
          this.currentIndex -= 1
          break
  
        case key == 'Tab':
          this.focus.textContent += '\t'
          break
  
        case key == 'ArrowLeft':
          if (this.currentIndex == 0) {
            return
          }
          this.setCursorPosition(this.currentIndex, this.currentIndex - 1)
          break
  
        case key == 'ArrowRight':
          if (this.currentIndex == this.focus.textContent.length) {
            return
          }
          this.setCursorPosition(this.currentIndex, this.currentIndex + 1)
          break
        case key == 'ArrowUp':
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
        case key == 'ArrowDown':
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
        case key.length == 1:
          this.spliceSplit(this.currentIndex, 0, key)
          this.currentIndex += 1
  
          break

        default:
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