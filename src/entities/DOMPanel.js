import Panel from './Panel.js'
import {
	CanvasTexture,
	LinearFilter,
	SRGBColorSpace
} from 'three';
import html2canvas from 'html2canvas'

class DOMPanel extends Panel {
    constructor(){
        super()

        this.html = document.createElement('div')

        this.onPinch = this.onPinch.bind(this)
        this.onPinchEnd = this.onPinchEnd.bind(this)

        document.addEventListener('pinch', this.onPinch)
        document.addEventListener('pinchend', this.onPinchEnd)
    }

    connected(){
        this.createTexture()
    }

    onPinchEnd(event){
        this.drawFlag = false
     }


    onPinch(event){
       
    }

    createTexture(){
        if(!this.html) { return }
		let width = this.width * 256
		let height = this.height * 256
        let texture = new HTMLTexture( this, width, height);

		this.setAttribute('style', `width: ${width}px;
                                    height: ${height}px;
                                    padding: 10px;
                                    display: flex;
                                    align-items: stretch;
									background-color: ${this.color ? this.color : '#fff'}`)

        if (this.object3D.material) {
            this.object3D.material.map = texture
        } else {
            this.object3D.material = new MeshBasicMaterial( { map: texture, toneMapped: false, transparent: true } );
        }
    }

}

// Borrowed from HTMLMesh: https://github.com/mrdoob/three.js/blob/674400e2ccf07f5fe81c287c294f0e15a199100d/examples/jsm/interactive/HTMLMesh.js#L11

class HTMLTexture extends CanvasTexture {

	constructor( html, width, height) {

		let canvas = document.createElement('canvas')

		super( canvas );

		this.html = html;
		this.canvas = canvas

		this.canvas.width = width
        this.canvas.height = height

		this.anisotropy = 16;
		this.colorSpace = SRGBColorSpace;
		this.minFilter = LinearFilter;
		this.magFilter = LinearFilter;
		console.log('init observer');
		this.update()

		// Create an observer on the this.html, and run html2canvas update in the next loop
		const observer = new MutationObserver( (mutationList, observer) => {
			console.log('observing');

			if ( ! this.scheduleUpdate ) {

				// ideally should use xr.requestAnimationFrame, here setTimeout to avoid passing the renderer
				this.scheduleUpdate = setTimeout( () => this.update(), 16 );

			}

		} );

		const config = { attributes: true, childList: true, subtree: true, characterData: true };
		observer.observe( this.html, config );

		this.observer = observer;

	}

	dispatchDOMEvent( event ) {

		if ( event.data ) {

			htmlevent( this.this.html, event.type, event.data.x, event.data.y );

		}

	}

	update() {
		console.log('update');

		html2canvas(this.html, {canvas: this.canvas, scale: 1}).then((canvas) => {
			this.needsUpdate = true
			this.scheduleUpdate = null;

		  });

	}

	dispose() {

		if ( this.observer ) {

			this.observer.disconnect();

		}

		this.scheduleUpdate = clearTimeout( this.scheduleUpdate );

		super.dispose();

	}

}

customElements.get('mr-dom-panel') || customElements.define('mr-dom-panel', DOMPanel);