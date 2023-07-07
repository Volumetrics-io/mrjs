import * as THREE from 'three'

export function parseVector(str) {
  return str.split(' ').map(Number)
}

export function radToDeg(val) {
  return (val * Math.PI) / 180
}

export function setTransformValues(entity) {
  const position = entity.getAttribute('position')
  const scale = entity.getAttribute('scale')
  const rotation = entity.getAttribute('rotation')

  if (position) {
    entity.object3D.position.fromArray(parseVector(position))
  }

  if (scale) {
    entity.object3D.scale.fromArray(parseVector(scale))
  }

  if (rotation) {
    const euler = new THREE.Euler()
    const array = parseVector(rotation).map(radToDeg)
    euler.fromArray(array)
    entity.object3D.setRotationFromEuler(euler)
  }
}

export function parseAttributeString(attrString) {
  const regexPattern = /(\w+):\s*([^;]+)/g
  const jsonObject = {}

  let match
  while ((match = regexPattern.exec(attrString)) !== null) {
    const key = match[1].trim()
    let value = match[2].trim()

    // Check value type and convert if necessary
    if (value.includes(' ')) {
      value = value.split(' ').map((v) => parseFloat(v))
    } else if (/^\d+(\.\d+)?$/.test(value)) {
      value = parseFloat(value)
    } else if (value === 'true') {
      value = true
    } else if (value === 'false') {
      value = false
    }

    jsonObject[key] = value
  }

  return jsonObject
}
