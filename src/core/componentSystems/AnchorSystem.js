import * as THREE from 'three';

import { MRSystem } from 'mrjs/core/MRSystem';
import { mrjsUtils } from '../../utils';
import { MRPlaneManager } from './MRPlaneManager';

/**
 * @class AnchorSystem
 * @classdesc Manages webXR anchors
 * @augments MRSystem
 */
export class AnchorSystem extends MRSystem {
    /**
     * @class
     * @description SurfaceSystem's default constructor including setting up /...? TODO - i need to understand what an mr-surface is first
     */
    constructor() {
        super();
        this.sourceRequest = false;
        this.source;
        this.currentEntity = null;
        this.tempMatrix = new THREE.Matrix4();

        this.planeManager = new MRPlaneManager(this.app.scene, this.app.physicsWorld)
        this.anchoringQueue = new Set()

        this.hitResults

        this.userWorldPosition = new THREE.Vector3();
        this.cameraForward = new THREE.Vector3();
        this.pinchDistance = 0;

        this.axisSwapQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -(3 * Math.PI) / 2)

        this.hand = null;

        this.snapDistance = 0.6;

        this.scale = 1;

        let existing = document.querySelectorAll('[data-comp-anchor]');

        for( const entity of existing ) {
            this.attachedComponent(entity)
            this.registry.add(entity)
        }

        this.app.addEventListener('enterXR', () => {
            if (this.sourceRequest == false) {

                mrjsUtils.xr.session.requestReferenceSpace('viewer').then((viewerSpace) => {
                    mrjsUtils.xr.session.requestHitTestSource({ space: viewerSpace }).then((source) => {
                        this.source = source;
                    });
                });
    
                mrjsUtils.xr.session.addEventListener('end', () => {
    
                    this.sourceRequest = false;
                    this.source = null;
                    this.hand = null
                });
    
                this.sourceRequest = true;
            }    
        })


        document.addEventListener('selectstart', (event) => {
            if (this.currentEntity == null || (this.hand && this.hand != event.detail.handedness)) {
                return;
            }
            if(!event.detail) { return }
            this.pinchDistance = this.cameraForward.distanceTo(event.detail.position);
            this.hand = event.detail.handedness;
        });

        document.addEventListener('selectmoved', (event) => {
            mrjsUtils.xr.session.requestAnimationFrame((t, frame) => {

                if (this.currentEntity && this.hand == event.detail.handedness) {
                    this.hitResults = frame.getHitTestResults(this.source);
                    const hit = this.hitResults[0];
                    const pose = hit?.getPose(mrjsUtils.xr.referenceSpace);

                    this.userWorldPosition.setFromMatrixPosition(this.app.user.matrixWorld);
                    this.pinchDistance = this.cameraForward.distanceTo(event.detail.position);
                    this.scale = Math.exp(2 * this.pinchDistance);

                    if (pose && this.userWorldPosition.distanceTo(pose.transform.position) < this.snapDistance * this.scale) {
                        let transform = this.multiplyQuaternionWithXRRigidTransform(this.axisSwapQuat, pose.transform)
                        this.currentEntity.object3D.matrix.copy(this.ensureYAxisUp(transform))
                    } else {

                        this.app.anchor.position.z = this.app.forward.position.z * this.scale;
                        this.currentEntity.object3D.matrix.copy(this.app.anchor.matrixWorld);

                    }
                }
            });
            
        });

