import * as THREE from 'three'
import { Text } from 'troika-three-text'
import { System } from '../core/System'
import { Entity } from '../core/entity'

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
        entity.textObj.color = 0x000
        entity.textObj.position.z = 0.0001
    }
}