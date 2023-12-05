import { MREntity } from 'MRJS/Core/MREntity';
import { loadModel } from 'MRJS/Utils/LoadModel';

/**
 *
 */
export class Model extends MREntity {
    /**
     *
     */
    constructor() {
        super();
    }

    /**
     *
     */
    get height() {
        return this.contentHeight;
    }

    /**
     *
     */
    connected() {
        this.src = this.getAttribute('src');
        if (!this.src) {
            return;
        }

        const extension = this.src.slice(((this.src.lastIndexOf('.') - 1) >>> 0) + 2);

        loadModel(this.src, extension)
            .then((loadedMeshModel) => {
                // todo - these material changes should be moved out of the loader at some point
                // loadedMeshModel.material = material;
                loadedMeshModel.receiveShadow = true;
                loadedMeshModel.renderOrder = 3;

                // the below is the same as 'scene.add'
                this.object3D.add(loadedMeshModel);

                // TODO - recheck this lower part
                this.dispatchEvent(new CustomEvent('new-entity', { bubbles: true }));
            })
            .catch((error) => {
                console.log(`ERR: in loading model ${this.src}. Error was:`, error);
            });
    }

    onLoad = () => {};
}

customElements.get('mr-model') || customElements.define('mr-model', Model);
