
/**
 *
 * @param group
 * @param relativeTo
 */
export function computeBoundingSphere(group, relativeTo = null) {
    let sphere = new THREE.Sphere();
    let box = new THREE.Box3();

    box.setFromObject(group);
    box.getBoundingSphere(sphere);

    if (relativeTo) {
        sphere.applyMatrix4(relativeTo.matrixWorld);
    } else {
        sphere.applyMatrix4(group.matrixWorld);
    }

    return sphere;
}
