import * as THREE from 'three';
import { ColladaLoader } from 'three/addons/loaders/ColladaLoader.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { USDZLoader } from 'three/examples/jsm/loaders/USDZLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';

// Keeping the below imports in as reference for future items we can add.
// import { AMFLoader } from 'three/addons/loaders/AMFLoader.js';
// import { BVHLoader } from 'three/addons/loaders/BVHLoader.js';
// import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
// import { GCodeLoader } from 'three/addons/loaders/GCodeLoader.js';
// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// // import { IFCLoader }        from 'web-ifc-three';
// // import { IFCSPACE }         from 'web-ifc';
// import { Rhino3dmLoader } from 'three/addons/loaders/3DMLoader.js';
// import { PCDLoader } from 'three/addons/loaders/PCDLoader.js';
// import { PDBLoader } from 'three/addons/loaders/PDBLoader.js';
// import { PLYLoader } from 'three/addons/loaders/PLYLoader.js';
// import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
// import { TDSLoader } from 'three/addons/loaders/TDSLoader.js';
// import { ThreeMFLoader } from 'three/addons/loaders/3MFLoader.js';

/**
 * @namespace model
 * @description Useful namespace for helping with Model utility functions
 */
let model = {};

/**
 * @function
 * @memberof model
 * @description Loads Collada file
 * @param {string} filePath - The path to the file(s) needing to be loaded. For now this only supports
 * the full path and the relative path directly to the file.
 * @returns {Promise<THREE.Mesh>} - the promise of the loaded mesh object.
 */
model.loadDAE = async function (filePath) {
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
};

/**
 * @function
 * @memberof model
 * @description Loads OBJ file
 * @param {string} filePath - The path to the file(s) needing to be loaded. For now this only supports
 * the full path and the relative path directly to the file.
 * @returns {Promise<THREE.Mesh>} - the promise of the loaded mesh object.
 */
model.loadOBJ = async function (filePath) {
    const loader = new OBJLoader();

    return new Promise((resolve, reject) => {
        loader.load(
            filePath,
            (obj) => {
                resolve(obj);
            },
            undefined,
            (error) => {
                console.error(error);
                reject(error);
            }
        );
    });
};

/**
 * @function
 * @memberof model
 * @description Loads OBJ file with externally hosted MTL file
 * @param {string} filePath - The path of the form '/path/to/mtlFile.mtl,/path/to/objFile.obj'.
 * @returns {Promise<THREE.Mesh>} - the promise of the loaded mesh object.
 */
model.loadOBJWithMTL = function (filePath) {
    let paths = filePath.split(',');
    // Assigning each path to a variable
    if (paths.length != 2) {
        console.error('Expected the loading of an MTL file and an OBJ file like "path/to/mtlFile.mtl,path/to/the/objFile.obj" - got:', filePath);
        return Promise.reject(new Error('Invalid path format for OBJ and MTL files.'));
    }

    const filePathMTL = paths[0];
    const filePathOBJ = paths[1];

    console.log('in load obj with mtl');

    const loadMTL = (url) =>
        new Promise((resolve, reject) => {
            const mtlLoader = new MTLLoader();
            mtlLoader.load(
                url,
                (materials) => {
                    materials.preload();
                    console.log(materials);
                    resolve(materials);
                },
                undefined,
                (error) => {
                    console.error('Failed to load MTL from URL:', error);
                    reject(error);
                }
            );
        });

    const loadOBJ = (filePath, materials) =>
        new Promise((resolve, reject) => {
            const objLoader = new OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.load(
                filePath,
                (obj) => {
                    resolve(obj);
                },
                undefined,
                (error) => {
                    console.error('Failed to load OBJ:', error);
                    reject(error);
                }
            );
        });

    return loadMTL(filePathMTL)
        .then((materials) => loadOBJ(filePathOBJ, materials))
        .catch((error) => {
            console.error('An error occurred while loading OBJ with external MTL:', error);
            throw error; // Ensure errors are propagated
        });
};

/**
 * @function
 * @memberof model
 * @description Loads FBX file
 * @param {string} filePath - The path to the file(s) needing to be loaded. For now this only supports
 * the full path and the relative path directly to the file.
 * @returns {Promise<THREE.Mesh>} - the promise of the loaded mesh object.
 */
model.loadFBX = async function (filePath) {
    const loader = new FBXLoader();

    console.log('in load FBX');

    return new Promise((resolve, reject) => {
        loader.load(
            filePath,
            (fbx) => {
                console.log(fbx);
                resolve(fbx);
            },
            undefined,
            (error) => {
                console.error(error);
                reject(error);
            }
        );
    });
};

/**
 * @function
 * @memberof model
 * @description Loads GLTF/GLB file
 * @param {string} filePath - The path to the file(s) needing to be loaded. For now this only supports
 * the full path and the relative path directly to the file.
 * @returns {Promise<THREE.Mesh>} - the promise of the loaded mesh object.
 */
