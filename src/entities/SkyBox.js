class SkyBox extends Entity {
    constructor() {
        super();
    }

    /**
     *
     */
    connected() {
        this.texturesList = this.getAttribute('textures');
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
