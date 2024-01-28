class SpinSystem extends MRSystem {
    constructor() {
        super()

        console.log(this.componentName);
    }

    update(deltaTime, frame) {
        for(const entity of this.registry){
            let component = entity.components.get("spin")
            if (Math.abs(component.speed) < Math.abs(component.maxspeed)) {
                entity.components.set("spin", { speed: parseFloat(component.speed) + parseFloat(component.acceleration) })
            }
            entity.object3D.rotation.z += parseFloat(component.speed);
        }
    }

    attachedComponent(entity) {
        entity.components.set("spin", { speed: 0 })
    }

    detachedComponent(entity) {
        
    }

    rotate = (entity, component) => {
        
    }
}

let spinsys = new SpinSystem()
