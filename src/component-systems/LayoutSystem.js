import System from "../core/System";
import { Surface } from "../entities/Surface";

export class LayoutSystem extends System {
    constructor(){
        super()

        this.app.addEventListener('container-mutated', this.updateLayout)
    }

    updateLayout = (event) => {
        this.adjustContainerSize(event.target)
    }

    adjustContainerSize = (container) => {

        if(container.parentElement instanceof Surface && this.app.inXRSession) {
          container.height = container.parentElement.height
          container.width = container.parentElement.width * container.parentElement.aspectRatio
        } else {
          container.absoluteHeight = container.height * this.app.viewPortHieght
          container.absoluteWidth = container.width * this.app.viewPortWidth
        }

        console.log(window.innerWidth);
    }
}