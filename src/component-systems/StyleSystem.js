import { MRUIEntity } from '../UI/UIEntity'
import System from '../core/System'

export class StyleSystem extends System {
    constructor() {
        super(false, 1 / 15)
    }

    update(deltaTime, frame) {
        for (const entity of this.registry) {
            if (entity.compStyle.scale != 'none') {
                entity.object3D.scale.setScalar(entity.compStyle.scale)
            } else {
                entity.object3D.scale.setScalar(1)
            }

            if (entity.compStyle.zIndex != 'auto') {
                entity.object3D.position.setZ(entity.compStyle.zIndex / 1000)
            }

            if (entity instanceof MRUIEntity) {
                entity.updateStyle()
            }
        }
    }

    // called when a new entity is added to the scene
    onNewEntity(entity) {
        this.registry.add(entity)
    }
}
