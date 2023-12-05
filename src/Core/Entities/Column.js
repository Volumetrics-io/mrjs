import { MRLayoutEntity } from 'MRJS/Core/MRLayoutEntity';
import { UIPlane } from 'MRJS/Utils/Geometry';

/**
 *
 */
export class Column extends MRLayoutEntity {
    /**
     *
     */
    constructor() {
        super();
        this.accumulatedY = 0;

        document.addEventListener('container-mutated', (event) => {
            if (event.target != this.closest('mr-container')) {
                return;
            }
            this.update();
        });
    }

    update = () => {
        const children = Array.from(this.children);
        this.accumulatedY = -this.pxToThree(this.compStyle.paddingTop);
        for (const index in children) {
            const child = children[index];
            this.accumulatedY -= this.pxToThree(child.compStyle.marginTop);
            child.object3D.position.setY(this.accumulatedY - child.height / 2);
            this.accumulatedY -= child.height;
            this.accumulatedY -= this.pxToThree(child.compStyle.marginBottom);
        }
        this.accumulatedY -= this.pxToThree(this.compStyle.paddingBottom);
        this.shuttle.position.setY(this.parentElement.height / 2);
    };

    /**
     *
     * @param entity
     */
    add(entity) {
        this.shuttle.add(entity.object3D);
        this.update();
    }

    /**
     *
     * @param entity
     */
    remove(entity) {
        this.shuttle.remove(entity.object3D);
        this.update();
    }

    /**
     *
     */
    setBorder() {
        const borderRadii = this.compStyle.borderRadius.split(' ').map((r) => this.domToThree(r));
        const height = -this.accumulatedY + this.domToThree(this.compStyle.paddingTop) + this.domToThree(this.compStyle.paddingBottom);
        const width = this.width + this.domToThree(this.compStyle.paddingLeft) + this.domToThree(this.compStyle.paddingRight);
        this.background.geometry = UIPlane(width, height, borderRadii, 18);
        this.background.position.setY(-height / 2 + this.parentElement.height / 2);
    }
}

customElements.get('mr-column') || customElements.define('mr-column', Column);
