export class BodyOffset {

    constructor(callback) {
        this.callback = callback
    }

    #top = 0
    set top(value){
        this.#top = value
        this.callback()
    }
    get top() {
        return this.#top
    }

    #right = 0
    set right(value){
        this.#right = value
        this.callback()
    }
    get right() {
        return this.#right
    }

    #bottom = 0
    set bottom(value){
        this.#bottom = value
        this.callback()
    }
    get bottom() {
        return this.#bottom
    }

    #left = 0
    set left(value){
        this.#left = value
        this.callback()
    }
    get left() {
        return this.#left
    }

    set vertical(value){
        this.#top = value
        this.#bottom = value
        this.callback()
    }

    get vertical(){
        return this.#top + this.#bottom
    }
    
    set horizontal(value){
        this.#right = value
        this.#left = value
        this.callback()
    }

    get horizontal(){
        return this.#right + this.#left
    }

    set all(value) {
        this.#top = value
        this.#right = value
        this.#bottom = value
        this.#left = value
        this.callback()
    }

    setFromVector(vector) {
        switch (vector.length) {
            case 1:
                this.#top = vector[0]
                this.#right = vector[0]
                this.#bottom = vector[0]
                this.#left = vector[0]
                break;
            case 2:
                this.#top = vector[0]
                this.#right = vector[1]
                this.#bottom = vector[0]
                this.#left = vector[1]
                break;
            case 3:
                this.#top = vector[0]
                this.#right = vector[1]
                this.#left = vector[1]
                this.#bottom = vector[2]
                break;
            case 4:
                this.#top = vector[0]
                this.#right = vector[1]
                this.#bottom = vector[2]
                this.#left = vector[3]
                break;
            default:
                break;
        }

        this.callback
    }

}