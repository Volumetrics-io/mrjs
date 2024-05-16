import * as THREE from 'three';
import { ColladaLoader } from 'three/addons/loaders/ColladaLoader.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { USDZLoader } from 'three/examples/jsm/loaders/USDZLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';

// Singleton material pool for reuse
const materialPool = {};

/**
 * @function getMaterialKey
 * @description Generates a unique key for a material based on its properties
 * @param {THREE.Material} material - The material to generate a key for
 * @returns {string} - The generated key
 */
const getMaterialKey = (material) => {
    let key = material.type;
    for (const [property, value] of Object.entries(material)) {
        if (value instanceof THREE.Color || value instanceof THREE.Texture) {
            key += `|${property}:${value.uuid}`;
        } else if (typeof value !== 'object') {
            key += `|${property}:${value}`;
        }
    }
    return key;
};

/**
 * @function getOrCreateMaterial
 * @description Reuses or creates a new material based on its properties
 * @param {THREE.Material} material - The material to reuse or create
 * @returns {THREE.Material} - The reused or newly created material
 */
const getOrCreateMaterial = (material) => {
    const key = getMaterialKey(material);
    if (materialPool[key]) {
        return materialPool[key];
    } else {
        materialPool[key] = material;
        return material;
    }
};

let model = {};

/**
 * @function
 * @memberof model
 * @description Loads Collada file
 * @param {string} filePath - The path to the file(s) needing to be loaded.
 * @returns {Promise<THREE.Mesh>} - the promise of the loaded mesh object.
 */
model.loadDAE = async function (filePath) {
    const loader = new ColladaLoader();

    return new Promise((resolve, reject) => {
        loader.load(
            filePath,
            (dae) => {
                dae.scene.traverse((child) => {
                    if (child.isMesh) {
                        child.material = getOrCreateMaterial(child.material);
                    }
                });
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
 * @param {string} filePath - The path to the file(s) needing to be loaded.
 * @returns {Promise<THREE.Mesh>} - the promise of the loaded mesh object.
 */
model.loadOBJ = async function (filePath) {
    const loader = new OBJLoader();

    return new Promise((resolve, reject) => {
        loader.load(
            filePath,
            (obj) => {
                obj.traverse((child) => {
                    if (child.isMesh) {
                        child.material = getOrCreateMaterial(child.material);
                    }
                });
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
    if (paths.length != 2) {
        console.error('Expected the loading of an MTL file and an OBJ file like "path/to/mtlFile.mtl,path/to/the/objFile.obj" - got:', filePath);
        return Promise.reject(new Error('Invalid path format for OBJ and MTL files.'));
    }

    const filePathMTL = paths[0];
    const filePathOBJ = paths[1];

    const loadMTL = (url) =>
        new Promise((resolve, reject) => {
            const mtlLoader = new MTLLoader();
            mtlLoader.load(
                url,
                (materials) => {
                    materials.preload();
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
                    obj.traverse((child) => {
                        if (child.isMesh) {
                            child.material = getOrCreateMaterial(child.material);
                        }
                    });
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
            throw error;
        });
};

/**
 * @function
 * @memberof model
 * @description Loads FBX file
 * @param {string} filePath - The path to the file(s) needing to be loaded.
 * @returns {Promise<THREE.Mesh>} - the promise of the loaded mesh object.
 */
model.loadFBX = async function (filePath) {
    const loader = new FBXLoader();

    return new Promise((resolve, reject) => {
        loader.load(
            filePath,
            (fbx) => {
                fbx.traverse((child) => {
                    if (child.isMesh) {
                        child.material = getOrCreateMaterial(child.material);
                    }
                });
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
 * @param {string} filePath - The path to the file(s) needing to be loaded.
 * @returns {Promise<THREE.Mesh>} - the promise of the loaded mesh object.
 */
model.loadGLTF = async function (filePath) {
    const loader = new GLTFLoader();

    return new Promise((resolve, reject) => {
        loader.load(
            filePath,
            (gltf) => {
                const scene = gltf.scene;
                scene.traverse((child) => {
                    if (child.isMesh) {
                        child.material = getOrCreateMaterial(child.material);
                    }
                });
                const animations = gltf.animations;
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
 * @description Loads STL file
 * @param {string} filePath - The path to the file(s) needing to be loaded.
 * @returns {Promise<THREE.Mesh>} - the promise of the loaded mesh object.
 */
model.loadSTL = async function (filePath) {
    const loader = new STLLoader();

    return new Promise((resolve, reject) => {
        loader.load(
            filePath,
            (geometry) => {
                const mesh = new THREE.Mesh(geometry, getOrCreateMaterial(new THREE.MeshPhongMaterial()));
                resolve(mesh);
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
 * @description Loads USD/USDZ file
 * @param {string} filePath - The path to the file(s) needing to be loaded.
 * @returns {Promise<THREE.Mesh>} - the promise of the loaded mesh object.
 */
model.loadUSDZ = async function (filePath) {
    const usdzLoader = new USDZLoader();

    return usdzLoader.loadAsync(filePath)
        .then((model) => {
            model.traverse((child) => {
                if (child.isMesh) {
                    child.material = getOrCreateMaterial(child.material);
                }
            });
            return model;
        })
        .catch((error) => {
            console.error(error);
            return null;
        });
};

/**
 * @function
 * @memberof model
 * @description The main loading function
 * @param {string} filePath - The path to the file(s) needing to be loaded.
 * @param {string} extension - The extension of the file type. Current allowed extensions are `dae`, fbx`, `glb`, `obj`, and `stl`.
 * @returns {Promise<THREE.Mesh>} - the promise of the loaded mesh object.
 */
model.loadModel = async function (filePath, extension) {
    switch (extension) {
        case 'fbx':
            return model.loadFBX(filePath);
        case 'glb':
        case 'gltf':
            return model.loadGLTF(filePath);
        case 'stl':
            return model.loadSTL(filePath);
        case 'obj':
            if (filePath.includes(',')) {
                return model.loadOBJWithMTL(filePath);
            } else {
                return model.loadOBJ(filePath);
            }
        case 'dae':
            return model.loadDAE(filePath);
        case 'usdz':
        case 'usdc':
            return model.loadUSDZ(filePath);
        default:
            console.error(`ERR: the extensions ${extension} is not supported by MR.js`);
            return null;
    }
};

model.disposeObject3D = function (parentObject3D) {
    parentObject3D.traverse(function (node) {
        if (node.isMesh) {
            if (node.geometry) {
                node.geometry.dispose();
            }
            if (node.material) {
                if (Array.isArray(node.material)) {
                    node.material.forEach((material) => material.dispose());
                } else {
                    node.material.dispose();
                }
            }
        }
    });
};

model.removeObject3DFromScene = function (object3D, scene) {
    model.disposeObject3D(object3D);
    scene.remove(object3D);
};

model.currentRunningAnimationClip = function (entity) {
    if (!entity.mixer) {
        console.log('No mixer found for :', entity);
        return;
    }
    if (!entity.mixer._actions.some((action) => action.isRunning())) {
        console.log('No animation is currently playing');
        return;
    }
    for (let i = 0; i < entity.mixer._actions.length; i++) {
        let clipAction = entity._actions[i];
        if (clipAction.isRunning()) {
            let clipName = clipAction.getClip().name;
            console.log("Animation '" + clipName + "' is currently playing");
        }
    }
};

export { model };
