import * as THREE from 'three'
import System from '../core/System'

export class SurfaceSystem extends System {
  constructor() {
    super()
    this.referenceSpace
    this.sourceRequest = false
    this.source
    this.currentSurface = null
    this.tempMatrix = new THREE.Matrix4()

    this.startPinchPos = new THREE.Vector3()
    this.scale = 1
    

    const entities = this.app.querySelectorAll('mr-surface')

    for ( const surface of entities) {
        this.registry.add(surface)
        surface.group.visible = false
        surface.rotationPlane.rotation.x = 3 * (Math.PI / 2)
    }

    document.addEventListener('pinchstart', (event) => {
        this.startPinchPos.copy(event.detail.position)
    })

    document.addEventListener('pinchmoved', (event) => {
        if (this.currentSurface) {
            this.scale = 1 + (this.startPinchPos.distanceTo(event.detail.position) * 5)
            this.currentSurface.viz.scale.setScalar(this.scale)
        }
    })

    document.addEventListener('pinchend', (event) => {
        if (this.currentSurface == null) { return }
        this.currentSurface.width *= this.scale * (1 / 3)
        this.currentSurface.height *= this.scale * (1 / 3)
        this.currentSurface.place()

        this.currentSurface.anchorPosition.copy(this.currentSurface.object3D.position)
        this.currentSurface.anchorQuaternion.copy(this.currentSurface.object3D.quaternion)

        this.currentSurface.anchored = true
        
        this.currentSurface = null

    })

  }

  update(deltaTime, frame) {
    for(const surface of this.registry) {
        if(this.currentSurface == null && surface.anchored == false) {
            this.currentSurface = surface
        } else if (surface.anchored && !surface.placed) {
            if(!this.app.inXRSession) { return }
            surface.replace()
            surface.rotationPlane.rotation.x = 3 * (Math.PI / 2)

        }
    }

    if ( this.sourceRequest == false ) {
        this.referenceSpace = this.app.renderer.xr.getReferenceSpace();
        console.log(this.referenceSpace);

        this.session = this.app.renderer.xr.getSession();

        this.session.requestReferenceSpace( 'viewer' ).then( ( referenceSpace ) => {

            this.session.requestHitTestSource( { space: referenceSpace } ).then( ( source ) => {

                this.source = source;

            } );

        } );

        this.session.addEventListener( 'end', () => {
            this.app.inXRSession = false
            this.app.user.position.set(0, 0, 1)
            this.app.user.quaternion.set(0,0,0,1)
            this.resetAllSurfaces()

            this.sourceRequest = false;
            this.source = null;

        } );

        this.sourceRequest = true;

        
    }
    if(this.currentSurface == null) { return }
    if ( this.source ) {

        const hitTestResults = frame.getHitTestResults( this.source );

        if ( hitTestResults.length ) {

            const hit = hitTestResults[ 0 ];
            this.placeSurface(hit)

        }

    }
  }

  resetAllSurfaces() {
    for (const surface of this.registry) {
        surface.remove()
        surface.rotationPlane.rotation.x = 0

    }
  }

  placeSurface(hit) {
    let pose = hit.getPose( this.referenceSpace )

    if (!this.currentSurface.viz.visible) {
        this.currentSurface.viz.visible = true
    }
    
    this.currentSurface.object3D.position.fromArray( [pose.transform.position.x, pose.transform.position.y,pose.transform.position.z] )
    this.currentSurface.object3D.quaternion.fromArray( [pose.transform.orientation.x, pose.transform.orientation.y, pose.transform.orientation.z, pose.transform.orientation.w] )
  }

}
