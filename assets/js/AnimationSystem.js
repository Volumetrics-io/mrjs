class AnimationSystem extends System {
    constructor() {
        super()

        console.log(this.componentName);
    }

    update(deltaTime, frame) {
        for(const entity of this.registry){
            switch (entity.components.animation?.type) {
                case 'rotate':
                    this.rotate(entity)
                    break;
            
                default:
                    break;
            }
        }
    }

    attachedComponent(entity) {
        entity.components.animation.speed = 0
    }

    updatedComponent(entity, oldData) {
        console.log('updated');
        console.log(oldData);
        console.log(entity.components.animation);
        entity.components.animation.speed = oldData.speed
    }

    detachedComponent(entity) {
        
    }

    rotate = (entity) => {
        if (Math.abs(entity.components.animation.speed) < Math.abs(entity.components.animation.maxspeed)) {
            entity.components.animation.speed += parseFloat(entity.components.animation.acceleration)
        }
        entity.object3D.rotation.z += entity.components.animation.speed;
    }
}

let animSystem = new AnimationSystem()
