class AnimationSystem extends System {
    constructor() {
        super()

        console.log(this.componentName);
    }

    update(deltaTime, frame) {
        for(const entity of this.registry){
            switch (entity.components.get("animation").type) {
                case 'rotate':
                    this.rotate(entity, entity.components.get("animation"))
                    break;
            
                default:
                    break;
            }
        }
    }

    attachedComponent(entity) {
        entity.components.set("animation", { speed: 0 })
    }

    detachedComponent(entity) {
        
    }

    rotate = (entity, component) => {
        if (Math.abs(component.speed) < Math.abs(component.maxspeed)) {
            entity.components.set("animation", { speed: parseFloat(component.speed) + parseFloat(component.acceleration) })
        }
        entity.object3D.rotation.z += parseFloat(component.speed);
    }
}

let animSystem = new AnimationSystem()
