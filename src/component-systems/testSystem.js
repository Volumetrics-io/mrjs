import * as THREE from 'three';
import { MRSystemElement } from '../core/MRSystemElement.js'

class TestSystem extends MRSystemElement {
    constructor(){
        super()
    }
}

customElements.define('mr-test-system', TestSystem);