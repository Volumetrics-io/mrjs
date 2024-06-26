import * as THREE from 'three';

import { mrjsUtils } from 'mrjs';

import { MREntity } from 'mrjs/core/MREntity';
import { MRSystem } from 'mrjs/core/MRSystem';
import { MRPlaneManager } from 'mrjs/dataManagers/MRPlaneManager';

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

        this.planeManager = new MRPlaneManager(this.app.scene, this.app.dataset.occlusion);
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

        this.originPosition = new THREE.Vector3();

        for (const entity of existing) {
            this.attachedComponent(entity);
            this.registry.add(entity);
        }

        this.app.addEventListener('enterxr', () => {
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

        this.app.addEventListener('exitxr', () => {
            this.deleteAnchor(this.app);
            this.app.origin.matrix.copy(new THREE.Matrix4());
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
                this.userWorldPosition.setFromMatrixPosition(this.app.camera.matrixWorld);
                this.cameraForward.setFromMatrixPosition(this.app.user.forward.matrixWorld);

                this.pinchDistance = this.cameraForward.distanceTo(event.detail.position);
                this.scale = Math.exp(2 * this.pinchDistance);
                this.app.anchor.position.z = this.app.user.forward.position.z * this.scale;
                this.app.anchor.lookAt(this.userWorldPosition);
            }
        });

        document.addEventListener('selectend', (event) => {
            if (this.currentEntity == null || this.hand == null || this.hand != event.detail.handedness) {
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
     * @description This update function maintains the transforms of anchored entities.
     * This overrides any other transform values set on the element when in mixed reality.
     * @param {number} deltaTime - given timestep to be used for any feature changes
     * @param {object} frame - given frame information to be used for any feature changes
     */
    update(deltaTime, frame) {
        if (mrjsUtils.xr.isPresenting) {
            if (this.currentEntity) {
                this.floating(frame);
            }

            if (!this.app.anchor) {
                this.setAppOrigin();
            } else {
                this.updateOrigin(frame);
            }
        }

        for (const entity of this.registry) {
            if (mrjsUtils.xr.isPresenting) {
                let anchorComp = entity.components.get('anchor');
                if (entity.anchor == null && !this.anchoringQueue.has(entity)) {
                    entity.object3D.matrixWorldAutoUpdate = false;
                    this.createAnchor(entity, anchorComp);
                } else if (entity.anchor) {
                    let pose = frame.getPose(entity.anchor.anchorSpace, mrjsUtils.xr.referenceSpace);
                    let transform = this.multiplyQuaternionWithXRRigidTransform(this.axisSwapQuat, pose.transform);

                    entity.object3D.matrix.copy(this.adjustTransform(transform));
                } else {
                    this.createAnchor(entity, anchorComp);
                }
            } else if (entity.anchor) {
                entity.object3D.matrix.copy(entity.object3D.userData.originalMatrix);
                this.deleteAnchor(entity);
            }
        }
    }

    /**
     * @function
     * @description Called when the entity component is initialized
     * @param {object} entity - the entity being attached/initialized.
     */
    attachedComponent(entity) {
        entity.object3D.userData.originalMatrix = new THREE.Matrix4();
        entity.object3D.userData.originalMatrix.copy(entity.object3D.matrixWorld);
        entity.object3D.matrixAutoUpdate = false;
    }

    /**
     * @function
     * @description Called when the entity component is updated
     * @param {object} entity - the entity being updated based on the component.
     */
    updatedComponent(entity) {
        // delete before creating a new one.
        this.deleteAnchor(entity);
        // // These cases can be managed instantly
        // this.createAnchor(entity, comp);
    }

    /**
     * @function
     * @description Called when the entity component is detached
     * @param {object} entity - the entity being updated based on the component being detached.
     */
    detachedComponent(entity) {
        entity.object3D.matrixAutoUpdate = true;
        this.deleteAnchor(entity);
    }

    /**
     * @function
     * @description deletes anchors from the scene and removes all references to the anchored plane (if any)
     * @param {object} entity - the entity whose anchor is being deleted.
     */
    deleteAnchor(entity) {
        if (entity.plane) {
            entity.plane.occupied = false;
            entity.plane.mesh.visible = true;
            entity.plane = null;
        }
        entity.anchor = null;
        entity.dispatchEvent(new CustomEvent('anchorremoved', { bubbles: true }));
    }

    /**
     * @function
     * @description creates the anchor specified by the data-anchor-comp
     * @param {object} entity - the entity whose anchor is being created.
     * @param {object} comp - the data component with a type value that represents the string 'fixed', 'plane', 'floating', etc
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
     * @description Sets the origin of the MRApp being touched by all systems to allow anchoring to position
     * itself properly.
     */
    setAppOrigin() {
        if (!mrjsUtils.xr.isPresenting) {
            return;
        }
        let originMatrix = new THREE.Matrix4();
        mrjsUtils.xr.session.requestAnimationFrame((t, frame) => {
            originMatrix.copyPosition(this.app.user.forward.matrixWorld);
            frame.createAnchor(this.matrix4ToXRRigidTransform(originMatrix), mrjsUtils.xr.referenceSpace).then(
                (anchor) => {
                    this.app.origin.matrixAutoUpdate = false;
                    this.app.anchor = anchor;
                    this.app.dispatchEvent(new CustomEvent('anchored', { bubbles: true }));
                },
                (error) => {
                    console.error('Could not create anchor: ' + error);
                }
            );
        });
    }

    /**
     * @function
     * @description Updates the origin of the MRApp being touched by all systems to allow anchoring to position.
     * @param {object} frame - given frame information to be used for any feature changes (from the update(..) loop)
     */
    updateOrigin(frame) {
        let pose = frame.getPose(this.app.anchor.anchorSpace, mrjsUtils.xr.referenceSpace);
        let transform = this.multiplyQuaternionWithXRRigidTransform(this.axisSwapQuat, pose.transform);

        this.app.origin.matrix.copy(this.adjustTransform(transform, true));

        this.originPosition.setFromMatrixPosition(this.app.origin.matrixWorld);
    }

    /**
     * @function
     * @description Anchors the given entity half a meter in front of the users position at launch.
     * @param {object} entity - the entity being positioned.
     */
    fixed(entity) {
        this.anchoringQueue.add(entity);
        mrjsUtils.xr.session.requestAnimationFrame((t, frame) => {
            frame.createAnchor(this.matrix4ToXRRigidTransform(this.app.user.forward.matrixWorld), mrjsUtils.xr.referenceSpace).then(
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
     * @description Creates an anchor at the position specified by the user,
     * either floating in front of them or pinned to the scene mesh
     * @param {object} frame - given frame information to be used for any feature changes (from the update(..) loop)
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
     * @description Anchors the provided entity to the nearest unoccupied plane that meets the given orientation and label.
     * each plane is currently limited to one anchor for simplicity.
     * @param {object} entity - the entity being anchored by this function.
     * @param {object} comp - the data-component to determine the orientation and label of the associated plane
     */
    plane(entity, comp) {
        this.anchoringQueue.add(entity);
        this.userWorldPosition.setFromMatrixPosition(this.app.user.forward.matrixWorld);
        let sort = Array.from(this.planeManager.planeDictionary[comp.label].values());
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
                        if (!this.planeManager.planeDictionary[comp.label].has(mrPlane)) {
                            return;
                        }
                        if (entity.anchor) {
                            return;
                        }
                        entity.anchor = anchor;
                        entity.plane = mrPlane;
                        entity.dispatchEvent(new CustomEvent('anchored', { bubbles: true }));
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
     * @param {object} xrRigidTransform - a THREE.js transformation matrix that we want to adjust
     * @param {boolean} origin - true if this is positioned at the origin or not (handles special case of div-0).
     * @returns {object} a new adjusted THREE.js Matrix4
     */
    adjustTransform(xrRigidTransform, origin = false) {
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

        if (!origin) {
            position.sub(this.originPosition);
        }

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
     * @description Converts the provided matrix4 into a webXR xompatible XRRigidTransform
     * @param {object} matrix4 - the matrix we want to convert to a XRRigidTransform
     * @returns {object} xrRigidTransform - the converted representation of the param matrix4
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
     * @description Multiplies an xr rigid transform by the provided quaternion
     * @param {object} quaternion - the quaternion we want to multiply with the xrRigidTransform
     * @param {object} xrRigidTransform - the second part of the multiplication we are looking to perform.
     * @returns {object} xrRigidTransform - the output of the quaternion * xrRigidTransform in the form of an xrRigidTransform
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
