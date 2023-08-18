import { roundTo, roundVectorTo } from "../../../utils/parser.js";
import { Tool } from "./Tool.js";

export class PositionTool extends Tool {
    constructor(entity){
        super(entity)
        this.localPosition = new THREE.Vector3()
        this.worldPosition = new THREE.Vector3()
    }

    onGrab = (position) => {
        console.log('position tool');
        this.worldPosition.set(position.x, position.y, position.z)
        this.localPosition.copy(this.entity.object3D.parent.worldToLocal(this.worldPosition))
        roundVectorTo(this.localPosition, 100)
       this.entity.setAttribute('position', `${this.localPosition.x} ${this.localPosition.y} ${this.localPosition.z}`)
    }
}