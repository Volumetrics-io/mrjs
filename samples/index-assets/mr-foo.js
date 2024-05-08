export class MRFoo extends MREntity {
    constructor() {
        super();
    }

    connected() {
        super.connected();
        this.boxMesh = new THREE.Mesh(
            new THREE.BoxGeometry(0.2, 0.2, 0.2),
            new THREE.MeshPhongMaterial({
                color: "#ff9900",
                transparent: true,
                opacity: 0.4,
            }));
        this.object3D.add(this.boxMesh);
    }
    
}
function getClassHierarchy(obj) {
    // Get the prototype of the object
    const prototype = Object.getPrototypeOf(obj);

    // Get the constructor function from the prototype
    const constructor = prototype.constructor;

    // Check if the constructor is defined
    if (constructor) {
        // Print out the name of the constructor function
        console.log(constructor.name);
    } else {
        console.log('Unknown');
    }
}
function getAllParentClasses(obj) {
    const parentClasses = [];

    // Function to recursively traverse the prototype chain
    function traversePrototypeChain(obj) {
        const prototype = Object.getPrototypeOf(obj);

        if (prototype === null) {
            return;
        }

        const constructor = prototype.constructor;

        if (constructor) {
            parentClasses.push(constructor.name);
            traversePrototypeChain(prototype);
        }
    }

    traversePrototypeChain(obj);

    return parentClasses;
}
let m = new MRFoo();

getAllParentClasses(m);
customElements.get('mr-foo') || customElements.define('mr-foo', MRFoo);
