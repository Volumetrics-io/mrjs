import * as THREE from 'three';
import { MRHand } from './hand';

const HOVER_DISTANCE = 0.05
const PINCH_DISTANCE = 0.02

export class SpatialControls {

    constructor(renderer, scene){

        this.scene = scene

        this.leftPinch = false
        this.rightPinch = false
        this.doublePinch = false

        this.currentHoverObject


        this.leftHand = new MRHand('left', renderer)
        this.rightHand = new MRHand('right', renderer)

        this.leftHand.addToScene(scene)
        this.rightHand.addToScene(scene)

    }

    handleHover(hand) {
        let closest
        let closestDistance = 10000

        let selectable = this.getSelectable()

        selectable.forEach((object) => {
            let distance = hand.hoverPosition.normalize().distanceTo(object.position.normalize())
            if ( distance < closestDistance) {
                closestDistance = distance
                closest = object
            }
        })

        if (closest && closest != this.currentHoverObject) {
            if ( this.currentHoverObject ) {
                this.currentHoverObject.userData.element.dispatchEvent(new CustomEvent(`hoverend`))
            }
            closest.userData.element.dispatchEvent(new CustomEvent(`hoverstart`))
            this.currentHoverObject = closest
        }
    }

    getSelectable(){
        let selectable = []
        this.scene.traverseVisible( (object) => {
            if ( !object.userData.element ) { return }
            if ( !object.userData.element.classList.contains('selectable') ) { return }
            selectable.push(object)
        })
        return selectable
    }

    // TODO: per frame events seem kinda sketchy, there should be a better solution wit
    update() {
        if (this.leftHand.pinch && this.rightHand.pinch){
            let leftPosition = this.leftHand.getCursorPosition()
            let rightPosition = this.rightHand.getCursorPosition()

            let eventDetails = {
                leftPosition: leftPosition,
                rightPosition: rightPosition,
                center: leftPosition.lerp(rightPosition, 0.5),
                distance: leftPosition.distanceTo(rightPosition)      
            }

            if (!this.doublePinch) {
                this.doublePinch = true
                document.dispatchEvent(new CustomEvent(`doublepinchstart`, { bubbles: true, detail: eventDetails}))
            }

            document.dispatchEvent(new CustomEvent(`doublepinch`, { bubbles: true, detail: eventDetails}))
        } else if (this.leftHand.pinch) {
            document.dispatchEvent(new CustomEvent(`pinch`, { bubbles: true, detail: { 
                handedness: 'left',
                position: this.leftHand.getCursorPosition()      
            }}))
        } else if (this.rightHand.pinch) {
            document.dispatchEvent(new CustomEvent(`pinch`, { bubbles: true, detail: { 
                handedness: 'right',
                position: this.rightHand.getCursorPosition()      
            }}))
        } else if (this.doublePinch) {
            this.doublePinch = false

            let leftPosition = this.leftHand.getCursorPosition()
            let rightPosition = this.rightHand.getCursorPosition()

            let eventDetails = {
                leftPosition: leftPosition,
                rightPosition: rightPosition,
                center: leftPosition.lerp(rightPosition, 0.5),
                distance: leftPosition.distanceTo(rightPosition)      
            }

            document.dispatchEvent(new CustomEvent(`doublepinchended`, { bubbles: true, detail: eventDetails }))

        }

        if (this.leftHand.checkForHover()){
            this.handleHover(this.leftHand)
        }
        if (this.rightHand.checkForHover()){
            this.handleHover(this.rightHand)
        }
    }
}