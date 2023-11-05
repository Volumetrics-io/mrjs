import System from "../core/System";

export class StyleSystem extends System {
    constructor(){
        super(false, 1)
    }

    printed = false

    update(deltaTime,frame) {
    }

    // called when a new entity is added to the scene
    onNewEntity (entity) {
        this.registry.add(entity)
    }

}