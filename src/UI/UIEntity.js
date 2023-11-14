import Entity from '../core/entity'
import { UIPlane } from '../geometry/UIPlane'

/**
 *
 */
export class MRUIEntity extends Entity {
    /**
     *
     */
    get height() {
        super.height

        if (global.inXR) {
            this.windowVerticalScale = this.parentElement.windowVerticalScale
            return (this.compStyle.height.split('px')[0] / window.innerHeight) * this.windowVerticalScale
        }
        return (this.compStyle.height.split('px')[0] / window.innerHeight) * global.viewPortHeight
    }

    /**
     *
     */
    get width() {
        super.width

        if (global.inXR) {
            this.windowHorizontalScale = this.parentElement.windowHorizontalScale
            return (this.compStyle.width.split('px')[0] / window.innerWidth) * this.windowHorizontalScale
        }
        return (this.compStyle.width.split('px')[0] / window.innerWidth) * global.viewPortWidth
    }

    /**
     *
     */
    constructor() {
        super()
        this.worldScale = new THREE.Vector3()
        this.halfExtents = new THREE.Vector3()
        this.physics.type = 'ui'

        const geometry = UIPlane(1, 1, [0], 18)
        const material = new THREE.MeshStandardMaterial({
            color: 0xfff,
            roughness: 0.7,
            metalness: 0.0,
            side: 2,
            colorWriter: false,
        })

        this.background = new THREE.Mesh(geometry, material)
        this.background.receiveShadow = true
        this.background.renderOrder = 3
        this.background.visible = false
        this.object3D.add(this.background)

        this.windowVerticalScale = 1
        this.windowHorizontalScale = 1
    }

    /**
     *
     */
    connected() {
        this.background.geometry = UIPlane(this.width, this.height, [0], 18)
    }

    /**
     *
     */
    updatePhysicsData() {
        this.physics.halfExtents = new THREE.Vector3()
        this.object3D.userData.bbox.setFromCenterAndSize(this.object3D.position, new THREE.Vector3(this.width, this.height, 0.002))

        this.worldScale.setFromMatrixScale(this.object3D.matrixWorld)
        this.object3D.userData.bbox.getSize(this.object3D.userData.size)
        this.object3D.userData.size.multiply(this.worldScale)

        this.physics.halfExtents.copy(this.object3D.userData.size)
        this.physics.halfExtents.divideScalar(2)
    }

    /**
     *
     * @param val
     */
    pxToThree(val) {
        if (global.inXR) {
            return (val.split('px')[0] / window.innerWidth) * this.windowHorizontalScale
        }
        return (val.split('px')[0] / window.innerWidth) * global.viewPortWidth
    }

    /**
     *
     * @param val
     */
    domToThree(val) {
        if (typeof val === 'string') {
            const valuepair = val.split(/(\d+(?:\.\d+)?)/).filter(Boolean)
            if (valuepair.length > 1) {
                switch (valuepair[1]) {
                    case 'px':
                        if (global.inXR) {
                            return (val.split('px')[0] / window.innerWidth) * this.windowHorizontalScale
                        }
                        return (val.split('px')[0] / window.innerWidth) * global.viewPortWidth
                    case '%':
                        if (global.inXR) {
                            return (parseFloat(val) / 100) * this.windowHorizontalScale
                        }
                        return (parseFloat(val) / 100) * global.viewPortWidth
                    default:
                        return val
                }
            }
        }
        return val
    }

    /**
     *
     */
    updateStyle() {
        // background
        this.setBorder()
        this.setBackground()
    }

    /**
     *
     */
    setBorder() {
        const borderRadii = this.compStyle.borderRadius.split(' ').map((r) => this.domToThree(r))
        this.background.geometry = UIPlane(this.width, this.height, borderRadii, 18)
    }

    /**
     *
     */
    setBackground() {
        const color = this.compStyle.backgroundColor
        if (color.includes('rgba')) {
            const rgba = color
                .substring(5, color.length - 1)
                .split(',')
                .map((part) => parseFloat(part.trim()))
            if (rgba[3] == 0) {
                return
            }

            this.background.material.color.setStyle(`rgb(${rgba[0]}, ${rgba[1]}, ${rgba[2]})`)
        } else {
            this.background.material.color.setStyle(color)
        }
        this.background.visible = true
    }
}
