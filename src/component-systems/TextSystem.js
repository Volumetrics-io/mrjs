import * as THREE from 'three'
import { Text } from 'troika-three-text'
import { System } from '../core/System'
import { Entity } from '../core/entity'
import { parseAttributeString } from '../utils/parser'

export class TextSystem extends System {
    constructor() {
        super()
        this.environment.addEventListener('has-text', this.addText)
    }

    update(deltaTime) {

    }

    addText = (event) => {
        let entity = event.detail.entity
        this.registry.add(entity)
        entity.textObj = new Text()
        entity.object3D.add(entity.textObj)
        entity.textObj.text = entity.textContent.trim()

        let style = parseAttributeString(entity.getAttribute('text-style')) ?? {}
        style.maxWidth = style.maxWidth ?? entity.width ?? 1
        style.width = style.width ?? entity.width ?? 1
        let height = entity.height ?? 1
        entity.textObj.position.setY(height / 2)

        style.clipRect = [-style.maxWidth / 2, -height, style.maxWidth / 2, 0]
        this.setStyle(entity.textObj, style)
        entity.textObj.sync()
    }

    setStyle = (textObj, style) => {
        textObj.anchorX = style.horizontal ?? 'center'
        textObj.anchorY = style.vertical ?? 'top'
        textObj.material.color.setStyle(style.color ?? '#000')
        if (style.size == 'fit'){
            textObj.fontSize =  style.width * 0.025
        } else {
            textObj.fontSize = style.size ?? 0.025
        }
        textObj.font = style.font ?? textObj.font
        textObj.textAlign = style.textAlign ?? textObj.textAlign
        textObj.whiteSpace = style.whiteSpace ?? textObj.whiteSpace
        textObj.maxWidth = style.maxWidth
        textObj.clipRect = style.clipRect
        
        textObj.position.z = 0.0001
    }
}