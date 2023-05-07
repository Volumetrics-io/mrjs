import * as THREE from 'three';
import { Entity } from '../core/entity.js'

const QUAD_PINCH_THRESHOLD = 0.03

class Surface extends Entity {
    constructor(aspectRatio = 1.77777778){
        super()

        this.rotationPlane = new THREE.Group()
        this.group = new THREE.Group()
        this.horizontal = new THREE.Quaternion()
        this.vertical = new THREE.Quaternion()

        this.horizontal.setFromAxisAngle([1, 0, 0], 0)
        this.vertical.setFromAxisAngle([1, 0, 0], Math.PI / 2)

        this.object3D.add(this.rotationPlane)
        this.rotationPlane.add(this.group)

        this.rotationPlane.receiveShadow = true;
        this.rotationPlane.renderOrder = 3

        this.group.receiveShadow = true;
        this.group.renderOrder = 3

        this.aspectRatio = aspectRatio
        this.placed = false
        this.width  = 0.0
        this.height = 0.0
        this.worldPosition = new THREE.Vector3()
        this.lookPosition = new THREE.Vector3()

        this.material = new THREE.MeshStandardMaterial( {
            color: 0x3498db,
            roughness: 0.0,
            metalness: 0.7,
            transparent: true,
            opacity: 0.7,
            side: 2
        } );

        this.geometry = new THREE.PlaneGeometry( this.aspectRatio / 100, 0.01 );

        this.mesh = new THREE.Mesh(this.geometry, this.material)

        this.onDoublePinch = this.onDoublePinch.bind(this)
        this.onDoublePinchEnded = this.onDoublePinchEnded.bind(this)

        document.addEventListener('doublepinch', this.onDoublePinch)
        document.addEventListener('doublepinchended', this.onDoublePinchEnded)
    }

    add(entity){
        this.group.add(entity.object3D)
        entity.object3D.receiveShadow = true;
        entity.object3D.renderOrder = 3
    }

    remove(entity){
        this.group.remove(entity.object3D)
    }

    onDoublePinch(event) {
        this.user.getWorldPosition(this.worldPosition)
        this.lookPosition.copy(this.worldPosition)

        this.lookPosition.setY(event.detail.center.y)

        if(this.mesh.parent == null) {
            this.group.add(this.mesh)
        }

            this.object3D.position.setX(event.detail.center.x)
            this.object3D.position.setY(event.detail.center.y)
            this.object3D.position.setZ(event.detail.center.z)
            this.width = 2 * event.detail.distance
            this.height = this.width / this.aspectRatio
            this.mesh.geometry  = new THREE.PlaneGeometry( this.width, this.height );

            this.object3D.lookAt(this.lookPosition)

            this.setRotation(Math.abs(event.detail.center.y - this.worldPosition.y), 0.3)

    }

    setRotation(delta, threshold) {
        if (delta < threshold) {
            this.group.position.setY(0)
            this.rotationPlane.rotation.x = 0 
        } else {
            this.group.position.setY(-this.height / 2)
            this.rotationPlane.rotation.x = (Math.PI / 2)

        }
    }

    onDoublePinchEnded(event) {
        console.log(this.object3D);
        this.placed = true
        this.mesh.removeFromParent()
        // document.removeEventListener('doublepinch', this.onDoublePinch)
        // document.removeEventListener('doublepinchended', this.onDoublePinchEnded)
    }
}

customElements.get('mr-surface') || customElements.define('mr-surface', Surface);