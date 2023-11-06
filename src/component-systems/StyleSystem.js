import System from "../core/System";

export class StyleSystem extends System {
    constructor(){
        super(false, 1 / 15)
    }

    update(deltaTime,frame) {
        for (const entity of this.registry) {
            entity.compStyle = window.getComputedStyle(entity)
        }
    }

    // called when a new entity is added to the scene
    onNewEntity (entity) {
        this.registry.add(entity)
    }

}