import System from "../core/System";
import { Surface } from "../entities/Surface";

export class LayoutSystem extends System {
    constructor(){
        super(false)

        document.addEventListener('DOMContentLoaded', (event) => {
          let containers = this.app.querySelectorAll('mr-container')
        console.log(containers);

        for(const container of containers) {
          console.log(container);
          this.registry.add(container)
        }
        
        console.log(this.registry);
        })
        
    }

    update(deltaTime,frame) {
      for(const entity of this.registry) {
        this.adjustContainerSize(entity)
      }
    }

    adjustContainerSize = (container) => {

        if(container.parentElement instanceof Surface && this.app.inXRSession) {
          container.absoluteHeight = container.parentElement.offsetHeight
          container.absoluteWidth = container.parentElement.offsetWidth * container.parentElement.aspectRatio
        } else {
          container.absoluteHeight = container.height * this.app.viewPortHieght
          container.absoluteWidth = container.width * this.app.viewPortWidth

          //console.log(parseFloat(container.compStyle.height) / parseFloat(window.innerHeigh));
        }

        container.dispatchEvent( new CustomEvent('container-mutated', { bubbles: true }))

    }
}