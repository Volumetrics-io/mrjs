"use strict";
(self["webpackChunkvolumetrics"] = self["webpackChunkvolumetrics"] || []).push([[87],{

/***/ 709:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "F": () => (/* binding */ Coarena)
/* harmony export */ });
class Coarena {
    constructor() {
        this.fconv = new Float64Array(1);
        this.uconv = new Uint32Array(this.fconv.buffer);
        this.data = new Array();
        this.size = 0;
    }
    set(handle, data) {
        let i = this.index(handle);
        while (this.data.length <= i) {
            this.data.push(null);
        }
        if (this.data[i] == null)
            this.size += 1;
        this.data[i] = data;
    }
    len() {
        return this.size;
    }
    delete(handle) {
        let i = this.index(handle);
        if (i < this.data.length) {
            if (this.data[i] != null)
                this.size -= 1;
            this.data[i] = null;
        }
    }
    clear() {
        this.data = new Array();
    }
    get(handle) {
        let i = this.index(handle);
        if (i < this.data.length) {
            return this.data[i];
        }
        else {
            return null;
        }
    }
    forEach(f) {
        for (const elt of this.data) {
            if (elt != null)
                f(elt);
        }
    }
    getAll() {
        return this.data.filter((elt) => elt != null);
    }
    index(handle) {
        /// Extracts the index part of a handle (the lower 32 bits).
        /// This is done by first injecting the handle into an Float64Array
        /// which is itself injected into an Uint32Array (at construction time).
        /// The 0-th value of the Uint32Array will become the `number` integer
        /// representation of the lower 32 bits.
        /// Also `this.uconv[1]` then contains the generation number as a `number`,
        /// which we don’t really need.
        this.fconv[0] = handle;
        return this.uconv[0];
    }
}
//# sourceMappingURL=coarena.js.map

/***/ }),

/***/ 144:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "_": () => (/* binding */ CharacterCollision),
/* harmony export */   "m": () => (/* binding */ KinematicCharacterController)
/* harmony export */ });
/* harmony import */ var _raw__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(184);
/* harmony import */ var _math__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(383);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_raw__WEBPACK_IMPORTED_MODULE_0__, _math__WEBPACK_IMPORTED_MODULE_1__]);
([_raw__WEBPACK_IMPORTED_MODULE_0__, _math__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);


/**
 * A collision between the character and an obstacle hit on its path.
 */
class CharacterCollision {
}
/**
 * A character controller for controlling kinematic bodies and parentless colliders by hitting
 * and sliding against obstacles.
 */
class KinematicCharacterController {
    constructor(offset, params, bodies, colliders, queries) {
        this.params = params;
        this.bodies = bodies;
        this.colliders = colliders;
        this.queries = queries;
        this.raw = new _raw__WEBPACK_IMPORTED_MODULE_0__/* .RawKinematicCharacterController */ .vg(offset);
        this.rawCharacterCollision = new _raw__WEBPACK_IMPORTED_MODULE_0__/* .RawCharacterCollision */ .Wx();
        this._applyImpulsesToDynamicBodies = false;
        this._characterMass = null;
    }
    /** @internal */
    free() {
        if (!!this.raw) {
            this.raw.free();
            this.rawCharacterCollision.free();
        }
        this.raw = undefined;
        this.rawCharacterCollision = undefined;
    }
    /**
     * The direction that goes "up". Used to determine where the floor is, and the floor’s angle.
     */
    up() {
        return this.raw.up();
    }
    /**
     * Sets the direction that goes "up". Used to determine where the floor is, and the floor’s angle.
     */
    setUp(vector) {
        let rawVect = _math__WEBPACK_IMPORTED_MODULE_1__/* .VectorOps.intoRaw */ .ut.intoRaw(vector);
        return this.raw.setUp(rawVect);
        rawVect.free();
    }
    applyImpulsesToDynamicBodies() {
        return this._applyImpulsesToDynamicBodies;
    }
    setApplyImpulsesToDynamicBodies(enabled) {
        this._applyImpulsesToDynamicBodies = enabled;
    }
    /**
     * Returns the custom value of the character mass, if it was set by `this.setCharacterMass`.
     */
    characterMass() {
        return this._characterMass;
    }
    /**
     * Set the mass of the character to be used for impulse resolution if `self.applyImpulsesToDynamicBodies`
     * is set to `true`.
     *
     * If no character mass is set explicitly (or if it is set to `null`) it is automatically assumed to be equal
     * to the mass of the rigid-body the character collider is attached to; or equal to 0 if the character collider
     * isn’t attached to any rigid-body.
     *
     * @param mass - The mass to set.
     */
    setCharacterMass(mass) {
        this._characterMass = mass;
    }
    /**
     * A small gap to preserve between the character and its surroundings.
     *
     * This value should not be too large to avoid visual artifacts, but shouldn’t be too small
     * (must not be zero) to improve numerical stability of the character controller.
     */
    offset() {
        return this.raw.offset();
    }
    /**
     * Sets a small gap to preserve between the character and its surroundings.
     *
     * This value should not be too large to avoid visual artifacts, but shouldn’t be too small
     * (must not be zero) to improve numerical stability of the character controller.
     */
    setOffset(value) {
        this.raw.setOffset(value);
    }
    /**
     * Is sliding against obstacles enabled?
     */
    slideEnabled() {
        return this.raw.slideEnabled();
    }
    /**
     * Enable or disable sliding against obstacles.
     */
    setSlideEnabled(enabled) {
        this.raw.setSlideEnabled(enabled);
    }
    /**
     * The maximum step height a character can automatically step over.
     */
    autostepMaxHeight() {
        return this.raw.autostepMaxHeight();
    }
    /**
     * The minimum width of free space that must be available after stepping on a stair.
     */
    autostepMinWidth() {
        return this.raw.autostepMinWidth();
    }
    /**
     * Can the character automatically step over dynamic bodies too?
     */
    autostepIncludesDynamicBodies() {
        return this.raw.autostepIncludesDynamicBodies();
    }
    /**
     * Is automatically stepping over small objects enabled?
     */
    autostepEnabled() {
        return this.raw.autostepEnabled();
    }
    /**
     * Enabled automatically stepping over small objects.
     *
     * @param maxHeight - The maximum step height a character can automatically step over.
     * @param minWidth - The minimum width of free space that must be available after stepping on a stair.
     * @param includeDynamicBodies - Can the character automatically step over dynamic bodies too?
     */
    enableAutostep(maxHeight, minWidth, includeDynamicBodies) {
        this.raw.enableAutostep(maxHeight, minWidth, includeDynamicBodies);
    }
    /**
     * Disable automatically stepping over small objects.
     */
    disableAutostep() {
        return this.raw.disableAutostep();
    }
    /**
     * The maximum angle (radians) between the floor’s normal and the `up` vector that the
     * character is able to climb.
     */
    maxSlopeClimbAngle() {
        return this.raw.maxSlopeClimbAngle();
    }
    /**
     * Sets the maximum angle (radians) between the floor’s normal and the `up` vector that the
     * character is able to climb.
     */
    setMaxSlopeClimbAngle(angle) {
        this.raw.setMaxSlopeClimbAngle(angle);
    }
    /**
     * The minimum angle (radians) between the floor’s normal and the `up` vector before the
     * character starts to slide down automatically.
     */
    minSlopeSlideAngle() {
        return this.raw.minSlopeSlideAngle();
    }
    /**
     * Sets the minimum angle (radians) between the floor’s normal and the `up` vector before the
     * character starts to slide down automatically.
     */
    setMinSlopeSlideAngle(angle) {
        this.raw.setMinSlopeSlideAngle(angle);
    }
    /**
     * If snap-to-ground is enabled, should the character be automatically snapped to the ground if
     * the distance between the ground and its feet are smaller than the specified threshold?
     */
    snapToGroundDistance() {
        return this.raw.snapToGroundDistance();
    }
    /**
     * Enables automatically snapping the character to the ground if the distance between
     * the ground and its feet are smaller than the specified threshold.
     */
    enableSnapToGround(distance) {
        this.raw.enableSnapToGround(distance);
    }
    /**
     * Disables automatically snapping the character to the ground.
     */
    disableSnapToGround() {
        this.raw.disableSnapToGround();
    }
    /**
     * Is automatically snapping the character to the ground enabled?
     */
    snapToGroundEnabled() {
        return this.raw.snapToGroundEnabled();
    }
    /**
     * Computes the movement the given collider is able to execute after hitting and sliding on obstacles.
     *
     * @param collider - The collider to move.
     * @param desiredTranslation - The desired collider movement.
     * @param filterFlags - Flags for excluding whole subsets of colliders from the obstacles taken into account.
     * @param filterGroups - Groups for excluding colliders with incompatible collision groups from the obstacles
     *                       taken into account.
     * @param filterPredicate - Any collider for which this closure returns `false` will be excluded from the
     *                          obstacles taken into account.
     */
    computeColliderMovement(collider, desiredTranslation, filterFlags, filterGroups, filterPredicate) {
        let rawTranslation = _math__WEBPACK_IMPORTED_MODULE_1__/* .VectorOps.intoRaw */ .ut.intoRaw(desiredTranslation);
        this.raw.computeColliderMovement(this.params.dt, this.bodies.raw, this.colliders.raw, this.queries.raw, collider.handle, rawTranslation, this._applyImpulsesToDynamicBodies, this._characterMass, filterFlags, filterGroups, this.colliders.castClosure(filterPredicate));
        rawTranslation.free();
    }
    /**
     * The movement computed by the last call to `this.computeColliderMovement`.
     */
    computedMovement() {
        return _math__WEBPACK_IMPORTED_MODULE_1__/* .VectorOps.fromRaw */ .ut.fromRaw(this.raw.computedMovement());
    }
    /**
     * The result of ground detection computed by the last call to `this.computeColliderMovement`.
     */
    computedGrounded() {
        return this.raw.computedGrounded();
    }
    /**
     * The number of collisions against obstacles detected along the path of the last call
     * to `this.computeColliderMovement`.
     */
    numComputedCollisions() {
        return this.raw.numComputedCollisions();
    }
    /**
     * Returns the collision against one of the obstacles detected along the path of the last
     * call to `this.computeColliderMovement`.
     *
     * @param i - The i-th collision will be returned.
     * @param out - If this argument is set, it will be filled with the collision information.
     */
    computedCollision(i, out) {
        if (!this.raw.computedCollision(i, this.rawCharacterCollision)) {
            return null;
        }
        else {
            let c = this.rawCharacterCollision;
            out = out !== null && out !== void 0 ? out : new CharacterCollision();
            out.translationApplied = _math__WEBPACK_IMPORTED_MODULE_1__/* .VectorOps.fromRaw */ .ut.fromRaw(c.translationApplied());
            out.translationRemaining = _math__WEBPACK_IMPORTED_MODULE_1__/* .VectorOps.fromRaw */ .ut.fromRaw(c.translationRemaining());
            out.toi = c.toi();
            out.witness1 = _math__WEBPACK_IMPORTED_MODULE_1__/* .VectorOps.fromRaw */ .ut.fromRaw(c.worldWitness1());
            out.witness2 = _math__WEBPACK_IMPORTED_MODULE_1__/* .VectorOps.fromRaw */ .ut.fromRaw(c.worldWitness2());
            out.normal1 = _math__WEBPACK_IMPORTED_MODULE_1__/* .VectorOps.fromRaw */ .ut.fromRaw(c.worldNormal1());
            out.normal2 = _math__WEBPACK_IMPORTED_MODULE_1__/* .VectorOps.fromRaw */ .ut.fromRaw(c.worldNormal2());
            out.collider = this.colliders.get(c.handle());
            return out;
        }
    }
}
//# sourceMappingURL=character_controller.js.map
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 620:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "_": () => (/* reexport safe */ _character_controller__WEBPACK_IMPORTED_MODULE_0__._),
/* harmony export */   "m": () => (/* reexport safe */ _character_controller__WEBPACK_IMPORTED_MODULE_0__.m)
/* harmony export */ });
/* harmony import */ var _character_controller__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(144);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_character_controller__WEBPACK_IMPORTED_MODULE_0__]);
_character_controller__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];

//# sourceMappingURL=index.js.map
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 448:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "K": () => (/* binding */ CCDSolver)
/* harmony export */ });
/* harmony import */ var _raw__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(184);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_raw__WEBPACK_IMPORTED_MODULE_0__]);
_raw__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];

/**
 * The CCD solver responsible for resolving Continuous Collision Detection.
 *
 * To avoid leaking WASM resources, this MUST be freed manually with `ccdSolver.free()`
 * once you are done using it.
 */
class CCDSolver {
    constructor(raw) {
        this.raw = raw || new _raw__WEBPACK_IMPORTED_MODULE_0__/* .RawCCDSolver */ .LE();
    }
    /**
     * Release the WASM memory occupied by this narrow-phase.
     */
    free() {
        if (!!this.raw) {
            this.raw.free();
        }
        this.raw = undefined;
    }
}
//# sourceMappingURL=ccd_solver.js.map
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 42:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "j": () => (/* binding */ CoefficientCombineRule)
/* harmony export */ });
/**
 * A rule applied to combine coefficients.
 *
 * Use this when configuring the `ColliderDesc` to specify
 * how friction and restitution coefficient should be combined
 * in a contact.
 */
var CoefficientCombineRule;
(function (CoefficientCombineRule) {
    CoefficientCombineRule[CoefficientCombineRule["Average"] = 0] = "Average";
    CoefficientCombineRule[CoefficientCombineRule["Min"] = 1] = "Min";
    CoefficientCombineRule[CoefficientCombineRule["Multiply"] = 2] = "Multiply";
    CoefficientCombineRule[CoefficientCombineRule["Max"] = 3] = "Max";
})(CoefficientCombineRule || (CoefficientCombineRule = {}));
//# sourceMappingURL=coefficient_combine_rule.js.map

/***/ }),

/***/ 380:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "C1": () => (/* binding */ UnitImpulseJoint),
/* harmony export */   "JW": () => (/* binding */ FixedImpulseJoint),
/* harmony export */   "VH": () => (/* binding */ SphericalImpulseJoint),
/* harmony export */   "Vt": () => (/* binding */ MotorModel),
/* harmony export */   "_h": () => (/* binding */ JointData),
/* harmony export */   "au": () => (/* binding */ RevoluteImpulseJoint),
/* harmony export */   "dl": () => (/* binding */ JointType),
/* harmony export */   "eZ": () => (/* binding */ PrismaticImpulseJoint),
/* harmony export */   "s2": () => (/* binding */ ImpulseJoint)
/* harmony export */ });
/* harmony import */ var _math__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(383);
/* harmony import */ var _raw__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(184);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_math__WEBPACK_IMPORTED_MODULE_0__, _raw__WEBPACK_IMPORTED_MODULE_1__]);
([_math__WEBPACK_IMPORTED_MODULE_0__, _raw__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);


/**
 * An enum grouping all possible types of joints:
 *
 * - `Revolute`: A revolute joint that removes all degrees of freedom between the affected
 *               bodies except for the rotation along one axis.
 * - `Fixed`: A fixed joint that removes all relative degrees of freedom between the affected bodies.
 * - `Prismatic`: A prismatic joint that removes all degrees of freedom between the affected
 *                bodies except for the translation along one axis.
 * - `Spherical`: (3D only) A spherical joint that removes all relative linear degrees of freedom between the affected bodies.
 */
var JointType;
(function (JointType) {
    JointType[JointType["Revolute"] = 0] = "Revolute";
    JointType[JointType["Fixed"] = 1] = "Fixed";
    JointType[JointType["Prismatic"] = 2] = "Prismatic";
    // #if DIM3
    JointType[JointType["Spherical"] = 3] = "Spherical";
    // #endif
})(JointType || (JointType = {}));
var MotorModel;
(function (MotorModel) {
    MotorModel[MotorModel["AccelerationBased"] = 0] = "AccelerationBased";
    MotorModel[MotorModel["ForceBased"] = 1] = "ForceBased";
})(MotorModel || (MotorModel = {}));
class ImpulseJoint {
    constructor(rawSet, bodySet, handle) {
        this.rawSet = rawSet;
        this.bodySet = bodySet;
        this.handle = handle;
    }
    static newTyped(rawSet, bodySet, handle) {
        switch (rawSet.jointType(handle)) {
            case JointType.Revolute:
                return new RevoluteImpulseJoint(rawSet, bodySet, handle);
            case JointType.Prismatic:
                return new PrismaticImpulseJoint(rawSet, bodySet, handle);
            case JointType.Fixed:
                return new FixedImpulseJoint(rawSet, bodySet, handle);
            // #if DIM3
            case JointType.Spherical:
                return new SphericalImpulseJoint(rawSet, bodySet, handle);
            // #endif
            default:
                return new ImpulseJoint(rawSet, bodySet, handle);
        }
    }
    /** @internal */
    finalizeDeserialization(bodySet) {
        this.bodySet = bodySet;
    }
    /**
     * Checks if this joint is still valid (i.e. that it has
     * not been deleted from the joint set yet).
     */
    isValid() {
        return this.rawSet.contains(this.handle);
    }
    /**
     * The first rigid-body this joint it attached to.
     */
    body1() {
        return this.bodySet.get(this.rawSet.jointBodyHandle1(this.handle));
    }
    /**
     * The second rigid-body this joint is attached to.
     */
    body2() {
        return this.bodySet.get(this.rawSet.jointBodyHandle2(this.handle));
    }
    /**
     * The type of this joint given as a string.
     */
    type() {
        return this.rawSet.jointType(this.handle);
    }
    // #if DIM3
    /**
     * The rotation quaternion that aligns this joint's first local axis to the `x` axis.
     */
    frameX1() {
        return _math__WEBPACK_IMPORTED_MODULE_0__/* .RotationOps.fromRaw */ .T3.fromRaw(this.rawSet.jointFrameX1(this.handle));
    }
    // #endif
    // #if DIM3
    /**
     * The rotation matrix that aligns this joint's second local axis to the `x` axis.
     */
    frameX2() {
        return _math__WEBPACK_IMPORTED_MODULE_0__/* .RotationOps.fromRaw */ .T3.fromRaw(this.rawSet.jointFrameX2(this.handle));
    }
    // #endif
    /**
     * The position of the first anchor of this joint.
     *
     * The first anchor gives the position of the application point on the
     * local frame of the first rigid-body it is attached to.
     */
    anchor1() {
        return _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.fromRaw */ .ut.fromRaw(this.rawSet.jointAnchor1(this.handle));
    }
    /**
     * The position of the second anchor of this joint.
     *
     * The second anchor gives the position of the application point on the
     * local frame of the second rigid-body it is attached to.
     */
    anchor2() {
        return _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.fromRaw */ .ut.fromRaw(this.rawSet.jointAnchor2(this.handle));
    }
    /**
     * Sets the position of the first anchor of this joint.
     *
     * The first anchor gives the position of the application point on the
     * local frame of the first rigid-body it is attached to.
     */
    setAnchor1(newPos) {
        const rawPoint = _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.intoRaw */ .ut.intoRaw(newPos);
        this.rawSet.jointSetAnchor1(this.handle, rawPoint);
        rawPoint.free();
    }
    /**
     * Sets the position of the second anchor of this joint.
     *
     * The second anchor gives the position of the application point on the
     * local frame of the second rigid-body it is attached to.
     */
    setAnchor2(newPos) {
        const rawPoint = _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.intoRaw */ .ut.intoRaw(newPos);
        this.rawSet.jointSetAnchor2(this.handle, rawPoint);
        rawPoint.free();
    }
    /**
     * Controls whether contacts are computed between colliders attached
     * to the rigid-bodies linked by this joint.
     */
    setContactsEnabled(enabled) {
        this.rawSet.jointSetContactsEnabled(this.handle, enabled);
    }
    /**
     * Indicates if contacts are enabled between colliders attached
     * to the rigid-bodies linked by this joint.
     */
    contactsEnabled() {
        return this.rawSet.jointContactsEnabled(this.handle);
    }
}
class UnitImpulseJoint extends ImpulseJoint {
    /**
     * Are the limits enabled for this joint?
     */
    limitsEnabled() {
        return this.rawSet.jointLimitsEnabled(this.handle, this.rawAxis());
    }
    /**
     * The min limit of this joint.
     */
    limitsMin() {
        return this.rawSet.jointLimitsMin(this.handle, this.rawAxis());
    }
    /**
     * The max limit of this joint.
     */
    limitsMax() {
        return this.rawSet.jointLimitsMax(this.handle, this.rawAxis());
    }
    /**
     * Sets the limits of this joint.
     *
     * @param min - The minimum bound of this joint’s free coordinate.
     * @param max - The maximum bound of this joint’s free coordinate.
     */
    setLimits(min, max) {
        this.rawSet.jointSetLimits(this.handle, this.rawAxis(), min, max);
    }
    configureMotorModel(model) {
        this.rawSet.jointConfigureMotorModel(this.handle, this.rawAxis(), model);
    }
    configureMotorVelocity(targetVel, factor) {
        this.rawSet.jointConfigureMotorVelocity(this.handle, this.rawAxis(), targetVel, factor);
    }
    configureMotorPosition(targetPos, stiffness, damping) {
        this.rawSet.jointConfigureMotorPosition(this.handle, this.rawAxis(), targetPos, stiffness, damping);
    }
    configureMotor(targetPos, targetVel, stiffness, damping) {
        this.rawSet.jointConfigureMotor(this.handle, this.rawAxis(), targetPos, targetVel, stiffness, damping);
    }
}
class FixedImpulseJoint extends ImpulseJoint {
}
class PrismaticImpulseJoint extends UnitImpulseJoint {
    rawAxis() {
        return _raw__WEBPACK_IMPORTED_MODULE_1__/* .RawJointAxis.X */ .JM.X;
    }
}
class RevoluteImpulseJoint extends UnitImpulseJoint {
    rawAxis() {
        return _raw__WEBPACK_IMPORTED_MODULE_1__/* .RawJointAxis.AngX */ .JM.AngX;
    }
}
// #if DIM3
class SphericalImpulseJoint extends ImpulseJoint {
}
// #endif
class JointData {
    constructor() { }
    /**
     * Creates a new joint descriptor that builds a Fixed joint.
     *
     * A fixed joint removes all the degrees of freedom between the affected bodies, ensuring their
     * anchor and local frames coincide in world-space.
     *
     * @param anchor1 - Point where the joint is attached on the first rigid-body affected by this joint. Expressed in the
     *                  local-space of the rigid-body.
     * @param frame1 - The reference orientation of the joint wrt. the first rigid-body.
     * @param anchor2 - Point where the joint is attached on the second rigid-body affected by this joint. Expressed in the
     *                  local-space of the rigid-body.
     * @param frame2 - The reference orientation of the joint wrt. the second rigid-body.
     */
    static fixed(anchor1, frame1, anchor2, frame2) {
        let res = new JointData();
        res.anchor1 = anchor1;
        res.anchor2 = anchor2;
        res.frame1 = frame1;
        res.frame2 = frame2;
        res.jointType = JointType.Fixed;
        return res;
    }
    // #if DIM3
    /**
     * Create a new joint descriptor that builds spherical joints.
     *
     * A spherical joint allows three relative rotational degrees of freedom
     * by preventing any relative translation between the anchors of the
     * two attached rigid-bodies.
     *
     * @param anchor1 - Point where the joint is attached on the first rigid-body affected by this joint. Expressed in the
     *                  local-space of the rigid-body.
     * @param anchor2 - Point where the joint is attached on the second rigid-body affected by this joint. Expressed in the
     *                  local-space of the rigid-body.
     */
    static spherical(anchor1, anchor2) {
        let res = new JointData();
        res.anchor1 = anchor1;
        res.anchor2 = anchor2;
        res.jointType = JointType.Spherical;
        return res;
    }
    /**
     * Creates a new joint descriptor that builds a Prismatic joint.
     *
     * A prismatic joint removes all the degrees of freedom between the
     * affected bodies, except for the translation along one axis.
     *
     * @param anchor1 - Point where the joint is attached on the first rigid-body affected by this joint. Expressed in the
     *                  local-space of the rigid-body.
     * @param anchor2 - Point where the joint is attached on the second rigid-body affected by this joint. Expressed in the
     *                  local-space of the rigid-body.
     * @param axis - Axis of the joint, expressed in the local-space of the rigid-bodies it is attached to.
     */
    static prismatic(anchor1, anchor2, axis) {
        let res = new JointData();
        res.anchor1 = anchor1;
        res.anchor2 = anchor2;
        res.axis = axis;
        res.jointType = JointType.Prismatic;
        return res;
    }
    /**
     * Create a new joint descriptor that builds Revolute joints.
     *
     * A revolute joint removes all degrees of freedom between the affected
     * bodies except for the rotation along one axis.
     *
     * @param anchor1 - Point where the joint is attached on the first rigid-body affected by this joint. Expressed in the
     *                  local-space of the rigid-body.
     * @param anchor2 - Point where the joint is attached on the second rigid-body affected by this joint. Expressed in the
     *                  local-space of the rigid-body.
     * @param axis - Axis of the joint, expressed in the local-space of the rigid-bodies it is attached to.
     */
    static revolute(anchor1, anchor2, axis) {
        let res = new JointData();
        res.anchor1 = anchor1;
        res.anchor2 = anchor2;
        res.axis = axis;
        res.jointType = JointType.Revolute;
        return res;
    }
    // #endif
    intoRaw() {
        let rawA1 = _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.intoRaw */ .ut.intoRaw(this.anchor1);
        let rawA2 = _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.intoRaw */ .ut.intoRaw(this.anchor2);
        let rawAx;
        let result;
        let limitsEnabled = false;
        let limitsMin = 0.0;
        let limitsMax = 0.0;
        switch (this.jointType) {
            case JointType.Fixed:
                let rawFra1 = _math__WEBPACK_IMPORTED_MODULE_0__/* .RotationOps.intoRaw */ .T3.intoRaw(this.frame1);
                let rawFra2 = _math__WEBPACK_IMPORTED_MODULE_0__/* .RotationOps.intoRaw */ .T3.intoRaw(this.frame2);
                result = _raw__WEBPACK_IMPORTED_MODULE_1__/* .RawGenericJoint.fixed */ .cQ.fixed(rawA1, rawFra1, rawA2, rawFra2);
                rawFra1.free();
                rawFra2.free();
                break;
            case JointType.Prismatic:
                rawAx = _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.intoRaw */ .ut.intoRaw(this.axis);
                if (!!this.limitsEnabled) {
                    limitsEnabled = true;
                    limitsMin = this.limits[0];
                    limitsMax = this.limits[1];
                }
                // #if DIM3
                result = _raw__WEBPACK_IMPORTED_MODULE_1__/* .RawGenericJoint.prismatic */ .cQ.prismatic(rawA1, rawA2, rawAx, limitsEnabled, limitsMin, limitsMax);
                // #endif
                rawAx.free();
                break;
            // #if DIM3
            case JointType.Spherical:
                result = _raw__WEBPACK_IMPORTED_MODULE_1__/* .RawGenericJoint.spherical */ .cQ.spherical(rawA1, rawA2);
                break;
            case JointType.Revolute:
                rawAx = _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.intoRaw */ .ut.intoRaw(this.axis);
                result = _raw__WEBPACK_IMPORTED_MODULE_1__/* .RawGenericJoint.revolute */ .cQ.revolute(rawA1, rawA2, rawAx);
                rawAx.free();
                break;
            // #endif
        }
        rawA1.free();
        rawA2.free();
        return result;
    }
}
//# sourceMappingURL=impulse_joint.js.map
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 206:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "l": () => (/* binding */ ImpulseJointSet)
/* harmony export */ });
/* harmony import */ var _raw__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(184);
/* harmony import */ var _coarena__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(709);
/* harmony import */ var _impulse_joint__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(380);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_raw__WEBPACK_IMPORTED_MODULE_0__, _impulse_joint__WEBPACK_IMPORTED_MODULE_2__]);
([_raw__WEBPACK_IMPORTED_MODULE_0__, _impulse_joint__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);



/**
 * A set of joints.
 *
 * To avoid leaking WASM resources, this MUST be freed manually with `jointSet.free()`
 * once you are done using it (and all the joints it created).
 */
class ImpulseJointSet {
    constructor(raw) {
        this.raw = raw || new _raw__WEBPACK_IMPORTED_MODULE_0__/* .RawImpulseJointSet */ .Qc();
        this.map = new _coarena__WEBPACK_IMPORTED_MODULE_1__/* .Coarena */ .F();
        // Initialize the map with the existing elements, if any.
        if (raw) {
            raw.forEachJointHandle((handle) => {
                this.map.set(handle, _impulse_joint__WEBPACK_IMPORTED_MODULE_2__/* .ImpulseJoint.newTyped */ .s2.newTyped(raw, null, handle));
            });
        }
    }
    /**
     * Release the WASM memory occupied by this joint set.
     */
    free() {
        if (!!this.raw) {
            this.raw.free();
        }
        this.raw = undefined;
        if (!!this.map) {
            this.map.clear();
        }
        this.map = undefined;
    }
    /** @internal */
    finalizeDeserialization(bodies) {
        this.map.forEach((joint) => joint.finalizeDeserialization(bodies));
    }
    /**
     * Creates a new joint and return its integer handle.
     *
     * @param bodies - The set of rigid-bodies containing the bodies the joint is attached to.
     * @param desc - The joint's parameters.
     * @param parent1 - The handle of the first rigid-body this joint is attached to.
     * @param parent2 - The handle of the second rigid-body this joint is attached to.
     * @param wakeUp - Should the attached rigid-bodies be awakened?
     */
    createJoint(bodies, desc, parent1, parent2, wakeUp) {
        const rawParams = desc.intoRaw();
        const handle = this.raw.createJoint(rawParams, parent1, parent2, wakeUp);
        rawParams.free();
        let joint = _impulse_joint__WEBPACK_IMPORTED_MODULE_2__/* .ImpulseJoint.newTyped */ .s2.newTyped(this.raw, bodies, handle);
        this.map.set(handle, joint);
        return joint;
    }
    /**
     * Remove a joint from this set.
     *
     * @param handle - The integer handle of the joint.
     * @param wakeUp - If `true`, the rigid-bodies attached by the removed joint will be woken-up automatically.
     */
    remove(handle, wakeUp) {
        this.raw.remove(handle, wakeUp);
        this.unmap(handle);
    }
    /**
     * Calls the given closure with the integer handle of each impulse joint attached to this rigid-body.
     *
     * @param f - The closure called with the integer handle of each impulse joint attached to the rigid-body.
     */
    forEachJointHandleAttachedToRigidBody(handle, f) {
        this.raw.forEachJointAttachedToRigidBody(handle, f);
    }
    /**
     * Internal function, do not call directly.
     * @param handle
     */
    unmap(handle) {
        this.map.delete(handle);
    }
    /**
     * The number of joints on this set.
     */
    len() {
        return this.map.len();
    }
    /**
     * Does this set contain a joint with the given handle?
     *
     * @param handle - The joint handle to check.
     */
    contains(handle) {
        return this.get(handle) != null;
    }
    /**
     * Gets the joint with the given handle.
     *
     * Returns `null` if no joint with the specified handle exists.
     *
     * @param handle - The integer handle of the joint to retrieve.
     */
    get(handle) {
        return this.map.get(handle);
    }
    /**
     * Applies the given closure to each joint contained by this set.
     *
     * @param f - The closure to apply.
     */
    forEach(f) {
        this.map.forEach(f);
    }
    /**
     * Gets all joints in the list.
     *
     * @returns joint list.
     */
    getAll() {
        return this.map.getAll();
    }
}
//# sourceMappingURL=impulse_joint_set.js.map
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 715:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Am": () => (/* reexport safe */ _multibody_joint__WEBPACK_IMPORTED_MODULE_5__.Am),
/* harmony export */   "C1": () => (/* reexport safe */ _impulse_joint__WEBPACK_IMPORTED_MODULE_3__.C1),
/* harmony export */   "JW": () => (/* reexport safe */ _impulse_joint__WEBPACK_IMPORTED_MODULE_3__.JW),
/* harmony export */   "Jj": () => (/* reexport safe */ _rigid_body__WEBPACK_IMPORTED_MODULE_0__.Jj),
/* harmony export */   "Kd": () => (/* reexport safe */ _ccd_solver__WEBPACK_IMPORTED_MODULE_8__.K),
/* harmony export */   "RT": () => (/* reexport safe */ _integration_parameters__WEBPACK_IMPORTED_MODULE_2__.R),
/* harmony export */   "UW": () => (/* reexport safe */ _multibody_joint__WEBPACK_IMPORTED_MODULE_5__.UW),
/* harmony export */   "VH": () => (/* reexport safe */ _impulse_joint__WEBPACK_IMPORTED_MODULE_3__.VH),
/* harmony export */   "Vt": () => (/* reexport safe */ _impulse_joint__WEBPACK_IMPORTED_MODULE_3__.Vt),
/* harmony export */   "_h": () => (/* reexport safe */ _impulse_joint__WEBPACK_IMPORTED_MODULE_3__._h),
/* harmony export */   "au": () => (/* reexport safe */ _impulse_joint__WEBPACK_IMPORTED_MODULE_3__.au),
/* harmony export */   "dl": () => (/* reexport safe */ _impulse_joint__WEBPACK_IMPORTED_MODULE_3__.dl),
/* harmony export */   "dx": () => (/* reexport safe */ _multibody_joint__WEBPACK_IMPORTED_MODULE_5__.dx),
/* harmony export */   "eZ": () => (/* reexport safe */ _impulse_joint__WEBPACK_IMPORTED_MODULE_3__.eZ),
/* harmony export */   "h1": () => (/* reexport safe */ _multibody_joint_set__WEBPACK_IMPORTED_MODULE_6__.h),
/* harmony export */   "ib": () => (/* reexport safe */ _rigid_body__WEBPACK_IMPORTED_MODULE_0__.ib),
/* harmony export */   "jK": () => (/* reexport safe */ _coefficient_combine_rule__WEBPACK_IMPORTED_MODULE_7__.j),
/* harmony export */   "jp": () => (/* reexport safe */ _multibody_joint__WEBPACK_IMPORTED_MODULE_5__.jp),
/* harmony export */   "lX": () => (/* reexport safe */ _impulse_joint_set__WEBPACK_IMPORTED_MODULE_4__.l),
/* harmony export */   "rF": () => (/* reexport safe */ _rigid_body_set__WEBPACK_IMPORTED_MODULE_1__.r),
/* harmony export */   "s2": () => (/* reexport safe */ _impulse_joint__WEBPACK_IMPORTED_MODULE_3__.s2),
/* harmony export */   "wI": () => (/* reexport safe */ _multibody_joint__WEBPACK_IMPORTED_MODULE_5__.wI),
/* harmony export */   "xr": () => (/* reexport safe */ _rigid_body__WEBPACK_IMPORTED_MODULE_0__.xr),
/* harmony export */   "yB": () => (/* reexport safe */ _island_manager__WEBPACK_IMPORTED_MODULE_9__.y),
/* harmony export */   "yf": () => (/* reexport safe */ _multibody_joint__WEBPACK_IMPORTED_MODULE_5__.yf)
/* harmony export */ });
/* harmony import */ var _rigid_body__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(522);
/* harmony import */ var _rigid_body_set__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(676);
/* harmony import */ var _integration_parameters__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6);
/* harmony import */ var _impulse_joint__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(380);
/* harmony import */ var _impulse_joint_set__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(206);
/* harmony import */ var _multibody_joint__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(346);
/* harmony import */ var _multibody_joint_set__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(136);
/* harmony import */ var _coefficient_combine_rule__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(42);
/* harmony import */ var _ccd_solver__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(448);
/* harmony import */ var _island_manager__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(332);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_rigid_body__WEBPACK_IMPORTED_MODULE_0__, _rigid_body_set__WEBPACK_IMPORTED_MODULE_1__, _integration_parameters__WEBPACK_IMPORTED_MODULE_2__, _impulse_joint__WEBPACK_IMPORTED_MODULE_3__, _impulse_joint_set__WEBPACK_IMPORTED_MODULE_4__, _multibody_joint__WEBPACK_IMPORTED_MODULE_5__, _multibody_joint_set__WEBPACK_IMPORTED_MODULE_6__, _ccd_solver__WEBPACK_IMPORTED_MODULE_8__, _island_manager__WEBPACK_IMPORTED_MODULE_9__]);
([_rigid_body__WEBPACK_IMPORTED_MODULE_0__, _rigid_body_set__WEBPACK_IMPORTED_MODULE_1__, _integration_parameters__WEBPACK_IMPORTED_MODULE_2__, _impulse_joint__WEBPACK_IMPORTED_MODULE_3__, _impulse_joint_set__WEBPACK_IMPORTED_MODULE_4__, _multibody_joint__WEBPACK_IMPORTED_MODULE_5__, _multibody_joint_set__WEBPACK_IMPORTED_MODULE_6__, _ccd_solver__WEBPACK_IMPORTED_MODULE_8__, _island_manager__WEBPACK_IMPORTED_MODULE_9__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);










//# sourceMappingURL=index.js.map
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 6:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "R": () => (/* binding */ IntegrationParameters)
/* harmony export */ });
/* harmony import */ var _raw__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(184);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_raw__WEBPACK_IMPORTED_MODULE_0__]);
_raw__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];

class IntegrationParameters {
    constructor(raw) {
        this.raw = raw || new _raw__WEBPACK_IMPORTED_MODULE_0__/* .RawIntegrationParameters */ .zu();
    }
    /**
     * Free the WASM memory used by these integration parameters.
     */
    free() {
        if (!!this.raw) {
            this.raw.free();
        }
        this.raw = undefined;
    }
    /**
     * The timestep length (default: `1.0 / 60.0`)
     */
    get dt() {
        return this.raw.dt;
    }
    /**
     * The Error Reduction Parameter in `[0, 1]` is the proportion of
     * the positional error to be corrected at each time step (default: `0.2`).
     */
    get erp() {
        return this.raw.erp;
    }
    /**
     * Amount of penetration the engine wont attempt to correct (default: `0.001m`).
     */
    get allowedLinearError() {
        return this.raw.allowedLinearError;
    }
    /**
     * The maximal distance separating two objects that will generate predictive contacts (default: `0.002`).
     */
    get predictionDistance() {
        return this.raw.predictionDistance;
    }
    /**
     * Maximum number of iterations performed by the velocity constraints solver (default: `4`).
     */
    get maxVelocityIterations() {
        return this.raw.maxVelocityIterations;
    }
    /**
     * Maximum number of friction iterations performed by the position-based constraints solver (default: `1`).
     */
    get maxVelocityFrictionIterations() {
        return this.raw.maxVelocityFrictionIterations;
    }
    /**
     * Maximum number of stabilization iterations performed by the position-based constraints solver (default: `1`).
     */
    get maxStabilizationIterations() {
        return this.raw.maxStabilizationIterations;
    }
    /**
     * Minimum number of dynamic bodies in each active island (default: `128`).
     */
    get minIslandSize() {
        return this.raw.minIslandSize;
    }
    /**
     * Maximum number of substeps performed by the  solver (default: `1`).
     */
    get maxCcdSubsteps() {
        return this.raw.maxCcdSubsteps;
    }
    set dt(value) {
        this.raw.dt = value;
    }
    set erp(value) {
        this.raw.erp = value;
    }
    set allowedLinearError(value) {
        this.raw.allowedLinearError = value;
    }
    set predictionDistance(value) {
        this.raw.predictionDistance = value;
    }
    set maxVelocityIterations(value) {
        this.raw.maxVelocityIterations = value;
    }
    set maxVelocityFrictionIterations(value) {
        this.raw.maxVelocityFrictionIterations = value;
    }
    set maxStabilizationIterations(value) {
        this.raw.maxStabilizationIterations = value;
    }
    set minIslandSize(value) {
        this.raw.minIslandSize = value;
    }
    set maxCcdSubsteps(value) {
        this.raw.maxCcdSubsteps = value;
    }
}
//# sourceMappingURL=integration_parameters.js.map
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 332:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "y": () => (/* binding */ IslandManager)
/* harmony export */ });
/* harmony import */ var _raw__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(184);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_raw__WEBPACK_IMPORTED_MODULE_0__]);
_raw__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];

/**
 * The CCD solver responsible for resolving Continuous Collision Detection.
 *
 * To avoid leaking WASM resources, this MUST be freed manually with `ccdSolver.free()`
 * once you are done using it.
 */
class IslandManager {
    constructor(raw) {
        this.raw = raw || new _raw__WEBPACK_IMPORTED_MODULE_0__/* .RawIslandManager */ .Is();
    }
    /**
     * Release the WASM memory occupied by this narrow-phase.
     */
    free() {
        if (!!this.raw) {
            this.raw.free();
        }
        this.raw = undefined;
    }
    /**
     * Applies the given closure to the handle of each active rigid-bodies contained by this set.
     *
     * A rigid-body is active if it is not sleeping, i.e., if it moved recently.
     *
     * @param f - The closure to apply.
     */
    forEachActiveRigidBodyHandle(f) {
        this.raw.forEachActiveRigidBodyHandle(f);
    }
}
//# sourceMappingURL=island_manager.js.map
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 346:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Am": () => (/* binding */ RevoluteMultibodyJoint),
/* harmony export */   "UW": () => (/* binding */ FixedMultibodyJoint),
/* harmony export */   "dx": () => (/* binding */ SphericalMultibodyJoint),
/* harmony export */   "jp": () => (/* binding */ PrismaticMultibodyJoint),
/* harmony export */   "wI": () => (/* binding */ UnitMultibodyJoint),
/* harmony export */   "yf": () => (/* binding */ MultibodyJoint)
/* harmony export */ });
/* harmony import */ var _raw__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(184);
/* harmony import */ var _impulse_joint__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(380);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_impulse_joint__WEBPACK_IMPORTED_MODULE_0__, _raw__WEBPACK_IMPORTED_MODULE_1__]);
([_impulse_joint__WEBPACK_IMPORTED_MODULE_0__, _raw__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);


class MultibodyJoint {
    constructor(rawSet, handle) {
        this.rawSet = rawSet;
        this.handle = handle;
    }
    static newTyped(rawSet, handle) {
        switch (rawSet.jointType(handle)) {
            case _impulse_joint__WEBPACK_IMPORTED_MODULE_0__/* .JointType.Revolute */ .dl.Revolute:
                return new RevoluteMultibodyJoint(rawSet, handle);
            case _impulse_joint__WEBPACK_IMPORTED_MODULE_0__/* .JointType.Prismatic */ .dl.Prismatic:
                return new PrismaticMultibodyJoint(rawSet, handle);
            case _impulse_joint__WEBPACK_IMPORTED_MODULE_0__/* .JointType.Fixed */ .dl.Fixed:
                return new FixedMultibodyJoint(rawSet, handle);
            // #if DIM3
            case _impulse_joint__WEBPACK_IMPORTED_MODULE_0__/* .JointType.Spherical */ .dl.Spherical:
                return new SphericalMultibodyJoint(rawSet, handle);
            // #endif
            default:
                return new MultibodyJoint(rawSet, handle);
        }
    }
    /**
     * Checks if this joint is still valid (i.e. that it has
     * not been deleted from the joint set yet).
     */
    isValid() {
        return this.rawSet.contains(this.handle);
    }
    // /**
    //  * The unique integer identifier of the first rigid-body this joint it attached to.
    //  */
    // public bodyHandle1(): RigidBodyHandle {
    //     return this.rawSet.jointBodyHandle1(this.handle);
    // }
    //
    // /**
    //  * The unique integer identifier of the second rigid-body this joint is attached to.
    //  */
    // public bodyHandle2(): RigidBodyHandle {
    //     return this.rawSet.jointBodyHandle2(this.handle);
    // }
    //
    // /**
    //  * The type of this joint given as a string.
    //  */
    // public type(): JointType {
    //     return this.rawSet.jointType(this.handle);
    // }
    //
    // // #if DIM3
    // /**
    //  * The rotation quaternion that aligns this joint's first local axis to the `x` axis.
    //  */
    // public frameX1(): Rotation {
    //     return RotationOps.fromRaw(this.rawSet.jointFrameX1(this.handle));
    // }
    //
    // // #endif
    //
    // // #if DIM3
    // /**
    //  * The rotation matrix that aligns this joint's second local axis to the `x` axis.
    //  */
    // public frameX2(): Rotation {
    //     return RotationOps.fromRaw(this.rawSet.jointFrameX2(this.handle));
    // }
    //
    // // #endif
    //
    // /**
    //  * The position of the first anchor of this joint.
    //  *
    //  * The first anchor gives the position of the points application point on the
    //  * local frame of the first rigid-body it is attached to.
    //  */
    // public anchor1(): Vector {
    //     return VectorOps.fromRaw(this.rawSet.jointAnchor1(this.handle));
    // }
    //
    // /**
    //  * The position of the second anchor of this joint.
    //  *
    //  * The second anchor gives the position of the points application point on the
    //  * local frame of the second rigid-body it is attached to.
    //  */
    // public anchor2(): Vector {
    //     return VectorOps.fromRaw(this.rawSet.jointAnchor2(this.handle));
    // }
    /**
     * Controls whether contacts are computed between colliders attached
     * to the rigid-bodies linked by this joint.
     */
    setContactsEnabled(enabled) {
        this.rawSet.jointSetContactsEnabled(this.handle, enabled);
    }
    /**
     * Indicates if contacts are enabled between colliders attached
     * to the rigid-bodies linked by this joint.
     */
    contactsEnabled() {
        return this.rawSet.jointContactsEnabled(this.handle);
    }
}
class UnitMultibodyJoint extends MultibodyJoint {
}
class FixedMultibodyJoint extends MultibodyJoint {
}
class PrismaticMultibodyJoint extends UnitMultibodyJoint {
    rawAxis() {
        return _raw__WEBPACK_IMPORTED_MODULE_1__/* .RawJointAxis.X */ .JM.X;
    }
}
class RevoluteMultibodyJoint extends UnitMultibodyJoint {
    rawAxis() {
        return _raw__WEBPACK_IMPORTED_MODULE_1__/* .RawJointAxis.AngX */ .JM.AngX;
    }
}
// #if DIM3
class SphericalMultibodyJoint extends MultibodyJoint {
}
// #endif
//# sourceMappingURL=multibody_joint.js.map
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 136:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "h": () => (/* binding */ MultibodyJointSet)
/* harmony export */ });
/* harmony import */ var _raw__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(184);
/* harmony import */ var _coarena__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(709);
/* harmony import */ var _multibody_joint__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(346);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_raw__WEBPACK_IMPORTED_MODULE_0__, _multibody_joint__WEBPACK_IMPORTED_MODULE_2__]);
([_raw__WEBPACK_IMPORTED_MODULE_0__, _multibody_joint__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);



/**
 * A set of joints.
 *
 * To avoid leaking WASM resources, this MUST be freed manually with `jointSet.free()`
 * once you are done using it (and all the joints it created).
 */
class MultibodyJointSet {
    constructor(raw) {
        this.raw = raw || new _raw__WEBPACK_IMPORTED_MODULE_0__/* .RawMultibodyJointSet */ .fl();
        this.map = new _coarena__WEBPACK_IMPORTED_MODULE_1__/* .Coarena */ .F();
        // Initialize the map with the existing elements, if any.
        if (raw) {
            raw.forEachJointHandle((handle) => {
                this.map.set(handle, _multibody_joint__WEBPACK_IMPORTED_MODULE_2__/* .MultibodyJoint.newTyped */ .yf.newTyped(this.raw, handle));
            });
        }
    }
    /**
     * Release the WASM memory occupied by this joint set.
     */
    free() {
        if (!!this.raw) {
            this.raw.free();
        }
        this.raw = undefined;
        if (!!this.map) {
            this.map.clear();
        }
        this.map = undefined;
    }
    /**
     * Creates a new joint and return its integer handle.
     *
     * @param desc - The joint's parameters.
     * @param parent1 - The handle of the first rigid-body this joint is attached to.
     * @param parent2 - The handle of the second rigid-body this joint is attached to.
     * @param wakeUp - Should the attached rigid-bodies be awakened?
     */
    createJoint(desc, parent1, parent2, wakeUp) {
        const rawParams = desc.intoRaw();
        const handle = this.raw.createJoint(rawParams, parent1, parent2, wakeUp);
        rawParams.free();
        let joint = _multibody_joint__WEBPACK_IMPORTED_MODULE_2__/* .MultibodyJoint.newTyped */ .yf.newTyped(this.raw, handle);
        this.map.set(handle, joint);
        return joint;
    }
    /**
     * Remove a joint from this set.
     *
     * @param handle - The integer handle of the joint.
     * @param wake_up - If `true`, the rigid-bodies attached by the removed joint will be woken-up automatically.
     */
    remove(handle, wake_up) {
        this.raw.remove(handle, wake_up);
        this.map.delete(handle);
    }
    /**
     * Internal function, do not call directly.
     * @param handle
     */
    unmap(handle) {
        this.map.delete(handle);
    }
    /**
     * The number of joints on this set.
     */
    len() {
        return this.map.len();
    }
    /**
     * Does this set contain a joint with the given handle?
     *
     * @param handle - The joint handle to check.
     */
    contains(handle) {
        return this.get(handle) != null;
    }
    /**
     * Gets the joint with the given handle.
     *
     * Returns `null` if no joint with the specified handle exists.
     *
     * @param handle - The integer handle of the joint to retrieve.
     */
    get(handle) {
        return this.map.get(handle);
    }
    /**
     * Applies the given closure to each joint contained by this set.
     *
     * @param f - The closure to apply.
     */
    forEach(f) {
        this.map.forEach(f);
    }
    /**
     * Calls the given closure with the integer handle of each multibody joint attached to this rigid-body.
     *
     * @param f - The closure called with the integer handle of each multibody joint attached to the rigid-body.
     */
    forEachJointHandleAttachedToRigidBody(handle, f) {
        this.raw.forEachJointAttachedToRigidBody(handle, f);
    }
    /**
     * Gets all joints in the list.
     *
     * @returns joint list.
     */
    getAll() {
        return this.map.getAll();
    }
}
//# sourceMappingURL=multibody_joint_set.js.map
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 522:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Jj": () => (/* binding */ RigidBodyType),
/* harmony export */   "ib": () => (/* binding */ RigidBody),
/* harmony export */   "xr": () => (/* binding */ RigidBodyDesc)
/* harmony export */ });
/* harmony import */ var _math__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(383);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_math__WEBPACK_IMPORTED_MODULE_0__]);
_math__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];

// #if DIM3

/**
 * The simulation status of a rigid-body.
 */
// TODO: rename this to RigidBodyType
var RigidBodyType;
(function (RigidBodyType) {
    /**
     * A `RigidBodyType::Dynamic` body can be affected by all external forces.
     */
    RigidBodyType[RigidBodyType["Dynamic"] = 0] = "Dynamic";
    /**
     * A `RigidBodyType::Fixed` body cannot be affected by external forces.
     */
    RigidBodyType[RigidBodyType["Fixed"] = 1] = "Fixed";
    /**
     * A `RigidBodyType::KinematicPositionBased` body cannot be affected by any external forces but can be controlled
     * by the user at the position level while keeping realistic one-way interaction with dynamic bodies.
     *
     * One-way interaction means that a kinematic body can push a dynamic body, but a kinematic body
     * cannot be pushed by anything. In other words, the trajectory of a kinematic body can only be
     * modified by the user and is independent from any contact or joint it is involved in.
     */
    RigidBodyType[RigidBodyType["KinematicPositionBased"] = 2] = "KinematicPositionBased";
    /**
     * A `RigidBodyType::KinematicVelocityBased` body cannot be affected by any external forces but can be controlled
     * by the user at the velocity level while keeping realistic one-way interaction with dynamic bodies.
     *
     * One-way interaction means that a kinematic body can push a dynamic body, but a kinematic body
     * cannot be pushed by anything. In other words, the trajectory of a kinematic body can only be
     * modified by the user and is independent from any contact or joint it is involved in.
     */
    RigidBodyType[RigidBodyType["KinematicVelocityBased"] = 3] = "KinematicVelocityBased";
})(RigidBodyType || (RigidBodyType = {}));
/**
 * A rigid-body.
 */
class RigidBody {
    constructor(rawSet, colliderSet, handle) {
        this.rawSet = rawSet;
        this.colliderSet = colliderSet;
        this.handle = handle;
    }
    /** @internal */
    finalizeDeserialization(colliderSet) {
        this.colliderSet = colliderSet;
    }
    /**
     * Checks if this rigid-body is still valid (i.e. that it has
     * not been deleted from the rigid-body set yet.
     */
    isValid() {
        return this.rawSet.contains(this.handle);
    }
    /**
     * Locks or unlocks the ability of this rigid-body to translate.
     *
     * @param locked - If `true`, this rigid-body will no longer translate due to forces and impulses.
     * @param wakeUp - If `true`, this rigid-body will be automatically awaken if it is currently asleep.
     */
    lockTranslations(locked, wakeUp) {
        return this.rawSet.rbLockTranslations(this.handle, locked, wakeUp);
    }
    /**
     * Locks or unlocks the ability of this rigid-body to rotate.
     *
     * @param locked - If `true`, this rigid-body will no longer rotate due to torques and impulses.
     * @param wakeUp - If `true`, this rigid-body will be automatically awaken if it is currently asleep.
     */
    lockRotations(locked, wakeUp) {
        return this.rawSet.rbLockRotations(this.handle, locked, wakeUp);
    }
    // #if DIM3
    /**
     * Locks or unlocks the ability of this rigid-body to translate along individual coordinate axes.
     *
     * @param enableX - If `false`, this rigid-body will no longer translate due to torques and impulses, along the X coordinate axis.
     * @param enableY - If `false`, this rigid-body will no longer translate due to torques and impulses, along the Y coordinate axis.
     * @param enableZ - If `false`, this rigid-body will no longer translate due to torques and impulses, along the Z coordinate axis.
     * @param wakeUp - If `true`, this rigid-body will be automatically awaken if it is currently asleep.
     */
    setEnabledTranslations(enableX, enableY, enableZ, wakeUp) {
        return this.rawSet.rbSetEnabledTranslations(this.handle, enableX, enableY, enableZ, wakeUp);
    }
    /**
     * Locks or unlocks the ability of this rigid-body to translate along individual coordinate axes.
     *
     * @param enableX - If `false`, this rigid-body will no longer translate due to torques and impulses, along the X coordinate axis.
     * @param enableY - If `false`, this rigid-body will no longer translate due to torques and impulses, along the Y coordinate axis.
     * @param enableZ - If `false`, this rigid-body will no longer translate due to torques and impulses, along the Z coordinate axis.
     * @param wakeUp - If `true`, this rigid-body will be automatically awaken if it is currently asleep.
     * @deprecated use `this.setEnabledTranslations` with the same arguments instead.
     */
    restrictTranslations(enableX, enableY, enableZ, wakeUp) {
        this.setEnabledTranslations(enableX, enableY, enableZ, wakeUp);
    }
    /**
     * Locks or unlocks the ability of this rigid-body to rotate along individual coordinate axes.
     *
     * @param enableX - If `false`, this rigid-body will no longer rotate due to torques and impulses, along the X coordinate axis.
     * @param enableY - If `false`, this rigid-body will no longer rotate due to torques and impulses, along the Y coordinate axis.
     * @param enableZ - If `false`, this rigid-body will no longer rotate due to torques and impulses, along the Z coordinate axis.
     * @param wakeUp - If `true`, this rigid-body will be automatically awaken if it is currently asleep.
     */
    setEnabledRotations(enableX, enableY, enableZ, wakeUp) {
        return this.rawSet.rbSetEnabledRotations(this.handle, enableX, enableY, enableZ, wakeUp);
    }
    /**
     * Locks or unlocks the ability of this rigid-body to rotate along individual coordinate axes.
     *
     * @param enableX - If `false`, this rigid-body will no longer rotate due to torques and impulses, along the X coordinate axis.
     * @param enableY - If `false`, this rigid-body will no longer rotate due to torques and impulses, along the Y coordinate axis.
     * @param enableZ - If `false`, this rigid-body will no longer rotate due to torques and impulses, along the Z coordinate axis.
     * @param wakeUp - If `true`, this rigid-body will be automatically awaken if it is currently asleep.
     * @deprecated use `this.setEnabledRotations` with the same arguments instead.
     */
    restrictRotations(enableX, enableY, enableZ, wakeUp) {
        this.setEnabledRotations(enableX, enableY, enableZ, wakeUp);
    }
    // #endif
    /**
     * The dominance group, in [-127, +127] this rigid-body is part of.
     */
    dominanceGroup() {
        return this.rawSet.rbDominanceGroup(this.handle);
    }
    /**
     * Sets the dominance group of this rigid-body.
     *
     * @param group - The dominance group of this rigid-body. Must be a signed integer in the range [-127, +127].
     */
    setDominanceGroup(group) {
        this.rawSet.rbSetDominanceGroup(this.handle, group);
    }
    /**
     * Enable or disable CCD (Continuous Collision Detection) for this rigid-body.
     *
     * @param enabled - If `true`, CCD will be enabled for this rigid-body.
     */
    enableCcd(enabled) {
        this.rawSet.rbEnableCcd(this.handle, enabled);
    }
    /**
     * The world-space translation of this rigid-body.
     */
    translation() {
        let res = this.rawSet.rbTranslation(this.handle);
        return _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.fromRaw */ .ut.fromRaw(res);
    }
    /**
     * The world-space orientation of this rigid-body.
     */
    rotation() {
        let res = this.rawSet.rbRotation(this.handle);
        return _math__WEBPACK_IMPORTED_MODULE_0__/* .RotationOps.fromRaw */ .T3.fromRaw(res);
    }
    /**
     * The world-space next translation of this rigid-body.
     *
     * If this rigid-body is kinematic this value is set by the `setNextKinematicTranslation`
     * method and is used for estimating the kinematic body velocity at the next timestep.
     * For non-kinematic bodies, this value is currently unspecified.
     */
    nextTranslation() {
        let res = this.rawSet.rbNextTranslation(this.handle);
        return _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.fromRaw */ .ut.fromRaw(res);
    }
    /**
     * The world-space next orientation of this rigid-body.
     *
     * If this rigid-body is kinematic this value is set by the `setNextKinematicRotation`
     * method and is used for estimating the kinematic body velocity at the next timestep.
     * For non-kinematic bodies, this value is currently unspecified.
     */
    nextRotation() {
        let res = this.rawSet.rbNextRotation(this.handle);
        return _math__WEBPACK_IMPORTED_MODULE_0__/* .RotationOps.fromRaw */ .T3.fromRaw(res);
    }
    /**
     * Sets the translation of this rigid-body.
     *
     * @param tra - The world-space position of the rigid-body.
     * @param wakeUp - Forces the rigid-body to wake-up so it is properly affected by forces if it
     *                 wasn't moving before modifying its position.
     */
    setTranslation(tra, wakeUp) {
        // #if DIM3
        this.rawSet.rbSetTranslation(this.handle, tra.x, tra.y, tra.z, wakeUp);
        // #endif
    }
    /**
     * Sets the linear velocity fo this rigid-body.
     *
     * @param vel - The linear velocity to set.
     * @param wakeUp - Forces the rigid-body to wake-up if it was asleep.
     */
    setLinvel(vel, wakeUp) {
        let rawVel = _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.intoRaw */ .ut.intoRaw(vel);
        this.rawSet.rbSetLinvel(this.handle, rawVel, wakeUp);
        rawVel.free();
    }
    /**
     * The scale factor applied to the gravity affecting
     * this rigid-body.
     */
    gravityScale() {
        return this.rawSet.rbGravityScale(this.handle);
    }
    /**
     * Sets the scale factor applied to the gravity affecting
     * this rigid-body.
     *
     * @param factor - The scale factor to set. A value of 0.0 means
     *   that this rigid-body will on longer be affected by gravity.
     * @param wakeUp - Forces the rigid-body to wake-up if it was asleep.
     */
    setGravityScale(factor, wakeUp) {
        this.rawSet.rbSetGravityScale(this.handle, factor, wakeUp);
    }
    // #if DIM3
    /**
     * Sets the rotation quaternion of this rigid-body.
     *
     * This does nothing if a zero quaternion is provided.
     *
     * @param rotation - The rotation to set.
     * @param wakeUp - Forces the rigid-body to wake-up so it is properly affected by forces if it
     * wasn't moving before modifying its position.
     */
    setRotation(rot, wakeUp) {
        this.rawSet.rbSetRotation(this.handle, rot.x, rot.y, rot.z, rot.w, wakeUp);
    }
    /**
     * Sets the angular velocity fo this rigid-body.
     *
     * @param vel - The angular velocity to set.
     * @param wakeUp - Forces the rigid-body to wake-up if it was asleep.
     */
    setAngvel(vel, wakeUp) {
        let rawVel = _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.intoRaw */ .ut.intoRaw(vel);
        this.rawSet.rbSetAngvel(this.handle, rawVel, wakeUp);
        rawVel.free();
    }
    // #endif
    /**
     * If this rigid body is kinematic, sets its future translation after the next timestep integration.
     *
     * This should be used instead of `rigidBody.setTranslation` to make the dynamic object
     * interacting with this kinematic body behave as expected. Internally, Rapier will compute
     * an artificial velocity for this rigid-body from its current position and its next kinematic
     * position. This velocity will be used to compute forces on dynamic bodies interacting with
     * this body.
     *
     * @param t - The kinematic translation to set.
     */
    setNextKinematicTranslation(t) {
        // #if DIM3
        this.rawSet.rbSetNextKinematicTranslation(this.handle, t.x, t.y, t.z);
        // #endif
    }
    // #if DIM3
    /**
     * If this rigid body is kinematic, sets its future rotation after the next timestep integration.
     *
     * This should be used instead of `rigidBody.setRotation` to make the dynamic object
     * interacting with this kinematic body behave as expected. Internally, Rapier will compute
     * an artificial velocity for this rigid-body from its current position and its next kinematic
     * position. This velocity will be used to compute forces on dynamic bodies interacting with
     * this body.
     *
     * @param rot - The kinematic rotation to set.
     */
    setNextKinematicRotation(rot) {
        this.rawSet.rbSetNextKinematicRotation(this.handle, rot.x, rot.y, rot.z, rot.w);
    }
    // #endif
    /**
     * The linear velocity of this rigid-body.
     */
    linvel() {
        return _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.fromRaw */ .ut.fromRaw(this.rawSet.rbLinvel(this.handle));
    }
    // #if DIM3
    /**
     * The angular velocity of this rigid-body.
     */
    angvel() {
        return _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.fromRaw */ .ut.fromRaw(this.rawSet.rbAngvel(this.handle));
    }
    // #endif
    /**
     * The mass of this rigid-body.
     */
    mass() {
        return this.rawSet.rbMass(this.handle);
    }
    /**
     * The inverse mass taking into account translation locking.
     */
    effectiveInvMass() {
        return _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.fromRaw */ .ut.fromRaw(this.rawSet.rbEffectiveInvMass(this.handle));
    }
    /**
     * The inverse of the mass of a rigid-body.
     *
     * If this is zero, the rigid-body is assumed to have infinite mass.
     */
    invMass() {
        return this.rawSet.rbInvMass(this.handle);
    }
    /**
     * The center of mass of a rigid-body expressed in its local-space.
     */
    localCom() {
        return _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.fromRaw */ .ut.fromRaw(this.rawSet.rbLocalCom(this.handle));
    }
    /**
     * The world-space center of mass of the rigid-body.
     */
    worldCom() {
        return _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.fromRaw */ .ut.fromRaw(this.rawSet.rbWorldCom(this.handle));
    }
    // #if DIM3
    /**
     * The inverse of the principal angular inertia of the rigid-body.
     *
     * Components set to zero are assumed to be infinite along the corresponding principal axis.
     */
    invPrincipalInertiaSqrt() {
        return _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.fromRaw */ .ut.fromRaw(this.rawSet.rbInvPrincipalInertiaSqrt(this.handle));
    }
    // #endif
    // #if DIM3
    /**
     * The angular inertia along the principal inertia axes of the rigid-body.
     */
    principalInertia() {
        return _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.fromRaw */ .ut.fromRaw(this.rawSet.rbPrincipalInertia(this.handle));
    }
    // #endif
    // #if DIM3
    /**
     * The principal vectors of the local angular inertia tensor of the rigid-body.
     */
    principalInertiaLocalFrame() {
        return _math__WEBPACK_IMPORTED_MODULE_0__/* .RotationOps.fromRaw */ .T3.fromRaw(this.rawSet.rbPrincipalInertiaLocalFrame(this.handle));
    }
    // #endif
    // #if DIM3
    /**
     * The square-root of the world-space inverse angular inertia tensor of the rigid-body,
     * taking into account rotation locking.
     */
    effectiveWorldInvInertiaSqrt() {
        return _math__WEBPACK_IMPORTED_MODULE_0__/* .SdpMatrix3Ops.fromRaw */ .PR.fromRaw(this.rawSet.rbEffectiveWorldInvInertiaSqrt(this.handle));
    }
    // #endif
    // #if DIM3
    /**
     * The effective world-space angular inertia (that takes the potential rotation locking into account) of
     * this rigid-body.
     */
    effectiveAngularInertia() {
        return _math__WEBPACK_IMPORTED_MODULE_0__/* .SdpMatrix3Ops.fromRaw */ .PR.fromRaw(this.rawSet.rbEffectiveAngularInertia(this.handle));
    }
    // #endif
    /**
     * Put this rigid body to sleep.
     *
     * A sleeping body no longer moves and is no longer simulated by the physics engine unless
     * it is waken up. It can be woken manually with `this.wakeUp()` or automatically due to
     * external forces like contacts.
     */
    sleep() {
        this.rawSet.rbSleep(this.handle);
    }
    /**
     * Wakes this rigid-body up.
     *
     * A dynamic rigid-body that does not move during several consecutive frames will
     * be put to sleep by the physics engine, i.e., it will stop being simulated in order
     * to avoid useless computations.
     * This methods forces a sleeping rigid-body to wake-up. This is useful, e.g., before modifying
     * the position of a dynamic body so that it is properly simulated afterwards.
     */
    wakeUp() {
        this.rawSet.rbWakeUp(this.handle);
    }
    /**
     * Is CCD enabled for this rigid-body?
     */
    isCcdEnabled() {
        return this.rawSet.rbIsCcdEnabled(this.handle);
    }
    /**
     * The number of colliders attached to this rigid-body.
     */
    numColliders() {
        return this.rawSet.rbNumColliders(this.handle);
    }
    /**
     * Retrieves the `i-th` collider attached to this rigid-body.
     *
     * @param i - The index of the collider to retrieve. Must be a number in `[0, this.numColliders()[`.
     *         This index is **not** the same as the unique identifier of the collider.
     */
    collider(i) {
        return this.colliderSet.get(this.rawSet.rbCollider(this.handle, i));
    }
    /**
     * Sets whether this rigid-body is enabled or not.
     *
     * @param enabled - Set to `false` to disable this rigid-body and all its attached colliders.
     */
    setEnabled(enabled) {
        this.rawSet.rbSetEnabled(this.handle, enabled);
    }
    /**
     * Is this rigid-body enabled?
     */
    isEnabled() {
        return this.rawSet.rbIsEnabled(this.handle);
    }
    /**
     * The status of this rigid-body: static, dynamic, or kinematic.
     */
    bodyType() {
        return this.rawSet.rbBodyType(this.handle);
    }
    /**
     * Set a new status for this rigid-body: static, dynamic, or kinematic.
     */
    setBodyType(type, wakeUp) {
        return this.rawSet.rbSetBodyType(this.handle, type, wakeUp);
    }
    /**
     * Is this rigid-body sleeping?
     */
    isSleeping() {
        return this.rawSet.rbIsSleeping(this.handle);
    }
    /**
     * Is the velocity of this rigid-body not zero?
     */
    isMoving() {
        return this.rawSet.rbIsMoving(this.handle);
    }
    /**
     * Is this rigid-body static?
     */
    isFixed() {
        return this.rawSet.rbIsFixed(this.handle);
    }
    /**
     * Is this rigid-body kinematic?
     */
    isKinematic() {
        return this.rawSet.rbIsKinematic(this.handle);
    }
    /**
     * Is this rigid-body dynamic?
     */
    isDynamic() {
        return this.rawSet.rbIsDynamic(this.handle);
    }
    /**
     * The linear damping coefficient of this rigid-body.
     */
    linearDamping() {
        return this.rawSet.rbLinearDamping(this.handle);
    }
    /**
     * The angular damping coefficient of this rigid-body.
     */
    angularDamping() {
        return this.rawSet.rbAngularDamping(this.handle);
    }
    /**
     * Sets the linear damping factor applied to this rigid-body.
     *
     * @param factor - The damping factor to set.
     */
    setLinearDamping(factor) {
        this.rawSet.rbSetLinearDamping(this.handle, factor);
    }
    /**
     * Recompute the mass-properties of this rigid-bodies based on its currently attached colliders.
     */
    recomputeMassPropertiesFromColliders() {
        this.rawSet.rbRecomputeMassPropertiesFromColliders(this.handle, this.colliderSet.raw);
    }
    /**
     * Sets the rigid-body's additional mass.
     *
     * The total angular inertia of the rigid-body will be scaled automatically based on this additional mass. If this
     * scaling effect isn’t desired, use Self::additional_mass_properties instead of this method.
     *
     * This is only the "additional" mass because the total mass of the rigid-body is equal to the sum of this
     * additional mass and the mass computed from the colliders (with non-zero densities) attached to this rigid-body.
     *
     * That total mass (which includes the attached colliders’ contributions) will be updated at the name physics step,
     * or can be updated manually with `this.recomputeMassPropertiesFromColliders`.
     *
     * This will override any previous additional mass-properties set by `this.setAdditionalMass`,
     * `this.setAdditionalMassProperties`, `RigidBodyDesc::setAdditionalMass`, or
     * `RigidBodyDesc.setAdditionalMassfProperties` for this rigid-body.
     *
     * @param mass - The additional mass to set.
     * @param wakeUp - If `true` then the rigid-body will be woken up if it was put to sleep because it did not move for a while.
     */
    setAdditionalMass(mass, wakeUp) {
        this.rawSet.rbSetAdditionalMass(this.handle, mass, wakeUp);
    }
    // #if DIM3
    /**
     * Sets the rigid-body's additional mass-properties.
     *
     * This is only the "additional" mass-properties because the total mass-properties of the rigid-body is equal to the
     * sum of this additional mass-properties and the mass computed from the colliders (with non-zero densities) attached
     * to this rigid-body.
     *
     * That total mass-properties (which include the attached colliders’ contributions) will be updated at the name
     * physics step, or can be updated manually with `this.recomputeMassPropertiesFromColliders`.
     *
     * This will override any previous mass-properties set by `this.setAdditionalMass`,
     * `this.setAdditionalMassProperties`, `RigidBodyDesc.setAdditionalMass`, or `RigidBodyDesc.setAdditionalMassProperties`
     * for this rigid-body.
     *
     * If `wake_up` is true then the rigid-body will be woken up if it was put to sleep because it did not move for a while.
     */
    setAdditionalMassProperties(mass, centerOfMass, principalAngularInertia, angularInertiaLocalFrame, wakeUp) {
        let rawCom = _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.intoRaw */ .ut.intoRaw(centerOfMass);
        let rawPrincipalInertia = _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.intoRaw */ .ut.intoRaw(principalAngularInertia);
        let rawInertiaFrame = _math__WEBPACK_IMPORTED_MODULE_0__/* .RotationOps.intoRaw */ .T3.intoRaw(angularInertiaLocalFrame);
        this.rawSet.rbSetAdditionalMassProperties(this.handle, mass, rawCom, rawPrincipalInertia, rawInertiaFrame, wakeUp);
        rawCom.free();
        rawPrincipalInertia.free();
        rawInertiaFrame.free();
    }
    // #endif
    /**
     * Sets the linear damping factor applied to this rigid-body.
     *
     * @param factor - The damping factor to set.
     */
    setAngularDamping(factor) {
        this.rawSet.rbSetAngularDamping(this.handle, factor);
    }
    /**
     * Resets to zero the user forces (but not torques) applied to this rigid-body.
     *
     * @param wakeUp - should the rigid-body be automatically woken-up?
     */
    resetForces(wakeUp) {
        this.rawSet.rbResetForces(this.handle, wakeUp);
    }
    /**
     * Resets to zero the user torques applied to this rigid-body.
     *
     * @param wakeUp - should the rigid-body be automatically woken-up?
     */
    resetTorques(wakeUp) {
        this.rawSet.rbResetTorques(this.handle, wakeUp);
    }
    /**
     * Adds a force at the center-of-mass of this rigid-body.
     *
     * @param force - the world-space force to add to the rigid-body.
     * @param wakeUp - should the rigid-body be automatically woken-up?
     */
    addForce(force, wakeUp) {
        const rawForce = _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.intoRaw */ .ut.intoRaw(force);
        this.rawSet.rbAddForce(this.handle, rawForce, wakeUp);
        rawForce.free();
    }
    /**
     * Applies an impulse at the center-of-mass of this rigid-body.
     *
     * @param impulse - the world-space impulse to apply on the rigid-body.
     * @param wakeUp - should the rigid-body be automatically woken-up?
     */
    applyImpulse(impulse, wakeUp) {
        const rawImpulse = _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.intoRaw */ .ut.intoRaw(impulse);
        this.rawSet.rbApplyImpulse(this.handle, rawImpulse, wakeUp);
        rawImpulse.free();
    }
    // #if DIM3
    /**
     * Adds a torque at the center-of-mass of this rigid-body.
     *
     * @param torque - the world-space torque to add to the rigid-body.
     * @param wakeUp - should the rigid-body be automatically woken-up?
     */
    addTorque(torque, wakeUp) {
        const rawTorque = _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.intoRaw */ .ut.intoRaw(torque);
        this.rawSet.rbAddTorque(this.handle, rawTorque, wakeUp);
        rawTorque.free();
    }
    // #endif
    // #if DIM3
    /**
     * Applies an impulsive torque at the center-of-mass of this rigid-body.
     *
     * @param torqueImpulse - the world-space torque impulse to apply on the rigid-body.
     * @param wakeUp - should the rigid-body be automatically woken-up?
     */
    applyTorqueImpulse(torqueImpulse, wakeUp) {
        const rawTorqueImpulse = _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.intoRaw */ .ut.intoRaw(torqueImpulse);
        this.rawSet.rbApplyTorqueImpulse(this.handle, rawTorqueImpulse, wakeUp);
        rawTorqueImpulse.free();
    }
    // #endif
    /**
     * Adds a force at the given world-space point of this rigid-body.
     *
     * @param force - the world-space force to add to the rigid-body.
     * @param point - the world-space point where the impulse is to be applied on the rigid-body.
     * @param wakeUp - should the rigid-body be automatically woken-up?
     */
    addForceAtPoint(force, point, wakeUp) {
        const rawForce = _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.intoRaw */ .ut.intoRaw(force);
        const rawPoint = _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.intoRaw */ .ut.intoRaw(point);
        this.rawSet.rbAddForceAtPoint(this.handle, rawForce, rawPoint, wakeUp);
        rawForce.free();
        rawPoint.free();
    }
    /**
     * Applies an impulse at the given world-space point of this rigid-body.
     *
     * @param impulse - the world-space impulse to apply on the rigid-body.
     * @param point - the world-space point where the impulse is to be applied on the rigid-body.
     * @param wakeUp - should the rigid-body be automatically woken-up?
     */
    applyImpulseAtPoint(impulse, point, wakeUp) {
        const rawImpulse = _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.intoRaw */ .ut.intoRaw(impulse);
        const rawPoint = _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.intoRaw */ .ut.intoRaw(point);
        this.rawSet.rbApplyImpulseAtPoint(this.handle, rawImpulse, rawPoint, wakeUp);
        rawImpulse.free();
        rawPoint.free();
    }
}
class RigidBodyDesc {
    constructor(status) {
        this.enabled = true;
        this.status = status;
        this.translation = _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.zeros */ .ut.zeros();
        this.rotation = _math__WEBPACK_IMPORTED_MODULE_0__/* .RotationOps.identity */ .T3.identity();
        this.gravityScale = 1.0;
        this.linvel = _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.zeros */ .ut.zeros();
        this.mass = 0.0;
        this.massOnly = false;
        this.centerOfMass = _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.zeros */ .ut.zeros();
        this.translationsEnabledX = true;
        this.translationsEnabledY = true;
        // #if DIM3
        this.angvel = _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.zeros */ .ut.zeros();
        this.principalAngularInertia = _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.zeros */ .ut.zeros();
        this.angularInertiaLocalFrame = _math__WEBPACK_IMPORTED_MODULE_0__/* .RotationOps.identity */ .T3.identity();
        this.translationsEnabledZ = true;
        this.rotationsEnabledX = true;
        this.rotationsEnabledY = true;
        this.rotationsEnabledZ = true;
        // #endif
        this.linearDamping = 0.0;
        this.angularDamping = 0.0;
        this.canSleep = true;
        this.sleeping = false;
        this.ccdEnabled = false;
        this.dominanceGroup = 0;
    }
    /**
     * A rigid-body descriptor used to build a dynamic rigid-body.
     */
    static dynamic() {
        return new RigidBodyDesc(RigidBodyType.Dynamic);
    }
    /**
     * A rigid-body descriptor used to build a position-based kinematic rigid-body.
     */
    static kinematicPositionBased() {
        return new RigidBodyDesc(RigidBodyType.KinematicPositionBased);
    }
    /**
     * A rigid-body descriptor used to build a velocity-based kinematic rigid-body.
     */
    static kinematicVelocityBased() {
        return new RigidBodyDesc(RigidBodyType.KinematicVelocityBased);
    }
    /**
     * A rigid-body descriptor used to build a fixed rigid-body.
     */
    static fixed() {
        return new RigidBodyDesc(RigidBodyType.Fixed);
    }
    /**
     * A rigid-body descriptor used to build a dynamic rigid-body.
     *
     * @deprecated The method has been renamed to `.dynamic()`.
     */
    static newDynamic() {
        return new RigidBodyDesc(RigidBodyType.Dynamic);
    }
    /**
     * A rigid-body descriptor used to build a position-based kinematic rigid-body.
     *
     * @deprecated The method has been renamed to `.kinematicPositionBased()`.
     */
    static newKinematicPositionBased() {
        return new RigidBodyDesc(RigidBodyType.KinematicPositionBased);
    }
    /**
     * A rigid-body descriptor used to build a velocity-based kinematic rigid-body.
     *
     * @deprecated The method has been renamed to `.kinematicVelocityBased()`.
     */
    static newKinematicVelocityBased() {
        return new RigidBodyDesc(RigidBodyType.KinematicVelocityBased);
    }
    /**
     * A rigid-body descriptor used to build a fixed rigid-body.
     *
     * @deprecated The method has been renamed to `.fixed()`.
     */
    static newStatic() {
        return new RigidBodyDesc(RigidBodyType.Fixed);
    }
    setDominanceGroup(group) {
        this.dominanceGroup = group;
        return this;
    }
    /**
     * Sets whether the created rigid-body will be enabled or disabled.
     * @param enabled − If set to `false` the rigid-body will be disabled at creation.
     */
    setEnabled(enabled) {
        this.enabled = enabled;
        return this;
    }
    // #if DIM3
    /**
     * Sets the initial translation of the rigid-body to create.
     *
     * @param tra - The translation to set.
     */
    setTranslation(x, y, z) {
        if (typeof x != "number" ||
            typeof y != "number" ||
            typeof z != "number")
            throw TypeError("The translation components must be numbers.");
        this.translation = { x: x, y: y, z: z };
        return this;
    }
    // #endif
    /**
     * Sets the initial rotation of the rigid-body to create.
     *
     * @param rot - The rotation to set.
     */
    setRotation(rot) {
        // #if DIM3
        _math__WEBPACK_IMPORTED_MODULE_0__/* .RotationOps.copy */ .T3.copy(this.rotation, rot);
        // #endif
        return this;
    }
    /**
     * Sets the scale factor applied to the gravity affecting
     * the rigid-body being built.
     *
     * @param scale - The scale factor. Set this to `0.0` if the rigid-body
     *   needs to ignore gravity.
     */
    setGravityScale(scale) {
        this.gravityScale = scale;
        return this;
    }
    /**
     * Sets the initial mass of the rigid-body being built, before adding colliders' contributions.
     *
     * @param mass − The initial mass of the rigid-body to create.
     */
    setAdditionalMass(mass) {
        this.mass = mass;
        this.massOnly = true;
        return this;
    }
    // #if DIM3
    /**
     * Sets the initial linear velocity of the rigid-body to create.
     *
     * @param x - The linear velocity to set along the `x` axis.
     * @param y - The linear velocity to set along the `y` axis.
     * @param z - The linear velocity to set along the `z` axis.
     */
    setLinvel(x, y, z) {
        if (typeof x != "number" ||
            typeof y != "number" ||
            typeof z != "number")
            throw TypeError("The linvel components must be numbers.");
        this.linvel = { x: x, y: y, z: z };
        return this;
    }
    /**
     * Sets the initial angular velocity of the rigid-body to create.
     *
     * @param vel - The angular velocity to set.
     */
    setAngvel(vel) {
        _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.copy */ .ut.copy(this.angvel, vel);
        return this;
    }
    /**
     * Sets the mass properties of the rigid-body being built.
     *
     * Note that the final mass properties of the rigid-bodies depends
     * on the initial mass-properties of the rigid-body (set by this method)
     * to which is added the contributions of all the colliders with non-zero density
     * attached to this rigid-body.
     *
     * Therefore, if you want your provided mass properties to be the final
     * mass properties of your rigid-body, don't attach colliders to it, or
     * only attach colliders with densities equal to zero.
     *
     * @param mass − The initial mass of the rigid-body to create.
     * @param centerOfMass − The initial center-of-mass of the rigid-body to create.
     * @param principalAngularInertia − The initial principal angular inertia of the rigid-body to create.
     *                                  These are the eigenvalues of the angular inertia matrix.
     * @param angularInertiaLocalFrame − The initial local angular inertia frame of the rigid-body to create.
     *                                   These are the eigenvectors of the angular inertia matrix.
     */
    setAdditionalMassProperties(mass, centerOfMass, principalAngularInertia, angularInertiaLocalFrame) {
        this.mass = mass;
        _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.copy */ .ut.copy(this.centerOfMass, centerOfMass);
        _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.copy */ .ut.copy(this.principalAngularInertia, principalAngularInertia);
        _math__WEBPACK_IMPORTED_MODULE_0__/* .RotationOps.copy */ .T3.copy(this.angularInertiaLocalFrame, angularInertiaLocalFrame);
        this.massOnly = false;
        return this;
    }
    /**
     * Allow translation of this rigid-body only along specific axes.
     * @param translationsEnabledX - Are translations along the X axis enabled?
     * @param translationsEnabledY - Are translations along the y axis enabled?
     * @param translationsEnabledZ - Are translations along the Z axis enabled?
     */
    enabledTranslations(translationsEnabledX, translationsEnabledY, translationsEnabledZ) {
        this.translationsEnabledX = translationsEnabledX;
        this.translationsEnabledY = translationsEnabledY;
        this.translationsEnabledZ = translationsEnabledZ;
        return this;
    }
    /**
     * Allow translation of this rigid-body only along specific axes.
     * @param translationsEnabledX - Are translations along the X axis enabled?
     * @param translationsEnabledY - Are translations along the y axis enabled?
     * @param translationsEnabledZ - Are translations along the Z axis enabled?
     * @deprecated use `this.enabledTranslations` with the same arguments instead.
     */
    restrictTranslations(translationsEnabledX, translationsEnabledY, translationsEnabledZ) {
        return this.enabledTranslations(translationsEnabledX, translationsEnabledY, translationsEnabledZ);
    }
    /**
     * Locks all translations that would have resulted from forces on
     * the created rigid-body.
     */
    lockTranslations() {
        return this.enabledTranslations(false, false, false);
    }
    /**
     * Allow rotation of this rigid-body only along specific axes.
     * @param rotationsEnabledX - Are rotations along the X axis enabled?
     * @param rotationsEnabledY - Are rotations along the y axis enabled?
     * @param rotationsEnabledZ - Are rotations along the Z axis enabled?
     */
    enabledRotations(rotationsEnabledX, rotationsEnabledY, rotationsEnabledZ) {
        this.rotationsEnabledX = rotationsEnabledX;
        this.rotationsEnabledY = rotationsEnabledY;
        this.rotationsEnabledZ = rotationsEnabledZ;
        return this;
    }
    /**
     * Allow rotation of this rigid-body only along specific axes.
     * @param rotationsEnabledX - Are rotations along the X axis enabled?
     * @param rotationsEnabledY - Are rotations along the y axis enabled?
     * @param rotationsEnabledZ - Are rotations along the Z axis enabled?
     * @deprecated use `this.enabledRotations` with the same arguments instead.
     */
    restrictRotations(rotationsEnabledX, rotationsEnabledY, rotationsEnabledZ) {
        return this.enabledRotations(rotationsEnabledX, rotationsEnabledY, rotationsEnabledZ);
    }
    /**
     * Locks all rotations that would have resulted from forces on
     * the created rigid-body.
     */
    lockRotations() {
        return this.restrictRotations(false, false, false);
    }
    // #endif
    /**
     * Sets the linear damping of the rigid-body to create.
     *
     * This will progressively slowdown the translational movement of the rigid-body.
     *
     * @param damping - The angular damping coefficient. Should be >= 0. The higher this
     *                  value is, the stronger the translational slowdown will be.
     */
    setLinearDamping(damping) {
        this.linearDamping = damping;
        return this;
    }
    /**
     * Sets the angular damping of the rigid-body to create.
     *
     * This will progressively slowdown the rotational movement of the rigid-body.
     *
     * @param damping - The angular damping coefficient. Should be >= 0. The higher this
     *                  value is, the stronger the rotational slowdown will be.
     */
    setAngularDamping(damping) {
        this.angularDamping = damping;
        return this;
    }
    /**
     * Sets whether or not the rigid-body to create can sleep.
     *
     * @param can - true if the rigid-body can sleep, false if it can't.
     */
    setCanSleep(can) {
        this.canSleep = can;
        return this;
    }
    /**
     * Sets whether or not the rigid-body is to be created asleep.
     *
     * @param can - true if the rigid-body should be in sleep, default false.
     */
    setSleeping(sleeping) {
        this.sleeping = sleeping;
        return this;
    }
    /**
     * Sets whether Continuous Collision Detection (CCD) is enabled for this rigid-body.
     *
     * @param enabled - true if the rigid-body has CCD enabled.
     */
    setCcdEnabled(enabled) {
        this.ccdEnabled = enabled;
        return this;
    }
    /**
     * Sets the user-defined object of this rigid-body.
     *
     * @param userData - The user-defined object to set.
     */
    setUserData(data) {
        this.userData = data;
        return this;
    }
}
//# sourceMappingURL=rigid_body.js.map
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 676:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "r": () => (/* binding */ RigidBodySet)
/* harmony export */ });
/* harmony import */ var _raw__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(184);
/* harmony import */ var _coarena__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(709);
/* harmony import */ var _math__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(383);
/* harmony import */ var _rigid_body__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(522);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_raw__WEBPACK_IMPORTED_MODULE_0__, _rigid_body__WEBPACK_IMPORTED_MODULE_2__, _math__WEBPACK_IMPORTED_MODULE_3__]);
([_raw__WEBPACK_IMPORTED_MODULE_0__, _rigid_body__WEBPACK_IMPORTED_MODULE_2__, _math__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);




/**
 * A set of rigid bodies that can be handled by a physics pipeline.
 *
 * To avoid leaking WASM resources, this MUST be freed manually with `rigidBodySet.free()`
 * once you are done using it (and all the rigid-bodies it created).
 */
class RigidBodySet {
    constructor(raw) {
        this.raw = raw || new _raw__WEBPACK_IMPORTED_MODULE_0__/* .RawRigidBodySet */ .fY();
        this.map = new _coarena__WEBPACK_IMPORTED_MODULE_1__/* .Coarena */ .F();
        // deserialize
        if (raw) {
            raw.forEachRigidBodyHandle((handle) => {
                this.map.set(handle, new _rigid_body__WEBPACK_IMPORTED_MODULE_2__/* .RigidBody */ .ib(raw, null, handle));
            });
        }
    }
    /**
     * Release the WASM memory occupied by this rigid-body set.
     */
    free() {
        if (!!this.raw) {
            this.raw.free();
        }
        this.raw = undefined;
        if (!!this.map) {
            this.map.clear();
        }
        this.map = undefined;
    }
    /**
     * Internal method, do not call this explicitly.
     */
    finalizeDeserialization(colliderSet) {
        this.map.forEach((rb) => rb.finalizeDeserialization(colliderSet));
    }
    /**
     * Creates a new rigid-body and return its integer handle.
     *
     * @param desc - The description of the rigid-body to create.
     */
    createRigidBody(colliderSet, desc) {
        let rawTra = _math__WEBPACK_IMPORTED_MODULE_3__/* .VectorOps.intoRaw */ .ut.intoRaw(desc.translation);
        let rawRot = _math__WEBPACK_IMPORTED_MODULE_3__/* .RotationOps.intoRaw */ .T3.intoRaw(desc.rotation);
        let rawLv = _math__WEBPACK_IMPORTED_MODULE_3__/* .VectorOps.intoRaw */ .ut.intoRaw(desc.linvel);
        let rawCom = _math__WEBPACK_IMPORTED_MODULE_3__/* .VectorOps.intoRaw */ .ut.intoRaw(desc.centerOfMass);
        // #if DIM3
        let rawAv = _math__WEBPACK_IMPORTED_MODULE_3__/* .VectorOps.intoRaw */ .ut.intoRaw(desc.angvel);
        let rawPrincipalInertia = _math__WEBPACK_IMPORTED_MODULE_3__/* .VectorOps.intoRaw */ .ut.intoRaw(desc.principalAngularInertia);
        let rawInertiaFrame = _math__WEBPACK_IMPORTED_MODULE_3__/* .RotationOps.intoRaw */ .T3.intoRaw(desc.angularInertiaLocalFrame);
        // #endif
        let handle = this.raw.createRigidBody(desc.enabled, rawTra, rawRot, desc.gravityScale, desc.mass, desc.massOnly, rawCom, rawLv, 
        // #if DIM3
        rawAv, rawPrincipalInertia, rawInertiaFrame, desc.translationsEnabledX, desc.translationsEnabledY, desc.translationsEnabledZ, desc.rotationsEnabledX, desc.rotationsEnabledY, desc.rotationsEnabledZ, 
        // #endif
        desc.linearDamping, desc.angularDamping, desc.status, desc.canSleep, desc.sleeping, desc.ccdEnabled, desc.dominanceGroup);
        rawTra.free();
        rawRot.free();
        rawLv.free();
        rawCom.free();
        // #if DIM3
        rawAv.free();
        rawPrincipalInertia.free();
        rawInertiaFrame.free();
        // #endif
        const body = new _rigid_body__WEBPACK_IMPORTED_MODULE_2__/* .RigidBody */ .ib(this.raw, colliderSet, handle);
        body.userData = desc.userData;
        this.map.set(handle, body);
        return body;
    }
    /**
     * Removes a rigid-body from this set.
     *
     * This will also remove all the colliders and joints attached to the rigid-body.
     *
     * @param handle - The integer handle of the rigid-body to remove.
     * @param colliders - The set of colliders that may contain colliders attached to the removed rigid-body.
     * @param impulseJoints - The set of impulse joints that may contain joints attached to the removed rigid-body.
     * @param multibodyJoints - The set of multibody joints that may contain joints attached to the removed rigid-body.
     */
    remove(handle, islands, colliders, impulseJoints, multibodyJoints) {
        // Unmap the entities that will be removed automatically because of the rigid-body removals.
        for (let i = 0; i < this.raw.rbNumColliders(handle); i += 1) {
            colliders.unmap(this.raw.rbCollider(handle, i));
        }
        impulseJoints.forEachJointHandleAttachedToRigidBody(handle, (handle) => impulseJoints.unmap(handle));
        multibodyJoints.forEachJointHandleAttachedToRigidBody(handle, (handle) => multibodyJoints.unmap(handle));
        // Remove the rigid-body.
        this.raw.remove(handle, islands.raw, colliders.raw, impulseJoints.raw, multibodyJoints.raw);
        this.map.delete(handle);
    }
    /**
     * The number of rigid-bodies on this set.
     */
    len() {
        return this.map.len();
    }
    /**
     * Does this set contain a rigid-body with the given handle?
     *
     * @param handle - The rigid-body handle to check.
     */
    contains(handle) {
        return this.get(handle) != null;
    }
    /**
     * Gets the rigid-body with the given handle.
     *
     * @param handle - The handle of the rigid-body to retrieve.
     */
    get(handle) {
        return this.map.get(handle);
    }
    /**
     * Applies the given closure to each rigid-body contained by this set.
     *
     * @param f - The closure to apply.
     */
    forEach(f) {
        this.map.forEach(f);
    }
    /**
     * Applies the given closure to each active rigid-bodies contained by this set.
     *
     * A rigid-body is active if it is not sleeping, i.e., if it moved recently.
     *
     * @param f - The closure to apply.
     */
    forEachActiveRigidBody(islands, f) {
        islands.forEachActiveRigidBodyHandle((handle) => {
            f(this.get(handle));
        });
    }
    /**
     * Gets all rigid-bodies in the list.
     *
     * @returns rigid-bodies list.
     */
    getAll() {
        return this.map.getAll();
    }
}
//# sourceMappingURL=rigid_body_set.js.map
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 324:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ActiveCollisionTypes": () => (/* reexport safe */ _geometry__WEBPACK_IMPORTED_MODULE_3__.vq),
/* harmony export */   "ActiveEvents": () => (/* reexport safe */ _pipeline__WEBPACK_IMPORTED_MODULE_4__.Md),
/* harmony export */   "ActiveHooks": () => (/* reexport safe */ _pipeline__WEBPACK_IMPORTED_MODULE_4__.iX),
/* harmony export */   "Ball": () => (/* reexport safe */ _geometry__WEBPACK_IMPORTED_MODULE_3__.ec),
/* harmony export */   "BroadPhase": () => (/* reexport safe */ _geometry__WEBPACK_IMPORTED_MODULE_3__.NT),
/* harmony export */   "CCDSolver": () => (/* reexport safe */ _dynamics__WEBPACK_IMPORTED_MODULE_2__.Kd),
/* harmony export */   "Capsule": () => (/* reexport safe */ _geometry__WEBPACK_IMPORTED_MODULE_3__.sw),
/* harmony export */   "CharacterCollision": () => (/* reexport safe */ _control__WEBPACK_IMPORTED_MODULE_5__._),
/* harmony export */   "CoefficientCombineRule": () => (/* reexport safe */ _dynamics__WEBPACK_IMPORTED_MODULE_2__.jK),
/* harmony export */   "Collider": () => (/* reexport safe */ _geometry__WEBPACK_IMPORTED_MODULE_3__.YM),
/* harmony export */   "ColliderDesc": () => (/* reexport safe */ _geometry__WEBPACK_IMPORTED_MODULE_3__.ic),
/* harmony export */   "ColliderSet": () => (/* reexport safe */ _geometry__WEBPACK_IMPORTED_MODULE_3__.zY),
/* harmony export */   "Cone": () => (/* reexport safe */ _geometry__WEBPACK_IMPORTED_MODULE_3__.Qq),
/* harmony export */   "ConvexPolyhedron": () => (/* reexport safe */ _geometry__WEBPACK_IMPORTED_MODULE_3__.YD),
/* harmony export */   "Cuboid": () => (/* reexport safe */ _geometry__WEBPACK_IMPORTED_MODULE_3__.jv),
/* harmony export */   "Cylinder": () => (/* reexport safe */ _geometry__WEBPACK_IMPORTED_MODULE_3__.Ab),
/* harmony export */   "DebugRenderBuffers": () => (/* reexport safe */ _pipeline__WEBPACK_IMPORTED_MODULE_4__.tt),
/* harmony export */   "DebugRenderPipeline": () => (/* reexport safe */ _pipeline__WEBPACK_IMPORTED_MODULE_4__.kh),
/* harmony export */   "EventQueue": () => (/* reexport safe */ _pipeline__WEBPACK_IMPORTED_MODULE_4__.NH),
/* harmony export */   "FeatureType": () => (/* reexport safe */ _geometry__WEBPACK_IMPORTED_MODULE_3__.Te),
/* harmony export */   "FixedImpulseJoint": () => (/* reexport safe */ _dynamics__WEBPACK_IMPORTED_MODULE_2__.JW),
/* harmony export */   "FixedMultibodyJoint": () => (/* reexport safe */ _dynamics__WEBPACK_IMPORTED_MODULE_2__.UW),
/* harmony export */   "HalfSpace": () => (/* reexport safe */ _geometry__WEBPACK_IMPORTED_MODULE_3__.Fr),
/* harmony export */   "Heightfield": () => (/* reexport safe */ _geometry__WEBPACK_IMPORTED_MODULE_3__.f4),
/* harmony export */   "ImpulseJoint": () => (/* reexport safe */ _dynamics__WEBPACK_IMPORTED_MODULE_2__.s2),
/* harmony export */   "ImpulseJointSet": () => (/* reexport safe */ _dynamics__WEBPACK_IMPORTED_MODULE_2__.lX),
/* harmony export */   "IntegrationParameters": () => (/* reexport safe */ _dynamics__WEBPACK_IMPORTED_MODULE_2__.RT),
/* harmony export */   "IslandManager": () => (/* reexport safe */ _dynamics__WEBPACK_IMPORTED_MODULE_2__.yB),
/* harmony export */   "JointData": () => (/* reexport safe */ _dynamics__WEBPACK_IMPORTED_MODULE_2__._h),
/* harmony export */   "JointType": () => (/* reexport safe */ _dynamics__WEBPACK_IMPORTED_MODULE_2__.dl),
/* harmony export */   "KinematicCharacterController": () => (/* reexport safe */ _control__WEBPACK_IMPORTED_MODULE_5__.m),
/* harmony export */   "MassPropsMode": () => (/* reexport safe */ _geometry__WEBPACK_IMPORTED_MODULE_3__.uV),
/* harmony export */   "MotorModel": () => (/* reexport safe */ _dynamics__WEBPACK_IMPORTED_MODULE_2__.Vt),
/* harmony export */   "MultibodyJoint": () => (/* reexport safe */ _dynamics__WEBPACK_IMPORTED_MODULE_2__.yf),
/* harmony export */   "MultibodyJointSet": () => (/* reexport safe */ _dynamics__WEBPACK_IMPORTED_MODULE_2__.h1),
/* harmony export */   "NarrowPhase": () => (/* reexport safe */ _geometry__WEBPACK_IMPORTED_MODULE_3__.L4),
/* harmony export */   "PhysicsPipeline": () => (/* reexport safe */ _pipeline__WEBPACK_IMPORTED_MODULE_4__.DJ),
/* harmony export */   "PointColliderProjection": () => (/* reexport safe */ _geometry__WEBPACK_IMPORTED_MODULE_3__.Vl),
/* harmony export */   "PointProjection": () => (/* reexport safe */ _geometry__WEBPACK_IMPORTED_MODULE_3__.FP),
/* harmony export */   "Polyline": () => (/* reexport safe */ _geometry__WEBPACK_IMPORTED_MODULE_3__.aH),
/* harmony export */   "PrismaticImpulseJoint": () => (/* reexport safe */ _dynamics__WEBPACK_IMPORTED_MODULE_2__.eZ),
/* harmony export */   "PrismaticMultibodyJoint": () => (/* reexport safe */ _dynamics__WEBPACK_IMPORTED_MODULE_2__.jp),
/* harmony export */   "Quaternion": () => (/* reexport safe */ _math__WEBPACK_IMPORTED_MODULE_1__._f),
/* harmony export */   "QueryFilterFlags": () => (/* reexport safe */ _pipeline__WEBPACK_IMPORTED_MODULE_4__._m),
/* harmony export */   "QueryPipeline": () => (/* reexport safe */ _pipeline__WEBPACK_IMPORTED_MODULE_4__.Vq),
/* harmony export */   "Ray": () => (/* reexport safe */ _geometry__WEBPACK_IMPORTED_MODULE_3__.zH),
/* harmony export */   "RayColliderIntersection": () => (/* reexport safe */ _geometry__WEBPACK_IMPORTED_MODULE_3__.No),
/* harmony export */   "RayColliderToi": () => (/* reexport safe */ _geometry__WEBPACK_IMPORTED_MODULE_3__.cu),
/* harmony export */   "RayIntersection": () => (/* reexport safe */ _geometry__WEBPACK_IMPORTED_MODULE_3__.Gz),
/* harmony export */   "RevoluteImpulseJoint": () => (/* reexport safe */ _dynamics__WEBPACK_IMPORTED_MODULE_2__.au),
/* harmony export */   "RevoluteMultibodyJoint": () => (/* reexport safe */ _dynamics__WEBPACK_IMPORTED_MODULE_2__.Am),
/* harmony export */   "RigidBody": () => (/* reexport safe */ _dynamics__WEBPACK_IMPORTED_MODULE_2__.ib),
/* harmony export */   "RigidBodyDesc": () => (/* reexport safe */ _dynamics__WEBPACK_IMPORTED_MODULE_2__.xr),
/* harmony export */   "RigidBodySet": () => (/* reexport safe */ _dynamics__WEBPACK_IMPORTED_MODULE_2__.rF),
/* harmony export */   "RigidBodyType": () => (/* reexport safe */ _dynamics__WEBPACK_IMPORTED_MODULE_2__.Jj),
/* harmony export */   "RotationOps": () => (/* reexport safe */ _math__WEBPACK_IMPORTED_MODULE_1__.T3),
/* harmony export */   "RoundCone": () => (/* reexport safe */ _geometry__WEBPACK_IMPORTED_MODULE_3__.eT),
/* harmony export */   "RoundConvexPolyhedron": () => (/* reexport safe */ _geometry__WEBPACK_IMPORTED_MODULE_3__.Ch),
/* harmony export */   "RoundCuboid": () => (/* reexport safe */ _geometry__WEBPACK_IMPORTED_MODULE_3__.iA),
/* harmony export */   "RoundCylinder": () => (/* reexport safe */ _geometry__WEBPACK_IMPORTED_MODULE_3__.$t),
/* harmony export */   "RoundTriangle": () => (/* reexport safe */ _geometry__WEBPACK_IMPORTED_MODULE_3__.$R),
/* harmony export */   "SdpMatrix3": () => (/* reexport safe */ _math__WEBPACK_IMPORTED_MODULE_1__.w4),
/* harmony export */   "SdpMatrix3Ops": () => (/* reexport safe */ _math__WEBPACK_IMPORTED_MODULE_1__.PR),
/* harmony export */   "Segment": () => (/* reexport safe */ _geometry__WEBPACK_IMPORTED_MODULE_3__.XX),
/* harmony export */   "SerializationPipeline": () => (/* reexport safe */ _pipeline__WEBPACK_IMPORTED_MODULE_4__.y9),
/* harmony export */   "Shape": () => (/* reexport safe */ _geometry__WEBPACK_IMPORTED_MODULE_3__.bn),
/* harmony export */   "ShapeColliderTOI": () => (/* reexport safe */ _geometry__WEBPACK_IMPORTED_MODULE_3__.mB),
/* harmony export */   "ShapeContact": () => (/* reexport safe */ _geometry__WEBPACK_IMPORTED_MODULE_3__.Qi),
/* harmony export */   "ShapeTOI": () => (/* reexport safe */ _geometry__WEBPACK_IMPORTED_MODULE_3__.GJ),
/* harmony export */   "ShapeType": () => (/* reexport safe */ _geometry__WEBPACK_IMPORTED_MODULE_3__.DY),
/* harmony export */   "SolverFlags": () => (/* reexport safe */ _pipeline__WEBPACK_IMPORTED_MODULE_4__.Nv),
/* harmony export */   "SphericalImpulseJoint": () => (/* reexport safe */ _dynamics__WEBPACK_IMPORTED_MODULE_2__.VH),
/* harmony export */   "SphericalMultibodyJoint": () => (/* reexport safe */ _dynamics__WEBPACK_IMPORTED_MODULE_2__.dx),
/* harmony export */   "TempContactForceEvent": () => (/* reexport safe */ _pipeline__WEBPACK_IMPORTED_MODULE_4__.qV),
/* harmony export */   "TempContactManifold": () => (/* reexport safe */ _geometry__WEBPACK_IMPORTED_MODULE_3__.eL),
/* harmony export */   "TriMesh": () => (/* reexport safe */ _geometry__WEBPACK_IMPORTED_MODULE_3__.az),
/* harmony export */   "Triangle": () => (/* reexport safe */ _geometry__WEBPACK_IMPORTED_MODULE_3__.CJ),
/* harmony export */   "UnitImpulseJoint": () => (/* reexport safe */ _dynamics__WEBPACK_IMPORTED_MODULE_2__.C1),
/* harmony export */   "UnitMultibodyJoint": () => (/* reexport safe */ _dynamics__WEBPACK_IMPORTED_MODULE_2__.wI),
/* harmony export */   "Vector3": () => (/* reexport safe */ _math__WEBPACK_IMPORTED_MODULE_1__.P),
/* harmony export */   "VectorOps": () => (/* reexport safe */ _math__WEBPACK_IMPORTED_MODULE_1__.ut),
/* harmony export */   "World": () => (/* reexport safe */ _pipeline__WEBPACK_IMPORTED_MODULE_4__.q3),
/* harmony export */   "version": () => (/* binding */ version)
/* harmony export */ });
/* harmony import */ var _raw__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(184);
/* harmony import */ var _math__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(383);
/* harmony import */ var _dynamics__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(715);
/* harmony import */ var _geometry__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(328);
/* harmony import */ var _pipeline__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(161);
/* harmony import */ var _control__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(620);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_raw__WEBPACK_IMPORTED_MODULE_0__, _math__WEBPACK_IMPORTED_MODULE_1__, _dynamics__WEBPACK_IMPORTED_MODULE_2__, _geometry__WEBPACK_IMPORTED_MODULE_3__, _pipeline__WEBPACK_IMPORTED_MODULE_4__, _control__WEBPACK_IMPORTED_MODULE_5__]);
([_raw__WEBPACK_IMPORTED_MODULE_0__, _math__WEBPACK_IMPORTED_MODULE_1__, _dynamics__WEBPACK_IMPORTED_MODULE_2__, _geometry__WEBPACK_IMPORTED_MODULE_3__, _pipeline__WEBPACK_IMPORTED_MODULE_4__, _control__WEBPACK_IMPORTED_MODULE_5__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);

function version() {
    return (0,_raw__WEBPACK_IMPORTED_MODULE_0__/* .version */ .i8)();
}






//# sourceMappingURL=exports.js.map
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 261:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "N": () => (/* binding */ BroadPhase)
/* harmony export */ });
/* harmony import */ var _raw__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(184);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_raw__WEBPACK_IMPORTED_MODULE_0__]);
_raw__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];

/**
 * The broad-phase used for coarse collision-detection.
 *
 * To avoid leaking WASM resources, this MUST be freed manually with `broadPhase.free()`
 * once you are done using it.
 */
class BroadPhase {
    constructor(raw) {
        this.raw = raw || new _raw__WEBPACK_IMPORTED_MODULE_0__/* .RawBroadPhase */ .FU();
    }
    /**
     * Release the WASM memory occupied by this broad-phase.
     */
    free() {
        if (!!this.raw) {
            this.raw.free();
        }
        this.raw = undefined;
    }
}
//# sourceMappingURL=broad_phase.js.map
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 377:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "YM": () => (/* binding */ Collider),
/* harmony export */   "ic": () => (/* binding */ ColliderDesc),
/* harmony export */   "uV": () => (/* binding */ MassPropsMode),
/* harmony export */   "vq": () => (/* binding */ ActiveCollisionTypes)
/* harmony export */ });
/* harmony import */ var _math__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(383);
/* harmony import */ var _dynamics__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(42);
/* harmony import */ var _shape__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(429);
/* harmony import */ var _ray__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(238);
/* harmony import */ var _point__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(461);
/* harmony import */ var _toi__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(961);
/* harmony import */ var _contact__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(254);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_shape__WEBPACK_IMPORTED_MODULE_0__, _math__WEBPACK_IMPORTED_MODULE_1__, _point__WEBPACK_IMPORTED_MODULE_2__, _toi__WEBPACK_IMPORTED_MODULE_3__, _contact__WEBPACK_IMPORTED_MODULE_4__, _ray__WEBPACK_IMPORTED_MODULE_5__]);
([_shape__WEBPACK_IMPORTED_MODULE_0__, _math__WEBPACK_IMPORTED_MODULE_1__, _point__WEBPACK_IMPORTED_MODULE_2__, _toi__WEBPACK_IMPORTED_MODULE_3__, _contact__WEBPACK_IMPORTED_MODULE_4__, _ray__WEBPACK_IMPORTED_MODULE_5__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);







/**
 * Flags affecting whether collision-detection happens between two colliders
 * depending on the type of rigid-bodies they are attached to.
 */
var ActiveCollisionTypes;
(function (ActiveCollisionTypes) {
    /**
     * Enable collision-detection between a collider attached to a dynamic body
     * and another collider attached to a dynamic body.
     */
    ActiveCollisionTypes[ActiveCollisionTypes["DYNAMIC_DYNAMIC"] = 1] = "DYNAMIC_DYNAMIC";
    /**
     * Enable collision-detection between a collider attached to a dynamic body
     * and another collider attached to a kinematic body.
     */
    ActiveCollisionTypes[ActiveCollisionTypes["DYNAMIC_KINEMATIC"] = 12] = "DYNAMIC_KINEMATIC";
    /**
     * Enable collision-detection between a collider attached to a dynamic body
     * and another collider attached to a fixed body (or not attached to any body).
     */
    ActiveCollisionTypes[ActiveCollisionTypes["DYNAMIC_FIXED"] = 2] = "DYNAMIC_FIXED";
    /**
     * Enable collision-detection between a collider attached to a kinematic body
     * and another collider attached to a kinematic body.
     */
    ActiveCollisionTypes[ActiveCollisionTypes["KINEMATIC_KINEMATIC"] = 52224] = "KINEMATIC_KINEMATIC";
    /**
     * Enable collision-detection between a collider attached to a kinematic body
     * and another collider attached to a fixed body (or not attached to any body).
     */
    ActiveCollisionTypes[ActiveCollisionTypes["KINEMATIC_FIXED"] = 8704] = "KINEMATIC_FIXED";
    /**
     * Enable collision-detection between a collider attached to a fixed body (or
     * not attached to any body) and another collider attached to a fixed body (or
     * not attached to any body).
     */
    ActiveCollisionTypes[ActiveCollisionTypes["FIXED_FIXED"] = 32] = "FIXED_FIXED";
    /**
     * The default active collision types, enabling collisions between a dynamic body
     * and another body of any type, but not enabling collisions between two non-dynamic bodies.
     */
    ActiveCollisionTypes[ActiveCollisionTypes["DEFAULT"] = 15] = "DEFAULT";
    /**
     * Enable collisions between any kind of rigid-bodies (including between two non-dynamic bodies).
     */
    ActiveCollisionTypes[ActiveCollisionTypes["ALL"] = 60943] = "ALL";
})(ActiveCollisionTypes || (ActiveCollisionTypes = {}));
/**
 * A geometric entity that can be attached to a body so it can be affected
 * by contacts and proximity queries.
 */
class Collider {
    constructor(colliderSet, handle, parent, shape) {
        this.colliderSet = colliderSet;
        this.handle = handle;
        this._parent = parent;
        this._shape = shape;
    }
    /** @internal */
    finalizeDeserialization(bodies) {
        if (this.handle != null) {
            this._parent = bodies.get(this.colliderSet.raw.coParent(this.handle));
        }
    }
    ensureShapeIsCached() {
        if (!this._shape)
            this._shape = _shape__WEBPACK_IMPORTED_MODULE_0__/* .Shape.fromRaw */ .bn.fromRaw(this.colliderSet.raw, this.handle);
    }
    /**
     * The shape of this collider.
     */
    get shape() {
        this.ensureShapeIsCached();
        return this._shape;
    }
    /**
     * Checks if this collider is still valid (i.e. that it has
     * not been deleted from the collider set yet).
     */
    isValid() {
        return this.colliderSet.raw.contains(this.handle);
    }
    /**
     * The world-space translation of this rigid-body.
     */
    translation() {
        return _math__WEBPACK_IMPORTED_MODULE_1__/* .VectorOps.fromRaw */ .ut.fromRaw(this.colliderSet.raw.coTranslation(this.handle));
    }
    /**
     * The world-space orientation of this rigid-body.
     */
    rotation() {
        return _math__WEBPACK_IMPORTED_MODULE_1__/* .RotationOps.fromRaw */ .T3.fromRaw(this.colliderSet.raw.coRotation(this.handle));
    }
    /**
     * Is this collider a sensor?
     */
    isSensor() {
        return this.colliderSet.raw.coIsSensor(this.handle);
    }
    /**
     * Sets whether or not this collider is a sensor.
     * @param isSensor - If `true`, the collider will be a sensor.
     */
    setSensor(isSensor) {
        this.colliderSet.raw.coSetSensor(this.handle, isSensor);
    }
    /**
     * Sets the new shape of the collider.
     * @param shape - The collider’s new shape.
     */
    setShape(shape) {
        let rawShape = shape.intoRaw();
        this.colliderSet.raw.coSetShape(this.handle, rawShape);
        rawShape.free();
        this._shape = shape;
    }
    /**
     * Sets whether this collider is enabled or not.
     *
     * @param enabled - Set to `false` to disable this collider (its parent rigid-body won’t be disabled automatically by this).
     */
    setEnabled(enabled) {
        this.colliderSet.raw.coSetEnabled(this.handle, enabled);
    }
    /**
     * Is this collider enabled?
     */
    isEnabled() {
        return this.colliderSet.raw.coIsEnabled(this.handle);
    }
    /**
     * Sets the restitution coefficient of the collider to be created.
     *
     * @param restitution - The restitution coefficient in `[0, 1]`. A value of 0 (the default) means no bouncing behavior
     *                   while 1 means perfect bouncing (though energy may still be lost due to numerical errors of the
     *                   constraints solver).
     */
    setRestitution(restitution) {
        this.colliderSet.raw.coSetRestitution(this.handle, restitution);
    }
    /**
     * Sets the friction coefficient of the collider to be created.
     *
     * @param friction - The friction coefficient. Must be greater or equal to 0. This is generally smaller than 1. The
     *                   higher the coefficient, the stronger friction forces will be for contacts with the collider
     *                   being built.
     */
    setFriction(friction) {
        this.colliderSet.raw.coSetFriction(this.handle, friction);
    }
    /**
     * Gets the rule used to combine the friction coefficients of two colliders
     * colliders involved in a contact.
     */
    frictionCombineRule() {
        return this.colliderSet.raw.coFrictionCombineRule(this.handle);
    }
    /**
     * Sets the rule used to combine the friction coefficients of two colliders
     * colliders involved in a contact.
     *
     * @param rule − The combine rule to apply.
     */
    setFrictionCombineRule(rule) {
        this.colliderSet.raw.coSetFrictionCombineRule(this.handle, rule);
    }
    /**
     * Gets the rule used to combine the restitution coefficients of two colliders
     * colliders involved in a contact.
     */
    restitutionCombineRule() {
        return this.colliderSet.raw.coRestitutionCombineRule(this.handle);
    }
    /**
     * Sets the rule used to combine the restitution coefficients of two colliders
     * colliders involved in a contact.
     *
     * @param rule − The combine rule to apply.
     */
    setRestitutionCombineRule(rule) {
        this.colliderSet.raw.coSetRestitutionCombineRule(this.handle, rule);
    }
    /**
     * Sets the collision groups used by this collider.
     *
     * Two colliders will interact iff. their collision groups are compatible.
     * See the documentation of `InteractionGroups` for details on teh used bit pattern.
     *
     * @param groups - The collision groups used for the collider being built.
     */
    setCollisionGroups(groups) {
        this.colliderSet.raw.coSetCollisionGroups(this.handle, groups);
    }
    /**
     * Sets the solver groups used by this collider.
     *
     * Forces between two colliders in contact will be computed iff their solver
     * groups are compatible.
     * See the documentation of `InteractionGroups` for details on the used bit pattern.
     *
     * @param groups - The solver groups used for the collider being built.
     */
    setSolverGroups(groups) {
        this.colliderSet.raw.coSetSolverGroups(this.handle, groups);
    }
    /**
     * Get the physics hooks active for this collider.
     */
    activeHooks() {
        return this.colliderSet.raw.coActiveHooks(this.handle);
    }
    /**
     * Set the physics hooks active for this collider.
     *
     * Use this to enable custom filtering rules for contact/intersecstion pairs involving this collider.
     *
     * @param activeHooks - The hooks active for contact/intersection pairs involving this collider.
     */
    setActiveHooks(activeHooks) {
        this.colliderSet.raw.coSetActiveHooks(this.handle, activeHooks);
    }
    /**
     * The events active for this collider.
     */
    activeEvents() {
        return this.colliderSet.raw.coActiveEvents(this.handle);
    }
    /**
     * Set the events active for this collider.
     *
     * Use this to enable contact and/or intersection event reporting for this collider.
     *
     * @param activeEvents - The events active for contact/intersection pairs involving this collider.
     */
    setActiveEvents(activeEvents) {
        this.colliderSet.raw.coSetActiveEvents(this.handle, activeEvents);
    }
    /**
     * Gets the collision types active for this collider.
     */
    activeCollisionTypes() {
        return this.colliderSet.raw.coActiveCollisionTypes(this.handle);
    }
    /**
     * Sets the total force magnitude beyond which a contact force event can be emitted.
     *
     * @param threshold - The new force threshold.
     */
    setContactForceEventThreshold(threshold) {
        return this.colliderSet.raw.coSetContactForceEventThreshold(this.handle, threshold);
    }
    /**
     * The total force magnitude beyond which a contact force event can be emitted.
     */
    contactForceEventThreshold() {
        return this.colliderSet.raw.coContactForceEventThreshold(this.handle);
    }
    /**
     * Set the collision types active for this collider.
     *
     * @param activeCollisionTypes - The hooks active for contact/intersection pairs involving this collider.
     */
    setActiveCollisionTypes(activeCollisionTypes) {
        this.colliderSet.raw.coSetActiveCollisionTypes(this.handle, activeCollisionTypes);
    }
    /**
     * Sets the uniform density of this collider.
     *
     * This will override any previous mass-properties set by `this.setDensity`,
     * `this.setMass`, `this.setMassProperties`, `ColliderDesc.density`,
     * `ColliderDesc.mass`, or `ColliderDesc.massProperties` for this collider.
     *
     * The mass and angular inertia of this collider will be computed automatically based on its
     * shape.
     */
    setDensity(density) {
        this.colliderSet.raw.coSetDensity(this.handle, density);
    }
    /**
     * Sets the mass of this collider.
     *
     * This will override any previous mass-properties set by `this.setDensity`,
     * `this.setMass`, `this.setMassProperties`, `ColliderDesc.density`,
     * `ColliderDesc.mass`, or `ColliderDesc.massProperties` for this collider.
     *
     * The angular inertia of this collider will be computed automatically based on its shape
     * and this mass value.
     */
    setMass(mass) {
        this.colliderSet.raw.coSetMass(this.handle, mass);
    }
    // #if DIM3
    /**
     * Sets the mass of this collider.
     *
     * This will override any previous mass-properties set by `this.setDensity`,
     * `this.setMass`, `this.setMassProperties`, `ColliderDesc.density`,
     * `ColliderDesc.mass`, or `ColliderDesc.massProperties` for this collider.
     */
    setMassProperties(mass, centerOfMass, principalAngularInertia, angularInertiaLocalFrame) {
        let rawCom = _math__WEBPACK_IMPORTED_MODULE_1__/* .VectorOps.intoRaw */ .ut.intoRaw(centerOfMass);
        let rawPrincipalInertia = _math__WEBPACK_IMPORTED_MODULE_1__/* .VectorOps.intoRaw */ .ut.intoRaw(principalAngularInertia);
        let rawInertiaFrame = _math__WEBPACK_IMPORTED_MODULE_1__/* .RotationOps.intoRaw */ .T3.intoRaw(angularInertiaLocalFrame);
        this.colliderSet.raw.coSetMassProperties(this.handle, mass, rawCom, rawPrincipalInertia, rawInertiaFrame);
        rawCom.free();
        rawPrincipalInertia.free();
        rawInertiaFrame.free();
    }
    // #endif
    /**
     * Sets the translation of this collider.
     *
     * @param tra - The world-space position of the collider.
     */
    setTranslation(tra) {
        // #if DIM3
        this.colliderSet.raw.coSetTranslation(this.handle, tra.x, tra.y, tra.z);
        // #endif
    }
    /**
     * Sets the translation of this collider relative to its parent rigid-body.
     *
     * Does nothing if this collider isn't attached to a rigid-body.
     *
     * @param tra - The new translation of the collider relative to its parent.
     */
    setTranslationWrtParent(tra) {
        // #if DIM3
        this.colliderSet.raw.coSetTranslationWrtParent(this.handle, tra.x, tra.y, tra.z);
        // #endif
    }
    // #if DIM3
    /**
     * Sets the rotation quaternion of this collider.
     *
     * This does nothing if a zero quaternion is provided.
     *
     * @param rotation - The rotation to set.
     */
    setRotation(rot) {
        this.colliderSet.raw.coSetRotation(this.handle, rot.x, rot.y, rot.z, rot.w);
    }
    /**
     * Sets the rotation quaternion of this collider relative to its parent rigid-body.
     *
     * This does nothing if a zero quaternion is provided or if this collider isn't
     * attached to a rigid-body.
     *
     * @param rotation - The rotation to set.
     */
    setRotationWrtParent(rot) {
        this.colliderSet.raw.coSetRotationWrtParent(this.handle, rot.x, rot.y, rot.z, rot.w);
    }
    // #endif
    /**
     * The type of the shape of this collider.
     * @deprecated this field will be removed in the future, please access this field on `shape` member instead.
     */
    shapeType() {
        return this.colliderSet.raw.coShapeType(this.handle);
    }
    /**
     * The half-extents of this collider if it is a cuboid shape.
     * @deprecated this field will be removed in the future, please access this field on `shape` member instead.
     */
    halfExtents() {
        return _math__WEBPACK_IMPORTED_MODULE_1__/* .VectorOps.fromRaw */ .ut.fromRaw(this.colliderSet.raw.coHalfExtents(this.handle));
    }
    /**
     * Sets the half-extents of this collider if it is a cuboid shape.
     *
     * @param newHalfExtents - desired half extents.
     */
    setHalfExtents(newHalfExtents) {
        const rawPoint = _math__WEBPACK_IMPORTED_MODULE_1__/* .VectorOps.intoRaw */ .ut.intoRaw(newHalfExtents);
        this.colliderSet.raw.coSetHalfExtents(this.handle, rawPoint);
    }
    /**
     * The radius of this collider if it is a ball, cylinder, capsule, or cone shape.
     * @deprecated this field will be removed in the future, please access this field on `shape` member instead.
     */
    radius() {
        return this.colliderSet.raw.coRadius(this.handle);
    }
    /**
     * Sets the radius of this collider if it is a ball, cylinder, capsule, or cone shape.
     *
     * @param newRadius - desired radius.
     */
    setRadius(newRadius) {
        this.colliderSet.raw.coSetRadius(this.handle, newRadius);
    }
    /**
     * The radius of the round edges of this collider if it is a round cylinder.
     * @deprecated this field will be removed in the future, please access this field on `shape` member instead.
     */
    roundRadius() {
        return this.colliderSet.raw.coRoundRadius(this.handle);
    }
    /**
     * Sets the radius of the round edges of this collider if it has round edges.
     *
     * @param newBorderRadius - desired round edge radius.
     */
    setRoundRadius(newBorderRadius) {
        this.colliderSet.raw.coSetRoundRadius(this.handle, newBorderRadius);
    }
    /**
     * The half height of this collider if it is a cylinder, capsule, or cone shape.
     * @deprecated this field will be removed in the future, please access this field on `shape` member instead.
     */
    halfHeight() {
        return this.colliderSet.raw.coHalfHeight(this.handle);
    }
    /**
     * Sets the half height of this collider if it is a cylinder, capsule, or cone shape.
     *
     * @param newHalfheight - desired half height.
     */
    setHalfHeight(newHalfheight) {
        this.colliderSet.raw.coSetHalfHeight(this.handle, newHalfheight);
    }
    /**
     * If this collider has a triangle mesh, polyline, convex polygon, or convex polyhedron shape,
     * this returns the vertex buffer of said shape.
     * @deprecated this field will be removed in the future, please access this field on `shape` member instead.
     */
    vertices() {
        return this.colliderSet.raw.coVertices(this.handle);
    }
    /**
     * If this collider has a triangle mesh, polyline, or convex polyhedron shape,
     * this returns the index buffer of said shape.
     * @deprecated this field will be removed in the future, please access this field on `shape` member instead.
     */
    indices() {
        return this.colliderSet.raw.coIndices(this.handle);
    }
    /**
     * If this collider has a heightfield shape, this returns the heights buffer of
     * the heightfield.
     * In 3D, the returned height matrix is provided in column-major order.
     * @deprecated this field will be removed in the future, please access this field on `shape` member instead.
     */
    heightfieldHeights() {
        return this.colliderSet.raw.coHeightfieldHeights(this.handle);
    }
    /**
     * If this collider has a heightfield shape, this returns the scale
     * applied to it.
     * @deprecated this field will be removed in the future, please access this field on `shape` member instead.
     */
    heightfieldScale() {
        let scale = this.colliderSet.raw.coHeightfieldScale(this.handle);
        return _math__WEBPACK_IMPORTED_MODULE_1__/* .VectorOps.fromRaw */ .ut.fromRaw(scale);
    }
    // #if DIM3
    /**
     * If this collider has a heightfield shape, this returns the number of
     * rows of its height matrix.
     * @deprecated this field will be removed in the future, please access this field on `shape` member instead.
     */
    heightfieldNRows() {
        return this.colliderSet.raw.coHeightfieldNRows(this.handle);
    }
    /**
     * If this collider has a heightfield shape, this returns the number of
     * columns of its height matrix.
     * @deprecated this field will be removed in the future, please access this field on `shape` member instead.
     */
    heightfieldNCols() {
        return this.colliderSet.raw.coHeightfieldNCols(this.handle);
    }
    // #endif
    /**
     * The rigid-body this collider is attached to.
     */
    parent() {
        return this._parent;
    }
    /**
     * The friction coefficient of this collider.
     */
    friction() {
        return this.colliderSet.raw.coFriction(this.handle);
    }
    /**
     * The restitution coefficient of this collider.
     */
    restitution() {
        return this.colliderSet.raw.coRestitution(this.handle);
    }
    /**
     * The density of this collider.
     */
    density() {
        return this.colliderSet.raw.coDensity(this.handle);
    }
    /**
     * The mass of this collider.
     */
    mass() {
        return this.colliderSet.raw.coMass(this.handle);
    }
    /**
     * The volume of this collider.
     */
    volume() {
        return this.colliderSet.raw.coVolume(this.handle);
    }
    /**
     * The collision groups of this collider.
     */
    collisionGroups() {
        return this.colliderSet.raw.coCollisionGroups(this.handle);
    }
    /**
     * The solver groups of this collider.
     */
    solverGroups() {
        return this.colliderSet.raw.coSolverGroups(this.handle);
    }
    /**
     * Tests if this collider contains a point.
     *
     * @param point - The point to test.
     */
    containsPoint(point) {
        let rawPoint = _math__WEBPACK_IMPORTED_MODULE_1__/* .VectorOps.intoRaw */ .ut.intoRaw(point);
        let result = this.colliderSet.raw.coContainsPoint(this.handle, rawPoint);
        rawPoint.free();
        return result;
    }
    /**
     * Find the projection of a point on this collider.
     *
     * @param point - The point to project.
     * @param solid - If this is set to `true` then the collider shapes are considered to
     *   be plain (if the point is located inside of a plain shape, its projection is the point
     *   itself). If it is set to `false` the collider shapes are considered to be hollow
     *   (if the point is located inside of an hollow shape, it is projected on the shape's
     *   boundary).
     */
    projectPoint(point, solid) {
        let rawPoint = _math__WEBPACK_IMPORTED_MODULE_1__/* .VectorOps.intoRaw */ .ut.intoRaw(point);
        let result = _point__WEBPACK_IMPORTED_MODULE_2__/* .PointProjection.fromRaw */ .F.fromRaw(this.colliderSet.raw.coProjectPoint(this.handle, rawPoint, solid));
        rawPoint.free();
        return result;
    }
    /**
     * Tests if this collider intersects the given ray.
     *
     * @param ray - The ray to cast.
     * @param maxToi - The maximum time-of-impact that can be reported by this cast. This effectively
     *   limits the length of the ray to `ray.dir.norm() * maxToi`.
     */
    intersectsRay(ray, maxToi) {
        let rawOrig = _math__WEBPACK_IMPORTED_MODULE_1__/* .VectorOps.intoRaw */ .ut.intoRaw(ray.origin);
        let rawDir = _math__WEBPACK_IMPORTED_MODULE_1__/* .VectorOps.intoRaw */ .ut.intoRaw(ray.dir);
        let result = this.colliderSet.raw.coIntersectsRay(this.handle, rawOrig, rawDir, maxToi);
        rawOrig.free();
        rawDir.free();
        return result;
    }
    /*
     * Computes the smallest time between this and the given shape under translational movement are separated by a distance smaller or equal to distance.
     *
     * @param collider1Vel - The constant velocity of the current shape to cast (i.e. the cast direction).
     * @param shape2 - The shape to cast against.
     * @param shape2Pos - The position of the second shape.
     * @param shape2Rot - The rotation of the second shape.
     * @param shape2Vel - The constant velocity of the second shape.
     * @param maxToi - The maximum time-of-impact that can be reported by this cast. This effectively
     *   limits the distance traveled by the shape to `collider1Vel.norm() * maxToi`.
     * @param stopAtPenetration - If set to `false`, the linear shape-cast won’t immediately stop if
     *   the shape is penetrating another shape at its starting point **and** its trajectory is such
     *   that it’s on a path to exist that penetration state.
     */
    castShape(collider1Vel, shape2, shape2Pos, shape2Rot, shape2Vel, maxToi, stopAtPenetration) {
        let rawCollider1Vel = _math__WEBPACK_IMPORTED_MODULE_1__/* .VectorOps.intoRaw */ .ut.intoRaw(collider1Vel);
        let rawShape2Pos = _math__WEBPACK_IMPORTED_MODULE_1__/* .VectorOps.intoRaw */ .ut.intoRaw(shape2Pos);
        let rawShape2Rot = _math__WEBPACK_IMPORTED_MODULE_1__/* .RotationOps.intoRaw */ .T3.intoRaw(shape2Rot);
        let rawShape2Vel = _math__WEBPACK_IMPORTED_MODULE_1__/* .VectorOps.intoRaw */ .ut.intoRaw(shape2Vel);
        let rawShape2 = shape2.intoRaw();
        let result = _toi__WEBPACK_IMPORTED_MODULE_3__/* .ShapeTOI.fromRaw */ .G.fromRaw(this.colliderSet, this.colliderSet.raw.coCastShape(this.handle, rawCollider1Vel, rawShape2, rawShape2Pos, rawShape2Rot, rawShape2Vel, maxToi, stopAtPenetration));
        rawCollider1Vel.free();
        rawShape2Pos.free();
        rawShape2Rot.free();
        rawShape2Vel.free();
        rawShape2.free();
        return result;
    }
    /*
     * Computes the smallest time between this and the given collider under translational movement are separated by a distance smaller or equal to distance.
     *
     * @param collider1Vel - The constant velocity of the current collider to cast (i.e. the cast direction).
     * @param collider2 - The collider to cast against.
     * @param collider2Vel - The constant velocity of the second collider.
     * @param maxToi - The maximum time-of-impact that can be reported by this cast. This effectively
     *   limits the distance traveled by the shape to `shapeVel.norm() * maxToi`.
     * @param stopAtPenetration - If set to `false`, the linear shape-cast won’t immediately stop if
     *   the shape is penetrating another shape at its starting point **and** its trajectory is such
     *   that it’s on a path to exist that penetration state.
     */
    castCollider(collider1Vel, collider2, collider2Vel, maxToi, stopAtPenetration) {
        let rawCollider1Vel = _math__WEBPACK_IMPORTED_MODULE_1__/* .VectorOps.intoRaw */ .ut.intoRaw(collider1Vel);
        let rawCollider2Vel = _math__WEBPACK_IMPORTED_MODULE_1__/* .VectorOps.intoRaw */ .ut.intoRaw(collider2Vel);
        let result = _toi__WEBPACK_IMPORTED_MODULE_3__/* .ShapeColliderTOI.fromRaw */ .m.fromRaw(this.colliderSet, this.colliderSet.raw.coCastCollider(this.handle, rawCollider1Vel, collider2.handle, rawCollider2Vel, maxToi, stopAtPenetration));
        rawCollider1Vel.free();
        rawCollider2Vel.free();
        return result;
    }
    intersectsShape(shape2, shapePos2, shapeRot2) {
        let rawPos2 = _math__WEBPACK_IMPORTED_MODULE_1__/* .VectorOps.intoRaw */ .ut.intoRaw(shapePos2);
        let rawRot2 = _math__WEBPACK_IMPORTED_MODULE_1__/* .RotationOps.intoRaw */ .T3.intoRaw(shapeRot2);
        let rawShape2 = shape2.intoRaw();
        let result = this.colliderSet.raw.coIntersectsShape(this.handle, rawShape2, rawPos2, rawRot2);
        rawPos2.free();
        rawRot2.free();
        rawShape2.free();
        return result;
    }
    /**
     * Computes one pair of contact points between the shape owned by this collider and the given shape.
     *
     * @param shape2 - The second shape.
     * @param shape2Pos - The initial position of the second shape.
     * @param shape2Rot - The rotation of the second shape.
     * @param prediction - The prediction value, if the shapes are separated by a distance greater than this value, test will fail.
     * @returns `null` if the shapes are separated by a distance greater than prediction, otherwise contact details. The result is given in world-space.
     */
    contactShape(shape2, shape2Pos, shape2Rot, prediction) {
        let rawPos2 = _math__WEBPACK_IMPORTED_MODULE_1__/* .VectorOps.intoRaw */ .ut.intoRaw(shape2Pos);
        let rawRot2 = _math__WEBPACK_IMPORTED_MODULE_1__/* .RotationOps.intoRaw */ .T3.intoRaw(shape2Rot);
        let rawShape2 = shape2.intoRaw();
        let result = _contact__WEBPACK_IMPORTED_MODULE_4__/* .ShapeContact.fromRaw */ .Q.fromRaw(this.colliderSet.raw.coContactShape(this.handle, rawShape2, rawPos2, rawRot2, prediction));
        rawPos2.free();
        rawRot2.free();
        rawShape2.free();
        return result;
    }
    /**
     * Computes one pair of contact points between the collider and the given collider.
     *
     * @param collider2 - The second collider.
     * @param prediction - The prediction value, if the shapes are separated by a distance greater than this value, test will fail.
     * @returns `null` if the shapes are separated by a distance greater than prediction, otherwise contact details. The result is given in world-space.
     */
    contactCollider(collider2, prediction) {
        let result = _contact__WEBPACK_IMPORTED_MODULE_4__/* .ShapeContact.fromRaw */ .Q.fromRaw(this.colliderSet.raw.coContactCollider(this.handle, collider2.handle, prediction));
        return result;
    }
    /*
     * Find the closest intersection between a ray and this collider.
     *
     * This also computes the normal at the hit point.
     * @param ray - The ray to cast.
     * @param maxToi - The maximum time-of-impact that can be reported by this cast. This effectively
     *   limits the length of the ray to `ray.dir.norm() * maxToi`.
     * @param solid - If `false` then the ray will attempt to hit the boundary of a shape, even if its
     *   origin already lies inside of a shape. In other terms, `true` implies that all shapes are plain,
     *   whereas `false` implies that all shapes are hollow for this ray-cast.
     * @returns The time-of-impact between this collider and the ray, or `-1` if there is no intersection.
     */
    castRay(ray, maxToi, solid) {
        let rawOrig = _math__WEBPACK_IMPORTED_MODULE_1__/* .VectorOps.intoRaw */ .ut.intoRaw(ray.origin);
        let rawDir = _math__WEBPACK_IMPORTED_MODULE_1__/* .VectorOps.intoRaw */ .ut.intoRaw(ray.dir);
        let result = this.colliderSet.raw.coCastRay(this.handle, rawOrig, rawDir, maxToi, solid);
        rawOrig.free();
        rawDir.free();
        return result;
    }
    /**
     * Find the closest intersection between a ray and this collider.
     *
     * This also computes the normal at the hit point.
     * @param ray - The ray to cast.
     * @param maxToi - The maximum time-of-impact that can be reported by this cast. This effectively
     *   limits the length of the ray to `ray.dir.norm() * maxToi`.
     * @param solid - If `false` then the ray will attempt to hit the boundary of a shape, even if its
     *   origin already lies inside of a shape. In other terms, `true` implies that all shapes are plain,
     *   whereas `false` implies that all shapes are hollow for this ray-cast.
     */
    castRayAndGetNormal(ray, maxToi, solid) {
        let rawOrig = _math__WEBPACK_IMPORTED_MODULE_1__/* .VectorOps.intoRaw */ .ut.intoRaw(ray.origin);
        let rawDir = _math__WEBPACK_IMPORTED_MODULE_1__/* .VectorOps.intoRaw */ .ut.intoRaw(ray.dir);
        let result = _ray__WEBPACK_IMPORTED_MODULE_5__/* .RayIntersection.fromRaw */ .Gz.fromRaw(this.colliderSet.raw.coCastRayAndGetNormal(this.handle, rawOrig, rawDir, maxToi, solid));
        rawOrig.free();
        rawDir.free();
        return result;
    }
}
var MassPropsMode;
(function (MassPropsMode) {
    MassPropsMode[MassPropsMode["Density"] = 0] = "Density";
    MassPropsMode[MassPropsMode["Mass"] = 1] = "Mass";
    MassPropsMode[MassPropsMode["MassProps"] = 2] = "MassProps";
})(MassPropsMode || (MassPropsMode = {}));
class ColliderDesc {
    /**
     * Initializes a collider descriptor from the collision shape.
     *
     * @param shape - The shape of the collider being built.
     */
    constructor(shape) {
        this.enabled = true;
        this.shape = shape;
        this.massPropsMode = MassPropsMode.Density;
        this.density = 1.0;
        this.friction = 0.5;
        this.restitution = 0.0;
        this.rotation = _math__WEBPACK_IMPORTED_MODULE_1__/* .RotationOps.identity */ .T3.identity();
        this.translation = _math__WEBPACK_IMPORTED_MODULE_1__/* .VectorOps.zeros */ .ut.zeros();
        this.isSensor = false;
        this.collisionGroups = 4294967295;
        this.solverGroups = 4294967295;
        this.frictionCombineRule = _dynamics__WEBPACK_IMPORTED_MODULE_6__/* .CoefficientCombineRule.Average */ .j.Average;
        this.restitutionCombineRule = _dynamics__WEBPACK_IMPORTED_MODULE_6__/* .CoefficientCombineRule.Average */ .j.Average;
        this.activeCollisionTypes = ActiveCollisionTypes.DEFAULT;
        this.activeEvents = 0;
        this.activeHooks = 0;
        this.mass = 0.0;
        this.centerOfMass = _math__WEBPACK_IMPORTED_MODULE_1__/* .VectorOps.zeros */ .ut.zeros();
        this.contactForceEventThreshold = 0.0;
        // #if DIM3
        this.principalAngularInertia = _math__WEBPACK_IMPORTED_MODULE_1__/* .VectorOps.zeros */ .ut.zeros();
        this.angularInertiaLocalFrame = _math__WEBPACK_IMPORTED_MODULE_1__/* .RotationOps.identity */ .T3.identity();
        // #endif
    }
    /**
     * Create a new collider descriptor with a ball shape.
     *
     * @param radius - The radius of the ball.
     */
    static ball(radius) {
        const shape = new _shape__WEBPACK_IMPORTED_MODULE_0__/* .Ball */ .ec(radius);
        return new ColliderDesc(shape);
    }
    /**
     * Create a new collider descriptor with a capsule shape.
     *
     * @param halfHeight - The half-height of the capsule, along the `y` axis.
     * @param radius - The radius of the capsule basis.
     */
    static capsule(halfHeight, radius) {
        const shape = new _shape__WEBPACK_IMPORTED_MODULE_0__/* .Capsule */ .sw(halfHeight, radius);
        return new ColliderDesc(shape);
    }
    /**
     * Creates a new segment shape.
     *
     * @param a - The first point of the segment.
     * @param b - The second point of the segment.
     */
    static segment(a, b) {
        const shape = new _shape__WEBPACK_IMPORTED_MODULE_0__/* .Segment */ .XX(a, b);
        return new ColliderDesc(shape);
    }
    /**
     * Creates a new triangle shape.
     *
     * @param a - The first point of the triangle.
     * @param b - The second point of the triangle.
     * @param c - The third point of the triangle.
     */
    static triangle(a, b, c) {
        const shape = new _shape__WEBPACK_IMPORTED_MODULE_0__/* .Triangle */ .CJ(a, b, c);
        return new ColliderDesc(shape);
    }
    /**
     * Creates a new triangle shape with round corners.
     *
     * @param a - The first point of the triangle.
     * @param b - The second point of the triangle.
     * @param c - The third point of the triangle.
     * @param borderRadius - The radius of the borders of this triangle. In 3D,
     *   this is also equal to half the thickness of the triangle.
     */
    static roundTriangle(a, b, c, borderRadius) {
        const shape = new _shape__WEBPACK_IMPORTED_MODULE_0__/* .RoundTriangle */ .$R(a, b, c, borderRadius);
        return new ColliderDesc(shape);
    }
    /**
     * Creates a new collider descriptor with a polyline shape.
     *
     * @param vertices - The coordinates of the polyline's vertices.
     * @param indices - The indices of the polyline's segments. If this is `undefined` or `null`,
     *    the vertices are assumed to describe a line strip.
     */
    static polyline(vertices, indices) {
        const shape = new _shape__WEBPACK_IMPORTED_MODULE_0__/* .Polyline */ .aH(vertices, indices);
        return new ColliderDesc(shape);
    }
    /**
     * Creates a new collider descriptor with a triangle mesh shape.
     *
     * @param vertices - The coordinates of the triangle mesh's vertices.
     * @param indices - The indices of the triangle mesh's triangles.
     */
    static trimesh(vertices, indices) {
        const shape = new _shape__WEBPACK_IMPORTED_MODULE_0__/* .TriMesh */ .az(vertices, indices);
        return new ColliderDesc(shape);
    }
    // #if DIM3
    /**
     * Creates a new collider descriptor with a cuboid shape.
     *
     * @param hx - The half-width of the rectangle along its local `x` axis.
     * @param hy - The half-width of the rectangle along its local `y` axis.
     * @param hz - The half-width of the rectangle along its local `z` axis.
     */
    static cuboid(hx, hy, hz) {
        const shape = new _shape__WEBPACK_IMPORTED_MODULE_0__/* .Cuboid */ .jv(hx, hy, hz);
        return new ColliderDesc(shape);
    }
    /**
     * Creates a new collider descriptor with a rectangular shape with round borders.
     *
     * @param hx - The half-width of the rectangle along its local `x` axis.
     * @param hy - The half-width of the rectangle along its local `y` axis.
     * @param hz - The half-width of the rectangle along its local `z` axis.
     * @param borderRadius - The radius of the cuboid's borders.
     */
    static roundCuboid(hx, hy, hz, borderRadius) {
        const shape = new _shape__WEBPACK_IMPORTED_MODULE_0__/* .RoundCuboid */ .iA(hx, hy, hz, borderRadius);
        return new ColliderDesc(shape);
    }
    /**
     * Creates a new collider descriptor with a heightfield shape.
     *
     * @param nrows − The number of rows in the heights matrix.
     * @param ncols - The number of columns in the heights matrix.
     * @param heights - The heights of the heightfield along its local `y` axis,
     *                  provided as a matrix stored in column-major order.
     * @param scale - The scale factor applied to the heightfield.
     */
    static heightfield(nrows, ncols, heights, scale) {
        const shape = new _shape__WEBPACK_IMPORTED_MODULE_0__/* .Heightfield */ .f4(nrows, ncols, heights, scale);
        return new ColliderDesc(shape);
    }
    /**
     * Create a new collider descriptor with a cylinder shape.
     *
     * @param halfHeight - The half-height of the cylinder, along the `y` axis.
     * @param radius - The radius of the cylinder basis.
     */
    static cylinder(halfHeight, radius) {
        const shape = new _shape__WEBPACK_IMPORTED_MODULE_0__/* .Cylinder */ .Ab(halfHeight, radius);
        return new ColliderDesc(shape);
    }
    /**
     * Create a new collider descriptor with a cylinder shape with rounded corners.
     *
     * @param halfHeight - The half-height of the cylinder, along the `y` axis.
     * @param radius - The radius of the cylinder basis.
     * @param borderRadius - The radius of the cylinder's rounded edges and vertices.
     */
    static roundCylinder(halfHeight, radius, borderRadius) {
        const shape = new _shape__WEBPACK_IMPORTED_MODULE_0__/* .RoundCylinder */ .$t(halfHeight, radius, borderRadius);
        return new ColliderDesc(shape);
    }
    /**
     * Create a new collider descriptor with a cone shape.
     *
     * @param halfHeight - The half-height of the cone, along the `y` axis.
     * @param radius - The radius of the cone basis.
     */
    static cone(halfHeight, radius) {
        const shape = new _shape__WEBPACK_IMPORTED_MODULE_0__/* .Cone */ .Qq(halfHeight, radius);
        return new ColliderDesc(shape);
    }
    /**
     * Create a new collider descriptor with a cone shape with rounded corners.
     *
     * @param halfHeight - The half-height of the cone, along the `y` axis.
     * @param radius - The radius of the cone basis.
     * @param borderRadius - The radius of the cone's rounded edges and vertices.
     */
    static roundCone(halfHeight, radius, borderRadius) {
        const shape = new _shape__WEBPACK_IMPORTED_MODULE_0__/* .RoundCone */ .eT(halfHeight, radius, borderRadius);
        return new ColliderDesc(shape);
    }
    /**
     * Computes the convex-hull of the given points and use the resulting
     * convex polyhedron as the shape for this new collider descriptor.
     *
     * @param points - The point that will be used to compute the convex-hull.
     */
    static convexHull(points) {
        const shape = new _shape__WEBPACK_IMPORTED_MODULE_0__/* .ConvexPolyhedron */ .YD(points, null);
        return new ColliderDesc(shape);
    }
    /**
     * Creates a new collider descriptor that uses the given set of points assumed
     * to form a convex polyline (no convex-hull computation will be done).
     *
     * @param vertices - The vertices of the convex polyline.
     */
    static convexMesh(vertices, indices) {
        const shape = new _shape__WEBPACK_IMPORTED_MODULE_0__/* .ConvexPolyhedron */ .YD(vertices, indices);
        return new ColliderDesc(shape);
    }
    /**
     * Computes the convex-hull of the given points and use the resulting
     * convex polyhedron as the shape for this new collider descriptor. A
     * border is added to that convex polyhedron to give it round corners.
     *
     * @param points - The point that will be used to compute the convex-hull.
     * @param borderRadius - The radius of the round border added to the convex polyhedron.
     */
    static roundConvexHull(points, borderRadius) {
        const shape = new _shape__WEBPACK_IMPORTED_MODULE_0__/* .RoundConvexPolyhedron */ .Ch(points, null, borderRadius);
        return new ColliderDesc(shape);
    }
    /**
     * Creates a new collider descriptor that uses the given set of points assumed
     * to form a round convex polyline (no convex-hull computation will be done).
     *
     * @param vertices - The vertices of the convex polyline.
     * @param borderRadius - The radius of the round border added to the convex polyline.
     */
    static roundConvexMesh(vertices, indices, borderRadius) {
        const shape = new _shape__WEBPACK_IMPORTED_MODULE_0__/* .RoundConvexPolyhedron */ .Ch(vertices, indices, borderRadius);
        return new ColliderDesc(shape);
    }
    // #endif
    // #if DIM3
    /**
     * Sets the position of the collider to be created relative to the rigid-body it is attached to.
     */
    setTranslation(x, y, z) {
        if (typeof x != "number" ||
            typeof y != "number" ||
            typeof z != "number")
            throw TypeError("The translation components must be numbers.");
        this.translation = { x: x, y: y, z: z };
        return this;
    }
    // #endif
    /**
     * Sets the rotation of the collider to be created relative to the rigid-body it is attached to.
     *
     * @param rot - The rotation of the collider to be created relative to the rigid-body it is attached to.
     */
    setRotation(rot) {
        // #if DIM3
        _math__WEBPACK_IMPORTED_MODULE_1__/* .RotationOps.copy */ .T3.copy(this.rotation, rot);
        // #endif
        return this;
    }
    /**
     * Sets whether or not the collider being created is a sensor.
     *
     * A sensor collider does not take part of the physics simulation, but generates
     * proximity events.
     *
     * @param sensor - Set to `true` of the collider built is to be a sensor.
     */
    setSensor(sensor) {
        this.isSensor = sensor;
        return this;
    }
    /**
     * Sets whether the created collider will be enabled or disabled.
     * @param enabled − If set to `false` the collider will be disabled at creation.
     */
    setEnabled(enabled) {
        this.enabled = enabled;
        return this;
    }
    /**
     * Sets the density of the collider being built.
     *
     * The mass and angular inertia tensor will be computed automatically based on this density and the collider’s shape.
     *
     * @param density - The density to set, must be greater or equal to 0. A density of 0 means that this collider
     *                  will not affect the mass or angular inertia of the rigid-body it is attached to.
     */
    setDensity(density) {
        this.massPropsMode = MassPropsMode.Density;
        this.density = density;
        return this;
    }
    /**
     * Sets the mass of the collider being built.
     *
     * The angular inertia tensor will be computed automatically based on this mass and the collider’s shape.
     *
     * @param mass - The mass to set, must be greater or equal to 0.
     */
    setMass(mass) {
        this.massPropsMode = MassPropsMode.Mass;
        this.mass = mass;
        return this;
    }
    // #if DIM3
    /**
     * Sets the mass properties of the collider being built.
     *
     * This replaces the mass-properties automatically computed from the collider's density and shape.
     * These mass-properties will be added to the mass-properties of the rigid-body this collider will be attached to.
     *
     * @param mass − The mass of the collider to create.
     * @param centerOfMass − The center-of-mass of the collider to create.
     * @param principalAngularInertia − The initial principal angular inertia of the collider to create.
     *                                  These are the eigenvalues of the angular inertia matrix.
     * @param angularInertiaLocalFrame − The initial local angular inertia frame of the collider to create.
     *                                   These are the eigenvectors of the angular inertia matrix.
     */
    setMassProperties(mass, centerOfMass, principalAngularInertia, angularInertiaLocalFrame) {
        this.massPropsMode = MassPropsMode.MassProps;
        this.mass = mass;
        _math__WEBPACK_IMPORTED_MODULE_1__/* .VectorOps.copy */ .ut.copy(this.centerOfMass, centerOfMass);
        _math__WEBPACK_IMPORTED_MODULE_1__/* .VectorOps.copy */ .ut.copy(this.principalAngularInertia, principalAngularInertia);
        _math__WEBPACK_IMPORTED_MODULE_1__/* .RotationOps.copy */ .T3.copy(this.angularInertiaLocalFrame, angularInertiaLocalFrame);
        return this;
    }
    // #endif
    /**
     * Sets the restitution coefficient of the collider to be created.
     *
     * @param restitution - The restitution coefficient in `[0, 1]`. A value of 0 (the default) means no bouncing behavior
     *                   while 1 means perfect bouncing (though energy may still be lost due to numerical errors of the
     *                   constraints solver).
     */
    setRestitution(restitution) {
        this.restitution = restitution;
        return this;
    }
    /**
     * Sets the friction coefficient of the collider to be created.
     *
     * @param friction - The friction coefficient. Must be greater or equal to 0. This is generally smaller than 1. The
     *                   higher the coefficient, the stronger friction forces will be for contacts with the collider
     *                   being built.
     */
    setFriction(friction) {
        this.friction = friction;
        return this;
    }
    /**
     * Sets the rule used to combine the friction coefficients of two colliders
     * colliders involved in a contact.
     *
     * @param rule − The combine rule to apply.
     */
    setFrictionCombineRule(rule) {
        this.frictionCombineRule = rule;
        return this;
    }
    /**
     * Sets the rule used to combine the restitution coefficients of two colliders
     * colliders involved in a contact.
     *
     * @param rule − The combine rule to apply.
     */
    setRestitutionCombineRule(rule) {
        this.restitutionCombineRule = rule;
        return this;
    }
    /**
     * Sets the collision groups used by this collider.
     *
     * Two colliders will interact iff. their collision groups are compatible.
     * See the documentation of `InteractionGroups` for details on teh used bit pattern.
     *
     * @param groups - The collision groups used for the collider being built.
     */
    setCollisionGroups(groups) {
        this.collisionGroups = groups;
        return this;
    }
    /**
     * Sets the solver groups used by this collider.
     *
     * Forces between two colliders in contact will be computed iff their solver
     * groups are compatible.
     * See the documentation of `InteractionGroups` for details on the used bit pattern.
     *
     * @param groups - The solver groups used for the collider being built.
     */
    setSolverGroups(groups) {
        this.solverGroups = groups;
        return this;
    }
    /**
     * Set the physics hooks active for this collider.
     *
     * Use this to enable custom filtering rules for contact/intersecstion pairs involving this collider.
     *
     * @param activeHooks - The hooks active for contact/intersection pairs involving this collider.
     */
    setActiveHooks(activeHooks) {
        this.activeHooks = activeHooks;
        return this;
    }
    /**
     * Set the events active for this collider.
     *
     * Use this to enable contact and/or intersection event reporting for this collider.
     *
     * @param activeEvents - The events active for contact/intersection pairs involving this collider.
     */
    setActiveEvents(activeEvents) {
        this.activeEvents = activeEvents;
        return this;
    }
    /**
     * Set the collision types active for this collider.
     *
     * @param activeCollisionTypes - The hooks active for contact/intersection pairs involving this collider.
     */
    setActiveCollisionTypes(activeCollisionTypes) {
        this.activeCollisionTypes = activeCollisionTypes;
        return this;
    }
    /**
     * Sets the total force magnitude beyond which a contact force event can be emitted.
     *
     * @param threshold - The force threshold to set.
     */
    setContactForceEventThreshold(threshold) {
        this.contactForceEventThreshold = threshold;
        return this;
    }
}
//# sourceMappingURL=collider.js.map
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 927:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "z": () => (/* binding */ ColliderSet)
/* harmony export */ });
/* harmony import */ var _raw__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(184);
/* harmony import */ var _coarena__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(709);
/* harmony import */ var _math__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(383);
/* harmony import */ var _collider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(377);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_raw__WEBPACK_IMPORTED_MODULE_0__, _collider__WEBPACK_IMPORTED_MODULE_2__, _math__WEBPACK_IMPORTED_MODULE_3__]);
([_raw__WEBPACK_IMPORTED_MODULE_0__, _collider__WEBPACK_IMPORTED_MODULE_2__, _math__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);




/**
 * A set of rigid bodies that can be handled by a physics pipeline.
 *
 * To avoid leaking WASM resources, this MUST be freed manually with `colliderSet.free()`
 * once you are done using it (and all the rigid-bodies it created).
 */
class ColliderSet {
    constructor(raw) {
        this.raw = raw || new _raw__WEBPACK_IMPORTED_MODULE_0__/* .RawColliderSet */ .IQ();
        this.map = new _coarena__WEBPACK_IMPORTED_MODULE_1__/* .Coarena */ .F();
        // Initialize the map with the existing elements, if any.
        if (raw) {
            raw.forEachColliderHandle((handle) => {
                this.map.set(handle, new _collider__WEBPACK_IMPORTED_MODULE_2__/* .Collider */ .YM(this, handle, null));
            });
        }
    }
    /**
     * Release the WASM memory occupied by this collider set.
     */
    free() {
        if (!!this.raw) {
            this.raw.free();
        }
        this.raw = undefined;
        if (!!this.map) {
            this.map.clear();
        }
        this.map = undefined;
    }
    /** @internal */
    castClosure(f) {
        return (handle) => {
            if (!!f) {
                return f(this.get(handle));
            }
            else {
                return undefined;
            }
        };
    }
    /** @internal */
    finalizeDeserialization(bodies) {
        this.map.forEach((collider) => collider.finalizeDeserialization(bodies));
    }
    /**
     * Creates a new collider and return its integer handle.
     *
     * @param bodies - The set of bodies where the collider's parent can be found.
     * @param desc - The collider's description.
     * @param parentHandle - The integer handle of the rigid-body this collider is attached to.
     */
    createCollider(bodies, desc, parentHandle) {
        let hasParent = parentHandle != undefined && parentHandle != null;
        if (hasParent && isNaN(parentHandle))
            throw Error("Cannot create a collider with a parent rigid-body handle that is not a number.");
        let rawShape = desc.shape.intoRaw();
        let rawTra = _math__WEBPACK_IMPORTED_MODULE_3__/* .VectorOps.intoRaw */ .ut.intoRaw(desc.translation);
        let rawRot = _math__WEBPACK_IMPORTED_MODULE_3__/* .RotationOps.intoRaw */ .T3.intoRaw(desc.rotation);
        let rawCom = _math__WEBPACK_IMPORTED_MODULE_3__/* .VectorOps.intoRaw */ .ut.intoRaw(desc.centerOfMass);
        // #if DIM3
        let rawPrincipalInertia = _math__WEBPACK_IMPORTED_MODULE_3__/* .VectorOps.intoRaw */ .ut.intoRaw(desc.principalAngularInertia);
        let rawInertiaFrame = _math__WEBPACK_IMPORTED_MODULE_3__/* .RotationOps.intoRaw */ .T3.intoRaw(desc.angularInertiaLocalFrame);
        // #endif
        let handle = this.raw.createCollider(desc.enabled, rawShape, rawTra, rawRot, desc.massPropsMode, desc.mass, rawCom, 
        // #if DIM3
        rawPrincipalInertia, rawInertiaFrame, 
        // #endif
        desc.density, desc.friction, desc.restitution, desc.frictionCombineRule, desc.restitutionCombineRule, desc.isSensor, desc.collisionGroups, desc.solverGroups, desc.activeCollisionTypes, desc.activeHooks, desc.activeEvents, desc.contactForceEventThreshold, hasParent, hasParent ? parentHandle : 0, bodies.raw);
        rawShape.free();
        rawTra.free();
        rawRot.free();
        rawCom.free();
        // #if DIM3
        rawPrincipalInertia.free();
        rawInertiaFrame.free();
        // #endif
        let parent = hasParent ? bodies.get(parentHandle) : null;
        let collider = new _collider__WEBPACK_IMPORTED_MODULE_2__/* .Collider */ .YM(this, handle, parent, desc.shape);
        this.map.set(handle, collider);
        return collider;
    }
    /**
     * Remove a collider from this set.
     *
     * @param handle - The integer handle of the collider to remove.
     * @param bodies - The set of rigid-body containing the rigid-body the collider is attached to.
     * @param wakeUp - If `true`, the rigid-body the removed collider is attached to will be woken-up automatically.
     */
    remove(handle, islands, bodies, wakeUp) {
        this.raw.remove(handle, islands.raw, bodies.raw, wakeUp);
        this.unmap(handle);
    }
    /**
     * Internal function, do not call directly.
     * @param handle
     */
    unmap(handle) {
        this.map.delete(handle);
    }
    /**
     * Gets the rigid-body with the given handle.
     *
     * @param handle - The handle of the rigid-body to retrieve.
     */
    get(handle) {
        return this.map.get(handle);
    }
    /**
     * The number of colliders on this set.
     */
    len() {
        return this.map.len();
    }
    /**
     * Does this set contain a collider with the given handle?
     *
     * @param handle - The collider handle to check.
     */
    contains(handle) {
        return this.get(handle) != null;
    }
    /**
     * Applies the given closure to each collider contained by this set.
     *
     * @param f - The closure to apply.
     */
    forEach(f) {
        this.map.forEach(f);
    }
    /**
     * Gets all colliders in the list.
     *
     * @returns collider list.
     */
    getAll() {
        return this.map.getAll();
    }
}
//# sourceMappingURL=collider_set.js.map
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 254:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Q": () => (/* binding */ ShapeContact)
/* harmony export */ });
/* harmony import */ var _math__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(383);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_math__WEBPACK_IMPORTED_MODULE_0__]);
_math__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];

/**
 * The contact info between two shapes.
 */
class ShapeContact {
    constructor(dist, point1, point2, normal1, normal2) {
        this.distance = dist;
        this.point1 = point1;
        this.point2 = point2;
        this.normal1 = normal1;
        this.normal2 = normal2;
    }
    static fromRaw(raw) {
        if (!raw)
            return null;
        const result = new ShapeContact(raw.distance(), _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.fromRaw */ .ut.fromRaw(raw.point1()), _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.fromRaw */ .ut.fromRaw(raw.point2()), _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.fromRaw */ .ut.fromRaw(raw.normal1()), _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.fromRaw */ .ut.fromRaw(raw.normal2()));
        raw.free();
        return result;
    }
}
//# sourceMappingURL=contact.js.map
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 193:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "T": () => (/* binding */ FeatureType)
/* harmony export */ });
// #if DIM3
var FeatureType;
(function (FeatureType) {
    FeatureType[FeatureType["Vertex"] = 0] = "Vertex";
    FeatureType[FeatureType["Edge"] = 1] = "Edge";
    FeatureType[FeatureType["Face"] = 2] = "Face";
    FeatureType[FeatureType["Unknown"] = 3] = "Unknown";
})(FeatureType || (FeatureType = {}));
// #endif
//# sourceMappingURL=feature.js.map

/***/ }),

/***/ 328:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "$R": () => (/* reexport safe */ _shape__WEBPACK_IMPORTED_MODULE_2__.$R),
/* harmony export */   "$t": () => (/* reexport safe */ _shape__WEBPACK_IMPORTED_MODULE_2__.$t),
/* harmony export */   "Ab": () => (/* reexport safe */ _shape__WEBPACK_IMPORTED_MODULE_2__.Ab),
/* harmony export */   "CJ": () => (/* reexport safe */ _shape__WEBPACK_IMPORTED_MODULE_2__.CJ),
/* harmony export */   "Ch": () => (/* reexport safe */ _shape__WEBPACK_IMPORTED_MODULE_2__.Ch),
/* harmony export */   "DY": () => (/* reexport safe */ _shape__WEBPACK_IMPORTED_MODULE_2__.DY),
/* harmony export */   "FP": () => (/* reexport safe */ _point__WEBPACK_IMPORTED_MODULE_7__.F),
/* harmony export */   "Fr": () => (/* reexport safe */ _shape__WEBPACK_IMPORTED_MODULE_2__.Fr),
/* harmony export */   "GJ": () => (/* reexport safe */ _toi__WEBPACK_IMPORTED_MODULE_8__.G),
/* harmony export */   "Gz": () => (/* reexport safe */ _ray__WEBPACK_IMPORTED_MODULE_6__.Gz),
/* harmony export */   "L4": () => (/* reexport safe */ _narrow_phase__WEBPACK_IMPORTED_MODULE_1__.L),
/* harmony export */   "NT": () => (/* reexport safe */ _broad_phase__WEBPACK_IMPORTED_MODULE_0__.N),
/* harmony export */   "No": () => (/* reexport safe */ _ray__WEBPACK_IMPORTED_MODULE_6__.No),
/* harmony export */   "Qi": () => (/* reexport safe */ _contact__WEBPACK_IMPORTED_MODULE_9__.Q),
/* harmony export */   "Qq": () => (/* reexport safe */ _shape__WEBPACK_IMPORTED_MODULE_2__.Qq),
/* harmony export */   "Te": () => (/* reexport safe */ _feature__WEBPACK_IMPORTED_MODULE_5__.T),
/* harmony export */   "Vl": () => (/* reexport safe */ _point__WEBPACK_IMPORTED_MODULE_7__.V),
/* harmony export */   "XX": () => (/* reexport safe */ _shape__WEBPACK_IMPORTED_MODULE_2__.XX),
/* harmony export */   "YD": () => (/* reexport safe */ _shape__WEBPACK_IMPORTED_MODULE_2__.YD),
/* harmony export */   "YM": () => (/* reexport safe */ _collider__WEBPACK_IMPORTED_MODULE_3__.YM),
/* harmony export */   "aH": () => (/* reexport safe */ _shape__WEBPACK_IMPORTED_MODULE_2__.aH),
/* harmony export */   "az": () => (/* reexport safe */ _shape__WEBPACK_IMPORTED_MODULE_2__.az),
/* harmony export */   "bn": () => (/* reexport safe */ _shape__WEBPACK_IMPORTED_MODULE_2__.bn),
/* harmony export */   "cu": () => (/* reexport safe */ _ray__WEBPACK_IMPORTED_MODULE_6__.cu),
/* harmony export */   "eL": () => (/* reexport safe */ _narrow_phase__WEBPACK_IMPORTED_MODULE_1__.e),
/* harmony export */   "eT": () => (/* reexport safe */ _shape__WEBPACK_IMPORTED_MODULE_2__.eT),
/* harmony export */   "ec": () => (/* reexport safe */ _shape__WEBPACK_IMPORTED_MODULE_2__.ec),
/* harmony export */   "f4": () => (/* reexport safe */ _shape__WEBPACK_IMPORTED_MODULE_2__.f4),
/* harmony export */   "iA": () => (/* reexport safe */ _shape__WEBPACK_IMPORTED_MODULE_2__.iA),
/* harmony export */   "ic": () => (/* reexport safe */ _collider__WEBPACK_IMPORTED_MODULE_3__.ic),
/* harmony export */   "jv": () => (/* reexport safe */ _shape__WEBPACK_IMPORTED_MODULE_2__.jv),
/* harmony export */   "mB": () => (/* reexport safe */ _toi__WEBPACK_IMPORTED_MODULE_8__.m),
/* harmony export */   "sw": () => (/* reexport safe */ _shape__WEBPACK_IMPORTED_MODULE_2__.sw),
/* harmony export */   "uV": () => (/* reexport safe */ _collider__WEBPACK_IMPORTED_MODULE_3__.uV),
/* harmony export */   "vq": () => (/* reexport safe */ _collider__WEBPACK_IMPORTED_MODULE_3__.vq),
/* harmony export */   "zH": () => (/* reexport safe */ _ray__WEBPACK_IMPORTED_MODULE_6__.zH),
/* harmony export */   "zY": () => (/* reexport safe */ _collider_set__WEBPACK_IMPORTED_MODULE_4__.z)
/* harmony export */ });
/* harmony import */ var _broad_phase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(261);
/* harmony import */ var _narrow_phase__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(322);
/* harmony import */ var _shape__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(429);
/* harmony import */ var _collider__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(377);
/* harmony import */ var _collider_set__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(927);
/* harmony import */ var _feature__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(193);
/* harmony import */ var _ray__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(238);
/* harmony import */ var _point__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(461);
/* harmony import */ var _toi__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(961);
/* harmony import */ var _contact__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(254);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_broad_phase__WEBPACK_IMPORTED_MODULE_0__, _narrow_phase__WEBPACK_IMPORTED_MODULE_1__, _shape__WEBPACK_IMPORTED_MODULE_2__, _collider__WEBPACK_IMPORTED_MODULE_3__, _collider_set__WEBPACK_IMPORTED_MODULE_4__, _ray__WEBPACK_IMPORTED_MODULE_6__, _point__WEBPACK_IMPORTED_MODULE_7__, _toi__WEBPACK_IMPORTED_MODULE_8__, _contact__WEBPACK_IMPORTED_MODULE_9__]);
([_broad_phase__WEBPACK_IMPORTED_MODULE_0__, _narrow_phase__WEBPACK_IMPORTED_MODULE_1__, _shape__WEBPACK_IMPORTED_MODULE_2__, _collider__WEBPACK_IMPORTED_MODULE_3__, _collider_set__WEBPACK_IMPORTED_MODULE_4__, _ray__WEBPACK_IMPORTED_MODULE_6__, _point__WEBPACK_IMPORTED_MODULE_7__, _toi__WEBPACK_IMPORTED_MODULE_8__, _contact__WEBPACK_IMPORTED_MODULE_9__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);











//# sourceMappingURL=index.js.map
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 322:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "L": () => (/* binding */ NarrowPhase),
/* harmony export */   "e": () => (/* binding */ TempContactManifold)
/* harmony export */ });
/* harmony import */ var _raw__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(184);
/* harmony import */ var _math__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(383);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_raw__WEBPACK_IMPORTED_MODULE_0__, _math__WEBPACK_IMPORTED_MODULE_1__]);
([_raw__WEBPACK_IMPORTED_MODULE_0__, _math__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);


/**
 * The narrow-phase used for precise collision-detection.
 *
 * To avoid leaking WASM resources, this MUST be freed manually with `narrowPhase.free()`
 * once you are done using it.
 */
class NarrowPhase {
    constructor(raw) {
        this.raw = raw || new _raw__WEBPACK_IMPORTED_MODULE_0__/* .RawNarrowPhase */ .uU();
        this.tempManifold = new TempContactManifold(null);
    }
    /**
     * Release the WASM memory occupied by this narrow-phase.
     */
    free() {
        if (!!this.raw) {
            this.raw.free();
        }
        this.raw = undefined;
    }
    /**
     * Enumerates all the colliders potentially in contact with the given collider.
     *
     * @param collider1 - The second collider involved in the contact.
     * @param f - Closure that will be called on each collider that is in contact with `collider1`.
     */
    contactsWith(collider1, f) {
        this.raw.contacts_with(collider1, f);
    }
    /**
     * Enumerates all the colliders intersecting the given colliders, assuming one of them
     * is a sensor.
     */
    intersectionsWith(collider1, f) {
        this.raw.intersections_with(collider1, f);
    }
    /**
     * Iterates through all the contact manifolds between the given pair of colliders.
     *
     * @param collider1 - The first collider involved in the contact.
     * @param collider2 - The second collider involved in the contact.
     * @param f - Closure that will be called on each contact manifold between the two colliders. If the second argument
     *            passed to this closure is `true`, then the contact manifold data is flipped, i.e., methods like `localNormal1`
     *            actually apply to the `collider2` and fields like `localNormal2` apply to the `collider1`.
     */
    contactPair(collider1, collider2, f) {
        const rawPair = this.raw.contact_pair(collider1, collider2);
        if (!!rawPair) {
            const flipped = rawPair.collider1() != collider1;
            let i;
            for (i = 0; i < rawPair.numContactManifolds(); ++i) {
                this.tempManifold.raw = rawPair.contactManifold(i);
                if (!!this.tempManifold.raw) {
                    f(this.tempManifold, flipped);
                }
                // SAFETY: The RawContactManifold stores a raw pointer that will be invalidated
                //         at the next timestep. So we must be sure to free the pair here
                //         to avoid unsoundness in the Rust code.
                this.tempManifold.free();
            }
            rawPair.free();
        }
    }
    /**
     * Returns `true` if `collider1` and `collider2` intersect and at least one of them is a sensor.
     * @param collider1 − The first collider involved in the intersection.
     * @param collider2 − The second collider involved in the intersection.
     */
    intersectionPair(collider1, collider2) {
        return this.raw.intersection_pair(collider1, collider2);
    }
}
class TempContactManifold {
    constructor(raw) {
        this.raw = raw;
    }
    free() {
        if (!!this.raw) {
            this.raw.free();
        }
        this.raw = undefined;
    }
    normal() {
        return _math__WEBPACK_IMPORTED_MODULE_1__/* .VectorOps.fromRaw */ .ut.fromRaw(this.raw.normal());
    }
    localNormal1() {
        return _math__WEBPACK_IMPORTED_MODULE_1__/* .VectorOps.fromRaw */ .ut.fromRaw(this.raw.local_n1());
    }
    localNormal2() {
        return _math__WEBPACK_IMPORTED_MODULE_1__/* .VectorOps.fromRaw */ .ut.fromRaw(this.raw.local_n2());
    }
    subshape1() {
        return this.raw.subshape1();
    }
    subshape2() {
        return this.raw.subshape2();
    }
    numContacts() {
        return this.raw.num_contacts();
    }
    localContactPoint1(i) {
        return _math__WEBPACK_IMPORTED_MODULE_1__/* .VectorOps.fromRaw */ .ut.fromRaw(this.raw.contact_local_p1(i));
    }
    localContactPoint2(i) {
        return _math__WEBPACK_IMPORTED_MODULE_1__/* .VectorOps.fromRaw */ .ut.fromRaw(this.raw.contact_local_p2(i));
    }
    contactDist(i) {
        return this.raw.contact_dist(i);
    }
    contactFid1(i) {
        return this.raw.contact_fid1(i);
    }
    contactFid2(i) {
        return this.raw.contact_fid2(i);
    }
    contactImpulse(i) {
        return this.raw.contact_impulse(i);
    }
    // #if DIM3
    contactTangentImpulseX(i) {
        return this.raw.contact_tangent_impulse_x(i);
    }
    contactTangentImpulseY(i) {
        return this.raw.contact_tangent_impulse_y(i);
    }
    // #endif
    numSolverContacts() {
        return this.raw.num_solver_contacts();
    }
    solverContactPoint(i) {
        return _math__WEBPACK_IMPORTED_MODULE_1__/* .VectorOps.fromRaw */ .ut.fromRaw(this.raw.solver_contact_point(i));
    }
    solverContactDist(i) {
        return this.raw.solver_contact_dist(i);
    }
    solverContactFriction(i) {
        return this.raw.solver_contact_friction(i);
    }
    solverContactRestitution(i) {
        return this.raw.solver_contact_restitution(i);
    }
    solverContactTangentVelocity(i) {
        return _math__WEBPACK_IMPORTED_MODULE_1__/* .VectorOps.fromRaw */ .ut.fromRaw(this.raw.solver_contact_tangent_velocity(i));
    }
}
//# sourceMappingURL=narrow_phase.js.map
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 461:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "F": () => (/* binding */ PointProjection),
/* harmony export */   "V": () => (/* binding */ PointColliderProjection)
/* harmony export */ });
/* harmony import */ var _math__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(383);
/* harmony import */ var _feature__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(193);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_math__WEBPACK_IMPORTED_MODULE_0__]);
_math__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];


/**
 * The projection of a point on a collider.
 */
class PointProjection {
    constructor(point, isInside) {
        this.point = point;
        this.isInside = isInside;
    }
    static fromRaw(raw) {
        if (!raw)
            return null;
        const result = new PointProjection(_math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.fromRaw */ .ut.fromRaw(raw.point()), raw.isInside());
        raw.free();
        return result;
    }
}
/**
 * The projection of a point on a collider (includes the collider handle).
 */
class PointColliderProjection {
    constructor(collider, point, isInside, featureType, featureId) {
        /**
         * The type of the geometric feature the point was projected on.
         */
        this.featureType = _feature__WEBPACK_IMPORTED_MODULE_1__/* .FeatureType.Unknown */ .T.Unknown;
        /**
         * The id of the geometric feature the point was projected on.
         */
        this.featureId = undefined;
        this.collider = collider;
        this.point = point;
        this.isInside = isInside;
        if (featureId !== undefined)
            this.featureId = featureId;
        if (featureType !== undefined)
            this.featureType = featureType;
    }
    static fromRaw(colliderSet, raw) {
        if (!raw)
            return null;
        const result = new PointColliderProjection(colliderSet.get(raw.colliderHandle()), _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.fromRaw */ .ut.fromRaw(raw.point()), raw.isInside(), raw.featureType(), raw.featureId());
        raw.free();
        return result;
    }
}
//# sourceMappingURL=point.js.map
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 238:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Gz": () => (/* binding */ RayIntersection),
/* harmony export */   "No": () => (/* binding */ RayColliderIntersection),
/* harmony export */   "cu": () => (/* binding */ RayColliderToi),
/* harmony export */   "zH": () => (/* binding */ Ray)
/* harmony export */ });
/* harmony import */ var _math__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(383);
/* harmony import */ var _feature__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(193);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_math__WEBPACK_IMPORTED_MODULE_1__]);
_math__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];


/**
 * A ray. This is a directed half-line.
 */
class Ray {
    /**
     * Builds a ray from its origin and direction.
     *
     * @param origin - The ray's starting point.
     * @param dir - The ray's direction of propagation.
     */
    constructor(origin, dir) {
        this.origin = origin;
        this.dir = dir;
    }
    pointAt(t) {
        return {
            x: this.origin.x + this.dir.x * t,
            y: this.origin.y + this.dir.y * t,
            // #if DIM3
            z: this.origin.z + this.dir.z * t,
            // #endif
        };
    }
}
/**
 * The intersection between a ray and a collider.
 */
class RayIntersection {
    constructor(toi, normal, featureType, featureId) {
        /**
         * The type of the geometric feature the point was projected on.
         */
        this.featureType = _feature__WEBPACK_IMPORTED_MODULE_0__/* .FeatureType.Unknown */ .T.Unknown;
        /**
         * The id of the geometric feature the point was projected on.
         */
        this.featureId = undefined;
        this.toi = toi;
        this.normal = normal;
        if (featureId !== undefined)
            this.featureId = featureId;
        if (featureType !== undefined)
            this.featureType = featureType;
    }
    static fromRaw(raw) {
        if (!raw)
            return null;
        const result = new RayIntersection(raw.toi(), _math__WEBPACK_IMPORTED_MODULE_1__/* .VectorOps.fromRaw */ .ut.fromRaw(raw.normal()), raw.featureType(), raw.featureId());
        raw.free();
        return result;
    }
}
/**
 * The intersection between a ray and a collider (includes the collider handle).
 */
class RayColliderIntersection {
    constructor(collider, toi, normal, featureType, featureId) {
        /**
         * The type of the geometric feature the point was projected on.
         */
        this.featureType = _feature__WEBPACK_IMPORTED_MODULE_0__/* .FeatureType.Unknown */ .T.Unknown;
        /**
         * The id of the geometric feature the point was projected on.
         */
        this.featureId = undefined;
        this.collider = collider;
        this.toi = toi;
        this.normal = normal;
        if (featureId !== undefined)
            this.featureId = featureId;
        if (featureType !== undefined)
            this.featureType = featureType;
    }
    static fromRaw(colliderSet, raw) {
        if (!raw)
            return null;
        const result = new RayColliderIntersection(colliderSet.get(raw.colliderHandle()), raw.toi(), _math__WEBPACK_IMPORTED_MODULE_1__/* .VectorOps.fromRaw */ .ut.fromRaw(raw.normal()), raw.featureType(), raw.featureId());
        raw.free();
        return result;
    }
}
/**
 * The time of impact between a ray and a collider.
 */
class RayColliderToi {
    constructor(collider, toi) {
        this.collider = collider;
        this.toi = toi;
    }
    static fromRaw(colliderSet, raw) {
        if (!raw)
            return null;
        const result = new RayColliderToi(colliderSet.get(raw.colliderHandle()), raw.toi());
        raw.free();
        return result;
    }
}
//# sourceMappingURL=ray.js.map
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 429:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "$R": () => (/* binding */ RoundTriangle),
/* harmony export */   "$t": () => (/* binding */ RoundCylinder),
/* harmony export */   "Ab": () => (/* binding */ Cylinder),
/* harmony export */   "CJ": () => (/* binding */ Triangle),
/* harmony export */   "Ch": () => (/* binding */ RoundConvexPolyhedron),
/* harmony export */   "DY": () => (/* binding */ ShapeType),
/* harmony export */   "Fr": () => (/* binding */ HalfSpace),
/* harmony export */   "Qq": () => (/* binding */ Cone),
/* harmony export */   "XX": () => (/* binding */ Segment),
/* harmony export */   "YD": () => (/* binding */ ConvexPolyhedron),
/* harmony export */   "aH": () => (/* binding */ Polyline),
/* harmony export */   "az": () => (/* binding */ TriMesh),
/* harmony export */   "bn": () => (/* binding */ Shape),
/* harmony export */   "eT": () => (/* binding */ RoundCone),
/* harmony export */   "ec": () => (/* binding */ Ball),
/* harmony export */   "f4": () => (/* binding */ Heightfield),
/* harmony export */   "iA": () => (/* binding */ RoundCuboid),
/* harmony export */   "jv": () => (/* binding */ Cuboid),
/* harmony export */   "sw": () => (/* binding */ Capsule)
/* harmony export */ });
/* harmony import */ var _math__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(383);
/* harmony import */ var _raw__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(184);
/* harmony import */ var _contact__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(254);
/* harmony import */ var _point__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(461);
/* harmony import */ var _ray__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(238);
/* harmony import */ var _toi__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(961);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_math__WEBPACK_IMPORTED_MODULE_0__, _toi__WEBPACK_IMPORTED_MODULE_1__, _contact__WEBPACK_IMPORTED_MODULE_2__, _point__WEBPACK_IMPORTED_MODULE_3__, _ray__WEBPACK_IMPORTED_MODULE_4__, _raw__WEBPACK_IMPORTED_MODULE_5__]);
([_math__WEBPACK_IMPORTED_MODULE_0__, _toi__WEBPACK_IMPORTED_MODULE_1__, _contact__WEBPACK_IMPORTED_MODULE_2__, _point__WEBPACK_IMPORTED_MODULE_3__, _ray__WEBPACK_IMPORTED_MODULE_4__, _raw__WEBPACK_IMPORTED_MODULE_5__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);






class Shape {
    /**
     * instant mode without cache
     */
    static fromRaw(rawSet, handle) {
        const rawType = rawSet.coShapeType(handle);
        let extents;
        let borderRadius;
        let vs;
        let indices;
        let halfHeight;
        let radius;
        let normal;
        switch (rawType) {
            case ShapeType.Ball:
                return new Ball(rawSet.coRadius(handle));
            case ShapeType.Cuboid:
                extents = rawSet.coHalfExtents(handle);
                // #if DIM3
                return new Cuboid(extents.x, extents.y, extents.z);
            // #endif
            case ShapeType.RoundCuboid:
                extents = rawSet.coHalfExtents(handle);
                borderRadius = rawSet.coRoundRadius(handle);
                // #if DIM3
                return new RoundCuboid(extents.x, extents.y, extents.z, borderRadius);
            // #endif
            case ShapeType.Capsule:
                halfHeight = rawSet.coHalfHeight(handle);
                radius = rawSet.coRadius(handle);
                return new Capsule(halfHeight, radius);
            case ShapeType.Segment:
                vs = rawSet.coVertices(handle);
                // #if DIM3
                return new Segment(_math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps["new"] */ .ut["new"](vs[0], vs[1], vs[2]), _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps["new"] */ .ut["new"](vs[3], vs[4], vs[5]));
            // #endif
            case ShapeType.Polyline:
                vs = rawSet.coVertices(handle);
                indices = rawSet.coIndices(handle);
                return new Polyline(vs, indices);
            case ShapeType.Triangle:
                vs = rawSet.coVertices(handle);
                // #if DIM3
                return new Triangle(_math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps["new"] */ .ut["new"](vs[0], vs[1], vs[2]), _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps["new"] */ .ut["new"](vs[3], vs[4], vs[5]), _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps["new"] */ .ut["new"](vs[6], vs[7], vs[8]));
            // #endif
            case ShapeType.RoundTriangle:
                vs = rawSet.coVertices(handle);
                borderRadius = rawSet.coRoundRadius(handle);
                // #if DIM3
                return new RoundTriangle(_math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps["new"] */ .ut["new"](vs[0], vs[1], vs[2]), _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps["new"] */ .ut["new"](vs[3], vs[4], vs[5]), _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps["new"] */ .ut["new"](vs[6], vs[7], vs[8]), borderRadius);
            // #endif
            case ShapeType.HalfSpace:
                normal = _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.fromRaw */ .ut.fromRaw(rawSet.coHalfspaceNormal(handle));
                return new HalfSpace(normal);
            case ShapeType.TriMesh:
                vs = rawSet.coVertices(handle);
                indices = rawSet.coIndices(handle);
                return new TriMesh(vs, indices);
            case ShapeType.HeightField:
                const scale = rawSet.coHeightfieldScale(handle);
                const heights = rawSet.coHeightfieldHeights(handle);
                // #if DIM3
                const nrows = rawSet.coHeightfieldNRows(handle);
                const ncols = rawSet.coHeightfieldNCols(handle);
                return new Heightfield(nrows, ncols, heights, scale);
            // #endif
            // #if DIM3
            case ShapeType.ConvexPolyhedron:
                vs = rawSet.coVertices(handle);
                indices = rawSet.coIndices(handle);
                return new ConvexPolyhedron(vs, indices);
            case ShapeType.RoundConvexPolyhedron:
                vs = rawSet.coVertices(handle);
                indices = rawSet.coIndices(handle);
                borderRadius = rawSet.coRoundRadius(handle);
                return new RoundConvexPolyhedron(vs, indices, borderRadius);
            case ShapeType.Cylinder:
                halfHeight = rawSet.coHalfHeight(handle);
                radius = rawSet.coRadius(handle);
                return new Cylinder(halfHeight, radius);
            case ShapeType.RoundCylinder:
                halfHeight = rawSet.coHalfHeight(handle);
                radius = rawSet.coRadius(handle);
                borderRadius = rawSet.coRoundRadius(handle);
                return new RoundCylinder(halfHeight, radius, borderRadius);
            case ShapeType.Cone:
                halfHeight = rawSet.coHalfHeight(handle);
                radius = rawSet.coRadius(handle);
                return new Cone(halfHeight, radius);
            case ShapeType.RoundCone:
                halfHeight = rawSet.coHalfHeight(handle);
                radius = rawSet.coRadius(handle);
                borderRadius = rawSet.coRoundRadius(handle);
                return new RoundCone(halfHeight, radius, borderRadius);
            // #endif
            default:
                throw new Error("unknown shape type: " + rawType);
        }
    }
    /**
     * Computes the time of impact between two moving shapes.
     * @param shapePos1 - The initial position of this sahpe.
     * @param shapeRot1 - The rotation of this shape.
     * @param shapeVel1 - The velocity of this shape.
     * @param shape2 - The second moving shape.
     * @param shapePos2 - The initial position of the second shape.
     * @param shapeRot2 - The rotation of the second shape.
     * @param shapeVel2 - The velocity of the second shape.
     * @param maxToi - The maximum time when the impact can happen.
     * @param stopAtPenetration - If set to `false`, the linear shape-cast won’t immediately stop if
     *   the shape is penetrating another shape at its starting point **and** its trajectory is such
     *   that it’s on a path to exist that penetration state.
     * @returns If the two moving shapes collider at some point along their trajectories, this returns the
     *  time at which the two shape collider as well as the contact information during the impact. Returns
     *  `null`if the two shapes never collide along their paths.
     */
    castShape(shapePos1, shapeRot1, shapeVel1, shape2, shapePos2, shapeRot2, shapeVel2, maxToi, stopAtPenetration) {
        let rawPos1 = _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.intoRaw */ .ut.intoRaw(shapePos1);
        let rawRot1 = _math__WEBPACK_IMPORTED_MODULE_0__/* .RotationOps.intoRaw */ .T3.intoRaw(shapeRot1);
        let rawVel1 = _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.intoRaw */ .ut.intoRaw(shapeVel1);
        let rawPos2 = _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.intoRaw */ .ut.intoRaw(shapePos2);
        let rawRot2 = _math__WEBPACK_IMPORTED_MODULE_0__/* .RotationOps.intoRaw */ .T3.intoRaw(shapeRot2);
        let rawVel2 = _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.intoRaw */ .ut.intoRaw(shapeVel2);
        let rawShape1 = this.intoRaw();
        let rawShape2 = shape2.intoRaw();
        let result = _toi__WEBPACK_IMPORTED_MODULE_1__/* .ShapeTOI.fromRaw */ .G.fromRaw(null, rawShape1.castShape(rawPos1, rawRot1, rawVel1, rawShape2, rawPos2, rawRot2, rawVel2, maxToi, stopAtPenetration));
        rawPos1.free();
        rawRot1.free();
        rawVel1.free();
        rawPos2.free();
        rawRot2.free();
        rawVel2.free();
        rawShape1.free();
        rawShape2.free();
        return result;
    }
    /**
     * Tests if this shape intersects another shape.
     *
     * @param shapePos1 - The position of this shape.
     * @param shapeRot1 - The rotation of this shape.
     * @param shape2  - The second shape to test.
     * @param shapePos2 - The position of the second shape.
     * @param shapeRot2 - The rotation of the second shape.
     * @returns `true` if the two shapes intersect, `false` if they don’t.
     */
    intersectsShape(shapePos1, shapeRot1, shape2, shapePos2, shapeRot2) {
        let rawPos1 = _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.intoRaw */ .ut.intoRaw(shapePos1);
        let rawRot1 = _math__WEBPACK_IMPORTED_MODULE_0__/* .RotationOps.intoRaw */ .T3.intoRaw(shapeRot1);
        let rawPos2 = _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.intoRaw */ .ut.intoRaw(shapePos2);
        let rawRot2 = _math__WEBPACK_IMPORTED_MODULE_0__/* .RotationOps.intoRaw */ .T3.intoRaw(shapeRot2);
        let rawShape1 = this.intoRaw();
        let rawShape2 = shape2.intoRaw();
        let result = rawShape1.intersectsShape(rawPos1, rawRot1, rawShape2, rawPos2, rawRot2);
        rawPos1.free();
        rawRot1.free();
        rawPos2.free();
        rawRot2.free();
        rawShape1.free();
        rawShape2.free();
        return result;
    }
    /**
     * Computes one pair of contact points between two shapes.
     *
     * @param shapePos1 - The initial position of this sahpe.
     * @param shapeRot1 - The rotation of this shape.
     * @param shape2 - The second shape.
     * @param shapePos2 - The initial position of the second shape.
     * @param shapeRot2 - The rotation of the second shape.
     * @param prediction - The prediction value, if the shapes are separated by a distance greater than this value, test will fail.
     * @returns `null` if the shapes are separated by a distance greater than prediction, otherwise contact details. The result is given in world-space.
     */
    contactShape(shapePos1, shapeRot1, shape2, shapePos2, shapeRot2, prediction) {
        let rawPos1 = _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.intoRaw */ .ut.intoRaw(shapePos1);
        let rawRot1 = _math__WEBPACK_IMPORTED_MODULE_0__/* .RotationOps.intoRaw */ .T3.intoRaw(shapeRot1);
        let rawPos2 = _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.intoRaw */ .ut.intoRaw(shapePos2);
        let rawRot2 = _math__WEBPACK_IMPORTED_MODULE_0__/* .RotationOps.intoRaw */ .T3.intoRaw(shapeRot2);
        let rawShape1 = this.intoRaw();
        let rawShape2 = shape2.intoRaw();
        let result = _contact__WEBPACK_IMPORTED_MODULE_2__/* .ShapeContact.fromRaw */ .Q.fromRaw(rawShape1.contactShape(rawPos1, rawRot1, rawShape2, rawPos2, rawRot2, prediction));
        rawPos1.free();
        rawRot1.free();
        rawPos2.free();
        rawRot2.free();
        rawShape1.free();
        rawShape2.free();
        return result;
    }
    containsPoint(shapePos, shapeRot, point) {
        let rawPos = _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.intoRaw */ .ut.intoRaw(shapePos);
        let rawRot = _math__WEBPACK_IMPORTED_MODULE_0__/* .RotationOps.intoRaw */ .T3.intoRaw(shapeRot);
        let rawPoint = _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.intoRaw */ .ut.intoRaw(point);
        let rawShape = this.intoRaw();
        let result = rawShape.containsPoint(rawPos, rawRot, rawPoint);
        rawPos.free();
        rawRot.free();
        rawPoint.free();
        rawShape.free();
        return result;
    }
    projectPoint(shapePos, shapeRot, point, solid) {
        let rawPos = _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.intoRaw */ .ut.intoRaw(shapePos);
        let rawRot = _math__WEBPACK_IMPORTED_MODULE_0__/* .RotationOps.intoRaw */ .T3.intoRaw(shapeRot);
        let rawPoint = _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.intoRaw */ .ut.intoRaw(point);
        let rawShape = this.intoRaw();
        let result = _point__WEBPACK_IMPORTED_MODULE_3__/* .PointProjection.fromRaw */ .F.fromRaw(rawShape.projectPoint(rawPos, rawRot, rawPoint, solid));
        rawPos.free();
        rawRot.free();
        rawPoint.free();
        rawShape.free();
        return result;
    }
    intersectsRay(ray, shapePos, shapeRot, maxToi) {
        let rawPos = _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.intoRaw */ .ut.intoRaw(shapePos);
        let rawRot = _math__WEBPACK_IMPORTED_MODULE_0__/* .RotationOps.intoRaw */ .T3.intoRaw(shapeRot);
        let rawRayOrig = _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.intoRaw */ .ut.intoRaw(ray.origin);
        let rawRayDir = _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.intoRaw */ .ut.intoRaw(ray.dir);
        let rawShape = this.intoRaw();
        let result = rawShape.intersectsRay(rawPos, rawRot, rawRayOrig, rawRayDir, maxToi);
        rawPos.free();
        rawRot.free();
        rawRayOrig.free();
        rawRayDir.free();
        rawShape.free();
        return result;
    }
    castRay(ray, shapePos, shapeRot, maxToi, solid) {
        let rawPos = _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.intoRaw */ .ut.intoRaw(shapePos);
        let rawRot = _math__WEBPACK_IMPORTED_MODULE_0__/* .RotationOps.intoRaw */ .T3.intoRaw(shapeRot);
        let rawRayOrig = _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.intoRaw */ .ut.intoRaw(ray.origin);
        let rawRayDir = _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.intoRaw */ .ut.intoRaw(ray.dir);
        let rawShape = this.intoRaw();
        let result = rawShape.castRay(rawPos, rawRot, rawRayOrig, rawRayDir, maxToi, solid);
        rawPos.free();
        rawRot.free();
        rawRayOrig.free();
        rawRayDir.free();
        rawShape.free();
        return result;
    }
    castRayAndGetNormal(ray, shapePos, shapeRot, maxToi, solid) {
        let rawPos = _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.intoRaw */ .ut.intoRaw(shapePos);
        let rawRot = _math__WEBPACK_IMPORTED_MODULE_0__/* .RotationOps.intoRaw */ .T3.intoRaw(shapeRot);
        let rawRayOrig = _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.intoRaw */ .ut.intoRaw(ray.origin);
        let rawRayDir = _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.intoRaw */ .ut.intoRaw(ray.dir);
        let rawShape = this.intoRaw();
        let result = _ray__WEBPACK_IMPORTED_MODULE_4__/* .RayIntersection.fromRaw */ .Gz.fromRaw(rawShape.castRayAndGetNormal(rawPos, rawRot, rawRayOrig, rawRayDir, maxToi, solid));
        rawPos.free();
        rawRot.free();
        rawRayOrig.free();
        rawRayDir.free();
        rawShape.free();
        return result;
    }
}
// #if DIM3
/**
 * An enumeration representing the type of a shape.
 */
var ShapeType;
(function (ShapeType) {
    ShapeType[ShapeType["Ball"] = 0] = "Ball";
    ShapeType[ShapeType["Cuboid"] = 1] = "Cuboid";
    ShapeType[ShapeType["Capsule"] = 2] = "Capsule";
    ShapeType[ShapeType["Segment"] = 3] = "Segment";
    ShapeType[ShapeType["Polyline"] = 4] = "Polyline";
    ShapeType[ShapeType["Triangle"] = 5] = "Triangle";
    ShapeType[ShapeType["TriMesh"] = 6] = "TriMesh";
    ShapeType[ShapeType["HeightField"] = 7] = "HeightField";
    // Compound = 8,
    ShapeType[ShapeType["ConvexPolyhedron"] = 9] = "ConvexPolyhedron";
    ShapeType[ShapeType["Cylinder"] = 10] = "Cylinder";
    ShapeType[ShapeType["Cone"] = 11] = "Cone";
    ShapeType[ShapeType["RoundCuboid"] = 12] = "RoundCuboid";
    ShapeType[ShapeType["RoundTriangle"] = 13] = "RoundTriangle";
    ShapeType[ShapeType["RoundCylinder"] = 14] = "RoundCylinder";
    ShapeType[ShapeType["RoundCone"] = 15] = "RoundCone";
    ShapeType[ShapeType["RoundConvexPolyhedron"] = 16] = "RoundConvexPolyhedron";
    ShapeType[ShapeType["HalfSpace"] = 17] = "HalfSpace";
})(ShapeType || (ShapeType = {}));
// #endif
/**
 * A shape that is a sphere in 3D and a circle in 2D.
 */
class Ball extends Shape {
    /**
     * Creates a new ball with the given radius.
     * @param radius - The balls radius.
     */
    constructor(radius) {
        super();
        this.type = ShapeType.Ball;
        this.radius = radius;
    }
    intoRaw() {
        return _raw__WEBPACK_IMPORTED_MODULE_5__/* .RawShape.ball */ .X7.ball(this.radius);
    }
}
class HalfSpace extends Shape {
    /**
     * Creates a new halfspace delimited by an infinite plane.
     *
     * @param normal - The outward normal of the plane.
     */
    constructor(normal) {
        super();
        this.type = ShapeType.HalfSpace;
        this.normal = normal;
    }
    intoRaw() {
        let n = _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.intoRaw */ .ut.intoRaw(this.normal);
        let result = _raw__WEBPACK_IMPORTED_MODULE_5__/* .RawShape.halfspace */ .X7.halfspace(n);
        n.free();
        return result;
    }
}
/**
 * A shape that is a box in 3D and a rectangle in 2D.
 */
class Cuboid extends Shape {
    // #if DIM3
    /**
     * Creates a new 3D cuboid.
     * @param hx - The half width of the cuboid.
     * @param hy - The half height of the cuboid.
     * @param hz - The half depth of the cuboid.
     */
    constructor(hx, hy, hz) {
        super();
        this.type = ShapeType.Cuboid;
        this.halfExtents = _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps["new"] */ .ut["new"](hx, hy, hz);
    }
    // #endif
    intoRaw() {
        // #if DIM3
        return _raw__WEBPACK_IMPORTED_MODULE_5__/* .RawShape.cuboid */ .X7.cuboid(this.halfExtents.x, this.halfExtents.y, this.halfExtents.z);
        // #endif
    }
}
/**
 * A shape that is a box in 3D and a rectangle in 2D, with round corners.
 */
class RoundCuboid extends Shape {
    // #if DIM3
    /**
     * Creates a new 3D cuboid.
     * @param hx - The half width of the cuboid.
     * @param hy - The half height of the cuboid.
     * @param hz - The half depth of the cuboid.
     * @param borderRadius - The radius of the borders of this cuboid. This will
     *   effectively increase the half-extents of the cuboid by this radius.
     */
    constructor(hx, hy, hz, borderRadius) {
        super();
        this.type = ShapeType.RoundCuboid;
        this.halfExtents = _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps["new"] */ .ut["new"](hx, hy, hz);
        this.borderRadius = borderRadius;
    }
    // #endif
    intoRaw() {
        // #if DIM3
        return _raw__WEBPACK_IMPORTED_MODULE_5__/* .RawShape.roundCuboid */ .X7.roundCuboid(this.halfExtents.x, this.halfExtents.y, this.halfExtents.z, this.borderRadius);
        // #endif
    }
}
/**
 * A shape that is a capsule.
 */
class Capsule extends Shape {
    /**
     * Creates a new capsule with the given radius and half-height.
     * @param halfHeight - The balls half-height along the `y` axis.
     * @param radius - The balls radius.
     */
    constructor(halfHeight, radius) {
        super();
        this.type = ShapeType.Capsule;
        this.halfHeight = halfHeight;
        this.radius = radius;
    }
    intoRaw() {
        return _raw__WEBPACK_IMPORTED_MODULE_5__/* .RawShape.capsule */ .X7.capsule(this.halfHeight, this.radius);
    }
}
/**
 * A shape that is a segment.
 */
class Segment extends Shape {
    /**
     * Creates a new segment shape.
     * @param a - The first point of the segment.
     * @param b - The second point of the segment.
     */
    constructor(a, b) {
        super();
        this.type = ShapeType.Segment;
        this.a = a;
        this.b = b;
    }
    intoRaw() {
        let ra = _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.intoRaw */ .ut.intoRaw(this.a);
        let rb = _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.intoRaw */ .ut.intoRaw(this.b);
        let result = _raw__WEBPACK_IMPORTED_MODULE_5__/* .RawShape.segment */ .X7.segment(ra, rb);
        ra.free();
        rb.free();
        return result;
    }
}
/**
 * A shape that is a segment.
 */
class Triangle extends Shape {
    /**
     * Creates a new triangle shape.
     *
     * @param a - The first point of the triangle.
     * @param b - The second point of the triangle.
     * @param c - The third point of the triangle.
     */
    constructor(a, b, c) {
        super();
        this.type = ShapeType.Triangle;
        this.a = a;
        this.b = b;
        this.c = c;
    }
    intoRaw() {
        let ra = _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.intoRaw */ .ut.intoRaw(this.a);
        let rb = _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.intoRaw */ .ut.intoRaw(this.b);
        let rc = _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.intoRaw */ .ut.intoRaw(this.c);
        let result = _raw__WEBPACK_IMPORTED_MODULE_5__/* .RawShape.triangle */ .X7.triangle(ra, rb, rc);
        ra.free();
        rb.free();
        rc.free();
        return result;
    }
}
/**
 * A shape that is a triangle with round borders and a non-zero thickness.
 */
class RoundTriangle extends Shape {
    /**
     * Creates a new triangle shape with round corners.
     *
     * @param a - The first point of the triangle.
     * @param b - The second point of the triangle.
     * @param c - The third point of the triangle.
     * @param borderRadius - The radius of the borders of this triangle. In 3D,
     *   this is also equal to half the thickness of the triangle.
     */
    constructor(a, b, c, borderRadius) {
        super();
        this.type = ShapeType.RoundTriangle;
        this.a = a;
        this.b = b;
        this.c = c;
        this.borderRadius = borderRadius;
    }
    intoRaw() {
        let ra = _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.intoRaw */ .ut.intoRaw(this.a);
        let rb = _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.intoRaw */ .ut.intoRaw(this.b);
        let rc = _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.intoRaw */ .ut.intoRaw(this.c);
        let result = _raw__WEBPACK_IMPORTED_MODULE_5__/* .RawShape.roundTriangle */ .X7.roundTriangle(ra, rb, rc, this.borderRadius);
        ra.free();
        rb.free();
        rc.free();
        return result;
    }
}
/**
 * A shape that is a triangle mesh.
 */
class Polyline extends Shape {
    /**
     * Creates a new polyline shape.
     *
     * @param vertices - The coordinates of the polyline's vertices.
     * @param indices - The indices of the polyline's segments. If this is `null` or not provided, then
     *    the vertices are assumed to form a line strip.
     */
    constructor(vertices, indices) {
        super();
        this.type = ShapeType.Polyline;
        this.vertices = vertices;
        this.indices = indices !== null && indices !== void 0 ? indices : new Uint32Array(0);
    }
    intoRaw() {
        return _raw__WEBPACK_IMPORTED_MODULE_5__/* .RawShape.polyline */ .X7.polyline(this.vertices, this.indices);
    }
}
/**
 * A shape that is a triangle mesh.
 */
class TriMesh extends Shape {
    /**
     * Creates a new triangle mesh shape.
     *
     * @param vertices - The coordinates of the triangle mesh's vertices.
     * @param indices - The indices of the triangle mesh's triangles.
     */
    constructor(vertices, indices) {
        super();
        this.type = ShapeType.TriMesh;
        this.vertices = vertices;
        this.indices = indices;
    }
    intoRaw() {
        return _raw__WEBPACK_IMPORTED_MODULE_5__/* .RawShape.trimesh */ .X7.trimesh(this.vertices, this.indices);
    }
}
// #if DIM3
/**
 * A shape that is a convex polygon.
 */
class ConvexPolyhedron extends Shape {
    /**
     * Creates a new convex polygon shape.
     *
     * @param vertices - The coordinates of the convex polygon's vertices.
     * @param indices - The index buffer of this convex mesh. If this is `null`
     *   or `undefined`, the convex-hull of the input vertices will be computed
     *   automatically. Otherwise, it will be assumed that the mesh you provide
     *   is already convex.
     */
    constructor(vertices, indices) {
        super();
        this.type = ShapeType.ConvexPolyhedron;
        this.vertices = vertices;
        this.indices = indices;
    }
    intoRaw() {
        if (!!this.indices) {
            return _raw__WEBPACK_IMPORTED_MODULE_5__/* .RawShape.convexMesh */ .X7.convexMesh(this.vertices, this.indices);
        }
        else {
            return _raw__WEBPACK_IMPORTED_MODULE_5__/* .RawShape.convexHull */ .X7.convexHull(this.vertices);
        }
    }
}
/**
 * A shape that is a convex polygon.
 */
class RoundConvexPolyhedron extends Shape {
    /**
     * Creates a new convex polygon shape.
     *
     * @param vertices - The coordinates of the convex polygon's vertices.
     * @param indices - The index buffer of this convex mesh. If this is `null`
     *   or `undefined`, the convex-hull of the input vertices will be computed
     *   automatically. Otherwise, it will be assumed that the mesh you provide
     *   is already convex.
     * @param borderRadius - The radius of the borders of this convex polyhedron.
     */
    constructor(vertices, indices, borderRadius) {
        super();
        this.type = ShapeType.RoundConvexPolyhedron;
        this.vertices = vertices;
        this.indices = indices;
        this.borderRadius = borderRadius;
    }
    intoRaw() {
        if (!!this.indices) {
            return _raw__WEBPACK_IMPORTED_MODULE_5__/* .RawShape.roundConvexMesh */ .X7.roundConvexMesh(this.vertices, this.indices, this.borderRadius);
        }
        else {
            return _raw__WEBPACK_IMPORTED_MODULE_5__/* .RawShape.roundConvexHull */ .X7.roundConvexHull(this.vertices, this.borderRadius);
        }
    }
}
/**
 * A shape that is a heightfield.
 */
class Heightfield extends Shape {
    /**
     * Creates a new heightfield shape.
     *
     * @param nrows − The number of rows in the heights matrix.
     * @param ncols - The number of columns in the heights matrix.
     * @param heights - The heights of the heightfield along its local `y` axis,
     *                  provided as a matrix stored in column-major order.
     * @param scale - The dimensions of the heightfield's local `x,z` plane.
     */
    constructor(nrows, ncols, heights, scale) {
        super();
        this.type = ShapeType.HeightField;
        this.nrows = nrows;
        this.ncols = ncols;
        this.heights = heights;
        this.scale = scale;
    }
    intoRaw() {
        let rawScale = _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.intoRaw */ .ut.intoRaw(this.scale);
        let rawShape = _raw__WEBPACK_IMPORTED_MODULE_5__/* .RawShape.heightfield */ .X7.heightfield(this.nrows, this.ncols, this.heights, rawScale);
        rawScale.free();
        return rawShape;
    }
}
/**
 * A shape that is a 3D cylinder.
 */
class Cylinder extends Shape {
    /**
     * Creates a new cylinder with the given radius and half-height.
     * @param halfHeight - The balls half-height along the `y` axis.
     * @param radius - The balls radius.
     */
    constructor(halfHeight, radius) {
        super();
        this.type = ShapeType.Cylinder;
        this.halfHeight = halfHeight;
        this.radius = radius;
    }
    intoRaw() {
        return _raw__WEBPACK_IMPORTED_MODULE_5__/* .RawShape.cylinder */ .X7.cylinder(this.halfHeight, this.radius);
    }
}
/**
 * A shape that is a 3D cylinder with round corners.
 */
class RoundCylinder extends Shape {
    /**
     * Creates a new cylinder with the given radius and half-height.
     * @param halfHeight - The balls half-height along the `y` axis.
     * @param radius - The balls radius.
     * @param borderRadius - The radius of the borders of this cylinder.
     */
    constructor(halfHeight, radius, borderRadius) {
        super();
        this.type = ShapeType.RoundCylinder;
        this.borderRadius = borderRadius;
        this.halfHeight = halfHeight;
        this.radius = radius;
    }
    intoRaw() {
        return _raw__WEBPACK_IMPORTED_MODULE_5__/* .RawShape.roundCylinder */ .X7.roundCylinder(this.halfHeight, this.radius, this.borderRadius);
    }
}
/**
 * A shape that is a 3D cone.
 */
class Cone extends Shape {
    /**
     * Creates a new cone with the given radius and half-height.
     * @param halfHeight - The balls half-height along the `y` axis.
     * @param radius - The balls radius.
     */
    constructor(halfHeight, radius) {
        super();
        this.type = ShapeType.Cone;
        this.halfHeight = halfHeight;
        this.radius = radius;
    }
    intoRaw() {
        return _raw__WEBPACK_IMPORTED_MODULE_5__/* .RawShape.cone */ .X7.cone(this.halfHeight, this.radius);
    }
}
/**
 * A shape that is a 3D cone with round corners.
 */
class RoundCone extends Shape {
    /**
     * Creates a new cone with the given radius and half-height.
     * @param halfHeight - The balls half-height along the `y` axis.
     * @param radius - The balls radius.
     * @param borderRadius - The radius of the borders of this cone.
     */
    constructor(halfHeight, radius, borderRadius) {
        super();
        this.type = ShapeType.RoundCone;
        this.halfHeight = halfHeight;
        this.radius = radius;
        this.borderRadius = borderRadius;
    }
    intoRaw() {
        return _raw__WEBPACK_IMPORTED_MODULE_5__/* .RawShape.roundCone */ .X7.roundCone(this.halfHeight, this.radius, this.borderRadius);
    }
}
// #endif
//# sourceMappingURL=shape.js.map
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 961:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "G": () => (/* binding */ ShapeTOI),
/* harmony export */   "m": () => (/* binding */ ShapeColliderTOI)
/* harmony export */ });
/* harmony import */ var _math__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(383);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_math__WEBPACK_IMPORTED_MODULE_0__]);
_math__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];

/**
 * The intersection between a ray and a collider.
 */
class ShapeTOI {
    constructor(toi, witness1, witness2, normal1, normal2) {
        this.toi = toi;
        this.witness1 = witness1;
        this.witness2 = witness2;
        this.normal1 = normal1;
        this.normal2 = normal2;
    }
    static fromRaw(colliderSet, raw) {
        if (!raw)
            return null;
        const result = new ShapeTOI(raw.toi(), _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.fromRaw */ .ut.fromRaw(raw.witness1()), _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.fromRaw */ .ut.fromRaw(raw.witness2()), _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.fromRaw */ .ut.fromRaw(raw.normal1()), _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.fromRaw */ .ut.fromRaw(raw.normal2()));
        raw.free();
        return result;
    }
}
/**
 * The intersection between a ray and a collider.
 */
class ShapeColliderTOI extends ShapeTOI {
    constructor(collider, toi, witness1, witness2, normal1, normal2) {
        super(toi, witness1, witness2, normal1, normal2);
        this.collider = collider;
    }
    static fromRaw(colliderSet, raw) {
        if (!raw)
            return null;
        const result = new ShapeColliderTOI(colliderSet.get(raw.colliderHandle()), raw.toi(), _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.fromRaw */ .ut.fromRaw(raw.witness1()), _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.fromRaw */ .ut.fromRaw(raw.witness2()), _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.fromRaw */ .ut.fromRaw(raw.normal1()), _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.fromRaw */ .ut.fromRaw(raw.normal2()));
        raw.free();
        return result;
    }
}
//# sourceMappingURL=toi.js.map
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 383:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "P": () => (/* binding */ Vector3),
/* harmony export */   "PR": () => (/* binding */ SdpMatrix3Ops),
/* harmony export */   "T3": () => (/* binding */ RotationOps),
/* harmony export */   "_f": () => (/* binding */ Quaternion),
/* harmony export */   "ut": () => (/* binding */ VectorOps),
/* harmony export */   "w4": () => (/* binding */ SdpMatrix3)
/* harmony export */ });
/* harmony import */ var _raw__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(184);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_raw__WEBPACK_IMPORTED_MODULE_0__]);
_raw__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];

/**
 * A 3D vector.
 */
class Vector3 {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}
class VectorOps {
    static new(x, y, z) {
        return new Vector3(x, y, z);
    }
    static intoRaw(v) {
        return new _raw__WEBPACK_IMPORTED_MODULE_0__/* .RawVector */ .WF(v.x, v.y, v.z);
    }
    static zeros() {
        return VectorOps.new(0.0, 0.0, 0.0);
    }
    // FIXME: type ram: RawVector?
    static fromRaw(raw) {
        if (!raw)
            return null;
        let res = VectorOps.new(raw.x, raw.y, raw.z);
        raw.free();
        return res;
    }
    static copy(out, input) {
        out.x = input.x;
        out.y = input.y;
        out.z = input.z;
    }
}
/**
 * A quaternion.
 */
class Quaternion {
    constructor(x, y, z, w) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
}
class RotationOps {
    static identity() {
        return new Quaternion(0.0, 0.0, 0.0, 1.0);
    }
    static fromRaw(raw) {
        if (!raw)
            return null;
        let res = new Quaternion(raw.x, raw.y, raw.z, raw.w);
        raw.free();
        return res;
    }
    static intoRaw(rot) {
        return new _raw__WEBPACK_IMPORTED_MODULE_0__/* .RawRotation */ .$Z(rot.x, rot.y, rot.z, rot.w);
    }
    static copy(out, input) {
        out.x = input.x;
        out.y = input.y;
        out.z = input.z;
        out.w = input.w;
    }
}
/**
 * A 3D symmetric-positive-definite matrix.
 */
class SdpMatrix3 {
    constructor(elements) {
        this.elements = elements;
    }
    /**
     * Matrix element at row 1, column 1.
     */
    get m11() {
        return this.elements[0];
    }
    /**
     * Matrix element at row 1, column 2.
     */
    get m12() {
        return this.elements[1];
    }
    /**
     * Matrix element at row 2, column 1.
     */
    get m21() {
        return this.m12;
    }
    /**
     * Matrix element at row 1, column 3.
     */
    get m13() {
        return this.elements[2];
    }
    /**
     * Matrix element at row 3, column 1.
     */
    get m31() {
        return this.m13;
    }
    /**
     * Matrix element at row 2, column 2.
     */
    get m22() {
        return this.elements[3];
    }
    /**
     * Matrix element at row 2, column 3.
     */
    get m23() {
        return this.elements[4];
    }
    /**
     * Matrix element at row 3, column 2.
     */
    get m32() {
        return this.m23;
    }
    /**
     * Matrix element at row 3, column 3.
     */
    get m33() {
        return this.elements[5];
    }
}
class SdpMatrix3Ops {
    static fromRaw(raw) {
        const sdpMatrix3 = new SdpMatrix3(raw.elements());
        raw.free();
        return sdpMatrix3;
    }
}
// #endif
//# sourceMappingURL=math.js.map
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 339:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "k": () => (/* binding */ DebugRenderPipeline),
/* harmony export */   "t": () => (/* binding */ DebugRenderBuffers)
/* harmony export */ });
/* harmony import */ var _raw__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(184);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_raw__WEBPACK_IMPORTED_MODULE_0__]);
_raw__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];

/**
 * The vertex and color buffers for debug-redering the physics scene.
 */
class DebugRenderBuffers {
    constructor(vertices, colors) {
        this.vertices = vertices;
        this.colors = colors;
    }
}
/**
 * A pipeline for rendering the physics scene.
 *
 * To avoid leaking WASM resources, this MUST be freed manually with `debugRenderPipeline.free()`
 * once you are done using it (and all the rigid-bodies it created).
 */
class DebugRenderPipeline {
    constructor(raw) {
        this.raw = raw || new _raw__WEBPACK_IMPORTED_MODULE_0__/* .RawDebugRenderPipeline */ .wb();
    }
    /**
     * Release the WASM memory occupied by this serialization pipeline.
     */
    free() {
        if (!!this.raw) {
            this.raw.free();
        }
        this.raw = undefined;
        this.vertices = undefined;
        this.colors = undefined;
    }
    render(bodies, colliders, impulse_joints, multibody_joints, narrow_phase) {
        this.raw.render(bodies.raw, colliders.raw, impulse_joints.raw, multibody_joints.raw, narrow_phase.raw);
        this.vertices = this.raw.vertices();
        this.colors = this.raw.colors();
    }
}
//# sourceMappingURL=debug_render_pipeline.js.map
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 624:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Md": () => (/* binding */ ActiveEvents),
/* harmony export */   "NH": () => (/* binding */ EventQueue),
/* harmony export */   "qV": () => (/* binding */ TempContactForceEvent)
/* harmony export */ });
/* harmony import */ var _raw__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(184);
/* harmony import */ var _math__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(383);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_math__WEBPACK_IMPORTED_MODULE_0__, _raw__WEBPACK_IMPORTED_MODULE_1__]);
([_math__WEBPACK_IMPORTED_MODULE_0__, _raw__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);


/**
 * Flags indicating what events are enabled for colliders.
 */
var ActiveEvents;
(function (ActiveEvents) {
    /**
     * Enable collision events.
     */
    ActiveEvents[ActiveEvents["COLLISION_EVENTS"] = 1] = "COLLISION_EVENTS";
    /**
     * Enable contact force events.
     */
    ActiveEvents[ActiveEvents["CONTACT_FORCE_EVENTS"] = 2] = "CONTACT_FORCE_EVENTS";
})(ActiveEvents || (ActiveEvents = {}));
/**
 * Event occurring when the sum of the magnitudes of the
 * contact forces between two colliders exceed a threshold.
 *
 * This object should **not** be stored anywhere. Its properties can only be
 * read from within the closure given to `EventHandler.drainContactForceEvents`.
 */
class TempContactForceEvent {
    free() {
        if (!!this.raw) {
            this.raw.free();
        }
        this.raw = undefined;
    }
    /**
     * The first collider involved in the contact.
     */
    collider1() {
        return this.raw.collider1();
    }
    /**
     * The second collider involved in the contact.
     */
    collider2() {
        return this.raw.collider2();
    }
    /**
     * The sum of all the forces between the two colliders.
     */
    totalForce() {
        return _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.fromRaw */ .ut.fromRaw(this.raw.total_force());
    }
    /**
     * The sum of the magnitudes of each force between the two colliders.
     *
     * Note that this is **not** the same as the magnitude of `self.total_force`.
     * Here we are summing the magnitude of all the forces, instead of taking
     * the magnitude of their sum.
     */
    totalForceMagnitude() {
        return this.raw.total_force_magnitude();
    }
    /**
     * The world-space (unit) direction of the force with strongest magnitude.
     */
    maxForceDirection() {
        return _math__WEBPACK_IMPORTED_MODULE_0__/* .VectorOps.fromRaw */ .ut.fromRaw(this.raw.max_force_direction());
    }
    /**
     * The magnitude of the largest force at a contact point of this contact pair.
     */
    maxForceMagnitude() {
        return this.raw.max_force_magnitude();
    }
}
/**
 * A structure responsible for collecting events generated
 * by the physics engine.
 *
 * To avoid leaking WASM resources, this MUST be freed manually with `eventQueue.free()`
 * once you are done using it.
 */
class EventQueue {
    /**
     * Creates a new event collector.
     *
     * @param autoDrain -setting this to `true` is strongly recommended. If true, the collector will
     * be automatically drained before each `world.step(collector)`. If false, the collector will
     * keep all events in memory unless it is manually drained/cleared; this may lead to unbounded use of
     * RAM if no drain is performed.
     */
    constructor(autoDrain, raw) {
        this.raw = raw || new _raw__WEBPACK_IMPORTED_MODULE_1__/* .RawEventQueue */ .we(autoDrain);
    }
    /**
     * Release the WASM memory occupied by this event-queue.
     */
    free() {
        if (!!this.raw) {
            this.raw.free();
        }
        this.raw = undefined;
    }
    /**
     * Applies the given javascript closure on each collision event of this collector, then clear
     * the internal collision event buffer.
     *
     * @param f - JavaScript closure applied to each collision event. The
     * closure must take three arguments: two integers representing the handles of the colliders
     * involved in the collision, and a boolean indicating if the collision started (true) or stopped
     * (false).
     */
    drainCollisionEvents(f) {
        this.raw.drainCollisionEvents(f);
    }
    /**
     * Applies the given javascript closure on each contact force event of this collector, then clear
     * the internal collision event buffer.
     *
     * @param f - JavaScript closure applied to each collision event. The
     *            closure must take one `TempContactForceEvent` argument.
     */
    drainContactForceEvents(f) {
        let event = new TempContactForceEvent();
        this.raw.drainContactForceEvents((raw) => {
            event.raw = raw;
            f(event);
            event.free();
        });
    }
    /**
     * Removes all events contained by this collector
     */
    clear() {
        this.raw.clear();
    }
}
//# sourceMappingURL=event_queue.js.map
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 161:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DJ": () => (/* reexport safe */ _physics_pipeline__WEBPACK_IMPORTED_MODULE_1__.D),
/* harmony export */   "Md": () => (/* reexport safe */ _event_queue__WEBPACK_IMPORTED_MODULE_3__.Md),
/* harmony export */   "NH": () => (/* reexport safe */ _event_queue__WEBPACK_IMPORTED_MODULE_3__.NH),
/* harmony export */   "Nv": () => (/* reexport safe */ _physics_hooks__WEBPACK_IMPORTED_MODULE_4__.N),
/* harmony export */   "Vq": () => (/* reexport safe */ _query_pipeline__WEBPACK_IMPORTED_MODULE_6__.V),
/* harmony export */   "_m": () => (/* reexport safe */ _query_pipeline__WEBPACK_IMPORTED_MODULE_6__._),
/* harmony export */   "iX": () => (/* reexport safe */ _physics_hooks__WEBPACK_IMPORTED_MODULE_4__.i),
/* harmony export */   "kh": () => (/* reexport safe */ _debug_render_pipeline__WEBPACK_IMPORTED_MODULE_5__.k),
/* harmony export */   "q3": () => (/* reexport safe */ _world__WEBPACK_IMPORTED_MODULE_0__.q),
/* harmony export */   "qV": () => (/* reexport safe */ _event_queue__WEBPACK_IMPORTED_MODULE_3__.qV),
/* harmony export */   "tt": () => (/* reexport safe */ _debug_render_pipeline__WEBPACK_IMPORTED_MODULE_5__.t),
/* harmony export */   "y9": () => (/* reexport safe */ _serialization_pipeline__WEBPACK_IMPORTED_MODULE_2__.y)
/* harmony export */ });
/* harmony import */ var _world__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(641);
/* harmony import */ var _physics_pipeline__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(64);
/* harmony import */ var _serialization_pipeline__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(301);
/* harmony import */ var _event_queue__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(624);
/* harmony import */ var _physics_hooks__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(679);
/* harmony import */ var _debug_render_pipeline__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(339);
/* harmony import */ var _query_pipeline__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(94);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_world__WEBPACK_IMPORTED_MODULE_0__, _physics_pipeline__WEBPACK_IMPORTED_MODULE_1__, _serialization_pipeline__WEBPACK_IMPORTED_MODULE_2__, _event_queue__WEBPACK_IMPORTED_MODULE_3__, _debug_render_pipeline__WEBPACK_IMPORTED_MODULE_5__, _query_pipeline__WEBPACK_IMPORTED_MODULE_6__]);
([_world__WEBPACK_IMPORTED_MODULE_0__, _physics_pipeline__WEBPACK_IMPORTED_MODULE_1__, _serialization_pipeline__WEBPACK_IMPORTED_MODULE_2__, _event_queue__WEBPACK_IMPORTED_MODULE_3__, _debug_render_pipeline__WEBPACK_IMPORTED_MODULE_5__, _query_pipeline__WEBPACK_IMPORTED_MODULE_6__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);







//# sourceMappingURL=index.js.map
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 679:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "N": () => (/* binding */ SolverFlags),
/* harmony export */   "i": () => (/* binding */ ActiveHooks)
/* harmony export */ });
var ActiveHooks;
(function (ActiveHooks) {
    ActiveHooks[ActiveHooks["FILTER_CONTACT_PAIRS"] = 1] = "FILTER_CONTACT_PAIRS";
    ActiveHooks[ActiveHooks["FILTER_INTERSECTION_PAIRS"] = 2] = "FILTER_INTERSECTION_PAIRS";
    // MODIFY_SOLVER_CONTACTS = 0b0100, /* Not supported yet in JS. */
})(ActiveHooks || (ActiveHooks = {}));
var SolverFlags;
(function (SolverFlags) {
    SolverFlags[SolverFlags["EMPTY"] = 0] = "EMPTY";
    SolverFlags[SolverFlags["COMPUTE_IMPULSE"] = 1] = "COMPUTE_IMPULSE";
})(SolverFlags || (SolverFlags = {}));
//# sourceMappingURL=physics_hooks.js.map

/***/ }),

/***/ 64:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "D": () => (/* binding */ PhysicsPipeline)
/* harmony export */ });
/* harmony import */ var _raw__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(184);
/* harmony import */ var _math__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(383);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_raw__WEBPACK_IMPORTED_MODULE_0__, _math__WEBPACK_IMPORTED_MODULE_1__]);
([_raw__WEBPACK_IMPORTED_MODULE_0__, _math__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);


class PhysicsPipeline {
    constructor(raw) {
        this.raw = raw || new _raw__WEBPACK_IMPORTED_MODULE_0__/* .RawPhysicsPipeline */ ._q();
    }
    free() {
        if (!!this.raw) {
            this.raw.free();
        }
        this.raw = undefined;
    }
    step(gravity, integrationParameters, islands, broadPhase, narrowPhase, bodies, colliders, impulseJoints, multibodyJoints, ccdSolver, eventQueue, hooks) {
        let rawG = _math__WEBPACK_IMPORTED_MODULE_1__/* .VectorOps.intoRaw */ .ut.intoRaw(gravity);
        if (!!eventQueue) {
            this.raw.stepWithEvents(rawG, integrationParameters.raw, islands.raw, broadPhase.raw, narrowPhase.raw, bodies.raw, colliders.raw, impulseJoints.raw, multibodyJoints.raw, ccdSolver.raw, eventQueue.raw, hooks, !!hooks ? hooks.filterContactPair : null, !!hooks ? hooks.filterIntersectionPair : null);
        }
        else {
            this.raw.step(rawG, integrationParameters.raw, islands.raw, broadPhase.raw, narrowPhase.raw, bodies.raw, colliders.raw, impulseJoints.raw, multibodyJoints.raw, ccdSolver.raw);
        }
        rawG.free();
    }
}
//# sourceMappingURL=physics_pipeline.js.map
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 94:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "V": () => (/* binding */ QueryPipeline),
/* harmony export */   "_": () => (/* binding */ QueryFilterFlags)
/* harmony export */ });
/* harmony import */ var _raw__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(184);
/* harmony import */ var _geometry__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(238);
/* harmony import */ var _geometry__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(461);
/* harmony import */ var _geometry__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(961);
/* harmony import */ var _math__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(383);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_raw__WEBPACK_IMPORTED_MODULE_0__, _math__WEBPACK_IMPORTED_MODULE_1__, _geometry__WEBPACK_IMPORTED_MODULE_2__, _geometry__WEBPACK_IMPORTED_MODULE_3__, _geometry__WEBPACK_IMPORTED_MODULE_4__]);
([_raw__WEBPACK_IMPORTED_MODULE_0__, _math__WEBPACK_IMPORTED_MODULE_1__, _geometry__WEBPACK_IMPORTED_MODULE_2__, _geometry__WEBPACK_IMPORTED_MODULE_3__, _geometry__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);



// NOTE: must match the bits in the QueryFilterFlags on the Rust side.
/**
 * Flags for excluding whole sets of colliders from a scene query.
 */
var QueryFilterFlags;
(function (QueryFilterFlags) {
    /**
     * Exclude from the query any collider attached to a fixed rigid-body and colliders with no rigid-body attached.
     */
    QueryFilterFlags[QueryFilterFlags["EXCLUDE_FIXED"] = 1] = "EXCLUDE_FIXED";
    /**
     * Exclude from the query any collider attached to a dynamic rigid-body.
     */
    QueryFilterFlags[QueryFilterFlags["EXCLUDE_KINEMATIC"] = 2] = "EXCLUDE_KINEMATIC";
    /**
     * Exclude from the query any collider attached to a kinematic rigid-body.
     */
    QueryFilterFlags[QueryFilterFlags["EXCLUDE_DYNAMIC"] = 4] = "EXCLUDE_DYNAMIC";
    /**
     * Exclude from the query any collider that is a sensor.
     */
    QueryFilterFlags[QueryFilterFlags["EXCLUDE_SENSORS"] = 8] = "EXCLUDE_SENSORS";
    /**
     * Exclude from the query any collider that is not a sensor.
     */
    QueryFilterFlags[QueryFilterFlags["EXCLUDE_SOLIDS"] = 16] = "EXCLUDE_SOLIDS";
    /**
     * Excludes all colliders not attached to a dynamic rigid-body.
     */
    QueryFilterFlags[QueryFilterFlags["ONLY_DYNAMIC"] = 3] = "ONLY_DYNAMIC";
    /**
     * Excludes all colliders not attached to a kinematic rigid-body.
     */
    QueryFilterFlags[QueryFilterFlags["ONLY_KINEMATIC"] = 5] = "ONLY_KINEMATIC";
    /**
     * Exclude all colliders attached to a non-fixed rigid-body
     * (this will not exclude colliders not attached to any rigid-body).
     */
    QueryFilterFlags[QueryFilterFlags["ONLY_FIXED"] = 6] = "ONLY_FIXED";
})(QueryFilterFlags || (QueryFilterFlags = {}));
/**
 * A pipeline for performing queries on all the colliders of a scene.
 *
 * To avoid leaking WASM resources, this MUST be freed manually with `queryPipeline.free()`
 * once you are done using it (and all the rigid-bodies it created).
 */
class QueryPipeline {
    constructor(raw) {
        this.raw = raw || new _raw__WEBPACK_IMPORTED_MODULE_0__/* .RawQueryPipeline */ .nv();
    }
    /**
     * Release the WASM memory occupied by this query pipeline.
     */
    free() {
        if (!!this.raw) {
            this.raw.free();
        }
        this.raw = undefined;
    }
    /**
     * Updates the acceleration structure of the query pipeline.
     * @param bodies - The set of rigid-bodies taking part in this pipeline.
     * @param colliders - The set of colliders taking part in this pipeline.
     */
    update(bodies, colliders) {
        this.raw.update(bodies.raw, colliders.raw);
    }
    /**
     * Find the closest intersection between a ray and a set of collider.
     *
     * @param colliders - The set of colliders taking part in this pipeline.
     * @param ray - The ray to cast.
     * @param maxToi - The maximum time-of-impact that can be reported by this cast. This effectively
     *   limits the length of the ray to `ray.dir.norm() * maxToi`.
     * @param solid - If `false` then the ray will attempt to hit the boundary of a shape, even if its
     *   origin already lies inside of a shape. In other terms, `true` implies that all shapes are plain,
     *   whereas `false` implies that all shapes are hollow for this ray-cast.
     * @param groups - Used to filter the colliders that can or cannot be hit by the ray.
     * @param filter - The callback to filter out which collider will be hit.
     */
    castRay(bodies, colliders, ray, maxToi, solid, filterFlags, filterGroups, filterExcludeCollider, filterExcludeRigidBody, filterPredicate) {
        let rawOrig = _math__WEBPACK_IMPORTED_MODULE_1__/* .VectorOps.intoRaw */ .ut.intoRaw(ray.origin);
        let rawDir = _math__WEBPACK_IMPORTED_MODULE_1__/* .VectorOps.intoRaw */ .ut.intoRaw(ray.dir);
        let result = _geometry__WEBPACK_IMPORTED_MODULE_2__/* .RayColliderToi.fromRaw */ .cu.fromRaw(colliders, this.raw.castRay(bodies.raw, colliders.raw, rawOrig, rawDir, maxToi, solid, filterFlags, filterGroups, filterExcludeCollider, filterExcludeRigidBody, filterPredicate));
        rawOrig.free();
        rawDir.free();
        return result;
    }
    /**
     * Find the closest intersection between a ray and a set of collider.
     *
     * This also computes the normal at the hit point.
     * @param colliders - The set of colliders taking part in this pipeline.
     * @param ray - The ray to cast.
     * @param maxToi - The maximum time-of-impact that can be reported by this cast. This effectively
     *   limits the length of the ray to `ray.dir.norm() * maxToi`.
     * @param solid - If `false` then the ray will attempt to hit the boundary of a shape, even if its
     *   origin already lies inside of a shape. In other terms, `true` implies that all shapes are plain,
     *   whereas `false` implies that all shapes are hollow for this ray-cast.
     * @param groups - Used to filter the colliders that can or cannot be hit by the ray.
     */
    castRayAndGetNormal(bodies, colliders, ray, maxToi, solid, filterFlags, filterGroups, filterExcludeCollider, filterExcludeRigidBody, filterPredicate) {
        let rawOrig = _math__WEBPACK_IMPORTED_MODULE_1__/* .VectorOps.intoRaw */ .ut.intoRaw(ray.origin);
        let rawDir = _math__WEBPACK_IMPORTED_MODULE_1__/* .VectorOps.intoRaw */ .ut.intoRaw(ray.dir);
        let result = _geometry__WEBPACK_IMPORTED_MODULE_2__/* .RayColliderIntersection.fromRaw */ .No.fromRaw(colliders, this.raw.castRayAndGetNormal(bodies.raw, colliders.raw, rawOrig, rawDir, maxToi, solid, filterFlags, filterGroups, filterExcludeCollider, filterExcludeRigidBody, filterPredicate));
        rawOrig.free();
        rawDir.free();
        return result;
    }
    /**
     * Cast a ray and collects all the intersections between a ray and the scene.
     *
     * @param colliders - The set of colliders taking part in this pipeline.
     * @param ray - The ray to cast.
     * @param maxToi - The maximum time-of-impact that can be reported by this cast. This effectively
     *   limits the length of the ray to `ray.dir.norm() * maxToi`.
     * @param solid - If `false` then the ray will attempt to hit the boundary of a shape, even if its
     *   origin already lies inside of a shape. In other terms, `true` implies that all shapes are plain,
     *   whereas `false` implies that all shapes are hollow for this ray-cast.
     * @param groups - Used to filter the colliders that can or cannot be hit by the ray.
     * @param callback - The callback called once per hit (in no particular order) between a ray and a collider.
     *   If this callback returns `false`, then the cast will stop and no further hits will be detected/reported.
     */
    intersectionsWithRay(bodies, colliders, ray, maxToi, solid, callback, filterFlags, filterGroups, filterExcludeCollider, filterExcludeRigidBody, filterPredicate) {
        let rawOrig = _math__WEBPACK_IMPORTED_MODULE_1__/* .VectorOps.intoRaw */ .ut.intoRaw(ray.origin);
        let rawDir = _math__WEBPACK_IMPORTED_MODULE_1__/* .VectorOps.intoRaw */ .ut.intoRaw(ray.dir);
        let rawCallback = (rawInter) => {
            return callback(_geometry__WEBPACK_IMPORTED_MODULE_2__/* .RayColliderIntersection.fromRaw */ .No.fromRaw(colliders, rawInter));
        };
        this.raw.intersectionsWithRay(bodies.raw, colliders.raw, rawOrig, rawDir, maxToi, solid, rawCallback, filterFlags, filterGroups, filterExcludeCollider, filterExcludeRigidBody, filterPredicate);
        rawOrig.free();
        rawDir.free();
    }
    /**
     * Gets the handle of up to one collider intersecting the given shape.
     *
     * @param colliders - The set of colliders taking part in this pipeline.
     * @param shapePos - The position of the shape used for the intersection test.
     * @param shapeRot - The orientation of the shape used for the intersection test.
     * @param shape - The shape used for the intersection test.
     * @param groups - The bit groups and filter associated to the ray, in order to only
     *   hit the colliders with collision groups compatible with the ray's group.
     */
    intersectionWithShape(bodies, colliders, shapePos, shapeRot, shape, filterFlags, filterGroups, filterExcludeCollider, filterExcludeRigidBody, filterPredicate) {
        let rawPos = _math__WEBPACK_IMPORTED_MODULE_1__/* .VectorOps.intoRaw */ .ut.intoRaw(shapePos);
        let rawRot = _math__WEBPACK_IMPORTED_MODULE_1__/* .RotationOps.intoRaw */ .T3.intoRaw(shapeRot);
        let rawShape = shape.intoRaw();
        let result = this.raw.intersectionWithShape(bodies.raw, colliders.raw, rawPos, rawRot, rawShape, filterFlags, filterGroups, filterExcludeCollider, filterExcludeRigidBody, filterPredicate);
        rawPos.free();
        rawRot.free();
        rawShape.free();
        return result;
    }
    /**
     * Find the projection of a point on the closest collider.
     *
     * @param colliders - The set of colliders taking part in this pipeline.
     * @param point - The point to project.
     * @param solid - If this is set to `true` then the collider shapes are considered to
     *   be plain (if the point is located inside of a plain shape, its projection is the point
     *   itself). If it is set to `false` the collider shapes are considered to be hollow
     *   (if the point is located inside of an hollow shape, it is projected on the shape's
     *   boundary).
     * @param groups - The bit groups and filter associated to the point to project, in order to only
     *   project on colliders with collision groups compatible with the ray's group.
     */
    projectPoint(bodies, colliders, point, solid, filterFlags, filterGroups, filterExcludeCollider, filterExcludeRigidBody, filterPredicate) {
        let rawPoint = _math__WEBPACK_IMPORTED_MODULE_1__/* .VectorOps.intoRaw */ .ut.intoRaw(point);
        let result = _geometry__WEBPACK_IMPORTED_MODULE_3__/* .PointColliderProjection.fromRaw */ .V.fromRaw(colliders, this.raw.projectPoint(bodies.raw, colliders.raw, rawPoint, solid, filterFlags, filterGroups, filterExcludeCollider, filterExcludeRigidBody, filterPredicate));
        rawPoint.free();
        return result;
    }
    /**
     * Find the projection of a point on the closest collider.
     *
     * @param colliders - The set of colliders taking part in this pipeline.
     * @param point - The point to project.
     * @param groups - The bit groups and filter associated to the point to project, in order to only
     *   project on colliders with collision groups compatible with the ray's group.
     */
    projectPointAndGetFeature(bodies, colliders, point, filterFlags, filterGroups, filterExcludeCollider, filterExcludeRigidBody, filterPredicate) {
        let rawPoint = _math__WEBPACK_IMPORTED_MODULE_1__/* .VectorOps.intoRaw */ .ut.intoRaw(point);
        let result = _geometry__WEBPACK_IMPORTED_MODULE_3__/* .PointColliderProjection.fromRaw */ .V.fromRaw(colliders, this.raw.projectPointAndGetFeature(bodies.raw, colliders.raw, rawPoint, filterFlags, filterGroups, filterExcludeCollider, filterExcludeRigidBody, filterPredicate));
        rawPoint.free();
        return result;
    }
    /**
     * Find all the colliders containing the given point.
     *
     * @param colliders - The set of colliders taking part in this pipeline.
     * @param point - The point used for the containment test.
     * @param groups - The bit groups and filter associated to the point to test, in order to only
     *   test on colliders with collision groups compatible with the ray's group.
     * @param callback - A function called with the handles of each collider with a shape
     *   containing the `point`.
     */
    intersectionsWithPoint(bodies, colliders, point, callback, filterFlags, filterGroups, filterExcludeCollider, filterExcludeRigidBody, filterPredicate) {
        let rawPoint = _math__WEBPACK_IMPORTED_MODULE_1__/* .VectorOps.intoRaw */ .ut.intoRaw(point);
        this.raw.intersectionsWithPoint(bodies.raw, colliders.raw, rawPoint, callback, filterFlags, filterGroups, filterExcludeCollider, filterExcludeRigidBody, filterPredicate);
        rawPoint.free();
    }
    /**
     * Casts a shape at a constant linear velocity and retrieve the first collider it hits.
     * This is similar to ray-casting except that we are casting a whole shape instead of
     * just a point (the ray origin).
     *
     * @param colliders - The set of colliders taking part in this pipeline.
     * @param shapePos - The initial position of the shape to cast.
     * @param shapeRot - The initial rotation of the shape to cast.
     * @param shapeVel - The constant velocity of the shape to cast (i.e. the cast direction).
     * @param shape - The shape to cast.
     * @param maxToi - The maximum time-of-impact that can be reported by this cast. This effectively
     *   limits the distance traveled by the shape to `shapeVel.norm() * maxToi`.
     * @param stopAtPenetration - If set to `false`, the linear shape-cast won’t immediately stop if
     *   the shape is penetrating another shape at its starting point **and** its trajectory is such
     *   that it’s on a path to exist that penetration state.
     * @param groups - The bit groups and filter associated to the shape to cast, in order to only
     *   test on colliders with collision groups compatible with this group.
     */
    castShape(bodies, colliders, shapePos, shapeRot, shapeVel, shape, maxToi, stopAtPenetration, filterFlags, filterGroups, filterExcludeCollider, filterExcludeRigidBody, filterPredicate) {
        let rawPos = _math__WEBPACK_IMPORTED_MODULE_1__/* .VectorOps.intoRaw */ .ut.intoRaw(shapePos);
        let rawRot = _math__WEBPACK_IMPORTED_MODULE_1__/* .RotationOps.intoRaw */ .T3.intoRaw(shapeRot);
        let rawVel = _math__WEBPACK_IMPORTED_MODULE_1__/* .VectorOps.intoRaw */ .ut.intoRaw(shapeVel);
        let rawShape = shape.intoRaw();
        let result = _geometry__WEBPACK_IMPORTED_MODULE_4__/* .ShapeColliderTOI.fromRaw */ .m.fromRaw(colliders, this.raw.castShape(bodies.raw, colliders.raw, rawPos, rawRot, rawVel, rawShape, maxToi, stopAtPenetration, filterFlags, filterGroups, filterExcludeCollider, filterExcludeRigidBody, filterPredicate));
        rawPos.free();
        rawRot.free();
        rawVel.free();
        rawShape.free();
        return result;
    }
    /**
     * Retrieve all the colliders intersecting the given shape.
     *
     * @param colliders - The set of colliders taking part in this pipeline.
     * @param shapePos - The position of the shape to test.
     * @param shapeRot - The orientation of the shape to test.
     * @param shape - The shape to test.
     * @param groups - The bit groups and filter associated to the shape to test, in order to only
     *   test on colliders with collision groups compatible with this group.
     * @param callback - A function called with the handles of each collider intersecting the `shape`.
     */
    intersectionsWithShape(bodies, colliders, shapePos, shapeRot, shape, callback, filterFlags, filterGroups, filterExcludeCollider, filterExcludeRigidBody, filterPredicate) {
        let rawPos = _math__WEBPACK_IMPORTED_MODULE_1__/* .VectorOps.intoRaw */ .ut.intoRaw(shapePos);
        let rawRot = _math__WEBPACK_IMPORTED_MODULE_1__/* .RotationOps.intoRaw */ .T3.intoRaw(shapeRot);
        let rawShape = shape.intoRaw();
        this.raw.intersectionsWithShape(bodies.raw, colliders.raw, rawPos, rawRot, rawShape, callback, filterFlags, filterGroups, filterExcludeCollider, filterExcludeRigidBody, filterPredicate);
        rawPos.free();
        rawRot.free();
        rawShape.free();
    }
    /**
     * Finds the handles of all the colliders with an AABB intersecting the given AABB.
     *
     * @param aabbCenter - The center of the AABB to test.
     * @param aabbHalfExtents - The half-extents of the AABB to test.
     * @param callback - The callback that will be called with the handles of all the colliders
     *                   currently intersecting the given AABB.
     */
    collidersWithAabbIntersectingAabb(aabbCenter, aabbHalfExtents, callback) {
        let rawCenter = _math__WEBPACK_IMPORTED_MODULE_1__/* .VectorOps.intoRaw */ .ut.intoRaw(aabbCenter);
        let rawHalfExtents = _math__WEBPACK_IMPORTED_MODULE_1__/* .VectorOps.intoRaw */ .ut.intoRaw(aabbHalfExtents);
        this.raw.collidersWithAabbIntersectingAabb(rawCenter, rawHalfExtents, callback);
        rawCenter.free();
        rawHalfExtents.free();
    }
}
//# sourceMappingURL=query_pipeline.js.map
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 301:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "y": () => (/* binding */ SerializationPipeline)
/* harmony export */ });
/* harmony import */ var _raw__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(184);
/* harmony import */ var _math__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(383);
/* harmony import */ var _world__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(641);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_raw__WEBPACK_IMPORTED_MODULE_0__, _math__WEBPACK_IMPORTED_MODULE_1__, _world__WEBPACK_IMPORTED_MODULE_2__]);
([_raw__WEBPACK_IMPORTED_MODULE_0__, _math__WEBPACK_IMPORTED_MODULE_1__, _world__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);



/**
 * A pipeline for serializing the physics scene.
 *
 * To avoid leaking WASM resources, this MUST be freed manually with `queryPipeline.free()`
 * once you are done using it (and all the rigid-bodies it created).
 */
class SerializationPipeline {
    constructor(raw) {
        this.raw = raw || new _raw__WEBPACK_IMPORTED_MODULE_0__/* .RawSerializationPipeline */ .w0();
    }
    /**
     * Release the WASM memory occupied by this serialization pipeline.
     */
    free() {
        if (!!this.raw) {
            this.raw.free();
        }
        this.raw = undefined;
    }
    /**
     * Serialize a complete physics state into a single byte array.
     * @param gravity - The current gravity affecting the simulation.
     * @param integrationParameters - The integration parameters of the simulation.
     * @param broadPhase - The broad-phase of the simulation.
     * @param narrowPhase - The narrow-phase of the simulation.
     * @param bodies - The rigid-bodies taking part into the simulation.
     * @param colliders - The colliders taking part into the simulation.
     * @param impulseJoints - The impulse joints taking part into the simulation.
     * @param multibodyJoints - The multibody joints taking part into the simulation.
     */
    serializeAll(gravity, integrationParameters, islands, broadPhase, narrowPhase, bodies, colliders, impulseJoints, multibodyJoints) {
        let rawGra = _math__WEBPACK_IMPORTED_MODULE_1__/* .VectorOps.intoRaw */ .ut.intoRaw(gravity);
        const res = this.raw.serializeAll(rawGra, integrationParameters.raw, islands.raw, broadPhase.raw, narrowPhase.raw, bodies.raw, colliders.raw, impulseJoints.raw, multibodyJoints.raw);
        rawGra.free();
        return res;
    }
    /**
     * Deserialize the complete physics state from a single byte array.
     *
     * @param data - The byte array to deserialize.
     */
    deserializeAll(data) {
        return _world__WEBPACK_IMPORTED_MODULE_2__/* .World.fromRaw */ .q.fromRaw(this.raw.deserializeAll(data));
    }
}
//# sourceMappingURL=serialization_pipeline.js.map
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 641:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "q": () => (/* binding */ World)
/* harmony export */ });
/* harmony import */ var _geometry__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(261);
/* harmony import */ var _geometry__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(322);
/* harmony import */ var _geometry__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(927);
/* harmony import */ var _dynamics__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6);
/* harmony import */ var _dynamics__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(332);
/* harmony import */ var _dynamics__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(676);
/* harmony import */ var _dynamics__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(206);
/* harmony import */ var _dynamics__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(136);
/* harmony import */ var _dynamics__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(448);
/* harmony import */ var _math__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(383);
/* harmony import */ var _physics_pipeline__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(64);
/* harmony import */ var _query_pipeline__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(94);
/* harmony import */ var _serialization_pipeline__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(301);
/* harmony import */ var _debug_render_pipeline__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(339);
/* harmony import */ var _control__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(144);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_dynamics__WEBPACK_IMPORTED_MODULE_0__, _dynamics__WEBPACK_IMPORTED_MODULE_1__, _geometry__WEBPACK_IMPORTED_MODULE_2__, _geometry__WEBPACK_IMPORTED_MODULE_3__, _dynamics__WEBPACK_IMPORTED_MODULE_4__, _geometry__WEBPACK_IMPORTED_MODULE_5__, _dynamics__WEBPACK_IMPORTED_MODULE_6__, _dynamics__WEBPACK_IMPORTED_MODULE_7__, _dynamics__WEBPACK_IMPORTED_MODULE_8__, _query_pipeline__WEBPACK_IMPORTED_MODULE_9__, _physics_pipeline__WEBPACK_IMPORTED_MODULE_10__, _serialization_pipeline__WEBPACK_IMPORTED_MODULE_11__, _debug_render_pipeline__WEBPACK_IMPORTED_MODULE_12__, _math__WEBPACK_IMPORTED_MODULE_13__, _control__WEBPACK_IMPORTED_MODULE_14__]);
([_dynamics__WEBPACK_IMPORTED_MODULE_0__, _dynamics__WEBPACK_IMPORTED_MODULE_1__, _geometry__WEBPACK_IMPORTED_MODULE_2__, _geometry__WEBPACK_IMPORTED_MODULE_3__, _dynamics__WEBPACK_IMPORTED_MODULE_4__, _geometry__WEBPACK_IMPORTED_MODULE_5__, _dynamics__WEBPACK_IMPORTED_MODULE_6__, _dynamics__WEBPACK_IMPORTED_MODULE_7__, _dynamics__WEBPACK_IMPORTED_MODULE_8__, _query_pipeline__WEBPACK_IMPORTED_MODULE_9__, _physics_pipeline__WEBPACK_IMPORTED_MODULE_10__, _serialization_pipeline__WEBPACK_IMPORTED_MODULE_11__, _debug_render_pipeline__WEBPACK_IMPORTED_MODULE_12__, _math__WEBPACK_IMPORTED_MODULE_13__, _control__WEBPACK_IMPORTED_MODULE_14__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);








/**
 * The physics world.
 *
 * This contains all the data-structures necessary for creating and simulating
 * bodies with contacts, joints, and external forces.
 */
class World {
    constructor(gravity, rawIntegrationParameters, rawIslands, rawBroadPhase, rawNarrowPhase, rawBodies, rawColliders, rawImpulseJoints, rawMultibodyJoints, rawCCDSolver, rawQueryPipeline, rawPhysicsPipeline, rawSerializationPipeline, rawDebugRenderPipeline) {
        this.gravity = gravity;
        this.integrationParameters = new _dynamics__WEBPACK_IMPORTED_MODULE_0__/* .IntegrationParameters */ .R(rawIntegrationParameters);
        this.islands = new _dynamics__WEBPACK_IMPORTED_MODULE_1__/* .IslandManager */ .y(rawIslands);
        this.broadPhase = new _geometry__WEBPACK_IMPORTED_MODULE_2__/* .BroadPhase */ .N(rawBroadPhase);
        this.narrowPhase = new _geometry__WEBPACK_IMPORTED_MODULE_3__/* .NarrowPhase */ .L(rawNarrowPhase);
        this.bodies = new _dynamics__WEBPACK_IMPORTED_MODULE_4__/* .RigidBodySet */ .r(rawBodies);
        this.colliders = new _geometry__WEBPACK_IMPORTED_MODULE_5__/* .ColliderSet */ .z(rawColliders);
        this.impulseJoints = new _dynamics__WEBPACK_IMPORTED_MODULE_6__/* .ImpulseJointSet */ .l(rawImpulseJoints);
        this.multibodyJoints = new _dynamics__WEBPACK_IMPORTED_MODULE_7__/* .MultibodyJointSet */ .h(rawMultibodyJoints);
        this.ccdSolver = new _dynamics__WEBPACK_IMPORTED_MODULE_8__/* .CCDSolver */ .K(rawCCDSolver);
        this.queryPipeline = new _query_pipeline__WEBPACK_IMPORTED_MODULE_9__/* .QueryPipeline */ .V(rawQueryPipeline);
        this.physicsPipeline = new _physics_pipeline__WEBPACK_IMPORTED_MODULE_10__/* .PhysicsPipeline */ .D(rawPhysicsPipeline);
        this.serializationPipeline = new _serialization_pipeline__WEBPACK_IMPORTED_MODULE_11__/* .SerializationPipeline */ .y(rawSerializationPipeline);
        this.debugRenderPipeline = new _debug_render_pipeline__WEBPACK_IMPORTED_MODULE_12__/* .DebugRenderPipeline */ .k(rawDebugRenderPipeline);
        this.characterControllers = new Set();
        this.impulseJoints.finalizeDeserialization(this.bodies);
        this.bodies.finalizeDeserialization(this.colliders);
        this.colliders.finalizeDeserialization(this.bodies);
    }
    /**
     * Release the WASM memory occupied by this physics world.
     *
     * All the fields of this physics world will be freed as well,
     * so there is no need to call their `.free()` methods individually.
     */
    free() {
        this.integrationParameters.free();
        this.islands.free();
        this.broadPhase.free();
        this.narrowPhase.free();
        this.bodies.free();
        this.colliders.free();
        this.impulseJoints.free();
        this.multibodyJoints.free();
        this.ccdSolver.free();
        this.queryPipeline.free();
        this.physicsPipeline.free();
        this.serializationPipeline.free();
        this.debugRenderPipeline.free();
        this.characterControllers.forEach((controller) => controller.free());
        this.integrationParameters = undefined;
        this.islands = undefined;
        this.broadPhase = undefined;
        this.narrowPhase = undefined;
        this.bodies = undefined;
        this.colliders = undefined;
        this.ccdSolver = undefined;
        this.impulseJoints = undefined;
        this.multibodyJoints = undefined;
        this.queryPipeline = undefined;
        this.physicsPipeline = undefined;
        this.serializationPipeline = undefined;
        this.debugRenderPipeline = undefined;
        this.characterControllers = undefined;
    }
    static fromRaw(raw) {
        if (!raw)
            return null;
        return new World(_math__WEBPACK_IMPORTED_MODULE_13__/* .VectorOps.fromRaw */ .ut.fromRaw(raw.takeGravity()), raw.takeIntegrationParameters(), raw.takeIslandManager(), raw.takeBroadPhase(), raw.takeNarrowPhase(), raw.takeBodies(), raw.takeColliders(), raw.takeImpulseJoints(), raw.takeMultibodyJoints());
    }
    /**
     * Takes a snapshot of this world.
     *
     * Use `World.restoreSnapshot` to create a new physics world with a state identical to
     * the state when `.takeSnapshot()` is called.
     */
    takeSnapshot() {
        return this.serializationPipeline.serializeAll(this.gravity, this.integrationParameters, this.islands, this.broadPhase, this.narrowPhase, this.bodies, this.colliders, this.impulseJoints, this.multibodyJoints);
    }
    /**
     * Creates a new physics world from a snapshot.
     *
     * This new physics world will be an identical copy of the snapshoted physics world.
     */
    static restoreSnapshot(data) {
        let deser = new _serialization_pipeline__WEBPACK_IMPORTED_MODULE_11__/* .SerializationPipeline */ .y();
        return deser.deserializeAll(data);
    }
    /**
     * Computes all the lines (and their colors) needed to render the scene.
     */
    debugRender() {
        this.debugRenderPipeline.render(this.bodies, this.colliders, this.impulseJoints, this.multibodyJoints, this.narrowPhase);
        return new _debug_render_pipeline__WEBPACK_IMPORTED_MODULE_12__/* .DebugRenderBuffers */ .t(this.debugRenderPipeline.vertices, this.debugRenderPipeline.colors);
    }
    /**
     * Advance the simulation by one time step.
     *
     * All events generated by the physics engine are ignored.
     *
     * @param EventQueue - (optional) structure responsible for collecting
     *   events generated by the physics engine.
     */
    step(eventQueue, hooks) {
        this.physicsPipeline.step(this.gravity, this.integrationParameters, this.islands, this.broadPhase, this.narrowPhase, this.bodies, this.colliders, this.impulseJoints, this.multibodyJoints, this.ccdSolver, eventQueue, hooks);
        this.queryPipeline.update(this.bodies, this.colliders);
    }
    /**
     * Update colliders positions after rigid-bodies moved.
     *
     * When a rigid-body moves, the positions of the colliders attached to it need to be updated. This update is
     * generally automatically done at the beginning and the end of each simulation step with World.step.
     * If the positions need to be updated without running a simulation step this method can be called manually.
     */
    propagateModifiedBodyPositionsToColliders() {
        this.bodies.raw.propagateModifiedBodyPositionsToColliders(this.colliders.raw);
    }
    /**
     * Ensure subsequent scene queries take into account the collider positions set before this method is called.
     *
     * This does not step the physics simulation forward.
     */
    updateSceneQueries() {
        this.propagateModifiedBodyPositionsToColliders();
        this.queryPipeline.update(this.bodies, this.colliders);
    }
    /**
     * The current simulation timestep.
     */
    get timestep() {
        return this.integrationParameters.dt;
    }
    /**
     * Sets the new simulation timestep.
     *
     * The simulation timestep governs by how much the physics state of the world will
     * be integrated. A simulation timestep should:
     * - be as small as possible. Typical values evolve around 0.016 (assuming the chosen unit is milliseconds,
     * corresponds to the time between two frames of a game running at 60FPS).
     * - not vary too much during the course of the simulation. A timestep with large variations may
     * cause instabilities in the simulation.
     *
     * @param dt - The timestep length, in seconds.
     */
    set timestep(dt) {
        this.integrationParameters.dt = dt;
    }
    /**
     * The maximum velocity iterations the velocity-based force constraint solver can make.
     */
    get maxVelocityIterations() {
        return this.integrationParameters.maxVelocityIterations;
    }
    /**
     * Sets the maximum number of velocity iterations (default: 4).
     *
     * The greater this value is, the most rigid and realistic the physics simulation will be.
     * However a greater number of iterations is more computationally intensive.
     *
     * @param niter - The new maximum number of velocity iterations.
     */
    set maxVelocityIterations(niter) {
        this.integrationParameters.maxVelocityIterations = niter;
    }
    /**
     * The maximum velocity iterations the velocity-based friction constraint solver can make.
     */
    get maxVelocityFrictionIterations() {
        return this.integrationParameters.maxVelocityFrictionIterations;
    }
    /**
     * Sets the maximum number of velocity iterations for friction (default: 8).
     *
     * The greater this value is, the most realistic friction will be.
     * However a greater number of iterations is more computationally intensive.
     *
     * @param niter - The new maximum number of velocity iterations.
     */
    set maxVelocityFrictionIterations(niter) {
        this.integrationParameters.maxVelocityFrictionIterations = niter;
    }
    /**
     * The maximum velocity iterations the velocity-based constraint solver can make to attempt to remove
     * the energy introduced by constraint stabilization.
     */
    get maxStabilizationIterations() {
        return this.integrationParameters.maxStabilizationIterations;
    }
    /**
     * Sets the maximum number of velocity iterations for stabilization (default: 1).
     *
     * @param niter - The new maximum number of velocity iterations.
     */
    set maxStabilizationIterations(niter) {
        this.integrationParameters.maxStabilizationIterations = niter;
    }
    /**
     * Creates a new rigid-body from the given rigd-body descriptior.
     *
     * @param body - The description of the rigid-body to create.
     */
    createRigidBody(body) {
        return this.bodies.createRigidBody(this.colliders, body);
    }
    /**
     * Creates a new character controller.
     *
     * @param offset - The artificial gap added between the character’s chape and its environment.
     */
    createCharacterController(offset) {
        let controller = new _control__WEBPACK_IMPORTED_MODULE_14__/* .KinematicCharacterController */ .m(offset, this.integrationParameters, this.bodies, this.colliders, this.queryPipeline);
        this.characterControllers.add(controller);
        return controller;
    }
    /**
     * Removes a character controller from this world.
     *
     * @param controller - The character controller to remove.
     */
    removeCharacterController(controller) {
        this.characterControllers.delete(controller);
        controller.free();
    }
    /**
     * Creates a new collider.
     *
     * @param desc - The description of the collider.
     * @param parent - The rigid-body this collider is attached to.
     */
    createCollider(desc, parent) {
        let parentHandle = parent ? parent.handle : undefined;
        return this.colliders.createCollider(this.bodies, desc, parentHandle);
    }
    /**
     * Creates a new impulse joint from the given joint descriptor.
     *
     * @param params - The description of the joint to create.
     * @param parent1 - The first rigid-body attached to this joint.
     * @param parent2 - The second rigid-body attached to this joint.
     * @param wakeUp - Should the attached rigid-bodies be awakened?
     */
    createImpulseJoint(params, parent1, parent2, wakeUp) {
        return this.impulseJoints.createJoint(this.bodies, params, parent1.handle, parent2.handle, wakeUp);
    }
    /**
     * Creates a new multibody joint from the given joint descriptor.
     *
     * @param params - The description of the joint to create.
     * @param parent1 - The first rigid-body attached to this joint.
     * @param parent2 - The second rigid-body attached to this joint.
     * @param wakeUp - Should the attached rigid-bodies be awakened?
     */
    createMultibodyJoint(params, parent1, parent2, wakeUp) {
        return this.multibodyJoints.createJoint(params, parent1.handle, parent2.handle, wakeUp);
    }
    /**
     * Retrieves a rigid-body from its handle.
     *
     * @param handle - The integer handle of the rigid-body to retrieve.
     */
    getRigidBody(handle) {
        return this.bodies.get(handle);
    }
    /**
     * Retrieves a collider from its handle.
     *
     * @param handle - The integer handle of the collider to retrieve.
     */
    getCollider(handle) {
        return this.colliders.get(handle);
    }
    /**
     * Retrieves an impulse joint from its handle.
     *
     * @param handle - The integer handle of the impulse joint to retrieve.
     */
    getImpulseJoint(handle) {
        return this.impulseJoints.get(handle);
    }
    /**
     * Retrieves an multibody joint from its handle.
     *
     * @param handle - The integer handle of the multibody joint to retrieve.
     */
    getMultibodyJoint(handle) {
        return this.multibodyJoints.get(handle);
    }
    /**
     * Removes the given rigid-body from this physics world.
     *
     * This will remove this rigid-body as well as all its attached colliders and joints.
     * Every other bodies touching or attached by joints to this rigid-body will be woken-up.
     *
     * @param body - The rigid-body to remove.
     */
    removeRigidBody(body) {
        if (this.bodies) {
            this.bodies.remove(body.handle, this.islands, this.colliders, this.impulseJoints, this.multibodyJoints);
        }
    }
    /**
     * Removes the given collider from this physics world.
     *
     * @param collider - The collider to remove.
     * @param wakeUp - If set to `true`, the rigid-body this collider is attached to will be awaken.
     */
    removeCollider(collider, wakeUp) {
        if (this.colliders) {
            this.colliders.remove(collider.handle, this.islands, this.bodies, wakeUp);
        }
    }
    /**
     * Removes the given impulse joint from this physics world.
     *
     * @param joint - The impulse joint to remove.
     * @param wakeUp - If set to `true`, the rigid-bodies attached by this joint will be awaken.
     */
    removeImpulseJoint(joint, wakeUp) {
        if (this.impulseJoints) {
            this.impulseJoints.remove(joint.handle, wakeUp);
        }
    }
    /**
     * Removes the given multibody joint from this physics world.
     *
     * @param joint - The multibody joint to remove.
     * @param wakeUp - If set to `true`, the rigid-bodies attached by this joint will be awaken.
     */
    removeMultibodyJoint(joint, wakeUp) {
        if (this.impulseJoints) {
            this.multibodyJoints.remove(joint.handle, wakeUp);
        }
    }
    /**
     * Applies the given closure to each collider managed by this physics world.
     *
     * @param f(collider) - The function to apply to each collider managed by this physics world. Called as `f(collider)`.
     */
    forEachCollider(f) {
        this.colliders.forEach(f);
    }
    /**
     * Applies the given closure to each rigid-body managed by this physics world.
     *
     * @param f(body) - The function to apply to each rigid-body managed by this physics world. Called as `f(collider)`.
     */
    forEachRigidBody(f) {
        this.bodies.forEach(f);
    }
    /**
     * Applies the given closure to each active rigid-body managed by this physics world.
     *
     * After a short time of inactivity, a rigid-body is automatically deactivated ("asleep") by
     * the physics engine in order to save computational power. A sleeping rigid-body never moves
     * unless it is moved manually by the user.
     *
     * @param f - The function to apply to each active rigid-body managed by this physics world. Called as `f(collider)`.
     */
    forEachActiveRigidBody(f) {
        this.bodies.forEachActiveRigidBody(this.islands, f);
    }
    /**
     * Find the closest intersection between a ray and the physics world.
     *
     * @param ray - The ray to cast.
     * @param maxToi - The maximum time-of-impact that can be reported by this cast. This effectively
     *   limits the length of the ray to `ray.dir.norm() * maxToi`.
     * @param solid - If `false` then the ray will attempt to hit the boundary of a shape, even if its
     *   origin already lies inside of a shape. In other terms, `true` implies that all shapes are plain,
     *   whereas `false` implies that all shapes are hollow for this ray-cast.
     * @param groups - Used to filter the colliders that can or cannot be hit by the ray.
     * @param filter - The callback to filter out which collider will be hit.
     */
    castRay(ray, maxToi, solid, filterFlags, filterGroups, filterExcludeCollider, filterExcludeRigidBody, filterPredicate) {
        return this.queryPipeline.castRay(this.bodies, this.colliders, ray, maxToi, solid, filterFlags, filterGroups, filterExcludeCollider ? filterExcludeCollider.handle : null, filterExcludeRigidBody ? filterExcludeRigidBody.handle : null, this.colliders.castClosure(filterPredicate));
    }
    /**
     * Find the closest intersection between a ray and the physics world.
     *
     * This also computes the normal at the hit point.
     * @param ray - The ray to cast.
     * @param maxToi - The maximum time-of-impact that can be reported by this cast. This effectively
     *   limits the length of the ray to `ray.dir.norm() * maxToi`.
     * @param solid - If `false` then the ray will attempt to hit the boundary of a shape, even if its
     *   origin already lies inside of a shape. In other terms, `true` implies that all shapes are plain,
     *   whereas `false` implies that all shapes are hollow for this ray-cast.
     * @param groups - Used to filter the colliders that can or cannot be hit by the ray.
     */
    castRayAndGetNormal(ray, maxToi, solid, filterFlags, filterGroups, filterExcludeCollider, filterExcludeRigidBody, filterPredicate) {
        return this.queryPipeline.castRayAndGetNormal(this.bodies, this.colliders, ray, maxToi, solid, filterFlags, filterGroups, filterExcludeCollider ? filterExcludeCollider.handle : null, filterExcludeRigidBody ? filterExcludeRigidBody.handle : null, this.colliders.castClosure(filterPredicate));
    }
    /**
     * Cast a ray and collects all the intersections between a ray and the scene.
     *
     * @param ray - The ray to cast.
     * @param maxToi - The maximum time-of-impact that can be reported by this cast. This effectively
     *   limits the length of the ray to `ray.dir.norm() * maxToi`.
     * @param solid - If `false` then the ray will attempt to hit the boundary of a shape, even if its
     *   origin already lies inside of a shape. In other terms, `true` implies that all shapes are plain,
     *   whereas `false` implies that all shapes are hollow for this ray-cast.
     * @param groups - Used to filter the colliders that can or cannot be hit by the ray.
     * @param callback - The callback called once per hit (in no particular order) between a ray and a collider.
     *   If this callback returns `false`, then the cast will stop and no further hits will be detected/reported.
     */
    intersectionsWithRay(ray, maxToi, solid, callback, filterFlags, filterGroups, filterExcludeCollider, filterExcludeRigidBody, filterPredicate) {
        this.queryPipeline.intersectionsWithRay(this.bodies, this.colliders, ray, maxToi, solid, callback, filterFlags, filterGroups, filterExcludeCollider ? filterExcludeCollider.handle : null, filterExcludeRigidBody ? filterExcludeRigidBody.handle : null, this.colliders.castClosure(filterPredicate));
    }
    /**
     * Gets the handle of up to one collider intersecting the given shape.
     *
     * @param shapePos - The position of the shape used for the intersection test.
     * @param shapeRot - The orientation of the shape used for the intersection test.
     * @param shape - The shape used for the intersection test.
     * @param groups - The bit groups and filter associated to the ray, in order to only
     *   hit the colliders with collision groups compatible with the ray's group.
     */
    intersectionWithShape(shapePos, shapeRot, shape, filterFlags, filterGroups, filterExcludeCollider, filterExcludeRigidBody, filterPredicate) {
        let handle = this.queryPipeline.intersectionWithShape(this.bodies, this.colliders, shapePos, shapeRot, shape, filterFlags, filterGroups, filterExcludeCollider ? filterExcludeCollider.handle : null, filterExcludeRigidBody ? filterExcludeRigidBody.handle : null, this.colliders.castClosure(filterPredicate));
        return handle != null ? this.colliders.get(handle) : null;
    }
    /**
     * Find the projection of a point on the closest collider.
     *
     * @param point - The point to project.
     * @param solid - If this is set to `true` then the collider shapes are considered to
     *   be plain (if the point is located inside of a plain shape, its projection is the point
     *   itself). If it is set to `false` the collider shapes are considered to be hollow
     *   (if the point is located inside of an hollow shape, it is projected on the shape's
     *   boundary).
     * @param groups - The bit groups and filter associated to the point to project, in order to only
     *   project on colliders with collision groups compatible with the ray's group.
     */
    projectPoint(point, solid, filterFlags, filterGroups, filterExcludeCollider, filterExcludeRigidBody, filterPredicate) {
        return this.queryPipeline.projectPoint(this.bodies, this.colliders, point, solid, filterFlags, filterGroups, filterExcludeCollider ? filterExcludeCollider.handle : null, filterExcludeRigidBody ? filterExcludeRigidBody.handle : null, this.colliders.castClosure(filterPredicate));
    }
    /**
     * Find the projection of a point on the closest collider.
     *
     * @param point - The point to project.
     * @param groups - The bit groups and filter associated to the point to project, in order to only
     *   project on colliders with collision groups compatible with the ray's group.
     */
    projectPointAndGetFeature(point, filterFlags, filterGroups, filterExcludeCollider, filterExcludeRigidBody, filterPredicate) {
        return this.queryPipeline.projectPointAndGetFeature(this.bodies, this.colliders, point, filterFlags, filterGroups, filterExcludeCollider ? filterExcludeCollider.handle : null, filterExcludeRigidBody ? filterExcludeRigidBody.handle : null, this.colliders.castClosure(filterPredicate));
    }
    /**
     * Find all the colliders containing the given point.
     *
     * @param point - The point used for the containment test.
     * @param groups - The bit groups and filter associated to the point to test, in order to only
     *   test on colliders with collision groups compatible with the ray's group.
     * @param callback - A function called with the handles of each collider with a shape
     *   containing the `point`.
     */
    intersectionsWithPoint(point, callback, filterFlags, filterGroups, filterExcludeCollider, filterExcludeRigidBody, filterPredicate) {
        this.queryPipeline.intersectionsWithPoint(this.bodies, this.colliders, point, this.colliders.castClosure(callback), filterFlags, filterGroups, filterExcludeCollider ? filterExcludeCollider.handle : null, filterExcludeRigidBody ? filterExcludeRigidBody.handle : null, this.colliders.castClosure(filterPredicate));
    }
    /**
     * Casts a shape at a constant linear velocity and retrieve the first collider it hits.
     * This is similar to ray-casting except that we are casting a whole shape instead of
     * just a point (the ray origin).
     *
     * @param shapePos - The initial position of the shape to cast.
     * @param shapeRot - The initial rotation of the shape to cast.
     * @param shapeVel - The constant velocity of the shape to cast (i.e. the cast direction).
     * @param shape - The shape to cast.
     * @param maxToi - The maximum time-of-impact that can be reported by this cast. This effectively
     *   limits the distance traveled by the shape to `shapeVel.norm() * maxToi`.
     * @param stopAtPenetration - If set to `false`, the linear shape-cast won’t immediately stop if
     *   the shape is penetrating another shape at its starting point **and** its trajectory is such
     *   that it’s on a path to exist that penetration state.
     * @param groups - The bit groups and filter associated to the shape to cast, in order to only
     *   test on colliders with collision groups compatible with this group.
     */
    castShape(shapePos, shapeRot, shapeVel, shape, maxToi, stopAtPenetration, filterFlags, filterGroups, filterExcludeCollider, filterExcludeRigidBody, filterPredicate) {
        return this.queryPipeline.castShape(this.bodies, this.colliders, shapePos, shapeRot, shapeVel, shape, maxToi, stopAtPenetration, filterFlags, filterGroups, filterExcludeCollider ? filterExcludeCollider.handle : null, filterExcludeRigidBody ? filterExcludeRigidBody.handle : null, this.colliders.castClosure(filterPredicate));
    }
    /**
     * Retrieve all the colliders intersecting the given shape.
     *
     * @param shapePos - The position of the shape to test.
     * @param shapeRot - The orientation of the shape to test.
     * @param shape - The shape to test.
     * @param groups - The bit groups and filter associated to the shape to test, in order to only
     *   test on colliders with collision groups compatible with this group.
     * @param callback - A function called with the handles of each collider intersecting the `shape`.
     */
    intersectionsWithShape(shapePos, shapeRot, shape, callback, filterFlags, filterGroups, filterExcludeCollider, filterExcludeRigidBody, filterPredicate) {
        this.queryPipeline.intersectionsWithShape(this.bodies, this.colliders, shapePos, shapeRot, shape, this.colliders.castClosure(callback), filterFlags, filterGroups, filterExcludeCollider ? filterExcludeCollider.handle : null, filterExcludeRigidBody ? filterExcludeRigidBody.handle : null, this.colliders.castClosure(filterPredicate));
    }
    /**
     * Finds the handles of all the colliders with an AABB intersecting the given AABB.
     *
     * @param aabbCenter - The center of the AABB to test.
     * @param aabbHalfExtents - The half-extents of the AABB to test.
     * @param callback - The callback that will be called with the handles of all the colliders
     *                   currently intersecting the given AABB.
     */
    collidersWithAabbIntersectingAabb(aabbCenter, aabbHalfExtents, callback) {
        this.queryPipeline.collidersWithAabbIntersectingAabb(aabbCenter, aabbHalfExtents, this.colliders.castClosure(callback));
    }
    /**
     * Enumerates all the colliders potentially in contact with the given collider.
     *
     * @param collider1 - The second collider involved in the contact.
     * @param f - Closure that will be called on each collider that is in contact with `collider1`.
     */
    contactsWith(collider1, f) {
        this.narrowPhase.contactsWith(collider1.handle, this.colliders.castClosure(f));
    }
    /**
     * Enumerates all the colliders intersecting the given colliders, assuming one of them
     * is a sensor.
     */
    intersectionsWith(collider1, f) {
        this.narrowPhase.intersectionsWith(collider1.handle, this.colliders.castClosure(f));
    }
    /**
     * Iterates through all the contact manifolds between the given pair of colliders.
     *
     * @param collider1 - The first collider involved in the contact.
     * @param collider2 - The second collider involved in the contact.
     * @param f - Closure that will be called on each contact manifold between the two colliders. If the second argument
     *            passed to this closure is `true`, then the contact manifold data is flipped, i.e., methods like `localNormal1`
     *            actually apply to the `collider2` and fields like `localNormal2` apply to the `collider1`.
     */
    contactPair(collider1, collider2, f) {
        this.narrowPhase.contactPair(collider1.handle, collider2.handle, f);
    }
    /**
     * Returns `true` if `collider1` and `collider2` intersect and at least one of them is a sensor.
     * @param collider1 − The first collider involved in the intersection.
     * @param collider2 − The second collider involved in the intersection.
     */
    intersectionPair(collider1, collider2) {
        return this.narrowPhase.intersectionPair(collider1.handle, collider2.handle);
    }
}
//# sourceMappingURL=world.js.map
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 87:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ActiveCollisionTypes": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.ActiveCollisionTypes),
/* harmony export */   "ActiveEvents": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.ActiveEvents),
/* harmony export */   "ActiveHooks": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.ActiveHooks),
/* harmony export */   "Ball": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.Ball),
/* harmony export */   "BroadPhase": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.BroadPhase),
/* harmony export */   "CCDSolver": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.CCDSolver),
/* harmony export */   "Capsule": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.Capsule),
/* harmony export */   "CharacterCollision": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.CharacterCollision),
/* harmony export */   "CoefficientCombineRule": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.CoefficientCombineRule),
/* harmony export */   "Collider": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.Collider),
/* harmony export */   "ColliderDesc": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.ColliderDesc),
/* harmony export */   "ColliderSet": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.ColliderSet),
/* harmony export */   "Cone": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.Cone),
/* harmony export */   "ConvexPolyhedron": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.ConvexPolyhedron),
/* harmony export */   "Cuboid": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.Cuboid),
/* harmony export */   "Cylinder": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.Cylinder),
/* harmony export */   "DebugRenderBuffers": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.DebugRenderBuffers),
/* harmony export */   "DebugRenderPipeline": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.DebugRenderPipeline),
/* harmony export */   "EventQueue": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.EventQueue),
/* harmony export */   "FeatureType": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.FeatureType),
/* harmony export */   "FixedImpulseJoint": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.FixedImpulseJoint),
/* harmony export */   "FixedMultibodyJoint": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.FixedMultibodyJoint),
/* harmony export */   "HalfSpace": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.HalfSpace),
/* harmony export */   "Heightfield": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.Heightfield),
/* harmony export */   "ImpulseJoint": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.ImpulseJoint),
/* harmony export */   "ImpulseJointSet": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.ImpulseJointSet),
/* harmony export */   "IntegrationParameters": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.IntegrationParameters),
/* harmony export */   "IslandManager": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.IslandManager),
/* harmony export */   "JointData": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.JointData),
/* harmony export */   "JointType": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.JointType),
/* harmony export */   "KinematicCharacterController": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.KinematicCharacterController),
/* harmony export */   "MassPropsMode": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.MassPropsMode),
/* harmony export */   "MotorModel": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.MotorModel),
/* harmony export */   "MultibodyJoint": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.MultibodyJoint),
/* harmony export */   "MultibodyJointSet": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.MultibodyJointSet),
/* harmony export */   "NarrowPhase": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.NarrowPhase),
/* harmony export */   "PhysicsPipeline": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.PhysicsPipeline),
/* harmony export */   "PointColliderProjection": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.PointColliderProjection),
/* harmony export */   "PointProjection": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.PointProjection),
/* harmony export */   "Polyline": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.Polyline),
/* harmony export */   "PrismaticImpulseJoint": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.PrismaticImpulseJoint),
/* harmony export */   "PrismaticMultibodyJoint": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.PrismaticMultibodyJoint),
/* harmony export */   "Quaternion": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.Quaternion),
/* harmony export */   "QueryFilterFlags": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.QueryFilterFlags),
/* harmony export */   "QueryPipeline": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.QueryPipeline),
/* harmony export */   "Ray": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.Ray),
/* harmony export */   "RayColliderIntersection": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.RayColliderIntersection),
/* harmony export */   "RayColliderToi": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.RayColliderToi),
/* harmony export */   "RayIntersection": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.RayIntersection),
/* harmony export */   "RevoluteImpulseJoint": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.RevoluteImpulseJoint),
/* harmony export */   "RevoluteMultibodyJoint": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.RevoluteMultibodyJoint),
/* harmony export */   "RigidBody": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.RigidBody),
/* harmony export */   "RigidBodyDesc": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.RigidBodyDesc),
/* harmony export */   "RigidBodySet": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.RigidBodySet),
/* harmony export */   "RigidBodyType": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.RigidBodyType),
/* harmony export */   "RotationOps": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.RotationOps),
/* harmony export */   "RoundCone": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.RoundCone),
/* harmony export */   "RoundConvexPolyhedron": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.RoundConvexPolyhedron),
/* harmony export */   "RoundCuboid": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.RoundCuboid),
/* harmony export */   "RoundCylinder": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.RoundCylinder),
/* harmony export */   "RoundTriangle": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.RoundTriangle),
/* harmony export */   "SdpMatrix3": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.SdpMatrix3),
/* harmony export */   "SdpMatrix3Ops": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.SdpMatrix3Ops),
/* harmony export */   "Segment": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.Segment),
/* harmony export */   "SerializationPipeline": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.SerializationPipeline),
/* harmony export */   "Shape": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.Shape),
/* harmony export */   "ShapeColliderTOI": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.ShapeColliderTOI),
/* harmony export */   "ShapeContact": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.ShapeContact),
/* harmony export */   "ShapeTOI": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.ShapeTOI),
/* harmony export */   "ShapeType": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.ShapeType),
/* harmony export */   "SolverFlags": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.SolverFlags),
/* harmony export */   "SphericalImpulseJoint": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.SphericalImpulseJoint),
/* harmony export */   "SphericalMultibodyJoint": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.SphericalMultibodyJoint),
/* harmony export */   "TempContactForceEvent": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.TempContactForceEvent),
/* harmony export */   "TempContactManifold": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.TempContactManifold),
/* harmony export */   "TriMesh": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.TriMesh),
/* harmony export */   "Triangle": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.Triangle),
/* harmony export */   "UnitImpulseJoint": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.UnitImpulseJoint),
/* harmony export */   "UnitMultibodyJoint": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.UnitMultibodyJoint),
/* harmony export */   "Vector3": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.Vector3),
/* harmony export */   "VectorOps": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.VectorOps),
/* harmony export */   "World": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.World),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "version": () => (/* reexport safe */ _exports__WEBPACK_IMPORTED_MODULE_0__.version)
/* harmony export */ });
/* harmony import */ var _exports__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(324);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_exports__WEBPACK_IMPORTED_MODULE_0__]);
_exports__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_exports__WEBPACK_IMPORTED_MODULE_0__);
//# sourceMappingURL=rapier.js.map
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 184:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "$B": () => (/* binding */ __wbg_rawcontactforceevent_new),
/* harmony export */   "$Z": () => (/* binding */ RawRotation),
/* harmony export */   "FU": () => (/* binding */ RawBroadPhase),
/* harmony export */   "HT": () => (/* binding */ __wbindgen_boolean_get),
/* harmony export */   "IQ": () => (/* binding */ RawColliderSet),
/* harmony export */   "Is": () => (/* binding */ RawIslandManager),
/* harmony export */   "JM": () => (/* binding */ RawJointAxis),
/* harmony export */   "LE": () => (/* binding */ RawCCDSolver),
/* harmony export */   "M1": () => (/* binding */ __wbindgen_number_get),
/* harmony export */   "Mv": () => (/* binding */ __wbg_newwithbyteoffsetandlength_be22e5fcf4f69ab4),
/* harmony export */   "Ne": () => (/* binding */ __wbg_rawraycolliderintersection_new),
/* harmony export */   "Or": () => (/* binding */ __wbindgen_throw),
/* harmony export */   "Py": () => (/* binding */ __wbg_set_0e0314cf6675c1b9),
/* harmony export */   "Qc": () => (/* binding */ RawImpulseJointSet),
/* harmony export */   "Qj": () => (/* binding */ __wbg_length_9a2deed95d22668d),
/* harmony export */   "R": () => (/* binding */ __wbg_call_e1f72c051cdab859),
/* harmony export */   "TY": () => (/* binding */ __wbg_newwithbyteoffsetandlength_d9aa266703cb98be),
/* harmony export */   "VD": () => (/* binding */ __wbg_call_168da88779e35f61),
/* harmony export */   "WF": () => (/* binding */ RawVector),
/* harmony export */   "Wx": () => (/* binding */ RawCharacterCollision),
/* harmony export */   "X7": () => (/* binding */ RawShape),
/* harmony export */   "_q": () => (/* binding */ RawPhysicsPipeline),
/* harmony export */   "am": () => (/* binding */ __wbg_bind_10dfe70e95d2a480),
/* harmony export */   "bj": () => (/* binding */ __wbg_length_9e1ae1900cb0fbd5),
/* harmony export */   "cQ": () => (/* binding */ RawGenericJoint),
/* harmony export */   "fP": () => (/* binding */ __wbg_set_83db9690f9353e79),
/* harmony export */   "fY": () => (/* binding */ RawRigidBodySet),
/* harmony export */   "fl": () => (/* binding */ RawMultibodyJointSet),
/* harmony export */   "i8": () => (/* binding */ version),
/* harmony export */   "jp": () => (/* binding */ __wbg_buffer_3f3d764d4747d564),
/* harmony export */   "lB": () => (/* binding */ __wbg_new_8c3f0052272a457a),
/* harmony export */   "nv": () => (/* binding */ RawQueryPipeline),
/* harmony export */   "o$": () => (/* binding */ __wbindgen_is_function),
/* harmony export */   "oH": () => (/* binding */ __wbindgen_memory),
/* harmony export */   "pT": () => (/* binding */ __wbindgen_number_new),
/* harmony export */   "pm": () => (/* binding */ __wbg_call_3999bee59e9f7719),
/* harmony export */   "uU": () => (/* binding */ RawNarrowPhase),
/* harmony export */   "ug": () => (/* binding */ __wbindgen_object_drop_ref),
/* harmony export */   "vg": () => (/* binding */ RawKinematicCharacterController),
/* harmony export */   "w0": () => (/* binding */ RawSerializationPipeline),
/* harmony export */   "w_": () => (/* binding */ __wbg_newwithlength_a7168e4a1e8f5e12),
/* harmony export */   "wb": () => (/* binding */ RawDebugRenderPipeline),
/* harmony export */   "we": () => (/* binding */ RawEventQueue),
/* harmony export */   "zu": () => (/* binding */ RawIntegrationParameters)
/* harmony export */ });
/* unused harmony exports RawJointType, RawMotorModel, RawRigidBodyType, RawFeatureType, RawShapeType, RawContactForceEvent, RawContactManifold, RawContactPair, RawDeserializedWorld, RawPointColliderProjection, RawPointProjection, RawRayColliderIntersection, RawRayColliderToi, RawRayIntersection, RawSdpMatrix3, RawShapeColliderTOI, RawShapeContact, RawShapeTOI */
/* harmony import */ var _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(502);
/* module decorator */ module = __webpack_require__.hmd(module);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__]);
_rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];


const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

let cachedFloat64Memory0 = new Float64Array();

function getFloat64Memory0() {
    if (cachedFloat64Memory0.byteLength === 0) {
        cachedFloat64Memory0 = new Float64Array(_rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.memory.buffer);
    }
    return cachedFloat64Memory0;
}

let cachedInt32Memory0 = new Int32Array();

function getInt32Memory0() {
    if (cachedInt32Memory0.byteLength === 0) {
        cachedInt32Memory0 = new Int32Array(_rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.memory.buffer);
    }
    return cachedInt32Memory0;
}

const lTextDecoder = typeof TextDecoder === 'undefined' ? (0, module.require)('util').TextDecoder : TextDecoder;

let cachedTextDecoder = new lTextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachedUint8Memory0 = new Uint8Array();

function getUint8Memory0() {
    if (cachedUint8Memory0.byteLength === 0) {
        cachedUint8Memory0 = new Uint8Array(_rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.memory.buffer);
    }
    return cachedUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}
/**
* @returns {string}
*/
function version() {
    try {
        const retptr = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_add_to_stack_pointer(-16);
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.version(retptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        return getStringFromWasm0(r0, r1);
    } finally {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_add_to_stack_pointer(16);
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_free(r0, r1);
    }
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
    return instance.ptr;
}

let cachedFloat32Memory0 = new Float32Array();

function getFloat32Memory0() {
    if (cachedFloat32Memory0.byteLength === 0) {
        cachedFloat32Memory0 = new Float32Array(_rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.memory.buffer);
    }
    return cachedFloat32Memory0;
}

let stack_pointer = 32;

function addBorrowedObject(obj) {
    if (stack_pointer == 1) throw new Error('out of js stack');
    heap[--stack_pointer] = obj;
    return stack_pointer;
}

function getArrayF32FromWasm0(ptr, len) {
    return getFloat32Memory0().subarray(ptr / 4, ptr / 4 + len);
}

let cachedUint32Memory0 = new Uint32Array();

function getUint32Memory0() {
    if (cachedUint32Memory0.byteLength === 0) {
        cachedUint32Memory0 = new Uint32Array(_rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.memory.buffer);
    }
    return cachedUint32Memory0;
}

function getArrayU32FromWasm0(ptr, len) {
    return getUint32Memory0().subarray(ptr / 4, ptr / 4 + len);
}

let WASM_VECTOR_LEN = 0;

function passArrayF32ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 4);
    getFloat32Memory0().set(arg, ptr / 4);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function passArray32ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 4);
    getUint32Memory0().set(arg, ptr / 4);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_exn_store(addHeapObject(e));
    }
}
/**
*/
const RawJointType = Object.freeze({ Revolute:0,"0":"Revolute",Fixed:1,"1":"Fixed",Prismatic:2,"2":"Prismatic",Spherical:3,"3":"Spherical",Generic:4,"4":"Generic", });
/**
*/
const RawMotorModel = Object.freeze({ AccelerationBased:0,"0":"AccelerationBased",ForceBased:1,"1":"ForceBased", });
/**
*/
const RawJointAxis = Object.freeze({ X:0,"0":"X",Y:1,"1":"Y",Z:2,"2":"Z",AngX:3,"3":"AngX",AngY:4,"4":"AngY",AngZ:5,"5":"AngZ", });
/**
*/
const RawRigidBodyType = Object.freeze({ Dynamic:0,"0":"Dynamic",Fixed:1,"1":"Fixed",KinematicPositionBased:2,"2":"KinematicPositionBased",KinematicVelocityBased:3,"3":"KinematicVelocityBased", });
/**
*/
const RawFeatureType = Object.freeze({ Vertex:0,"0":"Vertex",Edge:1,"1":"Edge",Face:2,"2":"Face",Unknown:3,"3":"Unknown", });
/**
*/
const RawShapeType = Object.freeze({ Ball:0,"0":"Ball",Cuboid:1,"1":"Cuboid",Capsule:2,"2":"Capsule",Segment:3,"3":"Segment",Polyline:4,"4":"Polyline",Triangle:5,"5":"Triangle",TriMesh:6,"6":"TriMesh",HeightField:7,"7":"HeightField",Compound:8,"8":"Compound",ConvexPolyhedron:9,"9":"ConvexPolyhedron",Cylinder:10,"10":"Cylinder",Cone:11,"11":"Cone",RoundCuboid:12,"12":"RoundCuboid",RoundTriangle:13,"13":"RoundTriangle",RoundCylinder:14,"14":"RoundCylinder",RoundCone:15,"15":"RoundCone",RoundConvexPolyhedron:16,"16":"RoundConvexPolyhedron",HalfSpace:17,"17":"HalfSpace", });
/**
*/
class RawBroadPhase {

    static __wrap(ptr) {
        const obj = Object.create(RawBroadPhase.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbg_rawbroadphase_free(ptr);
    }
    /**
    */
    constructor() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawbroadphase_new();
        return RawBroadPhase.__wrap(ret);
    }
}
/**
*/
class RawCCDSolver {

    static __wrap(ptr) {
        const obj = Object.create(RawCCDSolver.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbg_rawccdsolver_free(ptr);
    }
    /**
    */
    constructor() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawccdsolver_new();
        return RawCCDSolver.__wrap(ret);
    }
}
/**
*/
class RawCharacterCollision {

    static __wrap(ptr) {
        const obj = Object.create(RawCharacterCollision.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbg_rawcharactercollision_free(ptr);
    }
    /**
    */
    constructor() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcharactercollision_new();
        return RawCharacterCollision.__wrap(ret);
    }
    /**
    * @returns {number}
    */
    handle() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcharactercollision_handle(this.ptr);
        return ret;
    }
    /**
    * @returns {RawVector}
    */
    translationApplied() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcharactercollision_translationApplied(this.ptr);
        return RawVector.__wrap(ret);
    }
    /**
    * @returns {RawVector}
    */
    translationRemaining() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcharactercollision_translationRemaining(this.ptr);
        return RawVector.__wrap(ret);
    }
    /**
    * @returns {number}
    */
    toi() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcharactercollision_toi(this.ptr);
        return ret;
    }
    /**
    * @returns {RawVector}
    */
    worldWitness1() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcharactercollision_worldWitness1(this.ptr);
        return RawVector.__wrap(ret);
    }
    /**
    * @returns {RawVector}
    */
    worldWitness2() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcharactercollision_worldWitness2(this.ptr);
        return RawVector.__wrap(ret);
    }
    /**
    * @returns {RawVector}
    */
    worldNormal1() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcharactercollision_worldNormal1(this.ptr);
        return RawVector.__wrap(ret);
    }
    /**
    * @returns {RawVector}
    */
    worldNormal2() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcharactercollision_worldNormal2(this.ptr);
        return RawVector.__wrap(ret);
    }
}
/**
*/
class RawColliderSet {

    static __wrap(ptr) {
        const obj = Object.create(RawColliderSet.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbg_rawcolliderset_free(ptr);
    }
    /**
    * The world-space translation of this collider.
    * @param {number} handle
    * @returns {RawVector}
    */
    coTranslation(handle) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcolliderset_coTranslation(this.ptr, handle);
        return RawVector.__wrap(ret);
    }
    /**
    * The world-space orientation of this collider.
    * @param {number} handle
    * @returns {RawRotation}
    */
    coRotation(handle) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcolliderset_coRotation(this.ptr, handle);
        return RawRotation.__wrap(ret);
    }
    /**
    * Sets the translation of this collider.
    *
    * # Parameters
    * - `x`: the world-space position of the collider along the `x` axis.
    * - `y`: the world-space position of the collider along the `y` axis.
    * - `z`: the world-space position of the collider along the `z` axis.
    * - `wakeUp`: forces the collider to wake-up so it is properly affected by forces if it
    * wasn't moving before modifying its position.
    * @param {number} handle
    * @param {number} x
    * @param {number} y
    * @param {number} z
    */
    coSetTranslation(handle, x, y, z) {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcolliderset_coSetTranslation(this.ptr, handle, x, y, z);
    }
    /**
    * @param {number} handle
    * @param {number} x
    * @param {number} y
    * @param {number} z
    */
    coSetTranslationWrtParent(handle, x, y, z) {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcolliderset_coSetTranslationWrtParent(this.ptr, handle, x, y, z);
    }
    /**
    * Sets the rotation quaternion of this collider.
    *
    * This does nothing if a zero quaternion is provided.
    *
    * # Parameters
    * - `x`: the first vector component of the quaternion.
    * - `y`: the second vector component of the quaternion.
    * - `z`: the third vector component of the quaternion.
    * - `w`: the scalar component of the quaternion.
    * - `wakeUp`: forces the collider to wake-up so it is properly affected by forces if it
    * wasn't moving before modifying its position.
    * @param {number} handle
    * @param {number} x
    * @param {number} y
    * @param {number} z
    * @param {number} w
    */
    coSetRotation(handle, x, y, z, w) {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcolliderset_coSetRotation(this.ptr, handle, x, y, z, w);
    }
    /**
    * @param {number} handle
    * @param {number} x
    * @param {number} y
    * @param {number} z
    * @param {number} w
    */
    coSetRotationWrtParent(handle, x, y, z, w) {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcolliderset_coSetRotationWrtParent(this.ptr, handle, x, y, z, w);
    }
    /**
    * Is this collider a sensor?
    * @param {number} handle
    * @returns {boolean}
    */
    coIsSensor(handle) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcolliderset_coIsSensor(this.ptr, handle);
        return ret !== 0;
    }
    /**
    * The type of the shape of this collider.
    * @param {number} handle
    * @returns {number}
    */
    coShapeType(handle) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcolliderset_coShapeType(this.ptr, handle);
        return ret >>> 0;
    }
    /**
    * @param {number} handle
    * @returns {RawVector | undefined}
    */
    coHalfspaceNormal(handle) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcolliderset_coHalfspaceNormal(this.ptr, handle);
        return ret === 0 ? undefined : RawVector.__wrap(ret);
    }
    /**
    * The half-extents of this collider if it is has a cuboid shape.
    * @param {number} handle
    * @returns {RawVector | undefined}
    */
    coHalfExtents(handle) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcolliderset_coHalfExtents(this.ptr, handle);
        return ret === 0 ? undefined : RawVector.__wrap(ret);
    }
    /**
    * Set the half-extents of this collider if it has a cuboid shape.
    * @param {number} handle
    * @param {RawVector} newHalfExtents
    */
    coSetHalfExtents(handle, newHalfExtents) {
        _assertClass(newHalfExtents, RawVector);
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcolliderset_coSetHalfExtents(this.ptr, handle, newHalfExtents.ptr);
    }
    /**
    * The radius of this collider if it is a ball, capsule, cylinder, or cone shape.
    * @param {number} handle
    * @returns {number | undefined}
    */
    coRadius(handle) {
        try {
            const retptr = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_add_to_stack_pointer(-16);
            _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcolliderset_coRadius(retptr, this.ptr, handle);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getFloat32Memory0()[retptr / 4 + 1];
            return r0 === 0 ? undefined : r1;
        } finally {
            _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * Set the radius of this collider if it is a ball, capsule, cylinder, or cone shape.
    * @param {number} handle
    * @param {number} newRadius
    */
    coSetRadius(handle, newRadius) {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcolliderset_coSetRadius(this.ptr, handle, newRadius);
    }
    /**
    * The half height of this collider if it is a capsule, cylinder, or cone shape.
    * @param {number} handle
    * @returns {number | undefined}
    */
    coHalfHeight(handle) {
        try {
            const retptr = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_add_to_stack_pointer(-16);
            _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcolliderset_coHalfHeight(retptr, this.ptr, handle);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getFloat32Memory0()[retptr / 4 + 1];
            return r0 === 0 ? undefined : r1;
        } finally {
            _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * Set the half height of this collider if it is a capsule, cylinder, or cone shape.
    * @param {number} handle
    * @param {number} newHalfheight
    */
    coSetHalfHeight(handle, newHalfheight) {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcolliderset_coSetHalfHeight(this.ptr, handle, newHalfheight);
    }
    /**
    * The radius of the round edges of this collider.
    * @param {number} handle
    * @returns {number | undefined}
    */
    coRoundRadius(handle) {
        try {
            const retptr = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_add_to_stack_pointer(-16);
            _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcolliderset_coRoundRadius(retptr, this.ptr, handle);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getFloat32Memory0()[retptr / 4 + 1];
            return r0 === 0 ? undefined : r1;
        } finally {
            _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * Set the radius of the round edges of this collider.
    * @param {number} handle
    * @param {number} newBorderRadius
    */
    coSetRoundRadius(handle, newBorderRadius) {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcolliderset_coSetRoundRadius(this.ptr, handle, newBorderRadius);
    }
    /**
    * The vertices of this triangle mesh, polyline, convex polyhedron, segment, triangle or convex polyhedron, if it is one.
    * @param {number} handle
    * @returns {Float32Array | undefined}
    */
    coVertices(handle) {
        try {
            const retptr = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_add_to_stack_pointer(-16);
            _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcolliderset_coVertices(retptr, this.ptr, handle);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            let v0;
            if (r0 !== 0) {
                v0 = getArrayF32FromWasm0(r0, r1).slice();
                _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_free(r0, r1 * 4);
            }
            return v0;
        } finally {
            _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * The indices of this triangle mesh, polyline, or convex polyhedron, if it is one.
    * @param {number} handle
    * @returns {Uint32Array | undefined}
    */
    coIndices(handle) {
        try {
            const retptr = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_add_to_stack_pointer(-16);
            _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcolliderset_coIndices(retptr, this.ptr, handle);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            let v0;
            if (r0 !== 0) {
                v0 = getArrayU32FromWasm0(r0, r1).slice();
                _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_free(r0, r1 * 4);
            }
            return v0;
        } finally {
            _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * The height of this heightfield if it is one.
    * @param {number} handle
    * @returns {Float32Array | undefined}
    */
    coHeightfieldHeights(handle) {
        try {
            const retptr = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_add_to_stack_pointer(-16);
            _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcolliderset_coHeightfieldHeights(retptr, this.ptr, handle);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            let v0;
            if (r0 !== 0) {
                v0 = getArrayF32FromWasm0(r0, r1).slice();
                _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_free(r0, r1 * 4);
            }
            return v0;
        } finally {
            _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * The scaling factor applied of this heightfield if it is one.
    * @param {number} handle
    * @returns {RawVector | undefined}
    */
    coHeightfieldScale(handle) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcolliderset_coHeightfieldScale(this.ptr, handle);
        return ret === 0 ? undefined : RawVector.__wrap(ret);
    }
    /**
    * The number of rows on this heightfield's height matrix, if it is one.
    * @param {number} handle
    * @returns {number | undefined}
    */
    coHeightfieldNRows(handle) {
        try {
            const retptr = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_add_to_stack_pointer(-16);
            _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcolliderset_coHeightfieldNRows(retptr, this.ptr, handle);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return r0 === 0 ? undefined : r1 >>> 0;
        } finally {
            _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * The number of columns on this heightfield's height matrix, if it is one.
    * @param {number} handle
    * @returns {number | undefined}
    */
    coHeightfieldNCols(handle) {
        try {
            const retptr = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_add_to_stack_pointer(-16);
            _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcolliderset_coHeightfieldNCols(retptr, this.ptr, handle);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return r0 === 0 ? undefined : r1 >>> 0;
        } finally {
            _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * The unique integer identifier of the collider this collider is attached to.
    * @param {number} handle
    * @returns {number | undefined}
    */
    coParent(handle) {
        try {
            const retptr = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_add_to_stack_pointer(-16);
            _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcolliderset_coParent(retptr, this.ptr, handle);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r2 = getFloat64Memory0()[retptr / 8 + 1];
            return r0 === 0 ? undefined : r2;
        } finally {
            _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {number} handle
    * @param {boolean} enabled
    */
    coSetEnabled(handle, enabled) {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcolliderset_coSetEnabled(this.ptr, handle, enabled);
    }
    /**
    * @param {number} handle
    * @returns {boolean}
    */
    coIsEnabled(handle) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcolliderset_coIsEnabled(this.ptr, handle);
        return ret !== 0;
    }
    /**
    * The friction coefficient of this collider.
    * @param {number} handle
    * @returns {number}
    */
    coFriction(handle) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcolliderset_coFriction(this.ptr, handle);
        return ret;
    }
    /**
    * The restitution coefficient of this collider.
    * @param {number} handle
    * @returns {number}
    */
    coRestitution(handle) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcolliderset_coRestitution(this.ptr, handle);
        return ret;
    }
    /**
    * The density of this collider.
    * @param {number} handle
    * @returns {number}
    */
    coDensity(handle) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcolliderset_coDensity(this.ptr, handle);
        return ret;
    }
    /**
    * The mass of this collider.
    * @param {number} handle
    * @returns {number}
    */
    coMass(handle) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcolliderset_coMass(this.ptr, handle);
        return ret;
    }
    /**
    * The volume of this collider.
    * @param {number} handle
    * @returns {number}
    */
    coVolume(handle) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcolliderset_coVolume(this.ptr, handle);
        return ret;
    }
    /**
    * The collision groups of this collider.
    * @param {number} handle
    * @returns {number}
    */
    coCollisionGroups(handle) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcolliderset_coCollisionGroups(this.ptr, handle);
        return ret >>> 0;
    }
    /**
    * The solver groups of this collider.
    * @param {number} handle
    * @returns {number}
    */
    coSolverGroups(handle) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcolliderset_coSolverGroups(this.ptr, handle);
        return ret >>> 0;
    }
    /**
    * The physics hooks enabled for this collider.
    * @param {number} handle
    * @returns {number}
    */
    coActiveHooks(handle) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcolliderset_coActiveHooks(this.ptr, handle);
        return ret >>> 0;
    }
    /**
    * The collision types enabled for this collider.
    * @param {number} handle
    * @returns {number}
    */
    coActiveCollisionTypes(handle) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcolliderset_coActiveCollisionTypes(this.ptr, handle);
        return ret;
    }
    /**
    * The events enabled for this collider.
    * @param {number} handle
    * @returns {number}
    */
    coActiveEvents(handle) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcolliderset_coActiveEvents(this.ptr, handle);
        return ret >>> 0;
    }
    /**
    * The total force magnitude beyond which a contact force event can be emitted.
    * @param {number} handle
    * @returns {number}
    */
    coContactForceEventThreshold(handle) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcolliderset_coContactForceEventThreshold(this.ptr, handle);
        return ret;
    }
    /**
    * @param {number} handle
    * @param {RawVector} point
    * @returns {boolean}
    */
    coContainsPoint(handle, point) {
        _assertClass(point, RawVector);
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcolliderset_coContainsPoint(this.ptr, handle, point.ptr);
        return ret !== 0;
    }
    /**
    * @param {number} handle
    * @param {RawVector} colliderVel
    * @param {RawShape} shape2
    * @param {RawVector} shape2Pos
    * @param {RawRotation} shape2Rot
    * @param {RawVector} shape2Vel
    * @param {number} maxToi
    * @param {boolean} stop_at_penetration
    * @returns {RawShapeTOI | undefined}
    */
    coCastShape(handle, colliderVel, shape2, shape2Pos, shape2Rot, shape2Vel, maxToi, stop_at_penetration) {
        _assertClass(colliderVel, RawVector);
        _assertClass(shape2, RawShape);
        _assertClass(shape2Pos, RawVector);
        _assertClass(shape2Rot, RawRotation);
        _assertClass(shape2Vel, RawVector);
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcolliderset_coCastShape(this.ptr, handle, colliderVel.ptr, shape2.ptr, shape2Pos.ptr, shape2Rot.ptr, shape2Vel.ptr, maxToi, stop_at_penetration);
        return ret === 0 ? undefined : RawShapeTOI.__wrap(ret);
    }
    /**
    * @param {number} handle
    * @param {RawVector} collider1Vel
    * @param {number} collider2handle
    * @param {RawVector} collider2Vel
    * @param {number} max_toi
    * @param {boolean} stop_at_penetration
    * @returns {RawShapeColliderTOI | undefined}
    */
    coCastCollider(handle, collider1Vel, collider2handle, collider2Vel, max_toi, stop_at_penetration) {
        _assertClass(collider1Vel, RawVector);
        _assertClass(collider2Vel, RawVector);
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcolliderset_coCastCollider(this.ptr, handle, collider1Vel.ptr, collider2handle, collider2Vel.ptr, max_toi, stop_at_penetration);
        return ret === 0 ? undefined : RawShapeColliderTOI.__wrap(ret);
    }
    /**
    * @param {number} handle
    * @param {RawShape} shape2
    * @param {RawVector} shapePos2
    * @param {RawRotation} shapeRot2
    * @returns {boolean}
    */
    coIntersectsShape(handle, shape2, shapePos2, shapeRot2) {
        _assertClass(shape2, RawShape);
        _assertClass(shapePos2, RawVector);
        _assertClass(shapeRot2, RawRotation);
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcolliderset_coIntersectsShape(this.ptr, handle, shape2.ptr, shapePos2.ptr, shapeRot2.ptr);
        return ret !== 0;
    }
    /**
    * @param {number} handle
    * @param {RawShape} shape2
    * @param {RawVector} shapePos2
    * @param {RawRotation} shapeRot2
    * @param {number} prediction
    * @returns {RawShapeContact | undefined}
    */
    coContactShape(handle, shape2, shapePos2, shapeRot2, prediction) {
        _assertClass(shape2, RawShape);
        _assertClass(shapePos2, RawVector);
        _assertClass(shapeRot2, RawRotation);
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcolliderset_coContactShape(this.ptr, handle, shape2.ptr, shapePos2.ptr, shapeRot2.ptr, prediction);
        return ret === 0 ? undefined : RawShapeContact.__wrap(ret);
    }
    /**
    * @param {number} handle
    * @param {number} collider2handle
    * @param {number} prediction
    * @returns {RawShapeContact | undefined}
    */
    coContactCollider(handle, collider2handle, prediction) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcolliderset_coContactCollider(this.ptr, handle, collider2handle, prediction);
        return ret === 0 ? undefined : RawShapeContact.__wrap(ret);
    }
    /**
    * @param {number} handle
    * @param {RawVector} point
    * @param {boolean} solid
    * @returns {RawPointProjection}
    */
    coProjectPoint(handle, point, solid) {
        _assertClass(point, RawVector);
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcolliderset_coProjectPoint(this.ptr, handle, point.ptr, solid);
        return RawPointProjection.__wrap(ret);
    }
    /**
    * @param {number} handle
    * @param {RawVector} rayOrig
    * @param {RawVector} rayDir
    * @param {number} maxToi
    * @returns {boolean}
    */
    coIntersectsRay(handle, rayOrig, rayDir, maxToi) {
        _assertClass(rayOrig, RawVector);
        _assertClass(rayDir, RawVector);
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcolliderset_coIntersectsRay(this.ptr, handle, rayOrig.ptr, rayDir.ptr, maxToi);
        return ret !== 0;
    }
    /**
    * @param {number} handle
    * @param {RawVector} rayOrig
    * @param {RawVector} rayDir
    * @param {number} maxToi
    * @param {boolean} solid
    * @returns {number}
    */
    coCastRay(handle, rayOrig, rayDir, maxToi, solid) {
        _assertClass(rayOrig, RawVector);
        _assertClass(rayDir, RawVector);
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcolliderset_coCastRay(this.ptr, handle, rayOrig.ptr, rayDir.ptr, maxToi, solid);
        return ret;
    }
    /**
    * @param {number} handle
    * @param {RawVector} rayOrig
    * @param {RawVector} rayDir
    * @param {number} maxToi
    * @param {boolean} solid
    * @returns {RawRayIntersection | undefined}
    */
    coCastRayAndGetNormal(handle, rayOrig, rayDir, maxToi, solid) {
        _assertClass(rayOrig, RawVector);
        _assertClass(rayDir, RawVector);
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcolliderset_coCastRayAndGetNormal(this.ptr, handle, rayOrig.ptr, rayDir.ptr, maxToi, solid);
        return ret === 0 ? undefined : RawRayIntersection.__wrap(ret);
    }
    /**
    * @param {number} handle
    * @param {boolean} is_sensor
    */
    coSetSensor(handle, is_sensor) {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcolliderset_coSetSensor(this.ptr, handle, is_sensor);
    }
    /**
    * @param {number} handle
    * @param {number} restitution
    */
    coSetRestitution(handle, restitution) {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcolliderset_coSetRestitution(this.ptr, handle, restitution);
    }
    /**
    * @param {number} handle
    * @param {number} friction
    */
    coSetFriction(handle, friction) {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcolliderset_coSetFriction(this.ptr, handle, friction);
    }
    /**
    * @param {number} handle
    * @returns {number}
    */
    coFrictionCombineRule(handle) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcolliderset_coFrictionCombineRule(this.ptr, handle);
        return ret >>> 0;
    }
    /**
    * @param {number} handle
    * @param {number} rule
    */
    coSetFrictionCombineRule(handle, rule) {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcolliderset_coSetFrictionCombineRule(this.ptr, handle, rule);
    }
    /**
    * @param {number} handle
    * @returns {number}
    */
    coRestitutionCombineRule(handle) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcolliderset_coRestitutionCombineRule(this.ptr, handle);
        return ret >>> 0;
    }
    /**
    * @param {number} handle
    * @param {number} rule
    */
    coSetRestitutionCombineRule(handle, rule) {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcolliderset_coSetRestitutionCombineRule(this.ptr, handle, rule);
    }
    /**
    * @param {number} handle
    * @param {number} groups
    */
    coSetCollisionGroups(handle, groups) {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcolliderset_coSetCollisionGroups(this.ptr, handle, groups);
    }
    /**
    * @param {number} handle
    * @param {number} groups
    */
    coSetSolverGroups(handle, groups) {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcolliderset_coSetSolverGroups(this.ptr, handle, groups);
    }
    /**
    * @param {number} handle
    * @param {number} hooks
    */
    coSetActiveHooks(handle, hooks) {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcolliderset_coSetActiveHooks(this.ptr, handle, hooks);
    }
    /**
    * @param {number} handle
    * @param {number} events
    */
    coSetActiveEvents(handle, events) {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcolliderset_coSetActiveEvents(this.ptr, handle, events);
    }
    /**
    * @param {number} handle
    * @param {number} types
    */
    coSetActiveCollisionTypes(handle, types) {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcolliderset_coSetActiveCollisionTypes(this.ptr, handle, types);
    }
    /**
    * @param {number} handle
    * @param {RawShape} shape
    */
    coSetShape(handle, shape) {
        _assertClass(shape, RawShape);
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcolliderset_coSetShape(this.ptr, handle, shape.ptr);
    }
    /**
    * @param {number} handle
    * @param {number} threshold
    */
    coSetContactForceEventThreshold(handle, threshold) {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcolliderset_coSetContactForceEventThreshold(this.ptr, handle, threshold);
    }
    /**
    * @param {number} handle
    * @param {number} density
    */
    coSetDensity(handle, density) {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcolliderset_coSetDensity(this.ptr, handle, density);
    }
    /**
    * @param {number} handle
    * @param {number} mass
    */
    coSetMass(handle, mass) {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcolliderset_coSetMass(this.ptr, handle, mass);
    }
    /**
    * @param {number} handle
    * @param {number} mass
    * @param {RawVector} centerOfMass
    * @param {RawVector} principalAngularInertia
    * @param {RawRotation} angularInertiaFrame
    */
    coSetMassProperties(handle, mass, centerOfMass, principalAngularInertia, angularInertiaFrame) {
        _assertClass(centerOfMass, RawVector);
        _assertClass(principalAngularInertia, RawVector);
        _assertClass(angularInertiaFrame, RawRotation);
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcolliderset_coSetMassProperties(this.ptr, handle, mass, centerOfMass.ptr, principalAngularInertia.ptr, angularInertiaFrame.ptr);
    }
    /**
    */
    constructor() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcolliderset_new();
        return RawColliderSet.__wrap(ret);
    }
    /**
    * @returns {number}
    */
    len() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcolliderset_len(this.ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} handle
    * @returns {boolean}
    */
    contains(handle) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcolliderset_contains(this.ptr, handle);
        return ret !== 0;
    }
    /**
    * @param {boolean} enabled
    * @param {RawShape} shape
    * @param {RawVector} translation
    * @param {RawRotation} rotation
    * @param {number} massPropsMode
    * @param {number} mass
    * @param {RawVector} centerOfMass
    * @param {RawVector} principalAngularInertia
    * @param {RawRotation} angularInertiaFrame
    * @param {number} density
    * @param {number} friction
    * @param {number} restitution
    * @param {number} frictionCombineRule
    * @param {number} restitutionCombineRule
    * @param {boolean} isSensor
    * @param {number} collisionGroups
    * @param {number} solverGroups
    * @param {number} activeCollisionTypes
    * @param {number} activeHooks
    * @param {number} activeEvents
    * @param {number} contactForceEventThreshold
    * @param {boolean} hasParent
    * @param {number} parent
    * @param {RawRigidBodySet} bodies
    * @returns {number | undefined}
    */
    createCollider(enabled, shape, translation, rotation, massPropsMode, mass, centerOfMass, principalAngularInertia, angularInertiaFrame, density, friction, restitution, frictionCombineRule, restitutionCombineRule, isSensor, collisionGroups, solverGroups, activeCollisionTypes, activeHooks, activeEvents, contactForceEventThreshold, hasParent, parent, bodies) {
        try {
            const retptr = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(shape, RawShape);
            _assertClass(translation, RawVector);
            _assertClass(rotation, RawRotation);
            _assertClass(centerOfMass, RawVector);
            _assertClass(principalAngularInertia, RawVector);
            _assertClass(angularInertiaFrame, RawRotation);
            _assertClass(bodies, RawRigidBodySet);
            _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcolliderset_createCollider(retptr, this.ptr, enabled, shape.ptr, translation.ptr, rotation.ptr, massPropsMode, mass, centerOfMass.ptr, principalAngularInertia.ptr, angularInertiaFrame.ptr, density, friction, restitution, frictionCombineRule, restitutionCombineRule, isSensor, collisionGroups, solverGroups, activeCollisionTypes, activeHooks, activeEvents, contactForceEventThreshold, hasParent, parent, bodies.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r2 = getFloat64Memory0()[retptr / 8 + 1];
            return r0 === 0 ? undefined : r2;
        } finally {
            _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * Removes a collider from this set and wake-up the rigid-body it is attached to.
    * @param {number} handle
    * @param {RawIslandManager} islands
    * @param {RawRigidBodySet} bodies
    * @param {boolean} wakeUp
    */
    remove(handle, islands, bodies, wakeUp) {
        _assertClass(islands, RawIslandManager);
        _assertClass(bodies, RawRigidBodySet);
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcolliderset_remove(this.ptr, handle, islands.ptr, bodies.ptr, wakeUp);
    }
    /**
    * Checks if a collider with the given integer handle exists.
    * @param {number} handle
    * @returns {boolean}
    */
    isHandleValid(handle) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcolliderset_contains(this.ptr, handle);
        return ret !== 0;
    }
    /**
    * Applies the given JavaScript function to the integer handle of each collider managed by this collider set.
    *
    * # Parameters
    * - `f(handle)`: the function to apply to the integer handle of each collider managed by this collider set. Called as `f(handle)`.
    * @param {Function} f
    */
    forEachColliderHandle(f) {
        try {
            _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcolliderset_forEachColliderHandle(this.ptr, addBorrowedObject(f));
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
}
/**
*/
class RawContactForceEvent {

    static __wrap(ptr) {
        const obj = Object.create(RawContactForceEvent.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbg_rawcontactforceevent_free(ptr);
    }
    /**
    * The first collider involved in the contact.
    * @returns {number}
    */
    collider1() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcharactercollision_handle(this.ptr);
        return ret;
    }
    /**
    * The second collider involved in the contact.
    * @returns {number}
    */
    collider2() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcontactforceevent_collider2(this.ptr);
        return ret;
    }
    /**
    * The sum of all the forces between the two colliders.
    * @returns {RawVector}
    */
    total_force() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcontactforceevent_total_force(this.ptr);
        return RawVector.__wrap(ret);
    }
    /**
    * The sum of the magnitudes of each force between the two colliders.
    *
    * Note that this is **not** the same as the magnitude of `self.total_force`.
    * Here we are summing the magnitude of all the forces, instead of taking
    * the magnitude of their sum.
    * @returns {number}
    */
    total_force_magnitude() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcontactforceevent_total_force_magnitude(this.ptr);
        return ret;
    }
    /**
    * The world-space (unit) direction of the force with strongest magnitude.
    * @returns {RawVector}
    */
    max_force_direction() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcontactforceevent_max_force_direction(this.ptr);
        return RawVector.__wrap(ret);
    }
    /**
    * The magnitude of the largest force at a contact point of this contact pair.
    * @returns {number}
    */
    max_force_magnitude() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcontactforceevent_max_force_magnitude(this.ptr);
        return ret;
    }
}
/**
*/
class RawContactManifold {

    static __wrap(ptr) {
        const obj = Object.create(RawContactManifold.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbg_rawcontactmanifold_free(ptr);
    }
    /**
    * @returns {RawVector}
    */
    normal() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcontactmanifold_normal(this.ptr);
        return RawVector.__wrap(ret);
    }
    /**
    * @returns {RawVector}
    */
    local_n1() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcontactmanifold_local_n1(this.ptr);
        return RawVector.__wrap(ret);
    }
    /**
    * @returns {RawVector}
    */
    local_n2() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcontactmanifold_local_n2(this.ptr);
        return RawVector.__wrap(ret);
    }
    /**
    * @returns {number}
    */
    subshape1() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcontactmanifold_subshape1(this.ptr);
        return ret >>> 0;
    }
    /**
    * @returns {number}
    */
    subshape2() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcontactmanifold_subshape2(this.ptr);
        return ret >>> 0;
    }
    /**
    * @returns {number}
    */
    num_contacts() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcontactmanifold_num_contacts(this.ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} i
    * @returns {RawVector | undefined}
    */
    contact_local_p1(i) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcontactmanifold_contact_local_p1(this.ptr, i);
        return ret === 0 ? undefined : RawVector.__wrap(ret);
    }
    /**
    * @param {number} i
    * @returns {RawVector | undefined}
    */
    contact_local_p2(i) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcontactmanifold_contact_local_p2(this.ptr, i);
        return ret === 0 ? undefined : RawVector.__wrap(ret);
    }
    /**
    * @param {number} i
    * @returns {number}
    */
    contact_dist(i) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcontactmanifold_contact_dist(this.ptr, i);
        return ret;
    }
    /**
    * @param {number} i
    * @returns {number}
    */
    contact_fid1(i) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcontactmanifold_contact_fid1(this.ptr, i);
        return ret >>> 0;
    }
    /**
    * @param {number} i
    * @returns {number}
    */
    contact_fid2(i) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcontactmanifold_contact_fid2(this.ptr, i);
        return ret >>> 0;
    }
    /**
    * @param {number} i
    * @returns {number}
    */
    contact_impulse(i) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcontactmanifold_contact_impulse(this.ptr, i);
        return ret;
    }
    /**
    * @param {number} i
    * @returns {number}
    */
    contact_tangent_impulse_x(i) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcontactmanifold_contact_tangent_impulse_x(this.ptr, i);
        return ret;
    }
    /**
    * @param {number} i
    * @returns {number}
    */
    contact_tangent_impulse_y(i) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcontactmanifold_contact_tangent_impulse_y(this.ptr, i);
        return ret;
    }
    /**
    * @returns {number}
    */
    num_solver_contacts() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcontactmanifold_num_solver_contacts(this.ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} i
    * @returns {RawVector | undefined}
    */
    solver_contact_point(i) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcontactmanifold_solver_contact_point(this.ptr, i);
        return ret === 0 ? undefined : RawVector.__wrap(ret);
    }
    /**
    * @param {number} i
    * @returns {number}
    */
    solver_contact_dist(i) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcontactmanifold_solver_contact_dist(this.ptr, i);
        return ret;
    }
    /**
    * @param {number} i
    * @returns {number}
    */
    solver_contact_friction(i) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcontactmanifold_solver_contact_friction(this.ptr, i);
        return ret;
    }
    /**
    * @param {number} i
    * @returns {number}
    */
    solver_contact_restitution(i) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcontactmanifold_solver_contact_restitution(this.ptr, i);
        return ret;
    }
    /**
    * @param {number} i
    * @returns {RawVector}
    */
    solver_contact_tangent_velocity(i) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcontactmanifold_solver_contact_tangent_velocity(this.ptr, i);
        return RawVector.__wrap(ret);
    }
}
/**
*/
class RawContactPair {

    static __wrap(ptr) {
        const obj = Object.create(RawContactPair.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbg_rawcontactpair_free(ptr);
    }
    /**
    * @returns {number}
    */
    collider1() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcontactpair_collider1(this.ptr);
        return ret;
    }
    /**
    * @returns {number}
    */
    collider2() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcontactpair_collider2(this.ptr);
        return ret;
    }
    /**
    * @returns {number}
    */
    numContactManifolds() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcontactpair_numContactManifolds(this.ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} i
    * @returns {RawContactManifold | undefined}
    */
    contactManifold(i) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcontactpair_contactManifold(this.ptr, i);
        return ret === 0 ? undefined : RawContactManifold.__wrap(ret);
    }
}
/**
*/
class RawDebugRenderPipeline {

    static __wrap(ptr) {
        const obj = Object.create(RawDebugRenderPipeline.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbg_rawdebugrenderpipeline_free(ptr);
    }
    /**
    */
    constructor() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawdebugrenderpipeline_new();
        return RawDebugRenderPipeline.__wrap(ret);
    }
    /**
    * @returns {Float32Array}
    */
    vertices() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawdebugrenderpipeline_vertices(this.ptr);
        return takeObject(ret);
    }
    /**
    * @returns {Float32Array}
    */
    colors() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawdebugrenderpipeline_colors(this.ptr);
        return takeObject(ret);
    }
    /**
    * @param {RawRigidBodySet} bodies
    * @param {RawColliderSet} colliders
    * @param {RawImpulseJointSet} impulse_joints
    * @param {RawMultibodyJointSet} multibody_joints
    * @param {RawNarrowPhase} narrow_phase
    */
    render(bodies, colliders, impulse_joints, multibody_joints, narrow_phase) {
        _assertClass(bodies, RawRigidBodySet);
        _assertClass(colliders, RawColliderSet);
        _assertClass(impulse_joints, RawImpulseJointSet);
        _assertClass(multibody_joints, RawMultibodyJointSet);
        _assertClass(narrow_phase, RawNarrowPhase);
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawdebugrenderpipeline_render(this.ptr, bodies.ptr, colliders.ptr, impulse_joints.ptr, multibody_joints.ptr, narrow_phase.ptr);
    }
}
/**
*/
class RawDeserializedWorld {

    static __wrap(ptr) {
        const obj = Object.create(RawDeserializedWorld.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbg_rawdeserializedworld_free(ptr);
    }
    /**
    * @returns {RawVector | undefined}
    */
    takeGravity() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawdeserializedworld_takeGravity(this.ptr);
        return ret === 0 ? undefined : RawVector.__wrap(ret);
    }
    /**
    * @returns {RawIntegrationParameters | undefined}
    */
    takeIntegrationParameters() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawdeserializedworld_takeIntegrationParameters(this.ptr);
        return ret === 0 ? undefined : RawIntegrationParameters.__wrap(ret);
    }
    /**
    * @returns {RawIslandManager | undefined}
    */
    takeIslandManager() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawdeserializedworld_takeIslandManager(this.ptr);
        return ret === 0 ? undefined : RawIslandManager.__wrap(ret);
    }
    /**
    * @returns {RawBroadPhase | undefined}
    */
    takeBroadPhase() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawdeserializedworld_takeBroadPhase(this.ptr);
        return ret === 0 ? undefined : RawBroadPhase.__wrap(ret);
    }
    /**
    * @returns {RawNarrowPhase | undefined}
    */
    takeNarrowPhase() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawdeserializedworld_takeNarrowPhase(this.ptr);
        return ret === 0 ? undefined : RawNarrowPhase.__wrap(ret);
    }
    /**
    * @returns {RawRigidBodySet | undefined}
    */
    takeBodies() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawdeserializedworld_takeBodies(this.ptr);
        return ret === 0 ? undefined : RawRigidBodySet.__wrap(ret);
    }
    /**
    * @returns {RawColliderSet | undefined}
    */
    takeColliders() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawdeserializedworld_takeColliders(this.ptr);
        return ret === 0 ? undefined : RawColliderSet.__wrap(ret);
    }
    /**
    * @returns {RawImpulseJointSet | undefined}
    */
    takeImpulseJoints() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawdeserializedworld_takeImpulseJoints(this.ptr);
        return ret === 0 ? undefined : RawImpulseJointSet.__wrap(ret);
    }
    /**
    * @returns {RawMultibodyJointSet | undefined}
    */
    takeMultibodyJoints() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawdeserializedworld_takeMultibodyJoints(this.ptr);
        return ret === 0 ? undefined : RawMultibodyJointSet.__wrap(ret);
    }
}
/**
* A structure responsible for collecting events generated
* by the physics engine.
*/
class RawEventQueue {

    static __wrap(ptr) {
        const obj = Object.create(RawEventQueue.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbg_raweventqueue_free(ptr);
    }
    /**
    * Creates a new event collector.
    *
    * # Parameters
    * - `autoDrain`: setting this to `true` is strongly recommended. If true, the collector will
    * be automatically drained before each `world.step(collector)`. If false, the collector will
    * keep all events in memory unless it is manually drained/cleared; this may lead to unbounded use of
    * RAM if no drain is performed.
    * @param {boolean} autoDrain
    */
    constructor(autoDrain) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.raweventqueue_new(autoDrain);
        return RawEventQueue.__wrap(ret);
    }
    /**
    * Applies the given javascript closure on each collision event of this collector, then clear
    * the internal collision event buffer.
    *
    * # Parameters
    * - `f(handle1, handle2, started)`:  JavaScript closure applied to each collision event. The
    * closure should take three arguments: two integers representing the handles of the colliders
    * involved in the collision, and a boolean indicating if the collision started (true) or stopped
    * (false).
    * @param {Function} f
    */
    drainCollisionEvents(f) {
        try {
            _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.raweventqueue_drainCollisionEvents(this.ptr, addBorrowedObject(f));
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
    /**
    * @param {Function} f
    */
    drainContactForceEvents(f) {
        try {
            _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.raweventqueue_drainContactForceEvents(this.ptr, addBorrowedObject(f));
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
    /**
    * Removes all events contained by this collector.
    */
    clear() {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.raweventqueue_clear(this.ptr);
    }
}
/**
*/
class RawGenericJoint {

    static __wrap(ptr) {
        const obj = Object.create(RawGenericJoint.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbg_rawgenericjoint_free(ptr);
    }
    /**
    * Create a new joint descriptor that builds spehrical joints.
    *
    * A spherical joints allows three relative rotational degrees of freedom
    * by preventing any relative translation between the anchors of the
    * two attached rigid-bodies.
    * @param {RawVector} anchor1
    * @param {RawVector} anchor2
    * @returns {RawGenericJoint}
    */
    static spherical(anchor1, anchor2) {
        _assertClass(anchor1, RawVector);
        _assertClass(anchor2, RawVector);
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawgenericjoint_spherical(anchor1.ptr, anchor2.ptr);
        return RawGenericJoint.__wrap(ret);
    }
    /**
    * Creates a new joint descriptor that builds a Prismatic joint.
    *
    * A prismatic joint removes all the degrees of freedom between the
    * affected bodies, except for the translation along one axis.
    *
    * Returns `None` if any of the provided axes cannot be normalized.
    * @param {RawVector} anchor1
    * @param {RawVector} anchor2
    * @param {RawVector} axis
    * @param {boolean} limitsEnabled
    * @param {number} limitsMin
    * @param {number} limitsMax
    * @returns {RawGenericJoint | undefined}
    */
    static prismatic(anchor1, anchor2, axis, limitsEnabled, limitsMin, limitsMax) {
        _assertClass(anchor1, RawVector);
        _assertClass(anchor2, RawVector);
        _assertClass(axis, RawVector);
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawgenericjoint_prismatic(anchor1.ptr, anchor2.ptr, axis.ptr, limitsEnabled, limitsMin, limitsMax);
        return ret === 0 ? undefined : RawGenericJoint.__wrap(ret);
    }
    /**
    * Creates a new joint descriptor that builds a Fixed joint.
    *
    * A fixed joint removes all the degrees of freedom between the affected bodies.
    * @param {RawVector} anchor1
    * @param {RawRotation} axes1
    * @param {RawVector} anchor2
    * @param {RawRotation} axes2
    * @returns {RawGenericJoint}
    */
    static fixed(anchor1, axes1, anchor2, axes2) {
        _assertClass(anchor1, RawVector);
        _assertClass(axes1, RawRotation);
        _assertClass(anchor2, RawVector);
        _assertClass(axes2, RawRotation);
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawgenericjoint_fixed(anchor1.ptr, axes1.ptr, anchor2.ptr, axes2.ptr);
        return RawGenericJoint.__wrap(ret);
    }
    /**
    * Create a new joint descriptor that builds Revolute joints.
    *
    * A revolute joint removes all degrees of freedom between the affected
    * bodies except for the rotation along one axis.
    * @param {RawVector} anchor1
    * @param {RawVector} anchor2
    * @param {RawVector} axis
    * @returns {RawGenericJoint | undefined}
    */
    static revolute(anchor1, anchor2, axis) {
        _assertClass(anchor1, RawVector);
        _assertClass(anchor2, RawVector);
        _assertClass(axis, RawVector);
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawgenericjoint_revolute(anchor1.ptr, anchor2.ptr, axis.ptr);
        return ret === 0 ? undefined : RawGenericJoint.__wrap(ret);
    }
}
/**
*/
class RawImpulseJointSet {

    static __wrap(ptr) {
        const obj = Object.create(RawImpulseJointSet.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbg_rawimpulsejointset_free(ptr);
    }
    /**
    * The type of this joint.
    * @param {number} handle
    * @returns {number}
    */
    jointType(handle) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawimpulsejointset_jointType(this.ptr, handle);
        return ret >>> 0;
    }
    /**
    * The unique integer identifier of the first rigid-body this joint it attached to.
    * @param {number} handle
    * @returns {number}
    */
    jointBodyHandle1(handle) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawimpulsejointset_jointBodyHandle1(this.ptr, handle);
        return ret;
    }
    /**
    * The unique integer identifier of the second rigid-body this joint is attached to.
    * @param {number} handle
    * @returns {number}
    */
    jointBodyHandle2(handle) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawimpulsejointset_jointBodyHandle2(this.ptr, handle);
        return ret;
    }
    /**
    * The angular part of the joint’s local frame relative to the first rigid-body it is attached to.
    * @param {number} handle
    * @returns {RawRotation}
    */
    jointFrameX1(handle) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawimpulsejointset_jointFrameX1(this.ptr, handle);
        return RawRotation.__wrap(ret);
    }
    /**
    * The angular part of the joint’s local frame relative to the second rigid-body it is attached to.
    * @param {number} handle
    * @returns {RawRotation}
    */
    jointFrameX2(handle) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawimpulsejointset_jointFrameX2(this.ptr, handle);
        return RawRotation.__wrap(ret);
    }
    /**
    * The position of the first anchor of this joint.
    *
    * The first anchor gives the position of the points application point on the
    * local frame of the first rigid-body it is attached to.
    * @param {number} handle
    * @returns {RawVector}
    */
    jointAnchor1(handle) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawimpulsejointset_jointAnchor1(this.ptr, handle);
        return RawVector.__wrap(ret);
    }
    /**
    * The position of the second anchor of this joint.
    *
    * The second anchor gives the position of the points application point on the
    * local frame of the second rigid-body it is attached to.
    * @param {number} handle
    * @returns {RawVector}
    */
    jointAnchor2(handle) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawimpulsejointset_jointAnchor2(this.ptr, handle);
        return RawVector.__wrap(ret);
    }
    /**
    * Sets the position of the first local anchor
    * @param {number} handle
    * @param {RawVector} newPos
    */
    jointSetAnchor1(handle, newPos) {
        _assertClass(newPos, RawVector);
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawimpulsejointset_jointSetAnchor1(this.ptr, handle, newPos.ptr);
    }
    /**
    * Sets the position of the second local anchor
    * @param {number} handle
    * @param {RawVector} newPos
    */
    jointSetAnchor2(handle, newPos) {
        _assertClass(newPos, RawVector);
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawimpulsejointset_jointSetAnchor2(this.ptr, handle, newPos.ptr);
    }
    /**
    * Are contacts between the rigid-bodies attached by this joint enabled?
    * @param {number} handle
    * @returns {boolean}
    */
    jointContactsEnabled(handle) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawimpulsejointset_jointContactsEnabled(this.ptr, handle);
        return ret !== 0;
    }
    /**
    * Sets whether contacts are enabled between the rigid-bodies attached by this joint.
    * @param {number} handle
    * @param {boolean} enabled
    */
    jointSetContactsEnabled(handle, enabled) {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawimpulsejointset_jointSetContactsEnabled(this.ptr, handle, enabled);
    }
    /**
    * Are the limits for this joint enabled?
    * @param {number} handle
    * @param {number} axis
    * @returns {boolean}
    */
    jointLimitsEnabled(handle, axis) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawimpulsejointset_jointLimitsEnabled(this.ptr, handle, axis);
        return ret !== 0;
    }
    /**
    * Return the lower limit along the given joint axis.
    * @param {number} handle
    * @param {number} axis
    * @returns {number}
    */
    jointLimitsMin(handle, axis) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawimpulsejointset_jointLimitsMin(this.ptr, handle, axis);
        return ret;
    }
    /**
    * If this is a prismatic joint, returns its upper limit.
    * @param {number} handle
    * @param {number} axis
    * @returns {number}
    */
    jointLimitsMax(handle, axis) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawimpulsejointset_jointLimitsMax(this.ptr, handle, axis);
        return ret;
    }
    /**
    * Enables and sets the joint limits
    * @param {number} handle
    * @param {number} axis
    * @param {number} min
    * @param {number} max
    */
    jointSetLimits(handle, axis, min, max) {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawimpulsejointset_jointSetLimits(this.ptr, handle, axis, min, max);
    }
    /**
    * @param {number} handle
    * @param {number} axis
    * @param {number} model
    */
    jointConfigureMotorModel(handle, axis, model) {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawimpulsejointset_jointConfigureMotorModel(this.ptr, handle, axis, model);
    }
    /**
    * @param {number} handle
    * @param {number} axis
    * @param {number} targetVel
    * @param {number} factor
    */
    jointConfigureMotorVelocity(handle, axis, targetVel, factor) {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawimpulsejointset_jointConfigureMotorVelocity(this.ptr, handle, axis, targetVel, factor);
    }
    /**
    * @param {number} handle
    * @param {number} axis
    * @param {number} targetPos
    * @param {number} stiffness
    * @param {number} damping
    */
    jointConfigureMotorPosition(handle, axis, targetPos, stiffness, damping) {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawimpulsejointset_jointConfigureMotorPosition(this.ptr, handle, axis, targetPos, stiffness, damping);
    }
    /**
    * @param {number} handle
    * @param {number} axis
    * @param {number} targetPos
    * @param {number} targetVel
    * @param {number} stiffness
    * @param {number} damping
    */
    jointConfigureMotor(handle, axis, targetPos, targetVel, stiffness, damping) {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawimpulsejointset_jointConfigureMotor(this.ptr, handle, axis, targetPos, targetVel, stiffness, damping);
    }
    /**
    */
    constructor() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawimpulsejointset_new();
        return RawImpulseJointSet.__wrap(ret);
    }
    /**
    * @param {RawGenericJoint} params
    * @param {number} parent1
    * @param {number} parent2
    * @param {boolean} wake_up
    * @returns {number}
    */
    createJoint(params, parent1, parent2, wake_up) {
        _assertClass(params, RawGenericJoint);
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawimpulsejointset_createJoint(this.ptr, params.ptr, parent1, parent2, wake_up);
        return ret;
    }
    /**
    * @param {number} handle
    * @param {boolean} wakeUp
    */
    remove(handle, wakeUp) {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawimpulsejointset_remove(this.ptr, handle, wakeUp);
    }
    /**
    * @returns {number}
    */
    len() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawimpulsejointset_len(this.ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} handle
    * @returns {boolean}
    */
    contains(handle) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawimpulsejointset_contains(this.ptr, handle);
        return ret !== 0;
    }
    /**
    * Applies the given JavaScript function to the integer handle of each joint managed by this physics world.
    *
    * # Parameters
    * - `f(handle)`: the function to apply to the integer handle of each joint managed by this set. Called as `f(collider)`.
    * @param {Function} f
    */
    forEachJointHandle(f) {
        try {
            _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawimpulsejointset_forEachJointHandle(this.ptr, addBorrowedObject(f));
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
    /**
    * Applies the given JavaScript function to the integer handle of each joint attached to the given rigid-body.
    *
    * # Parameters
    * - `f(handle)`: the function to apply to the integer handle of each joint attached to the rigid-body. Called as `f(collider)`.
    * @param {number} body
    * @param {Function} f
    */
    forEachJointAttachedToRigidBody(body, f) {
        try {
            _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawimpulsejointset_forEachJointAttachedToRigidBody(this.ptr, body, addBorrowedObject(f));
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
}
/**
*/
class RawIntegrationParameters {

    static __wrap(ptr) {
        const obj = Object.create(RawIntegrationParameters.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbg_rawintegrationparameters_free(ptr);
    }
    /**
    */
    constructor() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawintegrationparameters_new();
        return RawIntegrationParameters.__wrap(ret);
    }
    /**
    * @returns {number}
    */
    get dt() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawintegrationparameters_dt(this.ptr);
        return ret;
    }
    /**
    * @returns {number}
    */
    get erp() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcharactercollision_toi(this.ptr);
        return ret;
    }
    /**
    * @returns {number}
    */
    get allowedLinearError() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawintegrationparameters_allowedLinearError(this.ptr);
        return ret;
    }
    /**
    * @returns {number}
    */
    get predictionDistance() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawintegrationparameters_predictionDistance(this.ptr);
        return ret;
    }
    /**
    * @returns {number}
    */
    get maxVelocityIterations() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawintegrationparameters_maxVelocityIterations(this.ptr);
        return ret >>> 0;
    }
    /**
    * @returns {number}
    */
    get maxVelocityFrictionIterations() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawintegrationparameters_maxVelocityFrictionIterations(this.ptr);
        return ret >>> 0;
    }
    /**
    * @returns {number}
    */
    get maxStabilizationIterations() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawintegrationparameters_maxStabilizationIterations(this.ptr);
        return ret >>> 0;
    }
    /**
    * @returns {number}
    */
    get minIslandSize() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawintegrationparameters_minIslandSize(this.ptr);
        return ret >>> 0;
    }
    /**
    * @returns {number}
    */
    get maxCcdSubsteps() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawintegrationparameters_maxCcdSubsteps(this.ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} value
    */
    set dt(value) {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawintegrationparameters_set_dt(this.ptr, value);
    }
    /**
    * @param {number} value
    */
    set erp(value) {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawintegrationparameters_set_erp(this.ptr, value);
    }
    /**
    * @param {number} value
    */
    set allowedLinearError(value) {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawintegrationparameters_set_allowedLinearError(this.ptr, value);
    }
    /**
    * @param {number} value
    */
    set predictionDistance(value) {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawintegrationparameters_set_predictionDistance(this.ptr, value);
    }
    /**
    * @param {number} value
    */
    set maxVelocityIterations(value) {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawintegrationparameters_set_maxVelocityIterations(this.ptr, value);
    }
    /**
    * @param {number} value
    */
    set maxVelocityFrictionIterations(value) {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawintegrationparameters_set_maxVelocityFrictionIterations(this.ptr, value);
    }
    /**
    * @param {number} value
    */
    set maxStabilizationIterations(value) {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawintegrationparameters_set_maxStabilizationIterations(this.ptr, value);
    }
    /**
    * @param {number} value
    */
    set minIslandSize(value) {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawintegrationparameters_set_minIslandSize(this.ptr, value);
    }
    /**
    * @param {number} value
    */
    set maxCcdSubsteps(value) {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawintegrationparameters_set_maxCcdSubsteps(this.ptr, value);
    }
}
/**
*/
class RawIslandManager {

    static __wrap(ptr) {
        const obj = Object.create(RawIslandManager.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbg_rawislandmanager_free(ptr);
    }
    /**
    */
    constructor() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawislandmanager_new();
        return RawIslandManager.__wrap(ret);
    }
    /**
    * Applies the given JavaScript function to the integer handle of each active rigid-body
    * managed by this island manager.
    *
    * After a short time of inactivity, a rigid-body is automatically deactivated ("asleep") by
    * the physics engine in order to save computational power. A sleeping rigid-body never moves
    * unless it is moved manually by the user.
    *
    * # Parameters
    * - `f(handle)`: the function to apply to the integer handle of each active rigid-body managed by this
    *   set. Called as `f(collider)`.
    * @param {Function} f
    */
    forEachActiveRigidBodyHandle(f) {
        try {
            _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawislandmanager_forEachActiveRigidBodyHandle(this.ptr, addBorrowedObject(f));
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
}
/**
*/
class RawKinematicCharacterController {

    static __wrap(ptr) {
        const obj = Object.create(RawKinematicCharacterController.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbg_rawkinematiccharactercontroller_free(ptr);
    }
    /**
    * @param {number} offset
    */
    constructor(offset) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawkinematiccharactercontroller_new(offset);
        return RawKinematicCharacterController.__wrap(ret);
    }
    /**
    * @returns {RawVector}
    */
    up() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawkinematiccharactercontroller_up(this.ptr);
        return RawVector.__wrap(ret);
    }
    /**
    * @param {RawVector} vector
    */
    setUp(vector) {
        _assertClass(vector, RawVector);
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawkinematiccharactercontroller_setUp(this.ptr, vector.ptr);
    }
    /**
    * @returns {number}
    */
    offset() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawkinematiccharactercontroller_offset(this.ptr);
        return ret;
    }
    /**
    * @param {number} value
    */
    setOffset(value) {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawkinematiccharactercontroller_setOffset(this.ptr, value);
    }
    /**
    * @returns {boolean}
    */
    slideEnabled() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawkinematiccharactercontroller_slideEnabled(this.ptr);
        return ret !== 0;
    }
    /**
    * @param {boolean} enabled
    */
    setSlideEnabled(enabled) {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawkinematiccharactercontroller_setSlideEnabled(this.ptr, enabled);
    }
    /**
    * @returns {number | undefined}
    */
    autostepMaxHeight() {
        try {
            const retptr = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_add_to_stack_pointer(-16);
            _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawkinematiccharactercontroller_autostepMaxHeight(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getFloat32Memory0()[retptr / 4 + 1];
            return r0 === 0 ? undefined : r1;
        } finally {
            _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {number | undefined}
    */
    autostepMinWidth() {
        try {
            const retptr = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_add_to_stack_pointer(-16);
            _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawkinematiccharactercontroller_autostepMinWidth(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getFloat32Memory0()[retptr / 4 + 1];
            return r0 === 0 ? undefined : r1;
        } finally {
            _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {boolean | undefined}
    */
    autostepIncludesDynamicBodies() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawkinematiccharactercontroller_autostepIncludesDynamicBodies(this.ptr);
        return ret === 0xFFFFFF ? undefined : ret !== 0;
    }
    /**
    * @returns {boolean}
    */
    autostepEnabled() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawkinematiccharactercontroller_autostepEnabled(this.ptr);
        return ret !== 0;
    }
    /**
    * @param {number} maxHeight
    * @param {number} minWidth
    * @param {boolean} includeDynamicBodies
    */
    enableAutostep(maxHeight, minWidth, includeDynamicBodies) {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawkinematiccharactercontroller_enableAutostep(this.ptr, maxHeight, minWidth, includeDynamicBodies);
    }
    /**
    */
    disableAutostep() {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawkinematiccharactercontroller_disableAutostep(this.ptr);
    }
    /**
    * @returns {number}
    */
    maxSlopeClimbAngle() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawkinematiccharactercontroller_maxSlopeClimbAngle(this.ptr);
        return ret;
    }
    /**
    * @param {number} angle
    */
    setMaxSlopeClimbAngle(angle) {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawkinematiccharactercontroller_setMaxSlopeClimbAngle(this.ptr, angle);
    }
    /**
    * @returns {number}
    */
    minSlopeSlideAngle() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawkinematiccharactercontroller_minSlopeSlideAngle(this.ptr);
        return ret;
    }
    /**
    * @param {number} angle
    */
    setMinSlopeSlideAngle(angle) {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawkinematiccharactercontroller_setMinSlopeSlideAngle(this.ptr, angle);
    }
    /**
    * @returns {number | undefined}
    */
    snapToGroundDistance() {
        try {
            const retptr = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_add_to_stack_pointer(-16);
            _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawkinematiccharactercontroller_snapToGroundDistance(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getFloat32Memory0()[retptr / 4 + 1];
            return r0 === 0 ? undefined : r1;
        } finally {
            _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {number} distance
    */
    enableSnapToGround(distance) {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawkinematiccharactercontroller_enableSnapToGround(this.ptr, distance);
    }
    /**
    */
    disableSnapToGround() {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawkinematiccharactercontroller_disableSnapToGround(this.ptr);
    }
    /**
    * @returns {boolean}
    */
    snapToGroundEnabled() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawkinematiccharactercontroller_snapToGroundEnabled(this.ptr);
        return ret !== 0;
    }
    /**
    * @param {number} dt
    * @param {RawRigidBodySet} bodies
    * @param {RawColliderSet} colliders
    * @param {RawQueryPipeline} queries
    * @param {number} collider_handle
    * @param {RawVector} desired_translation
    * @param {boolean} apply_impulses_to_dynamic_bodies
    * @param {number | undefined} character_mass
    * @param {number} filter_flags
    * @param {number | undefined} filter_groups
    * @param {Function} filter_predicate
    */
    computeColliderMovement(dt, bodies, colliders, queries, collider_handle, desired_translation, apply_impulses_to_dynamic_bodies, character_mass, filter_flags, filter_groups, filter_predicate) {
        try {
            _assertClass(bodies, RawRigidBodySet);
            _assertClass(colliders, RawColliderSet);
            _assertClass(queries, RawQueryPipeline);
            _assertClass(desired_translation, RawVector);
            _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawkinematiccharactercontroller_computeColliderMovement(this.ptr, dt, bodies.ptr, colliders.ptr, queries.ptr, collider_handle, desired_translation.ptr, apply_impulses_to_dynamic_bodies, !isLikeNone(character_mass), isLikeNone(character_mass) ? 0 : character_mass, filter_flags, !isLikeNone(filter_groups), isLikeNone(filter_groups) ? 0 : filter_groups, addBorrowedObject(filter_predicate));
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
    /**
    * @returns {RawVector}
    */
    computedMovement() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawkinematiccharactercontroller_computedMovement(this.ptr);
        return RawVector.__wrap(ret);
    }
    /**
    * @returns {boolean}
    */
    computedGrounded() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawkinematiccharactercontroller_computedGrounded(this.ptr);
        return ret !== 0;
    }
    /**
    * @returns {number}
    */
    numComputedCollisions() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawkinematiccharactercontroller_numComputedCollisions(this.ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} i
    * @param {RawCharacterCollision} collision
    * @returns {boolean}
    */
    computedCollision(i, collision) {
        _assertClass(collision, RawCharacterCollision);
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawkinematiccharactercontroller_computedCollision(this.ptr, i, collision.ptr);
        return ret !== 0;
    }
}
/**
*/
class RawMultibodyJointSet {

    static __wrap(ptr) {
        const obj = Object.create(RawMultibodyJointSet.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbg_rawmultibodyjointset_free(ptr);
    }
    /**
    * The type of this joint.
    * @param {number} handle
    * @returns {number}
    */
    jointType(handle) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawmultibodyjointset_jointType(this.ptr, handle);
        return ret >>> 0;
    }
    /**
    * The angular part of the joint’s local frame relative to the first rigid-body it is attached to.
    * @param {number} handle
    * @returns {RawRotation}
    */
    jointFrameX1(handle) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawmultibodyjointset_jointFrameX1(this.ptr, handle);
        return RawRotation.__wrap(ret);
    }
    /**
    * The angular part of the joint’s local frame relative to the second rigid-body it is attached to.
    * @param {number} handle
    * @returns {RawRotation}
    */
    jointFrameX2(handle) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawmultibodyjointset_jointFrameX2(this.ptr, handle);
        return RawRotation.__wrap(ret);
    }
    /**
    * The position of the first anchor of this joint.
    *
    * The first anchor gives the position of the points application point on the
    * local frame of the first rigid-body it is attached to.
    * @param {number} handle
    * @returns {RawVector}
    */
    jointAnchor1(handle) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawmultibodyjointset_jointAnchor1(this.ptr, handle);
        return RawVector.__wrap(ret);
    }
    /**
    * The position of the second anchor of this joint.
    *
    * The second anchor gives the position of the points application point on the
    * local frame of the second rigid-body it is attached to.
    * @param {number} handle
    * @returns {RawVector}
    */
    jointAnchor2(handle) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawmultibodyjointset_jointAnchor2(this.ptr, handle);
        return RawVector.__wrap(ret);
    }
    /**
    * Are contacts between the rigid-bodies attached by this joint enabled?
    * @param {number} handle
    * @returns {boolean}
    */
    jointContactsEnabled(handle) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawmultibodyjointset_jointContactsEnabled(this.ptr, handle);
        return ret !== 0;
    }
    /**
    * Sets whether contacts are enabled between the rigid-bodies attached by this joint.
    * @param {number} handle
    * @param {boolean} enabled
    */
    jointSetContactsEnabled(handle, enabled) {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawmultibodyjointset_jointSetContactsEnabled(this.ptr, handle, enabled);
    }
    /**
    * Are the limits for this joint enabled?
    * @param {number} handle
    * @param {number} axis
    * @returns {boolean}
    */
    jointLimitsEnabled(handle, axis) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawmultibodyjointset_jointLimitsEnabled(this.ptr, handle, axis);
        return ret !== 0;
    }
    /**
    * Return the lower limit along the given joint axis.
    * @param {number} handle
    * @param {number} axis
    * @returns {number}
    */
    jointLimitsMin(handle, axis) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawmultibodyjointset_jointLimitsMin(this.ptr, handle, axis);
        return ret;
    }
    /**
    * If this is a prismatic joint, returns its upper limit.
    * @param {number} handle
    * @param {number} axis
    * @returns {number}
    */
    jointLimitsMax(handle, axis) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawmultibodyjointset_jointLimitsMax(this.ptr, handle, axis);
        return ret;
    }
    /**
    */
    constructor() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawmultibodyjointset_new();
        return RawMultibodyJointSet.__wrap(ret);
    }
    /**
    * @param {RawGenericJoint} params
    * @param {number} parent1
    * @param {number} parent2
    * @param {boolean} wakeUp
    * @returns {number}
    */
    createJoint(params, parent1, parent2, wakeUp) {
        _assertClass(params, RawGenericJoint);
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawmultibodyjointset_createJoint(this.ptr, params.ptr, parent1, parent2, wakeUp);
        return ret;
    }
    /**
    * @param {number} handle
    * @param {boolean} wakeUp
    */
    remove(handle, wakeUp) {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawmultibodyjointset_remove(this.ptr, handle, wakeUp);
    }
    /**
    * @param {number} handle
    * @returns {boolean}
    */
    contains(handle) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawmultibodyjointset_contains(this.ptr, handle);
        return ret !== 0;
    }
    /**
    * Applies the given JavaScript function to the integer handle of each joint managed by this physics world.
    *
    * # Parameters
    * - `f(handle)`: the function to apply to the integer handle of each joint managed by this set. Called as `f(collider)`.
    * @param {Function} f
    */
    forEachJointHandle(f) {
        try {
            _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawmultibodyjointset_forEachJointHandle(this.ptr, addBorrowedObject(f));
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
    /**
    * Applies the given JavaScript function to the integer handle of each joint attached to the given rigid-body.
    *
    * # Parameters
    * - `f(handle)`: the function to apply to the integer handle of each joint attached to the rigid-body. Called as `f(collider)`.
    * @param {number} body
    * @param {Function} f
    */
    forEachJointAttachedToRigidBody(body, f) {
        try {
            _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawmultibodyjointset_forEachJointAttachedToRigidBody(this.ptr, body, addBorrowedObject(f));
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
}
/**
*/
class RawNarrowPhase {

    static __wrap(ptr) {
        const obj = Object.create(RawNarrowPhase.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbg_rawnarrowphase_free(ptr);
    }
    /**
    */
    constructor() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawnarrowphase_new();
        return RawNarrowPhase.__wrap(ret);
    }
    /**
    * @param {number} handle1
    * @param {Function} f
    */
    contacts_with(handle1, f) {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawnarrowphase_contacts_with(this.ptr, handle1, addHeapObject(f));
    }
    /**
    * @param {number} handle1
    * @param {number} handle2
    * @returns {RawContactPair | undefined}
    */
    contact_pair(handle1, handle2) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawnarrowphase_contact_pair(this.ptr, handle1, handle2);
        return ret === 0 ? undefined : RawContactPair.__wrap(ret);
    }
    /**
    * @param {number} handle1
    * @param {Function} f
    */
    intersections_with(handle1, f) {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawnarrowphase_intersections_with(this.ptr, handle1, addHeapObject(f));
    }
    /**
    * @param {number} handle1
    * @param {number} handle2
    * @returns {boolean}
    */
    intersection_pair(handle1, handle2) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawnarrowphase_intersection_pair(this.ptr, handle1, handle2);
        return ret !== 0;
    }
}
/**
*/
class RawPhysicsPipeline {

    static __wrap(ptr) {
        const obj = Object.create(RawPhysicsPipeline.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbg_rawphysicspipeline_free(ptr);
    }
    /**
    */
    constructor() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawphysicspipeline_new();
        return RawPhysicsPipeline.__wrap(ret);
    }
    /**
    * @param {RawVector} gravity
    * @param {RawIntegrationParameters} integrationParameters
    * @param {RawIslandManager} islands
    * @param {RawBroadPhase} broadPhase
    * @param {RawNarrowPhase} narrowPhase
    * @param {RawRigidBodySet} bodies
    * @param {RawColliderSet} colliders
    * @param {RawImpulseJointSet} joints
    * @param {RawMultibodyJointSet} articulations
    * @param {RawCCDSolver} ccd_solver
    */
    step(gravity, integrationParameters, islands, broadPhase, narrowPhase, bodies, colliders, joints, articulations, ccd_solver) {
        _assertClass(gravity, RawVector);
        _assertClass(integrationParameters, RawIntegrationParameters);
        _assertClass(islands, RawIslandManager);
        _assertClass(broadPhase, RawBroadPhase);
        _assertClass(narrowPhase, RawNarrowPhase);
        _assertClass(bodies, RawRigidBodySet);
        _assertClass(colliders, RawColliderSet);
        _assertClass(joints, RawImpulseJointSet);
        _assertClass(articulations, RawMultibodyJointSet);
        _assertClass(ccd_solver, RawCCDSolver);
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawphysicspipeline_step(this.ptr, gravity.ptr, integrationParameters.ptr, islands.ptr, broadPhase.ptr, narrowPhase.ptr, bodies.ptr, colliders.ptr, joints.ptr, articulations.ptr, ccd_solver.ptr);
    }
    /**
    * @param {RawVector} gravity
    * @param {RawIntegrationParameters} integrationParameters
    * @param {RawIslandManager} islands
    * @param {RawBroadPhase} broadPhase
    * @param {RawNarrowPhase} narrowPhase
    * @param {RawRigidBodySet} bodies
    * @param {RawColliderSet} colliders
    * @param {RawImpulseJointSet} joints
    * @param {RawMultibodyJointSet} articulations
    * @param {RawCCDSolver} ccd_solver
    * @param {RawEventQueue} eventQueue
    * @param {object} hookObject
    * @param {Function} hookFilterContactPair
    * @param {Function} hookFilterIntersectionPair
    */
    stepWithEvents(gravity, integrationParameters, islands, broadPhase, narrowPhase, bodies, colliders, joints, articulations, ccd_solver, eventQueue, hookObject, hookFilterContactPair, hookFilterIntersectionPair) {
        _assertClass(gravity, RawVector);
        _assertClass(integrationParameters, RawIntegrationParameters);
        _assertClass(islands, RawIslandManager);
        _assertClass(broadPhase, RawBroadPhase);
        _assertClass(narrowPhase, RawNarrowPhase);
        _assertClass(bodies, RawRigidBodySet);
        _assertClass(colliders, RawColliderSet);
        _assertClass(joints, RawImpulseJointSet);
        _assertClass(articulations, RawMultibodyJointSet);
        _assertClass(ccd_solver, RawCCDSolver);
        _assertClass(eventQueue, RawEventQueue);
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawphysicspipeline_stepWithEvents(this.ptr, gravity.ptr, integrationParameters.ptr, islands.ptr, broadPhase.ptr, narrowPhase.ptr, bodies.ptr, colliders.ptr, joints.ptr, articulations.ptr, ccd_solver.ptr, eventQueue.ptr, addHeapObject(hookObject), addHeapObject(hookFilterContactPair), addHeapObject(hookFilterIntersectionPair));
    }
}
/**
*/
class RawPointColliderProjection {

    static __wrap(ptr) {
        const obj = Object.create(RawPointColliderProjection.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbg_rawpointcolliderprojection_free(ptr);
    }
    /**
    * @returns {number}
    */
    colliderHandle() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawpointcolliderprojection_colliderHandle(this.ptr);
        return ret;
    }
    /**
    * @returns {RawVector}
    */
    point() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawkinematiccharactercontroller_computedMovement(this.ptr);
        return RawVector.__wrap(ret);
    }
    /**
    * @returns {boolean}
    */
    isInside() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawkinematiccharactercontroller_computedGrounded(this.ptr);
        return ret !== 0;
    }
    /**
    * @returns {number}
    */
    featureType() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawpointcolliderprojection_featureType(this.ptr);
        return ret >>> 0;
    }
    /**
    * @returns {number | undefined}
    */
    featureId() {
        try {
            const retptr = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_add_to_stack_pointer(-16);
            _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawpointcolliderprojection_featureId(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return r0 === 0 ? undefined : r1 >>> 0;
        } finally {
            _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
*/
class RawPointProjection {

    static __wrap(ptr) {
        const obj = Object.create(RawPointProjection.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbg_rawpointprojection_free(ptr);
    }
    /**
    * @returns {RawVector}
    */
    point() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawkinematiccharactercontroller_computedMovement(this.ptr);
        return RawVector.__wrap(ret);
    }
    /**
    * @returns {boolean}
    */
    isInside() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawkinematiccharactercontroller_computedGrounded(this.ptr);
        return ret !== 0;
    }
}
/**
*/
class RawQueryPipeline {

    static __wrap(ptr) {
        const obj = Object.create(RawQueryPipeline.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbg_rawquerypipeline_free(ptr);
    }
    /**
    */
    constructor() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawquerypipeline_new();
        return RawQueryPipeline.__wrap(ret);
    }
    /**
    * @param {RawRigidBodySet} bodies
    * @param {RawColliderSet} colliders
    */
    update(bodies, colliders) {
        _assertClass(bodies, RawRigidBodySet);
        _assertClass(colliders, RawColliderSet);
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawquerypipeline_update(this.ptr, bodies.ptr, colliders.ptr);
    }
    /**
    * @param {RawRigidBodySet} bodies
    * @param {RawColliderSet} colliders
    * @param {RawVector} rayOrig
    * @param {RawVector} rayDir
    * @param {number} maxToi
    * @param {boolean} solid
    * @param {number} filter_flags
    * @param {number | undefined} filter_groups
    * @param {number | undefined} filter_exclude_collider
    * @param {number | undefined} filter_exclude_rigid_body
    * @param {Function} filter_predicate
    * @returns {RawRayColliderToi | undefined}
    */
    castRay(bodies, colliders, rayOrig, rayDir, maxToi, solid, filter_flags, filter_groups, filter_exclude_collider, filter_exclude_rigid_body, filter_predicate) {
        try {
            _assertClass(bodies, RawRigidBodySet);
            _assertClass(colliders, RawColliderSet);
            _assertClass(rayOrig, RawVector);
            _assertClass(rayDir, RawVector);
            const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawquerypipeline_castRay(this.ptr, bodies.ptr, colliders.ptr, rayOrig.ptr, rayDir.ptr, maxToi, solid, filter_flags, !isLikeNone(filter_groups), isLikeNone(filter_groups) ? 0 : filter_groups, !isLikeNone(filter_exclude_collider), isLikeNone(filter_exclude_collider) ? 0 : filter_exclude_collider, !isLikeNone(filter_exclude_rigid_body), isLikeNone(filter_exclude_rigid_body) ? 0 : filter_exclude_rigid_body, addBorrowedObject(filter_predicate));
            return ret === 0 ? undefined : RawRayColliderToi.__wrap(ret);
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
    /**
    * @param {RawRigidBodySet} bodies
    * @param {RawColliderSet} colliders
    * @param {RawVector} rayOrig
    * @param {RawVector} rayDir
    * @param {number} maxToi
    * @param {boolean} solid
    * @param {number} filter_flags
    * @param {number | undefined} filter_groups
    * @param {number | undefined} filter_exclude_collider
    * @param {number | undefined} filter_exclude_rigid_body
    * @param {Function} filter_predicate
    * @returns {RawRayColliderIntersection | undefined}
    */
    castRayAndGetNormal(bodies, colliders, rayOrig, rayDir, maxToi, solid, filter_flags, filter_groups, filter_exclude_collider, filter_exclude_rigid_body, filter_predicate) {
        try {
            _assertClass(bodies, RawRigidBodySet);
            _assertClass(colliders, RawColliderSet);
            _assertClass(rayOrig, RawVector);
            _assertClass(rayDir, RawVector);
            const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawquerypipeline_castRayAndGetNormal(this.ptr, bodies.ptr, colliders.ptr, rayOrig.ptr, rayDir.ptr, maxToi, solid, filter_flags, !isLikeNone(filter_groups), isLikeNone(filter_groups) ? 0 : filter_groups, !isLikeNone(filter_exclude_collider), isLikeNone(filter_exclude_collider) ? 0 : filter_exclude_collider, !isLikeNone(filter_exclude_rigid_body), isLikeNone(filter_exclude_rigid_body) ? 0 : filter_exclude_rigid_body, addBorrowedObject(filter_predicate));
            return ret === 0 ? undefined : RawRayColliderIntersection.__wrap(ret);
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
    /**
    * @param {RawRigidBodySet} bodies
    * @param {RawColliderSet} colliders
    * @param {RawVector} rayOrig
    * @param {RawVector} rayDir
    * @param {number} maxToi
    * @param {boolean} solid
    * @param {Function} callback
    * @param {number} filter_flags
    * @param {number | undefined} filter_groups
    * @param {number | undefined} filter_exclude_collider
    * @param {number | undefined} filter_exclude_rigid_body
    * @param {Function} filter_predicate
    */
    intersectionsWithRay(bodies, colliders, rayOrig, rayDir, maxToi, solid, callback, filter_flags, filter_groups, filter_exclude_collider, filter_exclude_rigid_body, filter_predicate) {
        try {
            _assertClass(bodies, RawRigidBodySet);
            _assertClass(colliders, RawColliderSet);
            _assertClass(rayOrig, RawVector);
            _assertClass(rayDir, RawVector);
            _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawquerypipeline_intersectionsWithRay(this.ptr, bodies.ptr, colliders.ptr, rayOrig.ptr, rayDir.ptr, maxToi, solid, addBorrowedObject(callback), filter_flags, !isLikeNone(filter_groups), isLikeNone(filter_groups) ? 0 : filter_groups, !isLikeNone(filter_exclude_collider), isLikeNone(filter_exclude_collider) ? 0 : filter_exclude_collider, !isLikeNone(filter_exclude_rigid_body), isLikeNone(filter_exclude_rigid_body) ? 0 : filter_exclude_rigid_body, addBorrowedObject(filter_predicate));
        } finally {
            heap[stack_pointer++] = undefined;
            heap[stack_pointer++] = undefined;
        }
    }
    /**
    * @param {RawRigidBodySet} bodies
    * @param {RawColliderSet} colliders
    * @param {RawVector} shapePos
    * @param {RawRotation} shapeRot
    * @param {RawShape} shape
    * @param {number} filter_flags
    * @param {number | undefined} filter_groups
    * @param {number | undefined} filter_exclude_collider
    * @param {number | undefined} filter_exclude_rigid_body
    * @param {Function} filter_predicate
    * @returns {number | undefined}
    */
    intersectionWithShape(bodies, colliders, shapePos, shapeRot, shape, filter_flags, filter_groups, filter_exclude_collider, filter_exclude_rigid_body, filter_predicate) {
        try {
            const retptr = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(bodies, RawRigidBodySet);
            _assertClass(colliders, RawColliderSet);
            _assertClass(shapePos, RawVector);
            _assertClass(shapeRot, RawRotation);
            _assertClass(shape, RawShape);
            _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawquerypipeline_intersectionWithShape(retptr, this.ptr, bodies.ptr, colliders.ptr, shapePos.ptr, shapeRot.ptr, shape.ptr, filter_flags, !isLikeNone(filter_groups), isLikeNone(filter_groups) ? 0 : filter_groups, !isLikeNone(filter_exclude_collider), isLikeNone(filter_exclude_collider) ? 0 : filter_exclude_collider, !isLikeNone(filter_exclude_rigid_body), isLikeNone(filter_exclude_rigid_body) ? 0 : filter_exclude_rigid_body, addBorrowedObject(filter_predicate));
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r2 = getFloat64Memory0()[retptr / 8 + 1];
            return r0 === 0 ? undefined : r2;
        } finally {
            _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
        }
    }
    /**
    * @param {RawRigidBodySet} bodies
    * @param {RawColliderSet} colliders
    * @param {RawVector} point
    * @param {boolean} solid
    * @param {number} filter_flags
    * @param {number | undefined} filter_groups
    * @param {number | undefined} filter_exclude_collider
    * @param {number | undefined} filter_exclude_rigid_body
    * @param {Function} filter_predicate
    * @returns {RawPointColliderProjection | undefined}
    */
    projectPoint(bodies, colliders, point, solid, filter_flags, filter_groups, filter_exclude_collider, filter_exclude_rigid_body, filter_predicate) {
        try {
            _assertClass(bodies, RawRigidBodySet);
            _assertClass(colliders, RawColliderSet);
            _assertClass(point, RawVector);
            const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawquerypipeline_projectPoint(this.ptr, bodies.ptr, colliders.ptr, point.ptr, solid, filter_flags, !isLikeNone(filter_groups), isLikeNone(filter_groups) ? 0 : filter_groups, !isLikeNone(filter_exclude_collider), isLikeNone(filter_exclude_collider) ? 0 : filter_exclude_collider, !isLikeNone(filter_exclude_rigid_body), isLikeNone(filter_exclude_rigid_body) ? 0 : filter_exclude_rigid_body, addBorrowedObject(filter_predicate));
            return ret === 0 ? undefined : RawPointColliderProjection.__wrap(ret);
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
    /**
    * @param {RawRigidBodySet} bodies
    * @param {RawColliderSet} colliders
    * @param {RawVector} point
    * @param {number} filter_flags
    * @param {number | undefined} filter_groups
    * @param {number | undefined} filter_exclude_collider
    * @param {number | undefined} filter_exclude_rigid_body
    * @param {Function} filter_predicate
    * @returns {RawPointColliderProjection | undefined}
    */
    projectPointAndGetFeature(bodies, colliders, point, filter_flags, filter_groups, filter_exclude_collider, filter_exclude_rigid_body, filter_predicate) {
        try {
            _assertClass(bodies, RawRigidBodySet);
            _assertClass(colliders, RawColliderSet);
            _assertClass(point, RawVector);
            const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawquerypipeline_projectPointAndGetFeature(this.ptr, bodies.ptr, colliders.ptr, point.ptr, filter_flags, !isLikeNone(filter_groups), isLikeNone(filter_groups) ? 0 : filter_groups, !isLikeNone(filter_exclude_collider), isLikeNone(filter_exclude_collider) ? 0 : filter_exclude_collider, !isLikeNone(filter_exclude_rigid_body), isLikeNone(filter_exclude_rigid_body) ? 0 : filter_exclude_rigid_body, addBorrowedObject(filter_predicate));
            return ret === 0 ? undefined : RawPointColliderProjection.__wrap(ret);
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
    /**
    * @param {RawRigidBodySet} bodies
    * @param {RawColliderSet} colliders
    * @param {RawVector} point
    * @param {Function} callback
    * @param {number} filter_flags
    * @param {number | undefined} filter_groups
    * @param {number | undefined} filter_exclude_collider
    * @param {number | undefined} filter_exclude_rigid_body
    * @param {Function} filter_predicate
    */
    intersectionsWithPoint(bodies, colliders, point, callback, filter_flags, filter_groups, filter_exclude_collider, filter_exclude_rigid_body, filter_predicate) {
        try {
            _assertClass(bodies, RawRigidBodySet);
            _assertClass(colliders, RawColliderSet);
            _assertClass(point, RawVector);
            _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawquerypipeline_intersectionsWithPoint(this.ptr, bodies.ptr, colliders.ptr, point.ptr, addBorrowedObject(callback), filter_flags, !isLikeNone(filter_groups), isLikeNone(filter_groups) ? 0 : filter_groups, !isLikeNone(filter_exclude_collider), isLikeNone(filter_exclude_collider) ? 0 : filter_exclude_collider, !isLikeNone(filter_exclude_rigid_body), isLikeNone(filter_exclude_rigid_body) ? 0 : filter_exclude_rigid_body, addBorrowedObject(filter_predicate));
        } finally {
            heap[stack_pointer++] = undefined;
            heap[stack_pointer++] = undefined;
        }
    }
    /**
    * @param {RawRigidBodySet} bodies
    * @param {RawColliderSet} colliders
    * @param {RawVector} shapePos
    * @param {RawRotation} shapeRot
    * @param {RawVector} shapeVel
    * @param {RawShape} shape
    * @param {number} maxToi
    * @param {boolean} stop_at_penetration
    * @param {number} filter_flags
    * @param {number | undefined} filter_groups
    * @param {number | undefined} filter_exclude_collider
    * @param {number | undefined} filter_exclude_rigid_body
    * @param {Function} filter_predicate
    * @returns {RawShapeColliderTOI | undefined}
    */
    castShape(bodies, colliders, shapePos, shapeRot, shapeVel, shape, maxToi, stop_at_penetration, filter_flags, filter_groups, filter_exclude_collider, filter_exclude_rigid_body, filter_predicate) {
        try {
            _assertClass(bodies, RawRigidBodySet);
            _assertClass(colliders, RawColliderSet);
            _assertClass(shapePos, RawVector);
            _assertClass(shapeRot, RawRotation);
            _assertClass(shapeVel, RawVector);
            _assertClass(shape, RawShape);
            const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawquerypipeline_castShape(this.ptr, bodies.ptr, colliders.ptr, shapePos.ptr, shapeRot.ptr, shapeVel.ptr, shape.ptr, maxToi, stop_at_penetration, filter_flags, !isLikeNone(filter_groups), isLikeNone(filter_groups) ? 0 : filter_groups, !isLikeNone(filter_exclude_collider), isLikeNone(filter_exclude_collider) ? 0 : filter_exclude_collider, !isLikeNone(filter_exclude_rigid_body), isLikeNone(filter_exclude_rigid_body) ? 0 : filter_exclude_rigid_body, addBorrowedObject(filter_predicate));
            return ret === 0 ? undefined : RawShapeColliderTOI.__wrap(ret);
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
    /**
    * @param {RawRigidBodySet} bodies
    * @param {RawColliderSet} colliders
    * @param {RawVector} shapePos
    * @param {RawRotation} shapeRot
    * @param {RawShape} shape
    * @param {Function} callback
    * @param {number} filter_flags
    * @param {number | undefined} filter_groups
    * @param {number | undefined} filter_exclude_collider
    * @param {number | undefined} filter_exclude_rigid_body
    * @param {Function} filter_predicate
    */
    intersectionsWithShape(bodies, colliders, shapePos, shapeRot, shape, callback, filter_flags, filter_groups, filter_exclude_collider, filter_exclude_rigid_body, filter_predicate) {
        try {
            _assertClass(bodies, RawRigidBodySet);
            _assertClass(colliders, RawColliderSet);
            _assertClass(shapePos, RawVector);
            _assertClass(shapeRot, RawRotation);
            _assertClass(shape, RawShape);
            _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawquerypipeline_intersectionsWithShape(this.ptr, bodies.ptr, colliders.ptr, shapePos.ptr, shapeRot.ptr, shape.ptr, addBorrowedObject(callback), filter_flags, !isLikeNone(filter_groups), isLikeNone(filter_groups) ? 0 : filter_groups, !isLikeNone(filter_exclude_collider), isLikeNone(filter_exclude_collider) ? 0 : filter_exclude_collider, !isLikeNone(filter_exclude_rigid_body), isLikeNone(filter_exclude_rigid_body) ? 0 : filter_exclude_rigid_body, addBorrowedObject(filter_predicate));
        } finally {
            heap[stack_pointer++] = undefined;
            heap[stack_pointer++] = undefined;
        }
    }
    /**
    * @param {RawVector} aabbCenter
    * @param {RawVector} aabbHalfExtents
    * @param {Function} callback
    */
    collidersWithAabbIntersectingAabb(aabbCenter, aabbHalfExtents, callback) {
        try {
            _assertClass(aabbCenter, RawVector);
            _assertClass(aabbHalfExtents, RawVector);
            _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawquerypipeline_collidersWithAabbIntersectingAabb(this.ptr, aabbCenter.ptr, aabbHalfExtents.ptr, addBorrowedObject(callback));
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
}
/**
*/
class RawRayColliderIntersection {

    static __wrap(ptr) {
        const obj = Object.create(RawRayColliderIntersection.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbg_rawraycolliderintersection_free(ptr);
    }
    /**
    * @returns {number}
    */
    colliderHandle() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcharactercollision_handle(this.ptr);
        return ret;
    }
    /**
    * @returns {RawVector}
    */
    normal() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawraycolliderintersection_normal(this.ptr);
        return RawVector.__wrap(ret);
    }
    /**
    * @returns {number}
    */
    toi() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawraycolliderintersection_toi(this.ptr);
        return ret;
    }
    /**
    * @returns {number}
    */
    featureType() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawraycolliderintersection_featureType(this.ptr);
        return ret >>> 0;
    }
    /**
    * @returns {number | undefined}
    */
    featureId() {
        try {
            const retptr = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_add_to_stack_pointer(-16);
            _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawraycolliderintersection_featureId(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return r0 === 0 ? undefined : r1 >>> 0;
        } finally {
            _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
*/
class RawRayColliderToi {

    static __wrap(ptr) {
        const obj = Object.create(RawRayColliderToi.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbg_rawraycollidertoi_free(ptr);
    }
    /**
    * @returns {number}
    */
    colliderHandle() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcharactercollision_handle(this.ptr);
        return ret;
    }
    /**
    * @returns {number}
    */
    toi() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcharactercollision_toi(this.ptr);
        return ret;
    }
}
/**
*/
class RawRayIntersection {

    static __wrap(ptr) {
        const obj = Object.create(RawRayIntersection.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbg_rawrayintersection_free(ptr);
    }
    /**
    * @returns {RawVector}
    */
    normal() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcharactercollision_worldWitness1(this.ptr);
        return RawVector.__wrap(ret);
    }
    /**
    * @returns {number}
    */
    toi() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcharactercollision_toi(this.ptr);
        return ret;
    }
    /**
    * @returns {number}
    */
    featureType() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrayintersection_featureType(this.ptr);
        return ret >>> 0;
    }
    /**
    * @returns {number | undefined}
    */
    featureId() {
        try {
            const retptr = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_add_to_stack_pointer(-16);
            _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrayintersection_featureId(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return r0 === 0 ? undefined : r1 >>> 0;
        } finally {
            _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
*/
class RawRigidBodySet {

    static __wrap(ptr) {
        const obj = Object.create(RawRigidBodySet.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbg_rawrigidbodyset_free(ptr);
    }
    /**
    * The world-space translation of this rigid-body.
    * @param {number} handle
    * @returns {RawVector}
    */
    rbTranslation(handle) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrigidbodyset_rbTranslation(this.ptr, handle);
        return RawVector.__wrap(ret);
    }
    /**
    * The world-space orientation of this rigid-body.
    * @param {number} handle
    * @returns {RawRotation}
    */
    rbRotation(handle) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrigidbodyset_rbRotation(this.ptr, handle);
        return RawRotation.__wrap(ret);
    }
    /**
    * Put the given rigid-body to sleep.
    * @param {number} handle
    */
    rbSleep(handle) {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrigidbodyset_rbSleep(this.ptr, handle);
    }
    /**
    * Is this rigid-body sleeping?
    * @param {number} handle
    * @returns {boolean}
    */
    rbIsSleeping(handle) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrigidbodyset_rbIsSleeping(this.ptr, handle);
        return ret !== 0;
    }
    /**
    * Is the velocity of this rigid-body not zero?
    * @param {number} handle
    * @returns {boolean}
    */
    rbIsMoving(handle) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrigidbodyset_rbIsMoving(this.ptr, handle);
        return ret !== 0;
    }
    /**
    * The world-space predicted translation of this rigid-body.
    *
    * If this rigid-body is kinematic this value is set by the `setNextKinematicTranslation`
    * method and is used for estimating the kinematic body velocity at the next timestep.
    * For non-kinematic bodies, this value is currently unspecified.
    * @param {number} handle
    * @returns {RawVector}
    */
    rbNextTranslation(handle) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrigidbodyset_rbNextTranslation(this.ptr, handle);
        return RawVector.__wrap(ret);
    }
    /**
    * The world-space predicted orientation of this rigid-body.
    *
    * If this rigid-body is kinematic this value is set by the `setNextKinematicRotation`
    * method and is used for estimating the kinematic body velocity at the next timestep.
    * For non-kinematic bodies, this value is currently unspecified.
    * @param {number} handle
    * @returns {RawRotation}
    */
    rbNextRotation(handle) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrigidbodyset_rbNextRotation(this.ptr, handle);
        return RawRotation.__wrap(ret);
    }
    /**
    * Sets the translation of this rigid-body.
    *
    * # Parameters
    * - `x`: the world-space position of the rigid-body along the `x` axis.
    * - `y`: the world-space position of the rigid-body along the `y` axis.
    * - `z`: the world-space position of the rigid-body along the `z` axis.
    * - `wakeUp`: forces the rigid-body to wake-up so it is properly affected by forces if it
    * wasn't moving before modifying its position.
    * @param {number} handle
    * @param {number} x
    * @param {number} y
    * @param {number} z
    * @param {boolean} wakeUp
    */
    rbSetTranslation(handle, x, y, z, wakeUp) {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrigidbodyset_rbSetTranslation(this.ptr, handle, x, y, z, wakeUp);
    }
    /**
    * Sets the rotation quaternion of this rigid-body.
    *
    * This does nothing if a zero quaternion is provided.
    *
    * # Parameters
    * - `x`: the first vector component of the quaternion.
    * - `y`: the second vector component of the quaternion.
    * - `z`: the third vector component of the quaternion.
    * - `w`: the scalar component of the quaternion.
    * - `wakeUp`: forces the rigid-body to wake-up so it is properly affected by forces if it
    * wasn't moving before modifying its position.
    * @param {number} handle
    * @param {number} x
    * @param {number} y
    * @param {number} z
    * @param {number} w
    * @param {boolean} wakeUp
    */
    rbSetRotation(handle, x, y, z, w, wakeUp) {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrigidbodyset_rbSetRotation(this.ptr, handle, x, y, z, w, wakeUp);
    }
    /**
    * Sets the linear velocity of this rigid-body.
    * @param {number} handle
    * @param {RawVector} linvel
    * @param {boolean} wakeUp
    */
    rbSetLinvel(handle, linvel, wakeUp) {
        _assertClass(linvel, RawVector);
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrigidbodyset_rbSetLinvel(this.ptr, handle, linvel.ptr, wakeUp);
    }
    /**
    * Sets the angular velocity of this rigid-body.
    * @param {number} handle
    * @param {RawVector} angvel
    * @param {boolean} wakeUp
    */
    rbSetAngvel(handle, angvel, wakeUp) {
        _assertClass(angvel, RawVector);
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrigidbodyset_rbSetAngvel(this.ptr, handle, angvel.ptr, wakeUp);
    }
    /**
    * If this rigid body is kinematic, sets its future translation after the next timestep integration.
    *
    * This should be used instead of `rigidBody.setTranslation` to make the dynamic object
    * interacting with this kinematic body behave as expected. Internally, Rapier will compute
    * an artificial velocity for this rigid-body from its current position and its next kinematic
    * position. This velocity will be used to compute forces on dynamic bodies interacting with
    * this body.
    *
    * # Parameters
    * - `x`: the world-space position of the rigid-body along the `x` axis.
    * - `y`: the world-space position of the rigid-body along the `y` axis.
    * - `z`: the world-space position of the rigid-body along the `z` axis.
    * @param {number} handle
    * @param {number} x
    * @param {number} y
    * @param {number} z
    */
    rbSetNextKinematicTranslation(handle, x, y, z) {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrigidbodyset_rbSetNextKinematicTranslation(this.ptr, handle, x, y, z);
    }
    /**
    * If this rigid body is kinematic, sets its future rotation after the next timestep integration.
    *
    * This should be used instead of `rigidBody.setRotation` to make the dynamic object
    * interacting with this kinematic body behave as expected. Internally, Rapier will compute
    * an artificial velocity for this rigid-body from its current position and its next kinematic
    * position. This velocity will be used to compute forces on dynamic bodies interacting with
    * this body.
    *
    * # Parameters
    * - `x`: the first vector component of the quaternion.
    * - `y`: the second vector component of the quaternion.
    * - `z`: the third vector component of the quaternion.
    * - `w`: the scalar component of the quaternion.
    * @param {number} handle
    * @param {number} x
    * @param {number} y
    * @param {number} z
    * @param {number} w
    */
    rbSetNextKinematicRotation(handle, x, y, z, w) {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrigidbodyset_rbSetNextKinematicRotation(this.ptr, handle, x, y, z, w);
    }
    /**
    * @param {number} handle
    * @param {RawColliderSet} colliders
    */
    rbRecomputeMassPropertiesFromColliders(handle, colliders) {
        _assertClass(colliders, RawColliderSet);
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrigidbodyset_rbRecomputeMassPropertiesFromColliders(this.ptr, handle, colliders.ptr);
    }
    /**
    * @param {number} handle
    * @param {number} mass
    * @param {boolean} wake_up
    */
    rbSetAdditionalMass(handle, mass, wake_up) {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrigidbodyset_rbSetAdditionalMass(this.ptr, handle, mass, wake_up);
    }
    /**
    * @param {number} handle
    * @param {number} mass
    * @param {RawVector} centerOfMass
    * @param {RawVector} principalAngularInertia
    * @param {RawRotation} angularInertiaFrame
    * @param {boolean} wake_up
    */
    rbSetAdditionalMassProperties(handle, mass, centerOfMass, principalAngularInertia, angularInertiaFrame, wake_up) {
        _assertClass(centerOfMass, RawVector);
        _assertClass(principalAngularInertia, RawVector);
        _assertClass(angularInertiaFrame, RawRotation);
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrigidbodyset_rbSetAdditionalMassProperties(this.ptr, handle, mass, centerOfMass.ptr, principalAngularInertia.ptr, angularInertiaFrame.ptr, wake_up);
    }
    /**
    * The linear velocity of this rigid-body.
    * @param {number} handle
    * @returns {RawVector}
    */
    rbLinvel(handle) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrigidbodyset_rbLinvel(this.ptr, handle);
        return RawVector.__wrap(ret);
    }
    /**
    * The angular velocity of this rigid-body.
    * @param {number} handle
    * @returns {RawVector}
    */
    rbAngvel(handle) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrigidbodyset_rbAngvel(this.ptr, handle);
        return RawVector.__wrap(ret);
    }
    /**
    * @param {number} handle
    * @param {boolean} locked
    * @param {boolean} wake_up
    */
    rbLockTranslations(handle, locked, wake_up) {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrigidbodyset_rbLockTranslations(this.ptr, handle, locked, wake_up);
    }
    /**
    * @param {number} handle
    * @param {boolean} allow_x
    * @param {boolean} allow_y
    * @param {boolean} allow_z
    * @param {boolean} wake_up
    */
    rbSetEnabledTranslations(handle, allow_x, allow_y, allow_z, wake_up) {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrigidbodyset_rbSetEnabledTranslations(this.ptr, handle, allow_x, allow_y, allow_z, wake_up);
    }
    /**
    * @param {number} handle
    * @param {boolean} locked
    * @param {boolean} wake_up
    */
    rbLockRotations(handle, locked, wake_up) {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrigidbodyset_rbLockRotations(this.ptr, handle, locked, wake_up);
    }
    /**
    * @param {number} handle
    * @param {boolean} allow_x
    * @param {boolean} allow_y
    * @param {boolean} allow_z
    * @param {boolean} wake_up
    */
    rbSetEnabledRotations(handle, allow_x, allow_y, allow_z, wake_up) {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrigidbodyset_rbSetEnabledRotations(this.ptr, handle, allow_x, allow_y, allow_z, wake_up);
    }
    /**
    * @param {number} handle
    * @returns {number}
    */
    rbDominanceGroup(handle) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrigidbodyset_rbDominanceGroup(this.ptr, handle);
        return ret;
    }
    /**
    * @param {number} handle
    * @param {number} group
    */
    rbSetDominanceGroup(handle, group) {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrigidbodyset_rbSetDominanceGroup(this.ptr, handle, group);
    }
    /**
    * @param {number} handle
    * @param {boolean} enabled
    */
    rbEnableCcd(handle, enabled) {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrigidbodyset_rbEnableCcd(this.ptr, handle, enabled);
    }
    /**
    * The mass of this rigid-body.
    * @param {number} handle
    * @returns {number}
    */
    rbMass(handle) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrigidbodyset_rbMass(this.ptr, handle);
        return ret;
    }
    /**
    * The inverse of the mass of a rigid-body.
    *
    * If this is zero, the rigid-body is assumed to have infinite mass.
    * @param {number} handle
    * @returns {number}
    */
    rbInvMass(handle) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrigidbodyset_rbInvMass(this.ptr, handle);
        return ret;
    }
    /**
    * The inverse mass taking into account translation locking.
    * @param {number} handle
    * @returns {RawVector}
    */
    rbEffectiveInvMass(handle) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrigidbodyset_rbEffectiveInvMass(this.ptr, handle);
        return RawVector.__wrap(ret);
    }
    /**
    * The center of mass of a rigid-body expressed in its local-space.
    * @param {number} handle
    * @returns {RawVector}
    */
    rbLocalCom(handle) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrigidbodyset_rbLocalCom(this.ptr, handle);
        return RawVector.__wrap(ret);
    }
    /**
    * The world-space center of mass of the rigid-body.
    * @param {number} handle
    * @returns {RawVector}
    */
    rbWorldCom(handle) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrigidbodyset_rbWorldCom(this.ptr, handle);
        return RawVector.__wrap(ret);
    }
    /**
    * The inverse of the principal angular inertia of the rigid-body.
    *
    * Components set to zero are assumed to be infinite along the corresponding principal axis.
    * @param {number} handle
    * @returns {RawVector}
    */
    rbInvPrincipalInertiaSqrt(handle) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrigidbodyset_rbInvPrincipalInertiaSqrt(this.ptr, handle);
        return RawVector.__wrap(ret);
    }
    /**
    * The principal vectors of the local angular inertia tensor of the rigid-body.
    * @param {number} handle
    * @returns {RawRotation}
    */
    rbPrincipalInertiaLocalFrame(handle) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrigidbodyset_rbPrincipalInertiaLocalFrame(this.ptr, handle);
        return RawRotation.__wrap(ret);
    }
    /**
    * The angular inertia along the principal inertia axes of the rigid-body.
    * @param {number} handle
    * @returns {RawVector}
    */
    rbPrincipalInertia(handle) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrigidbodyset_rbPrincipalInertia(this.ptr, handle);
        return RawVector.__wrap(ret);
    }
    /**
    * The square-root of the world-space inverse angular inertia tensor of the rigid-body,
    * taking into account rotation locking.
    * @param {number} handle
    * @returns {RawSdpMatrix3}
    */
    rbEffectiveWorldInvInertiaSqrt(handle) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrigidbodyset_rbEffectiveWorldInvInertiaSqrt(this.ptr, handle);
        return RawSdpMatrix3.__wrap(ret);
    }
    /**
    * The effective world-space angular inertia (that takes the potential rotation locking into account) of
    * this rigid-body.
    * @param {number} handle
    * @returns {RawSdpMatrix3}
    */
    rbEffectiveAngularInertia(handle) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrigidbodyset_rbEffectiveAngularInertia(this.ptr, handle);
        return RawSdpMatrix3.__wrap(ret);
    }
    /**
    * Wakes this rigid-body up.
    *
    * A dynamic rigid-body that does not move during several consecutive frames will
    * be put to sleep by the physics engine, i.e., it will stop being simulated in order
    * to avoid useless computations.
    * This methods forces a sleeping rigid-body to wake-up. This is useful, e.g., before modifying
    * the position of a dynamic body so that it is properly simulated afterwards.
    * @param {number} handle
    */
    rbWakeUp(handle) {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrigidbodyset_rbWakeUp(this.ptr, handle);
    }
    /**
    * Is Continuous Collision Detection enabled for this rigid-body?
    * @param {number} handle
    * @returns {boolean}
    */
    rbIsCcdEnabled(handle) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrigidbodyset_rbIsCcdEnabled(this.ptr, handle);
        return ret !== 0;
    }
    /**
    * The number of colliders attached to this rigid-body.
    * @param {number} handle
    * @returns {number}
    */
    rbNumColliders(handle) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrigidbodyset_rbNumColliders(this.ptr, handle);
        return ret >>> 0;
    }
    /**
    * Retrieves the `i-th` collider attached to this rigid-body.
    *
    * # Parameters
    * - `at`: The index of the collider to retrieve. Must be a number in `[0, this.numColliders()[`.
    *         This index is **not** the same as the unique identifier of the collider.
    * @param {number} handle
    * @param {number} at
    * @returns {number}
    */
    rbCollider(handle, at) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrigidbodyset_rbCollider(this.ptr, handle, at);
        return ret;
    }
    /**
    * The status of this rigid-body: fixed, dynamic, or kinematic.
    * @param {number} handle
    * @returns {number}
    */
    rbBodyType(handle) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrigidbodyset_rbBodyType(this.ptr, handle);
        return ret >>> 0;
    }
    /**
    * Set a new status for this rigid-body: fixed, dynamic, or kinematic.
    * @param {number} handle
    * @param {number} status
    * @param {boolean} wake_up
    */
    rbSetBodyType(handle, status, wake_up) {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrigidbodyset_rbSetBodyType(this.ptr, handle, status, wake_up);
    }
    /**
    * Is this rigid-body fixed?
    * @param {number} handle
    * @returns {boolean}
    */
    rbIsFixed(handle) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrigidbodyset_rbIsFixed(this.ptr, handle);
        return ret !== 0;
    }
    /**
    * Is this rigid-body kinematic?
    * @param {number} handle
    * @returns {boolean}
    */
    rbIsKinematic(handle) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrigidbodyset_rbIsKinematic(this.ptr, handle);
        return ret !== 0;
    }
    /**
    * Is this rigid-body dynamic?
    * @param {number} handle
    * @returns {boolean}
    */
    rbIsDynamic(handle) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrigidbodyset_rbIsDynamic(this.ptr, handle);
        return ret !== 0;
    }
    /**
    * The linear damping coefficient of this rigid-body.
    * @param {number} handle
    * @returns {number}
    */
    rbLinearDamping(handle) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrigidbodyset_rbLinearDamping(this.ptr, handle);
        return ret;
    }
    /**
    * The angular damping coefficient of this rigid-body.
    * @param {number} handle
    * @returns {number}
    */
    rbAngularDamping(handle) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrigidbodyset_rbAngularDamping(this.ptr, handle);
        return ret;
    }
    /**
    * @param {number} handle
    * @param {number} factor
    */
    rbSetLinearDamping(handle, factor) {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrigidbodyset_rbSetLinearDamping(this.ptr, handle, factor);
    }
    /**
    * @param {number} handle
    * @param {number} factor
    */
    rbSetAngularDamping(handle, factor) {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrigidbodyset_rbSetAngularDamping(this.ptr, handle, factor);
    }
    /**
    * @param {number} handle
    * @param {boolean} enabled
    */
    rbSetEnabled(handle, enabled) {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrigidbodyset_rbSetEnabled(this.ptr, handle, enabled);
    }
    /**
    * @param {number} handle
    * @returns {boolean}
    */
    rbIsEnabled(handle) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrigidbodyset_rbIsEnabled(this.ptr, handle);
        return ret !== 0;
    }
    /**
    * @param {number} handle
    * @returns {number}
    */
    rbGravityScale(handle) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrigidbodyset_rbGravityScale(this.ptr, handle);
        return ret;
    }
    /**
    * @param {number} handle
    * @param {number} factor
    * @param {boolean} wakeUp
    */
    rbSetGravityScale(handle, factor, wakeUp) {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrigidbodyset_rbSetGravityScale(this.ptr, handle, factor, wakeUp);
    }
    /**
    * Resets to zero all user-added forces added to this rigid-body.
    * @param {number} handle
    * @param {boolean} wakeUp
    */
    rbResetForces(handle, wakeUp) {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrigidbodyset_rbResetForces(this.ptr, handle, wakeUp);
    }
    /**
    * Resets to zero all user-added torques added to this rigid-body.
    * @param {number} handle
    * @param {boolean} wakeUp
    */
    rbResetTorques(handle, wakeUp) {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrigidbodyset_rbResetTorques(this.ptr, handle, wakeUp);
    }
    /**
    * Adds a force at the center-of-mass of this rigid-body.
    *
    * # Parameters
    * - `force`: the world-space force to apply on the rigid-body.
    * - `wakeUp`: should the rigid-body be automatically woken-up?
    * @param {number} handle
    * @param {RawVector} force
    * @param {boolean} wakeUp
    */
    rbAddForce(handle, force, wakeUp) {
        _assertClass(force, RawVector);
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrigidbodyset_rbAddForce(this.ptr, handle, force.ptr, wakeUp);
    }
    /**
    * Applies an impulse at the center-of-mass of this rigid-body.
    *
    * # Parameters
    * - `impulse`: the world-space impulse to apply on the rigid-body.
    * - `wakeUp`: should the rigid-body be automatically woken-up?
    * @param {number} handle
    * @param {RawVector} impulse
    * @param {boolean} wakeUp
    */
    rbApplyImpulse(handle, impulse, wakeUp) {
        _assertClass(impulse, RawVector);
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrigidbodyset_rbApplyImpulse(this.ptr, handle, impulse.ptr, wakeUp);
    }
    /**
    * Adds a torque at the center-of-mass of this rigid-body.
    *
    * # Parameters
    * - `torque`: the world-space torque to apply on the rigid-body.
    * - `wakeUp`: should the rigid-body be automatically woken-up?
    * @param {number} handle
    * @param {RawVector} torque
    * @param {boolean} wakeUp
    */
    rbAddTorque(handle, torque, wakeUp) {
        _assertClass(torque, RawVector);
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrigidbodyset_rbAddTorque(this.ptr, handle, torque.ptr, wakeUp);
    }
    /**
    * Applies an impulsive torque at the center-of-mass of this rigid-body.
    *
    * # Parameters
    * - `torque impulse`: the world-space torque impulse to apply on the rigid-body.
    * - `wakeUp`: should the rigid-body be automatically woken-up?
    * @param {number} handle
    * @param {RawVector} torque_impulse
    * @param {boolean} wakeUp
    */
    rbApplyTorqueImpulse(handle, torque_impulse, wakeUp) {
        _assertClass(torque_impulse, RawVector);
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrigidbodyset_rbApplyTorqueImpulse(this.ptr, handle, torque_impulse.ptr, wakeUp);
    }
    /**
    * Adds a force at the given world-space point of this rigid-body.
    *
    * # Parameters
    * - `force`: the world-space force to apply on the rigid-body.
    * - `point`: the world-space point where the impulse is to be applied on the rigid-body.
    * - `wakeUp`: should the rigid-body be automatically woken-up?
    * @param {number} handle
    * @param {RawVector} force
    * @param {RawVector} point
    * @param {boolean} wakeUp
    */
    rbAddForceAtPoint(handle, force, point, wakeUp) {
        _assertClass(force, RawVector);
        _assertClass(point, RawVector);
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrigidbodyset_rbAddForceAtPoint(this.ptr, handle, force.ptr, point.ptr, wakeUp);
    }
    /**
    * Applies an impulse at the given world-space point of this rigid-body.
    *
    * # Parameters
    * - `impulse`: the world-space impulse to apply on the rigid-body.
    * - `point`: the world-space point where the impulse is to be applied on the rigid-body.
    * - `wakeUp`: should the rigid-body be automatically woken-up?
    * @param {number} handle
    * @param {RawVector} impulse
    * @param {RawVector} point
    * @param {boolean} wakeUp
    */
    rbApplyImpulseAtPoint(handle, impulse, point, wakeUp) {
        _assertClass(impulse, RawVector);
        _assertClass(point, RawVector);
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrigidbodyset_rbApplyImpulseAtPoint(this.ptr, handle, impulse.ptr, point.ptr, wakeUp);
    }
    /**
    * An arbitrary user-defined 32-bit integer
    * @param {number} handle
    * @returns {number}
    */
    rbUserData(handle) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrigidbodyset_rbUserData(this.ptr, handle);
        return ret >>> 0;
    }
    /**
    * Sets the user-defined 32-bit integer of this rigid-body.
    *
    * # Parameters
    * - `data`: an arbitrary user-defined 32-bit integer.
    * @param {number} handle
    * @param {number} data
    */
    rbSetUserData(handle, data) {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrigidbodyset_rbSetUserData(this.ptr, handle, data);
    }
    /**
    */
    constructor() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrigidbodyset_new();
        return RawRigidBodySet.__wrap(ret);
    }
    /**
    * @param {boolean} enabled
    * @param {RawVector} translation
    * @param {RawRotation} rotation
    * @param {number} gravityScale
    * @param {number} mass
    * @param {boolean} massOnly
    * @param {RawVector} centerOfMass
    * @param {RawVector} linvel
    * @param {RawVector} angvel
    * @param {RawVector} principalAngularInertia
    * @param {RawRotation} angularInertiaFrame
    * @param {boolean} translationEnabledX
    * @param {boolean} translationEnabledY
    * @param {boolean} translationEnabledZ
    * @param {boolean} rotationEnabledX
    * @param {boolean} rotationEnabledY
    * @param {boolean} rotationEnabledZ
    * @param {number} linearDamping
    * @param {number} angularDamping
    * @param {number} rb_type
    * @param {boolean} canSleep
    * @param {boolean} sleeping
    * @param {boolean} ccdEnabled
    * @param {number} dominanceGroup
    * @returns {number}
    */
    createRigidBody(enabled, translation, rotation, gravityScale, mass, massOnly, centerOfMass, linvel, angvel, principalAngularInertia, angularInertiaFrame, translationEnabledX, translationEnabledY, translationEnabledZ, rotationEnabledX, rotationEnabledY, rotationEnabledZ, linearDamping, angularDamping, rb_type, canSleep, sleeping, ccdEnabled, dominanceGroup) {
        _assertClass(translation, RawVector);
        _assertClass(rotation, RawRotation);
        _assertClass(centerOfMass, RawVector);
        _assertClass(linvel, RawVector);
        _assertClass(angvel, RawVector);
        _assertClass(principalAngularInertia, RawVector);
        _assertClass(angularInertiaFrame, RawRotation);
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrigidbodyset_createRigidBody(this.ptr, enabled, translation.ptr, rotation.ptr, gravityScale, mass, massOnly, centerOfMass.ptr, linvel.ptr, angvel.ptr, principalAngularInertia.ptr, angularInertiaFrame.ptr, translationEnabledX, translationEnabledY, translationEnabledZ, rotationEnabledX, rotationEnabledY, rotationEnabledZ, linearDamping, angularDamping, rb_type, canSleep, sleeping, ccdEnabled, dominanceGroup);
        return ret;
    }
    /**
    * @param {number} handle
    * @param {RawIslandManager} islands
    * @param {RawColliderSet} colliders
    * @param {RawImpulseJointSet} joints
    * @param {RawMultibodyJointSet} articulations
    */
    remove(handle, islands, colliders, joints, articulations) {
        _assertClass(islands, RawIslandManager);
        _assertClass(colliders, RawColliderSet);
        _assertClass(joints, RawImpulseJointSet);
        _assertClass(articulations, RawMultibodyJointSet);
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrigidbodyset_remove(this.ptr, handle, islands.ptr, colliders.ptr, joints.ptr, articulations.ptr);
    }
    /**
    * The number of rigid-bodies on this set.
    * @returns {number}
    */
    len() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrigidbodyset_len(this.ptr);
        return ret >>> 0;
    }
    /**
    * Checks if a rigid-body with the given integer handle exists.
    * @param {number} handle
    * @returns {boolean}
    */
    contains(handle) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrigidbodyset_contains(this.ptr, handle);
        return ret !== 0;
    }
    /**
    * Applies the given JavaScript function to the integer handle of each rigid-body managed by this set.
    *
    * # Parameters
    * - `f(handle)`: the function to apply to the integer handle of each rigid-body managed by this set. Called as `f(collider)`.
    * @param {Function} f
    */
    forEachRigidBodyHandle(f) {
        try {
            _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrigidbodyset_forEachRigidBodyHandle(this.ptr, addBorrowedObject(f));
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
    /**
    * @param {RawColliderSet} colliders
    */
    propagateModifiedBodyPositionsToColliders(colliders) {
        _assertClass(colliders, RawColliderSet);
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrigidbodyset_propagateModifiedBodyPositionsToColliders(this.ptr, colliders.ptr);
    }
}
/**
* A rotation quaternion.
*/
class RawRotation {

    static __wrap(ptr) {
        const obj = Object.create(RawRotation.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbg_rawrotation_free(ptr);
    }
    /**
    * @param {number} x
    * @param {number} y
    * @param {number} z
    * @param {number} w
    */
    constructor(x, y, z, w) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrotation_new(x, y, z, w);
        return RawRotation.__wrap(ret);
    }
    /**
    * The identity quaternion.
    * @returns {RawRotation}
    */
    static identity() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrotation_identity();
        return RawRotation.__wrap(ret);
    }
    /**
    * The `x` component of this quaternion.
    * @returns {number}
    */
    get x() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawintegrationparameters_dt(this.ptr);
        return ret;
    }
    /**
    * The `y` component of this quaternion.
    * @returns {number}
    */
    get y() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrotation_y(this.ptr);
        return ret;
    }
    /**
    * The `z` component of this quaternion.
    * @returns {number}
    */
    get z() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcharactercollision_toi(this.ptr);
        return ret;
    }
    /**
    * The `w` component of this quaternion.
    * @returns {number}
    */
    get w() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrotation_w(this.ptr);
        return ret;
    }
}
/**
*/
class RawSdpMatrix3 {

    static __wrap(ptr) {
        const obj = Object.create(RawSdpMatrix3.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbg_rawsdpmatrix3_free(ptr);
    }
    /**
    * Row major list of the upper-triangular part of the symmetric matrix.
    * @returns {Float32Array}
    */
    elements() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawsdpmatrix3_elements(this.ptr);
        return takeObject(ret);
    }
}
/**
*/
class RawSerializationPipeline {

    static __wrap(ptr) {
        const obj = Object.create(RawSerializationPipeline.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbg_rawserializationpipeline_free(ptr);
    }
    /**
    */
    constructor() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawserializationpipeline_new();
        return RawSerializationPipeline.__wrap(ret);
    }
    /**
    * @param {RawVector} gravity
    * @param {RawIntegrationParameters} integrationParameters
    * @param {RawIslandManager} islands
    * @param {RawBroadPhase} broadPhase
    * @param {RawNarrowPhase} narrowPhase
    * @param {RawRigidBodySet} bodies
    * @param {RawColliderSet} colliders
    * @param {RawImpulseJointSet} impulse_joints
    * @param {RawMultibodyJointSet} multibody_joints
    * @returns {Uint8Array | undefined}
    */
    serializeAll(gravity, integrationParameters, islands, broadPhase, narrowPhase, bodies, colliders, impulse_joints, multibody_joints) {
        _assertClass(gravity, RawVector);
        _assertClass(integrationParameters, RawIntegrationParameters);
        _assertClass(islands, RawIslandManager);
        _assertClass(broadPhase, RawBroadPhase);
        _assertClass(narrowPhase, RawNarrowPhase);
        _assertClass(bodies, RawRigidBodySet);
        _assertClass(colliders, RawColliderSet);
        _assertClass(impulse_joints, RawImpulseJointSet);
        _assertClass(multibody_joints, RawMultibodyJointSet);
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawserializationpipeline_serializeAll(this.ptr, gravity.ptr, integrationParameters.ptr, islands.ptr, broadPhase.ptr, narrowPhase.ptr, bodies.ptr, colliders.ptr, impulse_joints.ptr, multibody_joints.ptr);
        return takeObject(ret);
    }
    /**
    * @param {Uint8Array} data
    * @returns {RawDeserializedWorld | undefined}
    */
    deserializeAll(data) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawserializationpipeline_deserializeAll(this.ptr, addHeapObject(data));
        return ret === 0 ? undefined : RawDeserializedWorld.__wrap(ret);
    }
}
/**
*/
class RawShape {

    static __wrap(ptr) {
        const obj = Object.create(RawShape.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbg_rawshape_free(ptr);
    }
    /**
    * @param {number} hx
    * @param {number} hy
    * @param {number} hz
    * @returns {RawShape}
    */
    static cuboid(hx, hy, hz) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawshape_cuboid(hx, hy, hz);
        return RawShape.__wrap(ret);
    }
    /**
    * @param {number} hx
    * @param {number} hy
    * @param {number} hz
    * @param {number} borderRadius
    * @returns {RawShape}
    */
    static roundCuboid(hx, hy, hz, borderRadius) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawshape_roundCuboid(hx, hy, hz, borderRadius);
        return RawShape.__wrap(ret);
    }
    /**
    * @param {number} radius
    * @returns {RawShape}
    */
    static ball(radius) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawshape_ball(radius);
        return RawShape.__wrap(ret);
    }
    /**
    * @param {RawVector} normal
    * @returns {RawShape}
    */
    static halfspace(normal) {
        _assertClass(normal, RawVector);
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawshape_halfspace(normal.ptr);
        return RawShape.__wrap(ret);
    }
    /**
    * @param {number} halfHeight
    * @param {number} radius
    * @returns {RawShape}
    */
    static capsule(halfHeight, radius) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawshape_capsule(halfHeight, radius);
        return RawShape.__wrap(ret);
    }
    /**
    * @param {number} halfHeight
    * @param {number} radius
    * @returns {RawShape}
    */
    static cylinder(halfHeight, radius) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawshape_cylinder(halfHeight, radius);
        return RawShape.__wrap(ret);
    }
    /**
    * @param {number} halfHeight
    * @param {number} radius
    * @param {number} borderRadius
    * @returns {RawShape}
    */
    static roundCylinder(halfHeight, radius, borderRadius) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawshape_roundCylinder(halfHeight, radius, borderRadius);
        return RawShape.__wrap(ret);
    }
    /**
    * @param {number} halfHeight
    * @param {number} radius
    * @returns {RawShape}
    */
    static cone(halfHeight, radius) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawshape_cone(halfHeight, radius);
        return RawShape.__wrap(ret);
    }
    /**
    * @param {number} halfHeight
    * @param {number} radius
    * @param {number} borderRadius
    * @returns {RawShape}
    */
    static roundCone(halfHeight, radius, borderRadius) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawshape_roundCone(halfHeight, radius, borderRadius);
        return RawShape.__wrap(ret);
    }
    /**
    * @param {Float32Array} vertices
    * @param {Uint32Array} indices
    * @returns {RawShape}
    */
    static polyline(vertices, indices) {
        const ptr0 = passArrayF32ToWasm0(vertices, _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray32ToWasm0(indices, _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawshape_polyline(ptr0, len0, ptr1, len1);
        return RawShape.__wrap(ret);
    }
    /**
    * @param {Float32Array} vertices
    * @param {Uint32Array} indices
    * @returns {RawShape}
    */
    static trimesh(vertices, indices) {
        const ptr0 = passArrayF32ToWasm0(vertices, _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray32ToWasm0(indices, _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawshape_trimesh(ptr0, len0, ptr1, len1);
        return RawShape.__wrap(ret);
    }
    /**
    * @param {number} nrows
    * @param {number} ncols
    * @param {Float32Array} heights
    * @param {RawVector} scale
    * @returns {RawShape}
    */
    static heightfield(nrows, ncols, heights, scale) {
        const ptr0 = passArrayF32ToWasm0(heights, _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        _assertClass(scale, RawVector);
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawshape_heightfield(nrows, ncols, ptr0, len0, scale.ptr);
        return RawShape.__wrap(ret);
    }
    /**
    * @param {RawVector} p1
    * @param {RawVector} p2
    * @returns {RawShape}
    */
    static segment(p1, p2) {
        _assertClass(p1, RawVector);
        _assertClass(p2, RawVector);
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawshape_segment(p1.ptr, p2.ptr);
        return RawShape.__wrap(ret);
    }
    /**
    * @param {RawVector} p1
    * @param {RawVector} p2
    * @param {RawVector} p3
    * @returns {RawShape}
    */
    static triangle(p1, p2, p3) {
        _assertClass(p1, RawVector);
        _assertClass(p2, RawVector);
        _assertClass(p3, RawVector);
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawshape_triangle(p1.ptr, p2.ptr, p3.ptr);
        return RawShape.__wrap(ret);
    }
    /**
    * @param {RawVector} p1
    * @param {RawVector} p2
    * @param {RawVector} p3
    * @param {number} borderRadius
    * @returns {RawShape}
    */
    static roundTriangle(p1, p2, p3, borderRadius) {
        _assertClass(p1, RawVector);
        _assertClass(p2, RawVector);
        _assertClass(p3, RawVector);
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawshape_roundTriangle(p1.ptr, p2.ptr, p3.ptr, borderRadius);
        return RawShape.__wrap(ret);
    }
    /**
    * @param {Float32Array} points
    * @returns {RawShape | undefined}
    */
    static convexHull(points) {
        const ptr0 = passArrayF32ToWasm0(points, _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawshape_convexHull(ptr0, len0);
        return ret === 0 ? undefined : RawShape.__wrap(ret);
    }
    /**
    * @param {Float32Array} points
    * @param {number} borderRadius
    * @returns {RawShape | undefined}
    */
    static roundConvexHull(points, borderRadius) {
        const ptr0 = passArrayF32ToWasm0(points, _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawshape_roundConvexHull(ptr0, len0, borderRadius);
        return ret === 0 ? undefined : RawShape.__wrap(ret);
    }
    /**
    * @param {Float32Array} vertices
    * @param {Uint32Array} indices
    * @returns {RawShape | undefined}
    */
    static convexMesh(vertices, indices) {
        const ptr0 = passArrayF32ToWasm0(vertices, _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray32ToWasm0(indices, _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawshape_convexMesh(ptr0, len0, ptr1, len1);
        return ret === 0 ? undefined : RawShape.__wrap(ret);
    }
    /**
    * @param {Float32Array} vertices
    * @param {Uint32Array} indices
    * @param {number} borderRadius
    * @returns {RawShape | undefined}
    */
    static roundConvexMesh(vertices, indices, borderRadius) {
        const ptr0 = passArrayF32ToWasm0(vertices, _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray32ToWasm0(indices, _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawshape_roundConvexMesh(ptr0, len0, ptr1, len1, borderRadius);
        return ret === 0 ? undefined : RawShape.__wrap(ret);
    }
    /**
    * @param {RawVector} shapePos1
    * @param {RawRotation} shapeRot1
    * @param {RawVector} shapeVel1
    * @param {RawShape} shape2
    * @param {RawVector} shapePos2
    * @param {RawRotation} shapeRot2
    * @param {RawVector} shapeVel2
    * @param {number} maxToi
    * @param {boolean} stop_at_penetration
    * @returns {RawShapeTOI | undefined}
    */
    castShape(shapePos1, shapeRot1, shapeVel1, shape2, shapePos2, shapeRot2, shapeVel2, maxToi, stop_at_penetration) {
        _assertClass(shapePos1, RawVector);
        _assertClass(shapeRot1, RawRotation);
        _assertClass(shapeVel1, RawVector);
        _assertClass(shape2, RawShape);
        _assertClass(shapePos2, RawVector);
        _assertClass(shapeRot2, RawRotation);
        _assertClass(shapeVel2, RawVector);
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawshape_castShape(this.ptr, shapePos1.ptr, shapeRot1.ptr, shapeVel1.ptr, shape2.ptr, shapePos2.ptr, shapeRot2.ptr, shapeVel2.ptr, maxToi, stop_at_penetration);
        return ret === 0 ? undefined : RawShapeTOI.__wrap(ret);
    }
    /**
    * @param {RawVector} shapePos1
    * @param {RawRotation} shapeRot1
    * @param {RawShape} shape2
    * @param {RawVector} shapePos2
    * @param {RawRotation} shapeRot2
    * @returns {boolean}
    */
    intersectsShape(shapePos1, shapeRot1, shape2, shapePos2, shapeRot2) {
        _assertClass(shapePos1, RawVector);
        _assertClass(shapeRot1, RawRotation);
        _assertClass(shape2, RawShape);
        _assertClass(shapePos2, RawVector);
        _assertClass(shapeRot2, RawRotation);
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawshape_intersectsShape(this.ptr, shapePos1.ptr, shapeRot1.ptr, shape2.ptr, shapePos2.ptr, shapeRot2.ptr);
        return ret !== 0;
    }
    /**
    * @param {RawVector} shapePos1
    * @param {RawRotation} shapeRot1
    * @param {RawShape} shape2
    * @param {RawVector} shapePos2
    * @param {RawRotation} shapeRot2
    * @param {number} prediction
    * @returns {RawShapeContact | undefined}
    */
    contactShape(shapePos1, shapeRot1, shape2, shapePos2, shapeRot2, prediction) {
        _assertClass(shapePos1, RawVector);
        _assertClass(shapeRot1, RawRotation);
        _assertClass(shape2, RawShape);
        _assertClass(shapePos2, RawVector);
        _assertClass(shapeRot2, RawRotation);
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawshape_contactShape(this.ptr, shapePos1.ptr, shapeRot1.ptr, shape2.ptr, shapePos2.ptr, shapeRot2.ptr, prediction);
        return ret === 0 ? undefined : RawShapeContact.__wrap(ret);
    }
    /**
    * @param {RawVector} shapePos
    * @param {RawRotation} shapeRot
    * @param {RawVector} point
    * @returns {boolean}
    */
    containsPoint(shapePos, shapeRot, point) {
        _assertClass(shapePos, RawVector);
        _assertClass(shapeRot, RawRotation);
        _assertClass(point, RawVector);
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawshape_containsPoint(this.ptr, shapePos.ptr, shapeRot.ptr, point.ptr);
        return ret !== 0;
    }
    /**
    * @param {RawVector} shapePos
    * @param {RawRotation} shapeRot
    * @param {RawVector} point
    * @param {boolean} solid
    * @returns {RawPointProjection}
    */
    projectPoint(shapePos, shapeRot, point, solid) {
        _assertClass(shapePos, RawVector);
        _assertClass(shapeRot, RawRotation);
        _assertClass(point, RawVector);
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawshape_projectPoint(this.ptr, shapePos.ptr, shapeRot.ptr, point.ptr, solid);
        return RawPointProjection.__wrap(ret);
    }
    /**
    * @param {RawVector} shapePos
    * @param {RawRotation} shapeRot
    * @param {RawVector} rayOrig
    * @param {RawVector} rayDir
    * @param {number} maxToi
    * @returns {boolean}
    */
    intersectsRay(shapePos, shapeRot, rayOrig, rayDir, maxToi) {
        _assertClass(shapePos, RawVector);
        _assertClass(shapeRot, RawRotation);
        _assertClass(rayOrig, RawVector);
        _assertClass(rayDir, RawVector);
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawshape_intersectsRay(this.ptr, shapePos.ptr, shapeRot.ptr, rayOrig.ptr, rayDir.ptr, maxToi);
        return ret !== 0;
    }
    /**
    * @param {RawVector} shapePos
    * @param {RawRotation} shapeRot
    * @param {RawVector} rayOrig
    * @param {RawVector} rayDir
    * @param {number} maxToi
    * @param {boolean} solid
    * @returns {number}
    */
    castRay(shapePos, shapeRot, rayOrig, rayDir, maxToi, solid) {
        _assertClass(shapePos, RawVector);
        _assertClass(shapeRot, RawRotation);
        _assertClass(rayOrig, RawVector);
        _assertClass(rayDir, RawVector);
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawshape_castRay(this.ptr, shapePos.ptr, shapeRot.ptr, rayOrig.ptr, rayDir.ptr, maxToi, solid);
        return ret;
    }
    /**
    * @param {RawVector} shapePos
    * @param {RawRotation} shapeRot
    * @param {RawVector} rayOrig
    * @param {RawVector} rayDir
    * @param {number} maxToi
    * @param {boolean} solid
    * @returns {RawRayIntersection | undefined}
    */
    castRayAndGetNormal(shapePos, shapeRot, rayOrig, rayDir, maxToi, solid) {
        _assertClass(shapePos, RawVector);
        _assertClass(shapeRot, RawRotation);
        _assertClass(rayOrig, RawVector);
        _assertClass(rayDir, RawVector);
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawshape_castRayAndGetNormal(this.ptr, shapePos.ptr, shapeRot.ptr, rayOrig.ptr, rayDir.ptr, maxToi, solid);
        return ret === 0 ? undefined : RawRayIntersection.__wrap(ret);
    }
}
/**
*/
class RawShapeColliderTOI {

    static __wrap(ptr) {
        const obj = Object.create(RawShapeColliderTOI.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbg_rawshapecollidertoi_free(ptr);
    }
    /**
    * @returns {number}
    */
    colliderHandle() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcharactercollision_handle(this.ptr);
        return ret;
    }
    /**
    * @returns {number}
    */
    toi() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcharactercollision_toi(this.ptr);
        return ret;
    }
    /**
    * @returns {RawVector}
    */
    witness1() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcharactercollision_worldWitness1(this.ptr);
        return RawVector.__wrap(ret);
    }
    /**
    * @returns {RawVector}
    */
    witness2() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawshapecollidertoi_witness2(this.ptr);
        return RawVector.__wrap(ret);
    }
    /**
    * @returns {RawVector}
    */
    normal1() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcharactercollision_worldNormal1(this.ptr);
        return RawVector.__wrap(ret);
    }
    /**
    * @returns {RawVector}
    */
    normal2() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawshapecollidertoi_normal2(this.ptr);
        return RawVector.__wrap(ret);
    }
}
/**
*/
class RawShapeContact {

    static __wrap(ptr) {
        const obj = Object.create(RawShapeContact.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbg_rawshapecontact_free(ptr);
    }
    /**
    * @returns {number}
    */
    distance() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawshapecontact_distance(this.ptr);
        return ret;
    }
    /**
    * @returns {RawVector}
    */
    point1() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawkinematiccharactercontroller_computedMovement(this.ptr);
        return RawVector.__wrap(ret);
    }
    /**
    * @returns {RawVector}
    */
    point2() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcharactercollision_worldWitness1(this.ptr);
        return RawVector.__wrap(ret);
    }
    /**
    * @returns {RawVector}
    */
    normal1() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawshapecollidertoi_witness2(this.ptr);
        return RawVector.__wrap(ret);
    }
    /**
    * @returns {RawVector}
    */
    normal2() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcharactercollision_worldNormal1(this.ptr);
        return RawVector.__wrap(ret);
    }
}
/**
*/
class RawShapeTOI {

    static __wrap(ptr) {
        const obj = Object.create(RawShapeTOI.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbg_rawshapetoi_free(ptr);
    }
    /**
    * @returns {number}
    */
    toi() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawintegrationparameters_dt(this.ptr);
        return ret;
    }
    /**
    * @returns {RawVector}
    */
    witness1() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawshapetoi_witness1(this.ptr);
        return RawVector.__wrap(ret);
    }
    /**
    * @returns {RawVector}
    */
    witness2() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcontactforceevent_total_force(this.ptr);
        return RawVector.__wrap(ret);
    }
    /**
    * @returns {RawVector}
    */
    normal1() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawshapetoi_normal1(this.ptr);
        return RawVector.__wrap(ret);
    }
    /**
    * @returns {RawVector}
    */
    normal2() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawshapetoi_normal2(this.ptr);
        return RawVector.__wrap(ret);
    }
}
/**
* A vector.
*/
class RawVector {

    static __wrap(ptr) {
        const obj = Object.create(RawVector.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbg_rawvector_free(ptr);
    }
    /**
    * Creates a new vector filled with zeros.
    * @returns {RawVector}
    */
    static zero() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawvector_zero();
        return RawVector.__wrap(ret);
    }
    /**
    * Creates a new 3D vector from its two components.
    *
    * # Parameters
    * - `x`: the `x` component of this 3D vector.
    * - `y`: the `y` component of this 3D vector.
    * - `z`: the `z` component of this 3D vector.
    * @param {number} x
    * @param {number} y
    * @param {number} z
    */
    constructor(x, y, z) {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawvector_new(x, y, z);
        return RawVector.__wrap(ret);
    }
    /**
    * The `x` component of this vector.
    * @returns {number}
    */
    get x() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawintegrationparameters_dt(this.ptr);
        return ret;
    }
    /**
    * Sets the `x` component of this vector.
    * @param {number} x
    */
    set x(x) {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawintegrationparameters_set_dt(this.ptr, x);
    }
    /**
    * The `y` component of this vector.
    * @returns {number}
    */
    get y() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawrotation_y(this.ptr);
        return ret;
    }
    /**
    * Sets the `y` component of this vector.
    * @param {number} y
    */
    set y(y) {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawvector_set_y(this.ptr, y);
    }
    /**
    * The `z` component of this vector.
    * @returns {number}
    */
    get z() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawcharactercollision_toi(this.ptr);
        return ret;
    }
    /**
    * Sets the `z` component of this vector.
    * @param {number} z
    */
    set z(z) {
        _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawintegrationparameters_set_erp(this.ptr, z);
    }
    /**
    * Create a new 3D vector from this vector with its components rearranged as `{x, y, z}`.
    *
    * This will effectively return a copy of `this`. This method exist for completeness with the
    * other swizzling functions.
    * @returns {RawVector}
    */
    xyz() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawvector_xyz(this.ptr);
        return RawVector.__wrap(ret);
    }
    /**
    * Create a new 3D vector from this vector with its components rearranged as `{y, x, z}`.
    * @returns {RawVector}
    */
    yxz() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawvector_yxz(this.ptr);
        return RawVector.__wrap(ret);
    }
    /**
    * Create a new 3D vector from this vector with its components rearranged as `{z, x, y}`.
    * @returns {RawVector}
    */
    zxy() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawvector_zxy(this.ptr);
        return RawVector.__wrap(ret);
    }
    /**
    * Create a new 3D vector from this vector with its components rearranged as `{x, z, y}`.
    * @returns {RawVector}
    */
    xzy() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawvector_xzy(this.ptr);
        return RawVector.__wrap(ret);
    }
    /**
    * Create a new 3D vector from this vector with its components rearranged as `{y, z, x}`.
    * @returns {RawVector}
    */
    yzx() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawvector_yzx(this.ptr);
        return RawVector.__wrap(ret);
    }
    /**
    * Create a new 3D vector from this vector with its components rearranged as `{z, y, x}`.
    * @returns {RawVector}
    */
    zyx() {
        const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.rawvector_zyx(this.ptr);
        return RawVector.__wrap(ret);
    }
}

function __wbindgen_object_drop_ref(arg0) {
    takeObject(arg0);
};

function __wbindgen_number_new(arg0) {
    const ret = arg0;
    return addHeapObject(ret);
};

function __wbindgen_number_get(arg0, arg1) {
    const obj = getObject(arg1);
    const ret = typeof(obj) === 'number' ? obj : undefined;
    getFloat64Memory0()[arg0 / 8 + 1] = isLikeNone(ret) ? 0 : ret;
    getInt32Memory0()[arg0 / 4 + 0] = !isLikeNone(ret);
};

function __wbindgen_boolean_get(arg0) {
    const v = getObject(arg0);
    const ret = typeof(v) === 'boolean' ? (v ? 1 : 0) : 2;
    return ret;
};

function __wbindgen_is_function(arg0) {
    const ret = typeof(getObject(arg0)) === 'function';
    return ret;
};

function __wbg_rawraycolliderintersection_new(arg0) {
    const ret = RawRayColliderIntersection.__wrap(arg0);
    return addHeapObject(ret);
};

function __wbg_rawcontactforceevent_new(arg0) {
    const ret = RawContactForceEvent.__wrap(arg0);
    return addHeapObject(ret);
};

function __wbg_call_168da88779e35f61() { return handleError(function (arg0, arg1, arg2) {
    const ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
    return addHeapObject(ret);
}, arguments) };

function __wbg_call_3999bee59e9f7719() { return handleError(function (arg0, arg1, arg2, arg3) {
    const ret = getObject(arg0).call(getObject(arg1), getObject(arg2), getObject(arg3));
    return addHeapObject(ret);
}, arguments) };

function __wbg_call_e1f72c051cdab859() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
    const ret = getObject(arg0).call(getObject(arg1), getObject(arg2), getObject(arg3), getObject(arg4));
    return addHeapObject(ret);
}, arguments) };

function __wbg_bind_10dfe70e95d2a480(arg0, arg1, arg2, arg3) {
    const ret = getObject(arg0).bind(getObject(arg1), getObject(arg2), getObject(arg3));
    return addHeapObject(ret);
};

function __wbg_buffer_3f3d764d4747d564(arg0) {
    const ret = getObject(arg0).buffer;
    return addHeapObject(ret);
};

function __wbg_newwithbyteoffsetandlength_d9aa266703cb98be(arg0, arg1, arg2) {
    const ret = new Uint8Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
    return addHeapObject(ret);
};

function __wbg_new_8c3f0052272a457a(arg0) {
    const ret = new Uint8Array(getObject(arg0));
    return addHeapObject(ret);
};

function __wbg_set_83db9690f9353e79(arg0, arg1, arg2) {
    getObject(arg0).set(getObject(arg1), arg2 >>> 0);
};

function __wbg_length_9e1ae1900cb0fbd5(arg0) {
    const ret = getObject(arg0).length;
    return ret;
};

function __wbg_newwithbyteoffsetandlength_be22e5fcf4f69ab4(arg0, arg1, arg2) {
    const ret = new Float32Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
    return addHeapObject(ret);
};

function __wbg_set_0e0314cf6675c1b9(arg0, arg1, arg2) {
    getObject(arg0).set(getObject(arg1), arg2 >>> 0);
};

function __wbg_length_9a2deed95d22668d(arg0) {
    const ret = getObject(arg0).length;
    return ret;
};

function __wbg_newwithlength_a7168e4a1e8f5e12(arg0) {
    const ret = new Float32Array(arg0 >>> 0);
    return addHeapObject(ret);
};

function __wbindgen_throw(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

function __wbindgen_memory() {
    const ret = _rapier_wasm3d_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.memory;
    return addHeapObject(ret);
};


__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 502:
/***/ ((module, exports, __webpack_require__) => {

var __webpack_instantiate__ = ([WEBPACK_IMPORTED_MODULE_0]) => {
	return __webpack_require__.v(exports, module.id, "65ac97703679d0300d84", {
		"./rapier_wasm3d_bg.js": {
			"__wbindgen_object_drop_ref": WEBPACK_IMPORTED_MODULE_0/* .__wbindgen_object_drop_ref */ .ug,
			"__wbindgen_number_new": WEBPACK_IMPORTED_MODULE_0/* .__wbindgen_number_new */ .pT,
			"__wbindgen_number_get": WEBPACK_IMPORTED_MODULE_0/* .__wbindgen_number_get */ .M1,
			"__wbindgen_boolean_get": WEBPACK_IMPORTED_MODULE_0/* .__wbindgen_boolean_get */ .HT,
			"__wbindgen_is_function": WEBPACK_IMPORTED_MODULE_0/* .__wbindgen_is_function */ .o$,
			"__wbg_rawraycolliderintersection_new": WEBPACK_IMPORTED_MODULE_0/* .__wbg_rawraycolliderintersection_new */ .Ne,
			"__wbg_rawcontactforceevent_new": WEBPACK_IMPORTED_MODULE_0/* .__wbg_rawcontactforceevent_new */ .$B,
			"__wbg_call_168da88779e35f61": WEBPACK_IMPORTED_MODULE_0/* .__wbg_call_168da88779e35f61 */ .VD,
			"__wbg_call_3999bee59e9f7719": WEBPACK_IMPORTED_MODULE_0/* .__wbg_call_3999bee59e9f7719 */ .pm,
			"__wbg_call_e1f72c051cdab859": WEBPACK_IMPORTED_MODULE_0/* .__wbg_call_e1f72c051cdab859 */ .R,
			"__wbg_bind_10dfe70e95d2a480": WEBPACK_IMPORTED_MODULE_0/* .__wbg_bind_10dfe70e95d2a480 */ .am,
			"__wbg_buffer_3f3d764d4747d564": WEBPACK_IMPORTED_MODULE_0/* .__wbg_buffer_3f3d764d4747d564 */ .jp,
			"__wbg_newwithbyteoffsetandlength_d9aa266703cb98be": WEBPACK_IMPORTED_MODULE_0/* .__wbg_newwithbyteoffsetandlength_d9aa266703cb98be */ .TY,
			"__wbg_new_8c3f0052272a457a": WEBPACK_IMPORTED_MODULE_0/* .__wbg_new_8c3f0052272a457a */ .lB,
			"__wbg_set_83db9690f9353e79": WEBPACK_IMPORTED_MODULE_0/* .__wbg_set_83db9690f9353e79 */ .fP,
			"__wbg_length_9e1ae1900cb0fbd5": WEBPACK_IMPORTED_MODULE_0/* .__wbg_length_9e1ae1900cb0fbd5 */ .bj,
			"__wbg_newwithbyteoffsetandlength_be22e5fcf4f69ab4": WEBPACK_IMPORTED_MODULE_0/* .__wbg_newwithbyteoffsetandlength_be22e5fcf4f69ab4 */ .Mv,
			"__wbg_set_0e0314cf6675c1b9": WEBPACK_IMPORTED_MODULE_0/* .__wbg_set_0e0314cf6675c1b9 */ .Py,
			"__wbg_length_9a2deed95d22668d": WEBPACK_IMPORTED_MODULE_0/* .__wbg_length_9a2deed95d22668d */ .Qj,
			"__wbg_newwithlength_a7168e4a1e8f5e12": WEBPACK_IMPORTED_MODULE_0/* .__wbg_newwithlength_a7168e4a1e8f5e12 */ .w_,
			"__wbindgen_throw": WEBPACK_IMPORTED_MODULE_0/* .__wbindgen_throw */ .Or,
			"__wbindgen_memory": WEBPACK_IMPORTED_MODULE_0/* .__wbindgen_memory */ .oH
		}
	});
}
__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
	try {
	/* harmony import */ var WEBPACK_IMPORTED_MODULE_0 = __webpack_require__(184);
	var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([WEBPACK_IMPORTED_MODULE_0]);
	var [WEBPACK_IMPORTED_MODULE_0] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__;
	await __webpack_require__.v(exports, module.id, "65ac97703679d0300d84", {
		"./rapier_wasm3d_bg.js": {
			"__wbindgen_object_drop_ref": WEBPACK_IMPORTED_MODULE_0/* .__wbindgen_object_drop_ref */ .ug,
			"__wbindgen_number_new": WEBPACK_IMPORTED_MODULE_0/* .__wbindgen_number_new */ .pT,
			"__wbindgen_number_get": WEBPACK_IMPORTED_MODULE_0/* .__wbindgen_number_get */ .M1,
			"__wbindgen_boolean_get": WEBPACK_IMPORTED_MODULE_0/* .__wbindgen_boolean_get */ .HT,
			"__wbindgen_is_function": WEBPACK_IMPORTED_MODULE_0/* .__wbindgen_is_function */ .o$,
			"__wbg_rawraycolliderintersection_new": WEBPACK_IMPORTED_MODULE_0/* .__wbg_rawraycolliderintersection_new */ .Ne,
			"__wbg_rawcontactforceevent_new": WEBPACK_IMPORTED_MODULE_0/* .__wbg_rawcontactforceevent_new */ .$B,
			"__wbg_call_168da88779e35f61": WEBPACK_IMPORTED_MODULE_0/* .__wbg_call_168da88779e35f61 */ .VD,
			"__wbg_call_3999bee59e9f7719": WEBPACK_IMPORTED_MODULE_0/* .__wbg_call_3999bee59e9f7719 */ .pm,
			"__wbg_call_e1f72c051cdab859": WEBPACK_IMPORTED_MODULE_0/* .__wbg_call_e1f72c051cdab859 */ .R,
			"__wbg_bind_10dfe70e95d2a480": WEBPACK_IMPORTED_MODULE_0/* .__wbg_bind_10dfe70e95d2a480 */ .am,
			"__wbg_buffer_3f3d764d4747d564": WEBPACK_IMPORTED_MODULE_0/* .__wbg_buffer_3f3d764d4747d564 */ .jp,
			"__wbg_newwithbyteoffsetandlength_d9aa266703cb98be": WEBPACK_IMPORTED_MODULE_0/* .__wbg_newwithbyteoffsetandlength_d9aa266703cb98be */ .TY,
			"__wbg_new_8c3f0052272a457a": WEBPACK_IMPORTED_MODULE_0/* .__wbg_new_8c3f0052272a457a */ .lB,
			"__wbg_set_83db9690f9353e79": WEBPACK_IMPORTED_MODULE_0/* .__wbg_set_83db9690f9353e79 */ .fP,
			"__wbg_length_9e1ae1900cb0fbd5": WEBPACK_IMPORTED_MODULE_0/* .__wbg_length_9e1ae1900cb0fbd5 */ .bj,
			"__wbg_newwithbyteoffsetandlength_be22e5fcf4f69ab4": WEBPACK_IMPORTED_MODULE_0/* .__wbg_newwithbyteoffsetandlength_be22e5fcf4f69ab4 */ .Mv,
			"__wbg_set_0e0314cf6675c1b9": WEBPACK_IMPORTED_MODULE_0/* .__wbg_set_0e0314cf6675c1b9 */ .Py,
			"__wbg_length_9a2deed95d22668d": WEBPACK_IMPORTED_MODULE_0/* .__wbg_length_9a2deed95d22668d */ .Qj,
			"__wbg_newwithlength_a7168e4a1e8f5e12": WEBPACK_IMPORTED_MODULE_0/* .__wbg_newwithlength_a7168e4a1e8f5e12 */ .w_,
			"__wbindgen_throw": WEBPACK_IMPORTED_MODULE_0/* .__wbindgen_throw */ .Or,
			"__wbindgen_memory": WEBPACK_IMPORTED_MODULE_0/* .__wbindgen_memory */ .oH
		}
	});
	__webpack_async_result__();
	} catch(e) { __webpack_async_result__(e); }
}, 1);

/***/ })

}]);