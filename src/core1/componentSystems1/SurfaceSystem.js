import * as THREE from 'three';

import { MRSystem } from 'mrjs/core/MRSystem';

/**
 * @class SurfaceSystem
 * @classdesc Handles all items (3D and 2D) associated with an mr-surface including the surface itself.
 * @augments MRSystem
 */
export class SurfaceSystem extends MRSystem {
    /**
     * SurfaceSystem's default constructor including setting up /...? TODO - i need to understand what an mr-surface is first
     */
    constructor() {
        super(false);
        this.referenceSpace;
        this.sourceRequest = false;
        this.source;
        this.currentSurface = null;
        this.tempMatrix = new THREE.Matrix4();

        this.userWorldPosition = new THREE.Vector3();
        this.cameraForward = new THREE.Vector3();
        this.pinchDistance = 0;

        this.hand = null;

        this.snapDistance = 0.6;

        this.scale = 1;

        const entities = this.app.querySelectorAll('mr-surface');

        for (const surface of entities) {
            this.registry.add(surface);
            surface.group.visible = false;
            surface.rotationPlane.rotation.x = 3 * (Math.PI / 2);
        }

        document.addEventListener('pinchstart', (event) => {
            if (this.currentSurface == null || (this.hand && this.hand != event.detail.handedness)) {
                return;
            }
            this.pinchDistance = this.cameraForward.distanceTo(event.detail.position);
            if (this.pinchDistance < 0.3) {
                this.hand = event.detail.handedness;
            }
        });

        document.addEventListener('pinchmoved', (event) => {
            this.pinchDistance = this.cameraForward.distanceTo(event.detail.position);
            if (this.currentSurface && this.hand == event.detail.handedness) {
                this.scale = Math.exp(2 * this.pinchDistance);
                this.app.anchor.position.z = this.app.forward.position.z * this.scale;
                this.currentSurface.viz.scale.setScalar(this.scale);
            }
        });

        document.addEventListener('pinchend', (event) => {
            if (this.currentSurface == null || this.hand != event.detail.handedness) {
                return;
            }
            this.lockWindow();

            this.hand = null;
            this.app.anchor.position.z = this.app.forward.position.z;
        });
    }

    /**
     * The generic system update call.
     * // TODO - add better description here
     * @param {number} deltaTime - given timestep to be used for any feature changes
     * @param {object} frame - given frame information to be used for any feature changes
     */
    update(deltaTime, frame) {
        if (this.registry.size == 0) {
            return;
        }
        for (const surface of this.registry) {
            if (this.currentSurface == null && surface.anchored == false) {
                this.currentSurface = surface;
            } else if (surface.anchored && !surface.placed) {
                if (!global.inXR) {
                    return;
                }
                surface.replace();
            }
        }

        if (this.sourceRequest == false) {
            this.referenceSpace = this.app.renderer.xr.getReferenceSpace();

            this.session = this.app.renderer.xr.getSession();

            this.session.requestReferenceSpace('viewer').then((referenceSpace) => {
                this.session.requestHitTestSource({ space: referenceSpace }).then((source) => {
                    this.source = source;
                });
            });

            this.session.addEventListener('end', () => {
                global.inXR = false;
                this.app.user.position.set(0, 0, 1);
                this.app.user.quaternion.set(0, 0, 0, 1);
                this.resetAllSurfaces();

                this.sourceRequest = false;
                this.source = null;
            });

            this.sourceRequest = true;
        }
        if (this.currentSurface == null) {
            return;
        }
        if (this.source) {
            const results = frame.getHitTestResults(this.source);
            this.placeSurface(results, frame);
        }
    }

    /**
     * Detaches all surfaces in this system and resets them
     */
    resetAllSurfaces() {
        for (const surface of this.registry) {
            surface.detach();
        }
    }

    /**
     * Locks the window in place where it has been positioned after being moved.
     */
    lockWindow() {
        this.currentSurface.windowVerticalScale = this.scale * global.XRScale * this.currentSurface.height;
        this.currentSurface.windowHorizontalScale = this.scale * global.XRScale * this.currentSurface.width;
        this.currentSurface.place();

        this.currentSurface.anchorPosition.copy(this.currentSurface.object3D.position);
        this.currentSurface.anchorQuaternion.copy(this.currentSurface.object3D.quaternion);

        this.currentSurface.anchored = true;

        this.currentSurface = null;
    }

    /**
     * Places the surface based on the user's current pose position??? TODO
     * @param {object} hitResults - TODO
     * @param {object} frame - TODO
     */
    placeSurface(hitResults, frame) {
        if (!this.currentSurface.viz.visible) {
            this.currentSurface.viz.visible = true;
        }

        const hit = hitResults[0];
        const pose = hit?.getPose(this.referenceSpace);
        this.userWorldPosition.setFromMatrixPosition(this.app.user.matrixWorld);
        this.cameraForward.setFromMatrixPosition(this.app.forward.matrixWorld);

        if (pose && this.userWorldPosition.distanceTo(pose.transform.position) < this.snapDistance * this.scale) {
            this.currentSurface.rotationPlane.rotation.x = (3 * Math.PI) / 2;
            this.currentSurface.floating = false;

            this.currentSurface.object3D.position.fromArray([pose.transform.position.x, pose.transform.position.y, pose.transform.position.z]);
            this.currentSurface.object3D.quaternion.fromArray([
                pose.transform.orientation.x,
                pose.transform.orientation.y,
                pose.transform.orientation.z,
                pose.transform.orientation.w,
            ]);
        } else {
            this.currentSurface.floating = true;
            this.currentSurface.rotationPlane.rotation.x = 0;
            this.currentSurface.object3D.position.setFromMatrixPosition(this.app.anchor.matrixWorld);
            this.currentSurface.object3D.lookAt(this.app.user.position);

            if (this.currentSurface.getAttribute('fixed')) {
                this.lockWindow();
            }
        }
    }
}
