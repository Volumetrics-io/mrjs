import {
	CanvasTexture,
	LinearFilter,
	SRGBColorSpace
} from 'three';
import html2canvas from 'html2canvas'

// Borrowed from HTMLMesh: https://github.com/mrdoob/three.js/blob/674400e2ccf07f5fe81c287c294f0e15a199100d/examples/jsm/interactive/HTMLMesh.js#L11

export default class HTMLTexture extends CanvasTexture {

	constructor( html, width, height) {

		let canvas = document.createElement('canvas')

		super( canvas );

		this.html = html;
		this.htmlCanvas = canvas
		this.context = canvas.getContext('2d');

		this.htmlCanvas.width = width
        this.htmlCanvas.height = height

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
		html2canvas(this.html, {canvas: this.htmlCanvas, 
			scale: 1, 
			allowTaint: false,
			ignoreElements: (node) => {
			return node.nodeName === 'IFRAME';
		  }}).then((canvas) => {
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