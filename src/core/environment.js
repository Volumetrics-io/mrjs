import * as THREE from 'three';
import { ARButton } from 'three/addons/webxr/ARButton.js';

class Environment extends HTMLElement {

    constructor() {
      super();

      this.renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } )
      this.user = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 20 )

      this.scene = new THREE.Scene() // for system level stuff like the editor, app launcher, etc
      this.app = new THREE.Scene()

      const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 )
      light.position.set( 0.5, 1, 0.25 )
      this.scene.add( light )

      this.renderer.setPixelRatio( window.devicePixelRatio )
      this.renderer.setSize( window.innerWidth, window.innerHeight )
      this.renderer.xr.enabled = true

      document.body.appendChild(this.renderer.domElement)
      document.body.appendChild( ARButton.createButton( this.renderer ) )

      this.render = this.render.bind(this)

      this.renderer.setAnimationLoop( this.render )

      window.addEventListener( 'resize', this.onWindowResize )

    }

    add(entity){
      this.app.add(entity)
    }

    onWindowResize() {

      this.user.aspect = window.innerWidth / window.innerHeight
      this.user.updateProjectionMatrix();

      this.renderer.setSize( window.innerWidth, window.innerHeight )

    }

    render () {

      this.renderer.render( this.app, this.user )

      this.renderer.autoClear = false;
      this.renderer.clearDepth()

      this.renderer.render( this.scene, this.user )

    }
}

customElements.define('mr-environment', Environment);