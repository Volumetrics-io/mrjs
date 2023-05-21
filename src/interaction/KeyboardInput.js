// `element.focus()` freezes the animations loop (A truly insane bug)
// Until that's fixed (if ever), we've implemented our own keyboard handler to be used with keydown events.
//
// But it's also an opportunity to eventually add support for keybindings?

// TODOs
//
// - Insertion
// - deletion
// - enter
// - tab
// - arrow keys
//   - left & right
//   - up & down


export default class KeyboardInput {

    constructor(element) {
        this.element = element
        this.rawText = element.textContent
        this.meta = false
        this.currentIndex = 0
    }

    setFocus(element){
        if (this.element == element) { return }
        this.element = element
        this.currentIndex = this.element.textContent.length
        this.setCursorPosition(this.currentIndex, this.currentIndex)

    }

    handleInput(keyEvent) {
        switch (keyEvent.key) {
            case 'Meta':
                this.meta ^= true
                break;

            case 'Control':
                
                break;
            case 'Alt':
                
                break;

            case 'Shift':
                break;

            case 'Enter':
                if(keyEvent.type == 'keyup') { return }
                this.spliceSplit(this.currentIndex, 0, '\n')
                this.currentIndex += 1
                break;
            
            case 'Backspace':
                if(keyEvent.type == 'keyup') { return }
                if ( this.currentIndex == 0) { return }
                this.spliceSplit(this.currentIndex - 1, 1, '')
                this.currentIndex -= 1
                break;

            case 'Tab':
                if(keyEvent.type == 'keyup') { return }
                this.element.textContent += '\t'
                break;
            
            case 'ArrowLeft':
                if ( this.currentIndex == 0) { return }
                if(keyEvent.type == 'keyup') { return }
                this.setCursorPosition(this.currentIndex, this.currentIndex - 1)
                break;
        
            case 'ArrowRight':
                if ( this.currentIndex == this.element.textContent.length) { return }
                if(keyEvent.type == 'keyup') { return }
                this.setCursorPosition(this.currentIndex, this.currentIndex + 1)
                break;
            case 'ArrowUp':
                if ( this.currentIndex == 0) { return }
                if(keyEvent.type == 'keyup') { return }

                let oneLineBack = this.element.textContent.lastIndexOf('\n', this.currentIndex - 1)
                let twoLinesBack = this.element.textContent.lastIndexOf('\n', this.oneLineBack - 1)
                let newUpIndex = (this.currentIndex - oneLineBack) + twoLinesBack

                newUpIndex = newUpIndex < oneLineBack ? newUpIndex : oneLineBack

                this.setCursorPosition(this.currentIndex, newUpIndex)
                break;
            case 'ArrowDown':
                if (this.currentIndex == this.element.textContent.length) { return }
                if(keyEvent.type == 'keyup') { return }
                let prevLine = this.element.textContent.lastIndexOf('\n', this.currentIndex - 1)
                let nextLine = this.element.textContent.indexOf('\n', this.currentIndex + 1)
                let lineAfter = this.element.textContent.indexOf('\n', nextLine + 1)
                let newDownIndex = (this.currentIndex - prevLine) + nextLine

                newDownIndex = newDownIndex < lineAfter ? newDownIndex : lineAfter
                newDownIndex = newDownIndex < this.element.textContent.length - 1 ? newDownIndex : this.element.textContent.length - 1
                newDownIndex = newDownIndex > 0 ? newDownIndex : this.element.textContent.length - 1
                
                this.setCursorPosition(this.currentIndex, newDownIndex)
                break;
            default:
                if(keyEvent.type == 'keyup') { return }
                this.spliceSplit(this.currentIndex, 0, keyEvent.key)
                this.currentIndex += 1

                break;
        }
        console.log(this.currentIndex);
        console.log(this.element.textContent);
    }

    setCursorPosition(oldIndex, newIndex){
        console.log(`old: ${oldIndex} new: ${newIndex}`);
        if (oldIndex == newIndex){ return }
        if (newIndex < 0){ return }
        this.spliceSplit(oldIndex, 1, '')
        this.spliceSplit(newIndex, 0, '|')
        this.currentIndex = newIndex

    }

    spliceSplit(index, count, add) {
        var ar = this.element.textContent.split('');
        ar.splice(index, count, add);
        this.element.textContent = ar.join('');
      }

}

