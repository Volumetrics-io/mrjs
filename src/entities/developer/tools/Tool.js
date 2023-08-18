import { RAPIER, COLLIDER_TOOL_MAP } from "../../../component-systems/RapierPhysicsSystem"

export class Tool {
    constructor(entity){

        this.entity = entity

        this.toolName = this.constructor.name.toLowerCase().split('tool')[0]
        let geometry = new THREE.SphereGeometry(0.01, 32, 16)
        let material = new THREE.MeshStandardMaterial({
            roughness: 0.7,
            metalness: 0.0,
            side: 2,
        })

        material.color.setStyle('red')

        this.object3D = new THREE.Mesh(geometry, material)
        this.object3D.receiveShadow = true
        this.object3D.renderOrder = 3
    }

    initBody(world) {
        let worldPosition = new THREE.Vector3()
        this.object3D.getWorldPosition(worldPosition)
        const rigidBodyDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(...worldPosition)
        const colliderDesc = RAPIER.ColliderDesc.ball(0.01)
    
        this.body = world.createRigidBody(rigidBodyDesc)
        this.collider = world.createCollider(
        colliderDesc,
        this.body
        )
    
        COLLIDER_TOOL_MAP[this.collider.handle] = this
    
        this.collider.setActiveCollisionTypes(RAPIER.ActiveCollisionTypes.DEFAULT |
        RAPIER.ActiveCollisionTypes.KINEMATIC_FIXED | RAPIER.ActiveCollisionTypes.KINEMATIC_KINEMATIC);
        this.collider.setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);
    }

    traverse(callBack) {
        return
    }

    onGrab = (position) => {
        console.log(`you grabbed a ${this.toolName} tool! for ${this.entity}`);
    }
}