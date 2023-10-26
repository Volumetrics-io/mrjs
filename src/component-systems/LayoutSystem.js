import System from "../core/System";
import { Entity } from "../core/entity";
import { Surface } from "../entities/Surface";
import { Column } from "../entities/layout/Column";
import { Container } from "../entities/layout/Container";
import { Row } from "../entities/layout/Row";

export class LayoutSystem extends System {
    constructor(){
        super()

        this.app.addEventListener('container-mutated', this.updateLayout)
    }

    updateLayout = (event) => {
        this.adjustContainerSize(event.target)
        //this.adjustContent(event.target, event.target.absoluteWidth, event.target.absoluteHeight)
    }

    adjustContainerSize = (container) => {

        if(container.parentElement instanceof Surface && this.app.inXRSession) {
          container.height = container.parentElement.height
          container.width = container.parentElement.width * container.parentElement.aspectRatio
        } else {
          container.height = this.app.viewPortHieght
          container.width = this.app.viewPortWidth
        }
        

    }

    adjustContent = (entity, width, height) => {

        /// Set Z-index
        //entity.object3D.position.z += entity.zOffeset

        const children = Array.from(entity.children)
        for (const child of children) {
            entity.height = height
            entity.width = width
        }
    }
}