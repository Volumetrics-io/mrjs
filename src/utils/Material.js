import * as THREE from 'three';
import { html } from 'mrjsUtils/HTML';

/**
 * @namespace material
 * @description Useful namespace for helping with Materials and threejs utility functions
 */
let material = {};

/**
 * Defining materials here to only need to create them once
 * since render calls are proportional to the number of gl Materials.
 * 
 * An issue creating a large number of render calls per frame
 * is that we have multiple normal THREEjs materials that we're reusing
 * in places. Since these all just modify the base threejs with uniforms
 * we should just grab and clone from here.
 */
material.MeshBasicMaterial = new THREE.MeshBasicMaterial();
material.MeshPhongMaterial = new THREE.MeshPhongMaterial();
material.MeshStandardMaterial = new THREE.MeshStandardMaterial();

// // Singleton material pool for reuse
// const materialPool = {};

// /**
//  * @function getMaterialKey
//  * @description Generates a unique key for a material based on its properties
//  * @param {THREE.Material} material - The material to generate a key for
//  * @returns {string} - The generated key
//  */
// function getMaterialKey(material) {
//     let key = material.type;
//     for (const [property, value] of Object.entries(material)) {
//         if (value instanceof THREE.Color || value instanceof THREE.Texture) {
//             key += `|${property}:${value.uuid}`;
//         } else if (typeof value !== 'object') {
//             key += `|${property}:${value}`;
//         }
//     }
//     return key;
// };

// /**
//  * @function getOrCreateMaterial
//  * @description Reuses or creates a new material based on its properties
//  * @param {THREE.Material} material - The material to reuse or create
//  * @returns {THREE.Material} - The reused or newly created material
//  */
// material.getOrCreateMaterial = (material) => {
//     const key = getMaterialKey(material);
//     if (materialPool[key]) {
//         return materialPool[key];
//     } else {
//         const newMaterial = material.clone();
//         materialPool[key] = newMaterial;
//         return newMaterial;
//     }
// };

/**
 * @function
 * @memberof material
 * @param {object} parent - either a THREE.Group or a THREE.mesh/object
 * @description Given the parent, grabs either the parent's direct material or (in the case of a group) the
 * material of the first child hit.
 * @returns {object} material - the grabbed material
 */
material.getObjectMaterial = function (parent) {
    let foundMesh = false;
    let material;

    if (parent instanceof THREE.Group) {
        parent.traverse((child) => {
            if (!foundMesh && child instanceof THREE.Mesh) {
                material = child.material;
                foundMesh = true;
            }
        });
    } else {
        material = parent.material;
    }

    return material;
};

/**
 * @function
 * @memberof material
 * @param {object} parent - either a THREE.Group or a THREE.mesh/object
 * @param {object} material - a threejs material to be set for either the parent's direct material or
 * (in the case of a group) the material of all children within the parent group.
 * @description Given the parent, grabs either the parents direct material or (in the case of a group) the
 * material of the first child hit.
 * @returns {object} parent - the updated parent object
 */
material.setObjectMaterial = function (parent, material) {
    if (parent instanceof THREE.Group) {
        parent.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.material = material;
                child.material.needsUpdate = true;
            }
        });
    } else {
        parent.material = material;
        parent.material.needsUpdate = true;
    }
    return parent;
};

/**
 * @function
 * @memberof material
 * @param {object} src - the url path to the data to be loaded
 * @description Function to load the texture asynchronously and return a promise
 * @returns {object} texture - the fully loaded texture
 */
material.loadTextureAsync = function (src) {
    return new Promise((resolve, reject) => {
        const textureLoader = new THREE.TextureLoader();

        let resolvedSrc = html.resolvePath(src);

        // Use the img's src to load the texture
        textureLoader.load(
            resolvedSrc,
            (texture) => {
                resolve(texture);
            },
            undefined,
            (error) => {
                reject(error);
            }
        );
    });
};

/**
 * @function
 * @memberof material
 * @param {object} video - the html video element whose src contains the path to the data to be loaded
 * @description Function to load the texture asynchronously and return a promise
 * @returns {object} texture - the fully loaded texture
 */
material.loadVideoTextureAsync = function (video) {
    video.src = html.resolvePath(video.src);

    video.muted = true; // Mute the video to allow autoplay
    video.autoplay = false; //true; // Attempt to autoplay

    return new Promise((resolve, reject) => {
        // Event listener to ensure video is ready
        video.onloadeddata = () => {
            const videoTexture = new THREE.VideoTexture(video);
            videoTexture.needsUpdate = true; // Ensure the texture updates when the video plays

            video
                .play()
                .then(() => {
                    console.log('Video playback started');
                    resolve(videoTexture);
                })
                .catch((e) => {
                    console.error('Error trying to play the video:', e);
                    reject(e);
                });
        };

        video.onerror = (error) => {
            reject(new Error('Error loading video: ' + error.message));
        };

        // This can help with ensuring the video loads in some cases
        video.load();
    });
};

class AdvancedMaterialCache {
    constructor() {
        this.cache = new Map();
    }

    generateKey(material) {
        // This function generates a key based on several material properties.
        let key = `${material.type}|${material.color.getHexString()}`;
        
        if (material.map) key += `|map:${material.map.uuid}`;
        if (material.alphaMap) key += `|alphaMap:${material.alphaMap.uuid}`;
        if (material.bumpMap) key += `|bumpMap:${material.bumpMap.uuid}`;
        // Add other maps and properties as needed

        return key;
    }

    getCachedMaterial(material) {
        const key = this.generateKey(material);
        if (this.cache.has(key)) {
            return this.cache.get(key);
        } else {
            this.cache.set(key, material);
            this.watchMaterial(material);
            return material;
        }
    }

    watchMaterial(material) {
        // This function sets up watchers on the material properties
        // For example, watching the color property
        const colorHandler = {
            set: (target, prop, value) => {
                target[prop] = value;
                // Invalidate the cache entry when a property changes
                this.cache.delete(this.generateKey(material));
                // Optionally re-cache the material with new properties
                this.cache.set(this.generateKey(material), material);
                return true;
            }
        };
        material.color = new Proxy(material.color, colorHandler);
        // Extend this to other properties as needed
    }
}

// const materialCache = new AdvancedMaterialCache();
// const scene = new THREE.Scene();

// scene.add = new Proxy(scene.add, {
//     apply: (target, thisArg, args) => {
//         const object = args[0];
//         if (object.material) {
//             object.material = materialCache.getCachedMaterial(object.material);
//         }
//         object.traverse((child) => {
//             if (child.material && !(child.material instanceof Array)) {
//                 child.material = materialCache.getCachedMaterial(child.material);
//             }
//         });
//         return Reflect.apply(target, thisArg, args);
//     }
// });

// // Example usage
// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material1 = new THREE.MeshBasicMaterial({ color: 0xff0000 });
// const material2 = new THREE.MeshBasicMaterial({ color: 0xff0000 });

// const mesh1 = new THREE.Mesh(geometry, material1);
// const mesh2 = new THREE.Mesh(geometry, material2);

// scene.add(mesh1);
// scene.add(mesh2);

// console.log(mesh1.material === mesh2.material); // Should log true if caching works


export { material };
