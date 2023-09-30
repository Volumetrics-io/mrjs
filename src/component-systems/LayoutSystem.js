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
        this.app.addEventListener('column-mutated', this.adjustColumn)
        this.app.addEventListener('row-mutated', this.adjustRow)
    }

    updateLayout = (event) => {
        this.adjustContainerSize(event.target)
        this.adjustContent(event.target, event.target.absoluteWidth, event.target.absoluteHeight)
    }

    adjustContainerSize = (container) => {

        if(container.parentElement instanceof Surface && this.app.inXRSession) {
          container.absoluteHeight = container.height * container.parentElement.height
          container.absoluteWidth = container.width * container.parentElement.width
        } else {
            console.log(this.app.user.position.distanceTo(container.object3D.position));
          container.absoluteHeight = container.height * this.app.viewPortHieght
          container.absoluteWidth = container.width * this.app.viewPortWidth
        }
        

    }

    adjustContent = (entity, width, height) => {
        
        if (entity instanceof Column) { 
            // entity.absoluteWidth = width
            this.adjustColumn(entity, height) 
        }
        else if (entity instanceof Row) { 
            entity.absoluteHeight = height
            this.adjustRow(entity, width) 
        } else if(!(entity.parentElement instanceof Column) && !(entity.parentElement instanceof Row)) {
            entity.absoluteWidth = width
            entity.absoluteHeight = height
        }

        /// Set Z-index
        entity.object3D.position.z = entity.zOffeset

        const children = Array.from(entity.children)
        for (const child of children) {
            if (!child instanceof Entity) { continue }
            let childWidth = entity.computedInternalWidth
            let childHeight = entity.computedInternalHeight
            this.adjustContent(child, childWidth, childHeight)
        }
    }

    adjustColumn = (column, height) => {
        column.getRowCount()
        let rowHeight = (height / column.rows)
        const children = Array.from(column.children)
        this.accumulatedY = 0
        for (const index in children) {
            let child = children[index]
            this.accumulatedY -= child.margin.top
            child.absoluteHeight = child.height * rowHeight
            child.object3D.position.setY( this.accumulatedY - child.absoluteHeight / 2)
            this.accumulatedY -= child.absoluteHeight 
            this.accumulatedY -= child.margin.bottom

            child.absoluteWidth = column.computedInternalWidth
        }
        column.shuttle.position.setY(-this.accumulatedY / 2)
    }

    adjustRow = (row, width) => {
        row.getColumnCount()
        let colWidth = (width / row.columns)
        const children = Array.from(row.children)
        this.accumulatedX = 0
        for (const index in children) {
            let child = children[index]
            this.accumulatedX += child.margin.left
            child.absoluteWidth = child.width * colWidth
            child.object3D.position.setX( this.accumulatedX + child.absoluteWidth / 2)
            this.accumulatedX += child.absoluteWidth
            this.accumulatedX += child.margin.right

             // fill parent
             child.absoluteHeight = row.computedInternalHeight
        }
        row.shuttle.position.setX(-this.accumulatedX / 2)
    }
}