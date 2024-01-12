import * as THREE from 'three';

import { MRSystem } from 'mrjs/core/MRSystem';
import { mrjsUtils } from '../../utils';
import { MRPlaneManager } from '../managers/MRPlaneManager';

/**
 * @class AnchorSystem
 * @classdesc creates and manages WebXR anchors in the MR scene.
 * @augments MRSystem
 */
export class AnchorSystem extends MRSystem {
    /**
     * @class
     * @description AnchorSystem's default constructor including setting up event listeners for XR initialization, user interaction, and the MRPlaneManager
     */
    constructor() {
        super();
        this.sourceRequest = false;
        this.source;
        this.currentEntity = null;
        this.tempMatrix = new THREE.Matrix4();

        this.planeManager = new MRPlaneManager(this.app.scene, this.app.physicsWorld);
        this.anchoringQueue = new Set();

        this.hitResults;

        this.userWorldPosition = new THREE.Vector3();
        this.cameraForward = new THREE.Vector3();
        this.pinchDistance = 0;

        this.axisSwapQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -(3 * Math.PI) / 2);

        this.hand = null;

        this.snapDistance = 0.6;

        this.scale = 1;

        let existing = document.querySelectorAll('[data-comp-anchor]');

        for (const entity of existing) {
            this.attachedComponent(entity);
            this.registry.add(entity);
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
                    this.hand = null;
                });

                this.sourceRequest = true;
            }
        });

        document.addEventListener('selectstart', (event) => {
            if (this.currentEntity == null || (this.hand && this.hand != event.detail.handedness)) {
                return;
            }
            if (!event.detail) {
                return;
            }
            this.hand = event.detail.handedness;
        });

        document.addEventListener('selectmoved', (event) => {
            if (this.currentEntity && this.hand == event.detail.handedness) {
                this.userWorldPosition.setFromMatrixPosition(this.app.user.matrixWorld);
                this.cameraForward.setFromMatrixPosition(this.app.forward.matrixWorld);

                this.pinchDistance = this.cameraForward.distanceTo(event.detail.position);
                this.scale = Math.exp(2 * this.pinchDistance);
                this.app.anchor.position.z = this.app.forward.position.z * this.scale;
                this.app.anchor.lookAt(this.userWorldPosition);
            }
        });

        document.addEventListener('selectend', (event) => {
            if (this.currentEntity == null || (this.hand && this.hand != event.detail.handedness)) {
                return;
            }
            mrjsUtils.xr.session.requestAnimationFrame((t, frame) => {
                frame.createAnchor(this.matrix4ToXRRigidTransform(this.currentEntity.object3D.matrixWorld), mrjsUtils.xr.referenceSpace).then(
                    (anchor) => {
                        this.currentEntity.anchor = anchor;
                        this.anchoringQueue.delete(this.currentEntity);
                        this.currentEntity = null;
                    },
                    (error) => {
                        console.error('Could not create anchor: ' + error);
                    }
                );
            });
            this.hand = null;
        });
    }

    /**
     * @function
     * @description Checks if we need to run the generic system update call. Default implementation returns true if there are
     * any items in the system's registry. Allows subclasses to override with their own implementation.
     * @param {number} deltaTime - given timestep to be used for any feature changes
     * @param {object} frame - given frame information to be used for any feature changes
     * @returns {boolean} true if the system is in a state where an update is needed to be run this render call, false otherwise
     */
    needsUpdate(deltaTime, frame) {
        // for now leaving as always true instead of relying on the super.needsUpdate given the intial `if` in the `AnchorSystem`'s `update` function.
        return true;
    }

    /**
     * @function
     * @description This update function maintains the transforms of anchored entities.
     * This overrides any other transform values set on the element when in mixed reality.
     * @param {number} deltaTime - given timestep to be used for any feature changes
     * @param {object} frame - given frame information to be used for any feature changes
     */
    update(deltaTime, frame) {
        if (this.currentEntity) {
            if (!mrjsUtils.xr.isPresenting) {
                return;
            }
            this.floating(frame);
        }

        for (const entity of this.registry) {
            if (mrjsUtils.xr.isPresenting) {
                let anchorComp = entity.components.get('anchor');
                if (entity.anchor == null && !this.anchoringQueue.has(entity)) {
                    entity.object3D.matrixAutoUpdate = false;
                    this.createAnchor(entity, anchorComp);
                } else if (entity.anchor) {
                    let pose = frame.getPose(entity.anchor.anchorSpace, mrjsUtils.xr.referenceSpace);
                    let transform = this.multiplyQuaternionWithXRRigidTransform(this.axisSwapQuat, pose.transform);

                    entity.object3D.matrix.copy(this.adjustTransform(transform));
                }
            } else if (entity.anchor) {
                entity.object3D.matrix.copy(entity.object3D.userData.originalMatrix);
                this.deleteAnchor(entity);
            }
        }
    }

    /**
     *
     * @param entity
     */
    attachedComponent(entity) {
        entity.object3D.userData.originalMatrix = new THREE.Matrix4();
        entity.object3D.userData.originalMatrix.copy(entity.object3D.matrixWorld);
        entity.object3D.matrixAutoUpdate = false;
    }

    /**
     *
     * @param entity
     */
    updatedComponent(entity) {
        // delete before creating a new one.
        this.deleteAnchor(entity);
        let comp = entity.components.get('anchor');
        // These cases can be managed instantly
        this.createAnchor(entity, comp);
    }

    /**
     *
     * @param entity
     */
    detachedComponent(entity) {
        entity.object3D.matrixAutoUpdate = true;
        this.deleteAnchor(entity);
    }

    /**
     * @function
     * @description deletes anchors from the scene and removes all references to the anchored plane (if any)
     * @param entity
     */
    deleteAnchor(entity) {
        if (entity.mrPlane) {
            entity.mrPlane.occupied = false;
            entity.mrPlane.mesh.visible = true;
            entity.mrPlane = null;
        }
        entity.anchor = null;
        entity.dispatchEvent(new CustomEvent('anchor-removed', { bubbles: true }));
    }

    /**
     * @function
     * @description creates the anchor specified by the data-anchor-comp
     * @param entity
     * @param comp
     */
    createAnchor(entity, comp) {
        switch (comp.type) {
            case 'fixed':
                this.fixed(entity);
                break;
            case 'plane':
                this.plane(entity, comp);
                break;
            case 'floating':
                this.currentEntity = entity;
                this.anchoringQueue.add(entity);
                break;
            default:
                break;
        }
    }

    /**
     * @function
     * @description anchors the given entity half a meter in front of the users position at launch.
     * @param entity
     */
    fixed(entity) {
        this.anchoringQueue.add(entity);
        mrjsUtils.xr.session.requestAnimationFrame((t, frame) => {
            frame.createAnchor(this.matrix4ToXRRigidTransform(this.app.forward.matrixWorld), mrjsUtils.xr.referenceSpace).then(
                (anchor) => {
                    entity.anchor = anchor;
                    entity.dispatchEvent(new CustomEvent('anchored', { bubbles: true }));
                    this.anchoringQueue.delete(entity);
                },
                (error) => {
                    console.error('Could not create anchor: ' + error);
                }
            );
        });
    }

    /**
     * @function
     * @description creates an anchor at the position specified by the user,
     * either floating in front of them or pinned to the scene mesh
     * @param frame
     */
    floating(frame) {
        this.hitResults = frame.getHitTestResults(this.source);
        const hit = this.hitResults[0];
        const pose = hit?.getPose(mrjsUtils.xr.referenceSpace);

        if (pose && this.userWorldPosition.distanceTo(pose.transform.position) < this.snapDistance * this.scale) {
            let transform = this.multiplyQuaternionWithXRRigidTransform(this.axisSwapQuat, pose.transform);
            this.currentEntity.object3D.matrix.copy(this.adjustTransform(transform));
        } else {
            this.currentEntity.object3D.matrix.copy(this.app.anchor.matrixWorld);
        }
    }

    /**
     * @function
     * @description anchors the provided entity to the nearest unoccupied plane that meets the given orientation and label.
     * each plane is currently limited to one anchor for simplicity.
     * @param entity
     * @param comp
     */
    plane(entity, comp) {
        if (this.planeManager.currentPlanes.size == 0) {
            return;
        }
        this.anchoringQueue.add(entity);
        this.userWorldPosition.setFromMatrixPosition(this.app.forward.matrixWorld);
        let sort = Array.from(this.planeManager.currentPlanes.values());
        sort.sort((a, b) => {
            return a.mesh.position.distanceTo(this.userWorldPosition) - b.mesh.position.distanceTo(this.userWorldPosition);
        });
        for (const mrPlane of sort) {
            if (mrPlane.occupied) {
                continue;
            }
            if (comp.label && comp.label != mrPlane.label) {
                continue;
            }
            if (comp.orientation && comp.orientation != mrPlane.orientation) {
                continue;
            }
            mrPlane.occupied = true;

            mrjsUtils.xr.session.requestAnimationFrame((t, frame) => {
                frame.createAnchor(this.matrix4ToXRRigidTransform(mrPlane.mesh.matrixWorld), mrjsUtils.xr.referenceSpace).then(
                    (anchor) => {
                        this.anchoringQueue.delete(entity);
                        entity.anchor = anchor;
                        entity.dispatchEvent(new CustomEvent('anchored', { bubbles: true }));
                        entity.mrPlane = mrPlane;

                        if (comp.occlusion == false) {
                            mrPlane.mesh.visible = false;
                        }
                    },
                    (error) => {
                        console.error('Could not create anchor: ' + error);
                    }
                );
            });
            return;
        }
    }

    originalAnchorMatrix = new THREE.Matrix4();
    anchorForwardVector = new THREE.Vector3(0, 0, 0.03);
    rotationMatrix = new THREE.Matrix4();
    adjustedMatrix = new THREE.Matrix4();

    /**
     * @function
     * @description converts the provided XRRigidTransform to a Matrix4 and adjusts it to ensure
     * that it's y-axis is pointing directly up and it's z-axis is facing inward
     * @param xrRigidTransform
     * @returns a THREE.js Matrix4
     */
    adjustTransform(xrRigidTransform) {
        // Create a Three.js Quaternion for the XRRigidTransform's orientation
        let quaternion = new THREE.Quaternion(xrRigidTransform.orientation.x, xrRigidTransform.orientation.y, xrRigidTransform.orientation.z, xrRigidTransform.orientation.w);

        // Create a Three.js Vector for the up direction
        let upVector = new THREE.Vector3(0, 1, 0);

        // Apply the quaternion to the up direction
        let transformedUp = upVector.clone().applyQuaternion(quaternion);

        // Calculate the rotation needed to align the transformed up direction with the global up direction
        let correctionQuaternion = new THREE.Quaternion().setFromUnitVectors(transformedUp, upVector);

        // Apply the correction to the original quaternion
        quaternion.premultiply(correctionQuaternion);

        // Create a new Three.js Vector3 for the position
        let position = new THREE.Vector3(xrRigidTransform.position.x, xrRigidTransform.position.y, xrRigidTransform.position.z);

        this.originalAnchorMatrix.compose(position, quaternion, new THREE.Vector3(1, 1, 1));
        this.rotationMatrix.extractRotation(this.originalAnchorMatrix);

        this.anchorForwardVector.applyMatrix4(this.rotationMatrix);
        this.adjustedMatrix.makeTranslation(this.anchorForwardVector.x, this.anchorForwardVector.y, this.anchorForwardVector.y);
        this.anchorForwardVector.set(0, 0, 0.03);
        this.adjustedMatrix.multiply(this.originalAnchorMatrix);

        return this.adjustedMatrix;
    }

    /**
     * @function
     * @description converts the provided matrix4 into a webXR xompatible XRRigidTransform
     * @param matrix4
     */
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

    /**
     * @function
     * @description multuplies an xr rigid transform by the provided quaternion
     * @param quaternion
     * @param xrRigidTransform
     */
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
        let newOrientation = new DOMPointReadOnly(transformQuaternion.x, transformQuaternion.y, transformQuaternion.z, transformQuaternion.w);

        return new XRRigidTransform(newPosition, newOrientation);
    }
}
