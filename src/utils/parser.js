import * as THREE from 'three';
export function parseVector(str) {
    return str.split(' ').map(Number)
}

export function radToDeg(val) { return val * Math.PI/180}

export function setTransformValues(entity){
    let position = entity.getAttribute('position')
    let scale = entity.getAttribute('scale')
    let rotation = entity.getAttribute('rotation')

    if (position) {
        entity.object3D.position.fromArray(parseVector(position))
    }

    if (scale) {
        entity.object3D.scale.fromArray(parseVector(scale))
    }

    if (rotation) {
        let euler = new THREE.Euler()
        let array = parseVector(rotation).map(radToDeg)
        euler.fromArray(array)
        entity.object3D.setRotationFromEuler(euler)
    }
}