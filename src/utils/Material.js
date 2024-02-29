import * as THREE from 'three';
import { html } from 'mrjsUtils/HTML';

/**
 * @namespace material
 * @description Useful namespace for helping with Materials and threejs utility functions
 */
let material = {};

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

// Function to load the texture asynchronously and return a promise
material.loadTextureAsync = function (src) {
    return new Promise((resolve, reject) => {
        const textureLoader = new THREE.TextureLoader();

        let resolvedSrc = html.resolvePath(src);

        // Use the img's src to load the texture
        textureLoader.load(
            resolvedSrc,
            (texture) => {
                // Resolve the promise when the texture is loaded
                resolve(texture);
            },
            undefined,
            (error) => {
                // Reject the promise if there's an error
                reject(error);
            }
        );
    });
};

material.loadVideoTextureAsync = function (video) {
    video.src = html.resolvePath(video.src);

    video.muted = true; // Mute the video to allow autoplay
    video.autoplay = false; //true; // Attempt to autoplay

    return new Promise((resolve, reject) => {
        // Event listener to ensure video is ready
        video.onloadeddata = () => {
            try {
                const textureLoader = new THREE.VideoTexture(video);
                textureLoader.needsUpdate = true; // Ensure the texture updates when the video plays

                video
                    .play()
                    .then(() => {
                        console.log('Video playback started');
                    })
                    .catch((e) => {
                        console.error('Error trying to play the video:', e);
                        reject(e);
                    });
                resolve(textureLoader);
            } catch (err) {
                reject(err);
            }
        };

        video.onerror = (error) => {
            reject(new Error('Error loading video: ' + error.message));
        };

        // This can help with ensuring the video loads in some cases
        video.load();
    });
};

export { material };
