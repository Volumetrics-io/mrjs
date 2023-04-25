("use strict")
import * as THREE from 'three';
import { ARButton } from 'three/addons/webxr/ARButton.js';
import { MRElement } from './MRElement.js'

export class Environment extends MRElement {

    constructor() {
      super()
      Object.defineProperty(this, "isEnvironment", { value: true, writable: false })

      this.environment = this
      this.systems = new Set() // systemName : System

      this.scene = new THREE.Scene()
      this.app   = new THREE.Scene()

      this.renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } )
      this.user = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 20 )
      this.render = this.render.bind(this)
      this.onWindowResize = this.onWindowResize.bind(this)

      this.ARButton = ARButton.createButton( this.renderer )

    }

    connectedCallback() {
      this.init()
      this.observer = new MutationObserver(this.mutationCallback)
      this.observer.observe(this, { attributes: true, childList: true });

    }

    disconnectedCallback() {
      this.denit()

      this.environment = null
      this.observer.disconnect()
    }

    mutationCallback = (mutationList, observer) => {
        for (const mutation of mutationList) {
          if (mutation.type === "childList") { 
            this.mutatedChildList(mutation)
          }
          if (mutation.type === "attributes") { 
              this.mutatedAttribute(mutation)
          }
        }
    }

    init(){

      this.renderer.setPixelRatio( window.devicePixelRatio )
      this.renderer.setSize( window.innerWidth, window.innerHeight )
      this.renderer.xr.enabled = true

      document.body.appendChild(this.renderer.domElement)
      document.body.appendChild( this.ARButton )

      this.renderer.setAnimationLoop( this.render )

      window.addEventListener( 'resize', this.onWindowResize )
    }

    denit() {
      document.body.removeChild(this.renderer.domElement)
      document.body.removeChild( this.ARButton )
      window.removeEventListener( 'resize', this.onWindowResize )
    }

    registerSystem(system){
      this.systems.add(system)
    }

    unregisterSystem(system){
      this.systems.delete(system)
    }

    add(entity){
      this.app.add(entity.object3D)
    }

    remove(entity){
      this.app.remove(entity.object3D)
    }

    mutatedAttribute(mutation){

    }

    mutatedChildList(mutation) {
      
    }

    onWindowResize() {

      this.user.aspect = window.innerWidth / window.innerHeight
      this.user.updateProjectionMatrix();

      this.renderer.setSize( window.innerWidth, window.innerHeight )

    }

    render () {

      for (const system of this.systems) {
        system.registry.forEach(entity => {
          system.update(entity)
        });
      }

      this.renderer.render( this.app, this.user )

      this.renderer.autoClear = false;
      this.renderer.clearDepth()

      this.renderer.render( this.scene, this.user )

    }
}

customElements.get('mr-env') || customElements.define('mr-env', Environment);