model.loadGLTF = async function (filePath) {
    const loader = new GLTFLoader();

    console.log('in load gltf/glb');

    return new Promise((resolve, reject) => {
        loader.load(
            filePath,
            (gltf) => {
                const scene = gltf.scene;
                const animations = gltf.animations;

                console.log(scene);

                // Resolve the promise with the loaded scene and animations
                resolve({ scene, animations });
            },
            undefined,
            (error) => {
                console.error(error);
                reject(error);
            }
        );
    });
};

/**
 * @function
 * @memberof model
 * @description Loads stl file
 * @param {string} filePath - The path to the file(s) needing to be loaded. For now this only supports
 * the full path and the relative path directly to the file.
 * @returns {Promise<THREE.Mesh>} - the promise of the loaded mesh object.
 */
model.loadSTL = async function (filePath) {
    const loader = new STLLoader();

    return new Promise((resolve, reject) => {
        loader.load(
            filePath,
            (geometry) => {
                const material = mrjsUtils.material.MeshPhongMaterial.clone();
                material.programName = "stlMaterial";
                const mesh = new THREE.Mesh(geometry, material);

                resolve(mesh); // Resolve the promise with the loaded mesh
            },
            (xhr) => {
                // Progress callback
            },
            (error) => {
                console.error(error);
                reject(error); // Reject the promise if there's an error
            }
        );
    });
};

/**
 * @function
 * @memberof model
 * @description Loads USD/USDZ file
 * @param {string} filePath - The path to the file(s) needing to be loaded. For now this only supports
 * the full path and the relative path directly to the file.
 * @returns {Promise<THREE.Mesh>} - the promise of the loaded mesh object.
 */
model.loadUSDZ = async function (filePath) {
    const usdzLoader = new USDZLoader();

    console.log('in load usdz');

    const [model] = await Promise.all([usdzLoader.loadAsync(filePath)], undefined, (error) => {
        console.error(error);
        return null;
    });

    console.log(model);
    return model;
};

/// ////////////////////////
// Main Loading Function //
/// ////////////////////////

/**
 * @function
 * @memberof model
 * @description The main loading function
 * @param {string} filePath - The path to the file(s) needing to be loaded. For now this only supports
 * the full path and the relative path directly to the file.
 * @param {string} extension - The extension of the file type. Current allowed extensions are `dae`, fbx`, `glb`, `obj`, and `stl`.
 * @returns {Promise<THREE.Mesh>} - the promise of the loaded mesh object.
 */
model.loadModel = async function (filePath, extension) {
    // Flag used for debugging the ones that are only 'partially implemented' and
    // still as todos.
    const allowed = false;

    if (extension == 'fbx') {
        return model.loadFBX(filePath);
    } else if (extension == 'glb') {
        return model.loadGLTF(filePath);
    } else if (allowed && extension == 'gltf') {
        // TODO
        return model.loadGLTF(filePath);
    } else if (extension == 'stl') {
        return model.loadSTL(filePath);
    } else if (extension == 'obj') {
        if (filePath.includes(',')) {
            // has a preceeding material file
            return model.loadOBJWithMTL(filePath);
        } else {
            return model.loadOBJ(filePath);
        }
    } else if (extension == 'dae') {
        return model.loadDAE(filePath);
    } else if (allowed && (extension == 'usdc' || extension == 'usdz')) {
        // TODO
        return model.loadUSDZ(filePath);
    }
    console.error(`ERR: the extensions ${extension} is not supported by MR.js`);
    return null;
};

model.disposeObject3D = function (parentObject3D) {
    parentObject3D.traverse(function (node) {
        if (node.isMesh) {
            if (node.geometry) {
                node.geometry.dispose();
            }

            if (node.material) {
                if (node.material instanceof Array) {
                    // An array of materials
                    node.material.forEach((material) => material.dispose());
                } else {
                    // A single material
                    node.material.dispose();
                }
            }
        }
    });
};

model.removeObject3DFromScene = function (object3D, scene) {
    model.disposeObject3D(object3D);
    scene.remove(object3D);

    // Optional: Clean up references for GC if necessary
};

model.currentRunningAnimationClip = function (entity) {
    if (!entity.mixer) {
        console.log('No mixer found for :', entity);
        return;
    }
    // If no animation is currently playing
    if (!entity.mixer._actions.some((action) => action.isRunning())) {
        console.log('No animation is currently playing');
        return;
    }

    // Iterate over all clip actions in the mixer
    for (let i = 0; i < entity.mixer._actions.length; i++) {
        let clipAction = entity._actions[i];
        if (clipAction.isRunning()) {
            let clipName = clipAction.getClip().name;
            console.log("Animation '" + clipName + "' is currently playing");
            // You can do whatever you need with this information
            // break; // Break the loop if you only want to know the first running animation
        }
    }
};

export { model };
