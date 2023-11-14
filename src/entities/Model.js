import Entity from '../core/entity'
import { STLLoader } from '../utils/STLLoader'

const LOADERS = {
    stl: new STLLoader(),
}

/**
 *
 */
export class Model extends Entity {
    /**
     *
     */
    get height() {
        super.height
        return this.contentHeight
    }

    /**
     *
     */
    constructor() {
        super()
    }

    /**
     *
     */
    connected() {
        this.src = this.getAttribute('src')

        if (!this.src) {
            return
        }

        const ext = this.src.slice(((this.src.lastIndexOf('.') - 1) >>> 0) + 2)

        const loader = LOADERS[ext]

        if (!loader) {
            return
        }

        loader.load(this.src, (geometry) => {
            const material = new THREE.MeshPhysicalMaterial({
                clearcoat: 0.75,
                clearcoatRoughness: 0.5,
                metalness: 0.5,
                roughness: 0.6,
                envMapIntensity: 0.75,
            })

            const mesh = new THREE.Mesh(geometry, material)
            mesh.receiveShadow = true
            mesh.renderOrder = 3

            this.object3D.add(mesh)

            this.dispatchEvent(new CustomEvent(`new-entity`, { bubbles: true }))
        })
    }

    onLoad = () => {}
}

customElements.get('mr-model') || customElements.define('mr-model', Model)
