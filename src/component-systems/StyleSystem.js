import * as THREE from 'three'
import System from '../core/System'
import { Entity } from '../core/entity';

export class StyleSystem extends System {
  constructor() {
    super()
    this.tags = this.app.querySelectorAll('*')

    for(const tag of this.tags) {
        if (!tag instanceof Entity) { return }
        let style = window.getComputedStyle(tag)
        console.log(tag);
        console.log(style.fontFamily);
        tag.style = style
    }
  }

  update(deltaTime) {
    
  }
}
