import { System } from "../core/System";
import { Entity } from "../core/entity";
import { Column } from "../entities/layout/Column";
import { Row } from "../entities/layout/Row";

export class LayoutSystem extends System {
    constructor(){
        super()

        this.app.addEventListener('container-mutated', this.updateLayout)
        this.app.addEventListener('column-mutated', this.adjustColumn)
        this.app.addEventListener('row-mutated', this.adjustRow)
    }

    updateLayout = (event) => {
        this.adjustContent(event.target, event.target.width, event.target.height)
    }

    adjustContent = (entity, width, height) => {
        
        if (entity instanceof Column) { this.adjustColumn(entity, height) }
        else if (entity instanceof Row) { this.adjustRow(entity, width) }

        const children = Array.from(entity.children)
        for (const child of children) {
            if (!child instanceof Entity) { continue }
            let childWidth = entity.width == 'auto' ? width : entity.width
            let childHeight = entity.height == 'auto' ? height : entity.height
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
            let childHeight = child.height == 'auto' ? 1 : child.height
            child.object3D.position.setY( this.accumulatedY - childHeight * (rowHeight / 2))
            this.accumulatedY -= childHeight * rowHeight
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
            let childWidth = child.width == 'auto' ? 1 : child.width
            child.object3D.position.setX( this.accumulatedX + childWidth * (colWidth / 2))
            this.accumulatedX += childWidth * colWidth
        }
        row.shuttle.position.setX(-this.accumulatedX / 2)
    }
}