        document.addEventListener('selectend', (event) => {
            mrjsUtils.xr.session.requestAnimationFrame((t, frame) => {
                frame.createAnchor(this.matrix4ToXRRigidTransform(this.currentEntity.object3D.matrixWorld), mrjsUtils.xr.referenceSpace).then((anchor) => {
                    this.currentEntity.anchor = anchor
                    }, (error) => {
                    console.error("Could not create anchor: " + error);
                });
            })
            this.hand = null;
        });
    }

    /**
     * @function
     * @description The generic system update call. // TODO - add better description here
     * @param {number} deltaTime - given timestep to be used for any feature changes
     * @param {object} frame - given frame information to be used for any feature changes
     */
    update(deltaTime, frame) {

        for (const entity of this.registry) {
            if(mrjsUtils.xr.isPresenting) {
                if (entity.anchor == null && !this.anchoringQueue.has(entity)) {
                    this.currentEntity = entity;
                    entity.object3D.matrixAutoUpdate = false
                    let anchorComp = this.currentEntity.components.get('anchor')
    
                    this.createAnchor(entity, anchorComp)
                } else if(entity.anchor) {
                    let pose = frame.getPose(entity.anchor.anchorSpace, mrjsUtils.xr.referenceSpace);
                    let transform = this.multiplyQuaternionWithXRRigidTransform(this.axisSwapQuat, pose.transform)
                    entity.object3D.matrix.copy(this.ensureYAxisUp(transform))
                }
             } else if(entity.anchor){
                entity.object3D.matrix.copy(entity.object3D.userData.originalMatrix)
                entity.mrPlane.occupied = false
                entity.mrPlane.mesh.visible = true
                entity.mrPlane = null
                entity.anchor = null
             }
        }
    }

    attachedComponent(entity) {
        entity.object3D.userData.originalMatrix = new THREE.Matrix4()
        entity.object3D.userData.originalMatrix.copy(entity.object3D.matrixWorld)
        entity.object3D.matrixAutoUpdate = false
    }

    updatedComponent(entity) {
        // delete before creating a new one.
        entity.anchor.delete()
        let comp = entity.components.get('anchor')
        // These cases can be managed instantly
        this.createAnchor(entity, comp)
    }

    detachedComponent(entity) {
        entity.object3D.matrixAutoUpdate = true
        entity.anchor.delete()
    }

    createAnchor(entity, comp) {
        switch (comp.type) {
            case 'fixed':
                this.fixed(entity)
                break;
            case 'plane':
                this.plane(entity, comp)
                break;
            default:
                break;
        }
    }

    fixed(entity) {
        mrjsUtils.xr.session.requestAnimationFrame((t, frame) => {
            frame.createAnchor(this.matrix4ToXRRigidTransform(entity.object3D.matrixWorld), mrjsUtils.xr.referenceSpace).then((anchor) => {
                entity.anchor = anchor
                }, (error) => {
                console.error("Could not create anchor: " + error);
            });
        })
    }

    plane(entity, comp) {
        if(this.planeManager.currentPlanes.size == 0) { return }
        this.anchoringQueue.add(entity)
        this.userWorldPosition.setFromMatrixPosition(this.app.forward.matrixWorld);
        let sort = Array.from(this.planeManager.currentPlanes.values())
        sort.sort((a, b) => {return a.mesh.position.distanceTo(this.userWorldPosition) - b.mesh.position.distanceTo(this.userWorldPosition)})
        for( const mrPlane of sort ) {
            if (mrPlane.occupied) { continue }
            if (comp.label && comp.label != mrPlane.label) { continue }
            if (comp.orientation && comp.orientation != mrPlane.orientation) { continue }
            mrPlane.occupied = true
            console.log('anchoring...');

            mrjsUtils.xr.session.requestAnimationFrame((t, frame) => {
                frame.createAnchor(this.matrix4ToXRRigidTransform(mrPlane.mesh.matrixWorld), mrjsUtils.xr.referenceSpace).then((anchor) => {
                    this.anchoringQueue.delete(entity)
                    entity.anchor = anchor
                    entity.mrPlane = mrPlane
                    console.log('anchored');

                    if(comp.occlusion == false) {
                        console.log('disable occlusion');
                        mrPlane.mesh.visible = false;
                    }
                    }, (error) => {
                    console.error("Could not create anchor: " + error);
                });
            })

            return;

        }
    }


    ensureYAxisUp(xrRigidTransform) {
        // Create a Three.js Quaternion for the XRRigidTransform's orientation
        let quaternion = new THREE.Quaternion(
            xrRigidTransform.orientation.x,
            xrRigidTransform.orientation.y,
            xrRigidTransform.orientation.z,
            xrRigidTransform.orientation.w
        );

        // Create a Three.js Vector for the up direction
        let upVector = new THREE.Vector3(0, 1, 0);

        // Apply the quaternion to the up direction
        let transformedUp = upVector.clone().applyQuaternion(quaternion);

        // Calculate the rotation needed to align the transformed up direction with the global up direction
        let correctionQuaternion = new THREE.Quaternion().setFromUnitVectors(transformedUp, upVector);

        // Apply the correction to the original quaternion
        quaternion.premultiply(correctionQuaternion);

        // Create a new Three.js Vector3 for the position
        let position = new THREE.Vector3(
            xrRigidTransform.position.x,
            xrRigidTransform.position.y,
            xrRigidTransform.position.z
        );
        return new THREE.Matrix4().compose(position, quaternion, new THREE.Vector3(1, 1, 1)); // Assuming no scaling;
    }

    matrix4ToXRRigidTransform(matrix4) {
        // Extract the translation component from the Matrix4
        const position = new THREE.Vector3();
        position.setFromMatrixPosition(matrix4);
    
        // Extract the rotation component from the Matrix4
        const quaternion = new THREE.Quaternion();
        quaternion.setFromRotationMatrix(matrix4);
    
        // Create a DOMPointInit for the position
        const positionInit = { x: position.x, y: position.y, z: position.z, w: 1 };
    
        // Create a DOMPointInit for the orientation (quaternion)
        const orientationInit = { x: quaternion.x, y: quaternion.y, z: quaternion.z, w: quaternion.w };
    
        // Create and return the XRRigidTransform
        return new XRRigidTransform(positionInit, orientationInit);
    }


    multiplyQuaternionWithXRRigidTransform(quaternion, xrRigidTransform) {
        // Create a Three.js Quaternion for the XRRigidTransform's orientation
        let transformQuaternion = new THREE.Quaternion(
            xrRigidTransform.orientation.x,
            xrRigidTransform.orientation.y,
            xrRigidTransform.orientation.z,
            xrRigidTransform.orientation.w
        );
    
        // Multiply the quaternions
        transformQuaternion.multiply(quaternion);
    
        // Create a new XRRigidTransform with the multiplied orientation and original position
        let newPosition = xrRigidTransform.position;
        let newOrientation = new DOMPointReadOnly(
            transformQuaternion.x,
            transformQuaternion.y,
            transformQuaternion.z,
            transformQuaternion.w
        );
    
        return new XRRigidTransform(newPosition, newOrientation);
    }
    
}
