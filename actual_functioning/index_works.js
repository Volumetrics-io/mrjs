import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Scene, camera, and renderer setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Orbital controls
const controls = new OrbitControls(camera, renderer.domElement);

// Geometries
const torusGeometry = new THREE.TorusGeometry(1, 0.4, 16, 100);
const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);

// Render target for texture1
const renderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);

// Torus material for rendering to texture
const torusRenderMaterial = new THREE.ShaderMaterial({
    vertexShader: `
        void main() {
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        void main() {
            gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0); // Render white
        }
    `,
});

// Torus material
const torusMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

// Shader material for cube and sphere
const shaderMaterialUniforms = {
    texture1: { value: renderTarget.texture },
    resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
};

const objectShaderMaterial = {
    uniforms: shaderMaterialUniforms,
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform sampler2D texture1;
        uniform vec2 resolution;
        varying vec2 vUv;

        void main() {
            vec4 textureColor = texture2D(texture1, gl_FragCoord.xy / resolution);
            if (textureColor.r < 0.1) {
                discard;
            } else {
                gl_FragColor = vec4(0, 0, 0, 1);
            }
        }
    `
};

// Cube and sphere materials
const cubeMaterial = new THREE.ShaderMaterial({
    ...objectShaderMaterial,
    fragmentShader: `
        uniform sampler2D texture1;
        uniform vec2 resolution;
        varying vec2 vUv;

        void main() {
            vec4 textureColor = texture2D(texture1, gl_FragCoord.xy / resolution);
            if (textureColor.r < 0.1) {
                discard;
            } else {
                gl_FragColor = vec4(1, 0, 0, 1); // Red color
            }
        }
    `
});

const sphereMaterial = new THREE.ShaderMaterial({
    ...objectShaderMaterial,
    fragmentShader: `
        uniform sampler2D texture1;
        uniform vec2 resolution;
        varying vec2 vUv;

        void main() {
            vec4 textureColor = texture2D(texture1, gl_FragCoord.xy / resolution);
            if (textureColor.r < 0.1) {
                discard;
            } else {
                gl_FragColor = vec4(0, 0, 1, 1); // Blue color
            }
        }
    `
});

// Meshes
const torus = new THREE.Mesh(torusGeometry, torusMaterial);
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

// Positioning objects
sphere.position.x = -1.5;
cube.position.x = 1.5;

// Adding objects to the scene
scene.add(torus, sphere, cube);

// Debugging plane for texture1
const planeGeometry = new THREE.PlaneGeometry(1, 1);
const planeMaterial = new THREE.MeshBasicMaterial({ map: renderTarget.texture });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.position.set(-2, 2, 0);
scene.add(plane);

// Render pass for the torus
function renderTorusToTexture() {
    torus.material = torusRenderMaterial;
    renderer.setRenderTarget(renderTarget);
    renderer.clear();
    renderer.render(scene, camera);
    renderer.setRenderTarget(null);
    torus.material = torusMaterial;
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    renderTorusToTexture();
    renderer.render(scene, camera);

    controls.update();
}

animate();
