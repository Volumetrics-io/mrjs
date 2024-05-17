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

export { material };
