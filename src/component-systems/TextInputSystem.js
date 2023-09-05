import { MRText } from '../UI/Text/Text';
import { TextEditor } from '../UI/Text/TextEditor';
import System from '../core/System'

export class TextInputSystem extends System {
  constructor() {
    super()
    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('keyup', this.onKeyUp);

    const entities = this.app.querySelectorAll('mr-textfield, mr-texteditor')

    this.counter = 0

    this.syncPeriod = 5

    for (const entity of entities) {
      this.registry.add(entity)
      this.loadSrcText(entity)
    }
  }

  update(deltaTime){
    // for (const entity of this.registry) {
    //   if (!entity.edited || !this.app.focusEntity == entity) {
    //     this.loadSrcText(entity)
    //   }

    // }
  }


  loadSrcText(entity) {
    if (entity?.srcElement) {
      entity.textContent = entity.srcElement.innerHTML 
    }
    // TODO: load from file
  }



  saveUpdate(){
    if(this.app.focusEntity instanceof TextEditor) {
      console.log('saved');
      this.spliceSplit(this.currentIndex, 1, '')
      this.app.focusEntity.srcElement.innerHTML = this.app.focusEntity.textContent
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


    if (this.app.focusEntity == null || !this.app.focusEntity instanceof MRText) { return }
    if (!this.app.focusEntity.editable) { return }
    event.stopPropagation()


    let key = event.key;

    if (this.meta) {
      this.handleMetaKeys(key)
      return
    }

    switch (true) {
        case key == 'Control':
          this.meta = true
          break
        case key == 'Meta':
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
          this.app.focusEntity.textContent += '\t'
          break
  
        case key == 'ArrowLeft':
          if (this.currentIndex == 0) {
            return
          }
          this.setCursorPosition(this.currentIndex, this.currentIndex - 1)
          break
  
        case key == 'ArrowRight':
          if (this.currentIndex == this.app.focusEntity.textContent.length) {
            return
          }
          this.setCursorPosition(this.currentIndex, this.currentIndex + 1)
          break
        case key == 'ArrowUp':
          if (this.currentIndex == 0) {
            return
          }
  
          const oneLineBack = this.app.focusEntity.textContent.lastIndexOf(
            '\n',
            this.currentIndex - 1
          )
          const twoLinesBack = this.app.focusEntity.textContent.lastIndexOf(
            '\n',
            this.oneLineBack - 1
          )
          let newUpIndex = this.currentIndex - oneLineBack + twoLinesBack
  
          newUpIndex = newUpIndex < oneLineBack ? newUpIndex : oneLineBack
  
          this.setCursorPosition(this.currentIndex, newUpIndex)
          break
        case key == 'ArrowDown':
          if (this.currentIndex == this.app.focusEntity.textContent.length) {
            return
          }
          const prevLine = this.app.focusEntity.textContent.lastIndexOf(
            '\n',
            this.currentIndex - 1
          )
          const nextLine = this.app.focusEntity.textContent.indexOf(
            '\n',
            this.currentIndex + 1
          )
          const lineAfter = this.app.focusEntity.textContent.indexOf('\n', nextLine + 1)
          let newDownIndex = this.currentIndex - prevLine + nextLine
  
          newDownIndex = newDownIndex < lineAfter ? newDownIndex : lineAfter
          newDownIndex =
            newDownIndex < this.app.focusEntity.textContent.length - 1
              ? newDownIndex
              : this.app.focusEntity.textContent.length - 1
          newDownIndex =
            newDownIndex > 0 ? newDownIndex : this.app.focusEntity.textContent.length - 1
  
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
    const ar = this.app.focusEntity.textContent.split('')
    ar.splice(index, count, add)
    this.app.focusEntity.textContent = ar.join('')
  }

}