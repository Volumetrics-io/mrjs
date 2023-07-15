import { System } from '../core/System'
import { Entity } from '../core/entity'
import { parseVector } from '../utils/parser.js'

export class TransformSystem extends System {
        constructor() {
        super()

        let entities = this.environment.querySelectorAll('*')
        for (let entity of entities) {
            if (!(entity instanceof Entity)) { continue }
            this.registry.add(entity)
            this.initTransform(entity)
        }
    }

    update(deltaTime) {

    }

    initTransform(entity) {
        const position = entity.getAttribute('position')
        const scale = entity.getAttribute('scale')
        const rotation = entity.getAttribute('rotation')

        entity.width = entity.getAttribute('width') ?? entity.parent.width
        entity.height = entity.getAttribute('height') ?? entity.parent.height
        entity.radius = entity.getAttribute('corner-radius') ?? entity.parent.radius ?? 0

        console.log(entity.height);
    
        if (position) {
            entity.object3D.position.fromArray(parseVector(position))
        }
    
        if (scale) {
            entity.scale *= scale
            entity.object3D.scale.setScalar(scale)
            entity.traverse((child) => {
                child.physics.data.size = child.physics.data.size.map((x) => { return x * scale })
                child.physics.data.update = true
            })
        }
    
        if (rotation) {
            const euler = new THREE.Euler()
            const array = parseVector(rotation).map(radToDeg)
            euler.fromArray(array)
            entity.object3D.setRotationFromEuler(euler)
        }
    }
}