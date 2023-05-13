import './build.js'
class Whiteboard extends Panel {
    constructor(){
        super()

        this.canvas = document.createElement('canvas')

        document.body.appendChild(this.canvas)

        this.raycaster = new THREE.Raycaster();

        this.canvas.width = this.width * 2160
        this.canvas.height = 2160
        this.context = this.canvas.getContext('2d')
        this.localPosition = new THREE.Vector3()
        this.positionOnWhiteboard = new THREE.Vector3()

        this.canvasScale = new THREE.Vector2(this.canvas.width, this.canvas.height)

        this.origin = new THREE.Vector3()
        this.direction = new THREE.Vector3()
        this.zMax = 0.07
        this.zMin = -0.07

        this.drawPosition = new THREE.Vector2()
        this.drawStartPosition = new THREE.Vector2();

        this.context.fillStyle = '#FFFFFF';
        this.context.lineWidth = 12;
		this.context.fillRect( 0, 0, this.canvas.width, this.canvas.height );

        this.drawFlag = false

        this.canvasTexture = new THREE.CanvasTexture(this.canvas)
        this.object3D.material.map = this.canvasTexture

        this.onPinch = this.onPinch.bind(this)
        this.onPinchEnd = this.onPinchEnd.bind(this)

        document.addEventListener('pinch', this.onPinch)
        document.addEventListener('pinchend', this.onPinchEnd)
    }

    onPinchEnd(event){
        this.drawFlag = false
     }


    onPinch(event){
        this.localPosition.copy(this.object3D.worldToLocal(event.detail.position))
        if (this.localPosition.z < this.zMax && this.localPosition.z > this.zMin) {
            if(!this.drawFlag){
                this.drawFlag = true
                this.positionToCanvasPosition(this.localPosition)
                this.drawStartPosition.copy(this.drawPosition)
            } else {
                this.positionToCanvasPosition(this.localPosition)
                this.draw()
            }
        } else {
            this.drawFlag = false
        }
    }

    positionToCanvasPosition(vector) {
        this.positionOnWhiteboard.copy(vector)
        this.positionOnWhiteboard.setZ(0)

        this.origin = this.object3D.localToWorld(vector)
        this.direction = this.object3D.localToWorld(this.positionOnWhiteboard)
        this.raycaster.set(this.origin, this.direction)

        let intersection = this.raycaster.intersectObject(this.object3D)

        if(intersection.length > 0) {
            this.drawPosition.copy(intersection[0].uv).multiply(this.canvasScale)
            this.drawPosition.setY(this.canvasScale.y - this.drawPosition.y)
        }
    }

    draw() {

        this.context.moveTo( this.drawStartPosition.x , this.drawStartPosition.y);
        this.context.strokeStyle = '#000000';
        this.context.lineTo( this.drawPosition.x, this.drawPosition.y );
        this.context.stroke();
        // reset drawing start position to current position.
        this.drawStartPosition.copy( this.drawPosition );
        // need to flag the map as needing updating.
        this.object3D.material.map.needsUpdate = true;

    }
}

customElements.get('mr-whiteboard') || customElements.define('mr-whiteboard', Whiteboard);