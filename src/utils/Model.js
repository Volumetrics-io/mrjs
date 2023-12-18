import * as THREE from 'three';
import { ColladaLoader } from 'three/addons/loaders/ColladaLoader.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { USDZLoader } from 'three/examples/jsm/loaders/USDZLoader.js';

// Keeping the below imports in as reference for future items we can add.
// import { AMFLoader } from 'three/addons/loaders/AMFLoader.js';
// import { BVHLoader } from 'three/addons/loaders/BVHLoader.js';
// import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
// import { GCodeLoader } from 'three/addons/loaders/GCodeLoader.js';
// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// // import { IFCLoader }        from 'web-ifc-three';
// // import { IFCSPACE }         from 'web-ifc';
// import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
// import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
// import { Rhino3dmLoader } from 'three/addons/loaders/3DMLoader.js';
// import { PCDLoader } from 'three/addons/loaders/PCDLoader.js';
// import { PDBLoader } from 'three/addons/loaders/PDBLoader.js';
// import { PLYLoader } from 'three/addons/loaders/PLYLoader.js';
// import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
// import { TDSLoader } from 'three/addons/loaders/TDSLoader.js';
// import { ThreeMFLoader } from 'three/addons/loaders/3MFLoader.js';

/**
 * Loads Collada file
 * @param {string} filePath - The path to the file(s) needing to be loaded. For now this only supports
 * the full path and the relative path directly to the file.
 * @returns {Promise<THREE.Mesh>} - the promise of the loaded mesh object.
 */
function loadDAE(filePath) {
    const loader = new ColladaLoader();

    return new Promise((resolve, reject) => {
        loader.load(
            filePath,
            (dae) => {
                resolve(dae.scene);
            },
            undefined,
            (error) => {
                console.error(error);
                reject(error);
            }
        );
    });
}

/**
 * Loads FBX file
 * @param {string} filePath - The path to the file(s) needing to be loaded. For now this only supports
 * the full path and the relative path directly to the file.
 * @returns {Promise<THREE.Mesh>} - the promise of the loaded mesh object.
 */
function loadFBX(filePath) {
    const loader = new FBXLoader();

    return new Promise((resolve, reject) => {
        loader.load(
            filePath,
            (fbx) => {
                resolve(fbx);
            },
            undefined,
            (error) => {
                console.error(error);
                reject(error);
            }
        );
    });
}

/**
 * Loads GLTF/GLB file
 * @param {string} filePath - The path to the file(s) needing to be loaded. For now this only supports
 * the full path and the relative path directly to the file.
 * @returns {Promise<THREE.Mesh>} - the promise of the loaded mesh object.
 */
async function loadGLTF(filePath) {
    const loader = new GLTFLoader();

    return new Promise((resolve, reject) => {
        loader.load(
            filePath,
            (gltf) => {
                resolve(gltf.scene);
            },
            undefined,
            (error) => {
                console.error(error);
                reject(error);
            }
        );
    });
}

/**
 * Loads stl file
 * @param {string} filePath - The path to the file(s) needing to be loaded. For now this only supports
 * the full path and the relative path directly to the file.
 * @returns {Promise<THREE.Mesh>} - the promise of the loaded mesh object.
 */
async function loadSTL(filePath) {
    const loader = new STLLoader();

    return new Promise((resolve, reject) => {
        loader.load(
            filePath,
            (geometry) => {
                const material = new THREE.MeshPhongMaterial();
                const mesh = new THREE.Mesh(geometry, material);

                resolve(mesh); // Resolve the promise with the loaded mesh
            },
            (xhr) => {
                // Progress callback
                console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
            },
            (error) => {
                console.error(error);
                reject(error); // Reject the promise if there's an error
            }
        );
    });
}

/**
 * Loads USD/USDZ file
 * @param {string} filePath - The path to the file(s) needing to be loaded. For now this only supports
 * the full path and the relative path directly to the file.
 * @returns {Promise<THREE.Mesh>} - the promise of the loaded mesh object.
 */
async function loadUSDZ(filePath) {
    const usdzLoader = new USDZLoader();

    const [model] = await Promise.all([usdzLoader.loadAsync(filePath)], undefined, (error) => {
        console.error(error);
        return null;
    });

    return model;
}

/// ////////////////////////
// Main Loading Function //
/// ////////////////////////

/**
 *
 * @param {string} filePath - The path to the file(s) needing to be loaded. For now this only supports
 * the full path and the relative path directly to the file.
 * @param {string} extension - The extension of the file type. Current allowed extensions are `fbx`, `glb`, and `stl`.
 * @returns {Promise<THREE.Mesh>} - the promise of the loaded mesh object.
 */
export function loadModel(filePath, extension) {
    // later on - this would be better//faster with enums<->string<-->num interop but
    // quick impl for now

    // if (extension == 'gltf') { // - need to be able to have additional filepaths
    //   return loadGLTF(filePath);
    // }
    // if (extension == 'dae') {
    //     return loadDAE(filePath);
    // } else
    if (extension == 'fbx') {
        return loadFBX(filePath);
    } else if (extension == 'glb') {
        return loadGLTF(filePath);
    } else if (extension == 'stl') {
        return loadSTL(filePath);
    }
    const allowed = false;
    if (allowed && extension == 'dae') {
        return loadDAE(filePath);
    } else if (allowed && (extension == 'usdc' || extension == 'usdz')) {
        return loadUSDZ(filePath);
    }
    console.error(`ERR: the extensions ${extension} is not supported by MR.js`);
    return null;
}