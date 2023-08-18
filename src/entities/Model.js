import { Entity } from "../core/entity";
import { STLLoader } from "../utils/STLLoader";


const LOADERS = {
    'stl' : new STLLoader()
}


export class Model extends Entity {
    constructor(){
        super()
    }

    connected(){
        this.src = this.getAttribute('src')

        if (!this.src) { return }

        let ext = this.src.slice((this.src.lastIndexOf(".") - 1 >>> 0) + 2);
        console.log(ext);

        let loader = LOADERS[ext]

        if (!loader) { return }

        loader.load(this.src, (geometry) => {

            const material = new THREE.MeshPhysicalMaterial({
                clearcoat: 0.75,
                clearcoatRoughness: 0.5,
                metalness: 0.5,
                roughness: 0.6,
                //envMap: envTex,
                envMapIntensity: 0.75,
            });

            const mesh = new THREE.Mesh(geometry, material);
            mesh.receiveShadow = true
            mesh.renderOrder = 3

            // mesh.position.set(0.02, 0.02, 0);
            // mesh.rotation.set(-0.4, 0.3, 0.8);
            // let scale = 0.01;
            // mesh.scale.set(scale, scale, scale);
            this.object3D.add(mesh);

            // const light_orange = new THREE.PointLight({});
            // light_orange.color = new THREE.Color(`hsl(30, 100%, 50%)`);
            // light_orange.intensity = 30;
            // scene.add(light_orange);

            // const light_blue = new THREE.PointLight({});
            // light_blue.color = new THREE.Color(`hsl(208, 100%, 50%)`);
            // light_blue.intensity = 40;
            // scene.add(light_blue);

            // const light_pink = new THREE.PointLight({});
            // light_pink.color = new THREE.Color(`hsl(340, 100%, 50%)`);
            // light_pink.intensity = 50;
            // scene.add(light_pink);

            // var speed = 0;

            // const render = () => {
            //     const timer = Date.now() * 0.00025;
            //     const radius = 1.85;
            //     const depth = 0.5;

            //     light_pink.position.x = Math.sin(timer * 1) * radius;
            //     light_pink.position.y = Math.cos(timer * 1) * radius;
            //     light_pink.position.z = depth;

            //     light_orange.position.x = Math.sin(timer + Math.PI * 2 / 3) * radius;
            //     light_orange.position.y = Math.cos(timer + Math.PI * 2 / 3) * radius;
            //     light_orange.position.z = depth;

            //     light_blue.position.x = Math.sin(timer + Math.PI * 4 / 3) * radius;
            //     light_blue.position.y = Math.cos(timer + Math.PI * 4 / 3) * radius;
            //     light_blue.position.z = depth;

            //     // Rotate the solid, starting from rest and slowly accelerating 
            //     speed = (speed < 0.002) ? speed + 0.000008 : speed;
            //     mesh.rotation.z += speed;

            //     renderer.render(scene, camera);
            // };

            // renderer.setAnimationLoop(render);
        });

    }

    onLoad = () => {

    }
}

customElements.get('mr-model') || customElements.define('mr-model', Model)