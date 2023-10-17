class AnimationSystem extends System {
    constructor() {
        super()

        console.log(this.componentName);
    }

    update(deltaTime, frame) {
        for(const entity of this.registry){
            switch (entity.animation?.type) {
                case 'rotate':
                    this.rotate(entity)
                    break;
            
                default:
                    break;
            }
        }
    }

    attachedComponent(entity, data) {
        console.log(data);
        entity.animation = data
        entity.animation.speed = 0
    }

    updatedComponent(entity, data) {
        
    }

    detachedComponent(entity) {
        
    }

    rotate = (entity) => {
        if (Math.abs(entity.animation.speed) < Math.abs(entity.animation.maxspeed)) {
            entity.animation.speed += parseFloat(entity.animation.acceleration)
        }
        entity.object3D.rotation.z += entity.animation.speed;
    }
}

let animSystem = new AnimationSystem()
