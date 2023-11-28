class SkyBox extends Entity {
    constructor() {
        super();
    }

    /**
     *
     */
    connected() {
        // you can have texturesList be all individual textures
        // or you can store them in a specified path and just
        // load them up solely by filename in that path.
        
        this.src = this.getAttribute('src');
        if (!this.texturesList) {
            return;
        }

        const textureLoader = THREE.CubeTextureLoader();
        const textureNames = texturesList.split(',');
        let texture = null;

        let path = this.getAttribute('pathToTextures');
        const texture = !path ? textureLoader.load(textureNames) : textureLoader.load(textureNames.map((name) => path + name));

        // scene.background
        this.object3D.background = texture;

    }

    onLoad = () => {};
}
customElements.define('mr-skybox', SkyBox);
